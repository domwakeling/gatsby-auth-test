/* eslint-disable no-unreachable */
import { MongoClient } from "mongodb"
import userToken from "../lib/token"

// eslint-disable-next-line no-unused-vars
export async function handler(event, context) {
  const { id, name } = JSON.parse(event.body)
  // try to get token, verify and compare ids, and insert name
  try {
    const token = event.headers.cookie.match(
      /userToken=?([a-zA-Z0-9\-_.]+).*/
    )[1]
    const tokenId = await userToken.verifyToken(token)
    // if tokenId is null, or otherwise doesn't match request, error out
    if (tokenId != id) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "token validation error",
          status: 500,
        }),
      }
    }
    // token verified and id matches, so add racer to user ...

    // connect to DB
    const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017"
    const dbname = process.env.DB_NAME || "nextjsauth"
    const client = new MongoClient(uri, { useUnifiedTopology: true })
    await client.connect()

    // check whether the email already exists and if so error out
    const db = client.db(dbname)
    const res = await db
      .collection("users")
      .updateOne({ _id: id }, { $addToSet: { racers: name } })
    client.close()
    if (res.result.ok == 1) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Racer added",
          status: 200,
        }),
      }
    } else {
      // no res, error?
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "database error", status: 500 }),
      }
    }
  } catch (err) {
    // there was an error somewhere in the overall try above ...
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message, status: 500 }),
    }
  }
}
