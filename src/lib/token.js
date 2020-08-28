import jwt from "jsonwebtoken"
import { MongoClient } from "mongodb"

const max_age = 24 * 60 * 60
const jwtsecret = process.env.JWT_SECRET || "a secret for local JWT testing"

const userToken = {
  maxAge: max_age,

  createToken: id => {
    return jwt.sign({ id }, jwtsecret, { expiresIn: max_age })
  },

  // validateTokenId is used to veridy a token AND check that the id is valid
  validateTokenId: async token => {
    try {
      const data = jwt.verify(token, jwtsecret)
      if (data.id) {
        const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017"
        const dbname = process.env.DB_NAME || "nextjsauth"
        const client = new MongoClient(uri, { useUnifiedTopology: true })
        await client.connect()

        // look for item on the db
        const db = client.db(dbname)
        if (
          (await db.collection("users").countDocuments({ _id: data.id })) > 0
        ) {
          client.close()
          return data.id
        } else {
          client.close()
          return null
        }
      } else {
        return null
      }
    } catch (err) {
      return null
    }
  },

  // verifyToken is only used to verify that the token is signed and in-date
  verifyToken: async token => {
    try {
      const data = jwt.verify(token, jwtsecret)
      if (data.id) {
        return true
      }
    } catch {
      return false
    }
  },
}

export default userToken
