/* eslint-disable no-unreachable */
import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"
import userToken from "../lib/token"

// eslint-disable-next-line no-unused-vars
export async function handler(event, context) {
  const { email, password } = JSON.parse(event.body)

  // connect to DB
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017"
  const dbname = process.env.DB_NAME || "nextjsauth"
  const client = new MongoClient(uri, { useUnifiedTopology: true })
  await client.connect()

  // look for item on the db
  const db = client.db(dbname)
  const user = await db.collection("users").findOne({ email })
  client.close()
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = userToken.createToken(user._id)
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Successfully logged in",
        user_id: user._id,
        racers: user.racers,
        status: 200,
      }),
      headers: {
        "Set-Cookie": `userToken=${token}; Max-Age=${userToken.maxAge}; httpOnly; SameSite=Strict`,
      },
    }
  } else if (user) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: "Password incorrect",
        status: 401,
      }),
    }
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "That email address is not registered",
        status: 400,
      }),
    }
  }
}
