import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const myHandler = e => {
  e.preventDefault()
  fetch("/.netlify/functions/hello")
    .then(response => response.json())
    .then(console.log)
}

const SecondPage = () => (
  <Layout>
    <SEO title="Page two" />
    <h1>Hi from the second page</h1>
    <p>Welcome to page 2</p>
    <Link to="/">Go back to the homepage</Link>
    <button onClick={myHandler}>Click!</button>
  </Layout>
)

export default SecondPage
