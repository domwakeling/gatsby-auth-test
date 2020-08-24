/*  eslint-disable no-unused-vars */

import { MongoClient } from "mongodb"

export async function handler(event, context) {
  let forDay = ""
  try {
    forDay = event.path.match(/\/getbookings\/?(\d{8})$/)[1]
    console.log("looking for day", forDay)
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "incorrect request format" }),
    }
  }

  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017"
  const dbname = process.env.DB_NAME || "nextjsauth"
  console.log("MONGODB_URI:", uri)

  //   try {
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(dbname)
  return db
    .collection("bookings")
    .findOne({
      forWeek: forDay,
    })
    .then(data => {
      if (data) {
        console.log(data)
        return {
          statusCode: 200,
          body: JSON.stringify({ data: data }),
        }
      } else {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "data not found" }),
        }
      }
    })
    .catch(err => {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: err.message }),
      }
    })
  // const bookings = await db.collection("bookings").findOne({
  //   forWeek: forDay,
  // })
  // console.log(bookings);
  // return {
  //   statusCode: 200,
  //   body: JSON.stringify({ data: bookings }),
  // }
  //   } catch (e) {
  //     return {
  //       statusCode: 400,
  //       body: JSON.stringify({ message: e.message }),
  //     }
  //   }
}
