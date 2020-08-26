/* eslint-disable no-console */

import React, { useState, useEffect } from "react"
import { Link } from "gatsby"

import { toast } from "../components/toast"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Bookings from "../components/bookings"

const myHandler = e => {
  e.preventDefault()
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

useEffect(() => {
    async function fetchData() {
        const res = await fetch("/.netlify/functions/polltoken")
        if (res.status == 200) {
            const data = await res.json()
            setUser(data.id)
        }
    }
    if (!user) {
        // send to an endpoint to see whether there's a token embedded ...
        fetchData()   
        
    }
}, [user])

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

  const submitLogin = async e => {
    e.preventDefault()
    // check a password has been provided
    if (!password) {
      toast.notify("You must enter a password", {
        type: "error",
        title: "Error",
        duration: 2,
      })
      return
    }
    // create the request body
    const body = {
      email,
      password,
    }
    // try to log in
    const res = await fetch("/.netlify/functions/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const status = res.status
    const data = await res.json()
    // if successfui ...
    if (status === 200) {
      toast.notify("Welcome back", {
        type: "success",
        title: "Success",
        duration: 2,
      })
      setUser(data.user_id)
      setMode(modes.SIGNED_IN)
      setEmail("")
      setPassword("")
      setSecret("")
    } else {
      // not successful, notify using information from API
      toast.notify(data.message, {
        type: "error",
        title: "Error",
      })
    }
  }

  const submitSignUp = async e => {
    e.preventDefault()
    // check secret is correct
    if (secret !== process.env.GATSBY_CLUB_SECRET) {
      toast.notify("The secret you have entered is incorrect", {
        type: "error",
        title: "Error",
        duration: 2,
      })
      return
    }
    // check a password has been provided
    if (!password) {
      toast.notify("You must enter a password", {
        type: "error",
        title: "Error",
        duration: 2,
      })
      return
    }
    // create the request body
    const body = {
      email,
      password,
    }
    // try to create an account
    const res = await fetch("/.netlify/functions/newuser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const status = res.status
    const data = await res.json()
    // if successfui ...
    if (status === 201) {
      toast.notify("Your account is being set up", {
        type: "success",
        title: "Success",
        duration: 2,
      })
      setUser(data.user_id)
      setMode(modes.SIGNED_IN)
      setEmail("")
      setPassword("")
      setSecret("")
    } else {
      // not successful, notify using information from API
      toast.notify(data.message, {
        type: "error",
        title: "Error",
      })
    }
  }

  const changeToSignUp = e => {
    e.preventDefault()
    setMode(modes.SIGNING_UP)
  }

  const changeToLogIn = e => {
    e.preventDefault()
    setMode(modes.LOGGING_IN)
  }

  return (
    <Layout>
      <SEO title="Page two" />
      <h1>Bookings</h1>
      <p>Welcome to Bookings page</p>
      <Link to="/">Go back to the homepage</Link>
      <hr />
      {user ? <p>{user}</p> : <p>no user</p>}
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
