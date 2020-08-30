/*  eslint-disable no-unused-vars */

import { MongoClient } from "mongodb"
import modes from "../lib/modes"

export async function handler(event, context) {
  // TODO: VALIDATE JWT?

  // retrieve info from body and validate
  const { userid, name, day, mode } = JSON.parse(event.body)
  if (!/^\d{8}$/.test(day) || !userid || !name) {
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

  const bookings = await db.collection("bookings").findOne({
    forWeek: day,
  })

  let racersCount = 0
  let racerFound = false

  // if no booking was found set one up; expire after 30 days (minimise db size)
  if (!bookings) {
    await db.collection("bookings").insertOne({
      forWeek: day,
      racers: [],
      expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    })
  } else {
    racersCount = bookings.racers.length
    racerFound =
      bookings.racers.filter(r => r.userid == userid && r.name == name).length >
      0
  }

  const maxRacers = mode == modes.FRIDAY ? 15 : 6

  // no space and racer wasn't found
  if (racersCount >= maxRacers && !racerFound) {
    client.close()
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No places available", status: 400 }),
    }
  }

  // space and racer wasn't found
  if (racersCount < maxRacers && !racerFound) {
    await db
      .collection("bookings")
      .updateOne({ forWeek: day }, { $addToSet: { racers: { userid, name } } })
    client.close()
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Booking confirmed", status: 200 }),
    }
  }

  // racer was found, omit them
  await db
    .collection("bookings")
    .updateOne({ forWeek: day }, { $pull: { racers: { userid, name } } })

  client.close()
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Booking cancelled", status: 200 }),
  }
}
