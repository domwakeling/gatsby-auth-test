import userToken from "../lib/token"
import { MongoClient } from "mongodb"

// eslint-disable-next-line no-unused-vars
export async function handler(event, context) {
  try {
    const token = event.headers.cookie.match(
      /userToken=?([a-zA-Z0-9\-_.]+).*/
    )[1]
    const id = await userToken.validateTokenId(token)
    if (id) {
      // we know there's a token and racer id, see whether there are any racers ...

      const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017"
      const dbname = process.env.DB_NAME || "nextjsauth"
      const client = new MongoClient(uri, { useUnifiedTopology: true })
      await client.connect()

      // look for user on the db to get their racers; we've already checked that id exists
      // and have validated the JWT ...
      const db = client.db(dbname)
      const user = await db.collection("users").findOne({ _id: id })

      return {
        statusCode: 200,
        body: JSON.stringify({ id, racers: user.racers }),
        status: 200,
      }
    } else {
      return {
        statusCode: 204,
      }
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message }),
      status: 500,
    }
  }
}
