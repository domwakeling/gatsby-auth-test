/*  eslint-disable no-unused-vars */
// modern JS style - encouraged

import { MongoClient } from "mongodb"

const secrets =
  process.env.CONTEXT == "production" ? {} : require("../.env.prod")

export async function handler(event, context) {
  const forDay = event.path.split("/")[2] || ""

  if (forDay == "") {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "no date provided" }),
    }
  }

  const uri = process.env.GATSBY_MONGODB_URI || secrets.GATSBY_MONGODB_URI
  const dbname = process.env.GATSBY_DB_NAME || secrets.GATSBY_DB_NAME
  console.log(uri)

  try {
    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db(dbname)
    const bookings = await db.collection("bookings").findOne({
      forWeek: forDay,
    })
    return {
      statusCode: 200,
      body: JSON.stringify({ data: bookings }),
    }
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: e.message }),
    }
  }

  //   return {
  //     statusCode: 200,
  //     body: JSON.stringify({ message: event.path.split("/")[2], message2: "hi" }),
  //   }
}

// handler.get(async (req, res) => {
//     const forFriday = req.query.week;

//     const bookings = await req.db
//         .collection('bookings')
//         .findOne({
//             forWeek: forFriday,
//         });

//     res.send(bookings ? bookings.racers : []);
// });
