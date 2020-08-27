// eslint-disable-next-line no-unused-vars
export async function handler(event, context) {
  const cookies = event.headers.cookie || ""
  console.log(typeof cookies)
  console.log(cookies)
  //   let newUser = cookies.match(/newUser=?([a-zA-Z0-9\-_.]+).*/)
  //   if (newUser.length > 0) {
  //     newUser = newUser[1]
  //   } else {
  //     newUser = ""
  //   }
  //   console.log("Retrieved value for newUser:", newUser)
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `May have received some cookies `,
    }),
  }
}
