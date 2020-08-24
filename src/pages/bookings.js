/* eslint-disable no-console */

import React, { useState } from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Racer from "../components/racer"
import Bookings from "../components/bookings"

const myHandler = e => {
  e.preventDefault()
  console.log("Hi there")
  fetch("/.netlify/functions/hello")
    .then(response => response.json())
    .then(console.log)
}

const SecondPage = () => {
  const [user, setUser] = useState(null)

  // this just to stop stupid build errors
  if (user != null) setUser(null)

  return (
    <Layout>
      <SEO title="Page two" />
      <h1>Bookings</h1>
      <p>Welcome to Bookings page</p>
      <Link to="/">Go back to the homepage</Link>
      <hr />
      {/* eslint-disable-next-line react/button-has-type */}
      <button onClick={myHandler}>Click!</button>
      <br />
      <Racer name="hi" tabNum={1} />
      <hr />
      <Bookings />
    </Layout>
  )
}

export default SecondPage
