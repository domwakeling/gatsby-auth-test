export async function handler() {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Successfully logged out",
      status: 200,
    }),
    headers: { "Set-Cookie": `userToken=null` },
  }
}
