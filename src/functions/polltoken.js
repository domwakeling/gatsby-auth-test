import userToken from "../lib/token"

// eslint-disable-next-line no-unused-vars
export async function handler(event, context) {
  try {
    const token = event.headers.cookie.match(
      /userToken=?([a-zA-Z0-9\-_.]+).*/
    )[1]
    const id = await userToken.verifyToken(token)
    if (id) {
      return {
        statusCode: 200,
        body: JSON.stringify({ id }),
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
