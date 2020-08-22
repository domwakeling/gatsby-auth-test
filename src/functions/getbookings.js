/*  eslint-disable no-unused-vars */

import { MongoClient } from "mongodb"

export async function handler(event, context) {
  const forDay = event.path.split("/")[2] || ""

  console.log("NODE VERSION", process.env.NODE_VERSION)
  console.log("NETLIFT", process.env.NETLIFY)

  if (forDay == "") {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "no date provided" }),
    }
  }

  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017"
  const dbname = process.env.DB_NAME || "nextjsauth"
  console.log("MONGODB_URI:", uri)

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
}
