// modern JS style - encouraged
// eslint-disable-next-line no-unused-vars
export async function handler(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello world ${Math.floor(Math.random() * 10)}`,
    }),
  }
}

// export default handler;
