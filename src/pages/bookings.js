/* eslint-disable no-console */

import React, { useState } from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
// import Racer from "../components/racer"
import Bookings from "../components/bookings"

const myHandler = e => {
  e.preventDefault()
  console.log("Hi there")
  console.log(document.getElementById("email"))
  //   fetch("/.netlify/functions/hello")
  //     .then(response => response.json())
  //     .then(console.log)
}

const modes = {
  SIGNED_IN: 0,
  LOGGING_IN: 1,
  SIGNING_UP: 2,
}

const SecondPage = () => {
  const [user, setUser] = useState(null)
  const [mode, setMode] = useState(modes.LOGGING_IN)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [secret, setSecret] = useState("")

  const handleEmail = e => {
    e.preventDefault()
    setEmail(e.target.value)
  }

  const handlePassword = e => {
    e.preventDefault()
    setPassword(e.target.value)
  }

  const handleSecret = e => {
    e.preventDefault()
    setSecret(e.target.value)
  }

  const submitLogin = e => {
    e.preventDefault()
  }

  const submitSignUp = e => {
    e.preventDefault()
  }

  const changeToSignUp = e => {
    e.preventDefault()
    setMode(modes.SIGNING_UP)
  }

  const changeToLogIn = e => {
    e.preventDefault()
    setMode(modes.LOGGING_IN)
  }

  // this just to stop stupid build errors
  if (user != null) setUser(null)
  if (mode == null) setMode(modes.LOGGING_IN)

  return (
    <Layout>
      <SEO title="Page two" />
      <h1>Bookings</h1>
      <p>Welcome to Bookings page</p>
      <Link to="/">Go back to the homepage</Link>
      <hr />
      {!user ? (
        <>
          <p>no user detected, need to sign in or log in!</p>
          <form>
            <label htmlFor="email">email</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleEmail}
              value={email}
            />
            <label htmlFor="password">password</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handlePassword}
              value={password}
            />
            {mode == modes.SIGNING_UP ? (
              <>
                <label htmlFor="secret">secret</label>
                <input
                  type="secret"
                  id="secret"
                  name="secret"
                  onChange={handleSecret}
                  value={secret}
                />
              </>
            ) : (
              ""
            )}
          </form>
          <br />
          {mode == modes.LOGGING_IN ? (
            <>
              <button onClick={submitLogin}>Log In</button>
              <p>Or do you want to create a new account?</p>
              <button onClick={changeToSignUp}>Sign Up</button>
            </>
          ) : (
            <>
              <button onClick={submitSignUp}>Sign Up</button>
              <p>Or do you want to log in to an existing account?</p>
              <button onClick={changeToLogIn}>Log In</button>
            </>
          )}
        </>
      ) : (
        <>
          <br />
          <Bookings />
        </>
      )}
      {/* eslint-disable-next-line react/button-has-type */}
      <button onClick={myHandler}>Click!</button>

      <hr />
    </Layout>
  )
}

export default SecondPage
