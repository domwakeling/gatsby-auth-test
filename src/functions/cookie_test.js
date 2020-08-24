// eslint-disable-next-line no-unused-vars
export async function handler(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello world `,
    }),
    headers: { "Set-Cookie": "newUser=true" },
  }
}
