/* eslint-disable no-unreachable */
import isEmail from "validator/lib/isEmail"
import { MongoClient } from "mongodb"
import { nanoid } from "nanoid"
import bcrypt from "bcryptjs"
import userToken from "../lib/token"

// eslint-disable-next-line no-unused-vars
export async function handler(event, context) {
  const { email, password } = JSON.parse(event.body)

  if (!isEmail(email)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "The email you entered is invalid.",
        status: 400,
      }),
    }
  }

  // connect to DB
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017"
  const dbname = process.env.DB_NAME || "nextjsauth"
  const client = new MongoClient(uri, { useUnifiedTopology: true })
  await client.connect()

  // check whether the email already exists and if so error out
  const db = client.db(dbname)
  if ((await db.collection("users").countDocuments({ email })) > 0) {
    client.close()
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "That email already exists",
        status: 400,
      }),
    }
  }

  // insert user into database; catch if there's a DB error
  const user = await db
    .collection("users")
    .insertOne({
      _id: nanoid(12),
      email,
      password: bcrypt.hashSync(password, 10),
      racers: [],
    })
    .then(({ ops }) => ops[0])
    .catch(err => {
      client.close()
      return {
        statusCode: 500,
        body: JSON.stringify({ message: err.message, status: 500 }),
      }
    })

  client.close()
  const token = userToken.createToken(user._id)
  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Successfully signed up",
      user_id: user._id,
      status: 200,
    }),
    headers: {
      "Set-Cookie": `userToken=${token}; Max-Age=${
        userToken.maxAge * 1000
      }; httpOnly`,
    },
  }
}
