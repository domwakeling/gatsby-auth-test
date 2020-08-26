/*  eslint-disable no-unused-vars */

import { MongoClient } from "mongodb"

export async function handler(event, context) {
  // parse path to get required day as DDMMYYYY, return error if not found
  let forDay = ""
  try {
    forDay = event.path.match(/\/getbookings\/?(\d{8})$/)[1]
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "incorrect request format" }),
    }
  }

  // connect to DB
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017"
  const dbname = process.env.DB_NAME || "nextjsauth"
  const client = new MongoClient(uri, { useUnifiedTopology: true })
  await client.connect()

  // retrieve bookings information with error catching
  const db = client.db(dbname)
  return db
    .collection("bookings")
    .findOne({
      forWeek: forDay,
    })
    .then(data => {
      // if data found, return it
      if (data) {
        return {
          statusCode: 200,
          body: JSON.stringify({ racers: data.racers }),
        }
      } else {
        // data found but not an error => noone signed up yet, return empty racers array
        return {
          statusCode: 200,
          body: JSON.stringify({ racers: [] }),
        }
      }
    })
    .catch(err => {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: err.message }),
      }
    })
    .finally(() => {
      client.close()
    })
}
