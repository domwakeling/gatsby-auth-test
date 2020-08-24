import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const myHandler = e => {
  e.preventDefault()
  fetch("/.netlify/functions/cookie_test")
    .then(response => response.json())
    .then(console.log)
}

const myHandler2 = e => {
  e.preventDefault()
  fetch("/.netlify/functions/cookie_read_test")
    .then(response => response.json())
    .then(console.log)
  // if (typeof document !== 'undefined') {
  //     console.log('COOKIES\n', document.cookie)
  // } else {
  //     console.log('Frozen, problem!')
  // }
}

const myHandler3 = e => {
  e.preventDefault()
  if (typeof document !== "undefined") {
    console.log("COOKIES\n", document.cookie)
  } else {
    console.log("Frozen, problem!")
  }
}

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <div style={{ maxWidth: "300px", marginBottom: "1.45rem" }}>
      <Image />
    </div>
    <button onClick={myHandler}>Get Cookies</button>
    <button onClick={myHandler2}>Send Cookies</button>
    <button onClick={myHandler3}>Log Cookies Locally</button>
    <br />
    <Link to="/bookings/">Go to bookings</Link> (the whole point of this test
    app!)
    <br />
  </Layout>
)

export default IndexPage
