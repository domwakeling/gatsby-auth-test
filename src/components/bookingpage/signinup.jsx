import React, { useState } from "react"
import PropTypes from "prop-types"

import modes from "../../lib/modes"
import { toast } from "../toast"

const SignInUp = ({
  mode,
  setMode,
  setUser,
  setRacers,
  changeToLogIn,
  changeToSignUp,
}) => {
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

  // capture <enter> key and react accordingly
  const keyDown = e => {
    if (e.keyCode == 13) {
      e.preventDefault()
      const fakeE = { preventDefault: () => {} }
      if (mode == modes.LOGGING_IN) {
        submitLogin(fakeE)
      } else {
        submitSignUp(fakeE)
      }
    }
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
      setMode(modes.FRIDAY)
      setRacers(data.racers)
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
    // if successful ...
    if (status === 201) {
      toast.notify("Your account is being set up", {
        type: "success",
        title: "Success",
        duration: 2,
      })
      setUser(data.user_id)
      setMode(modes.FRIDAY)
      setRacers([])
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

  return (
    <>
      <style>
        {`
          input {
              border: 1px solid #d79022;
              min-width: 20rem;
              margin-bottom: 0.75rem;
              border-radius: 0.25rem;
              padding: 0.5rem 0 0.5rem 0.2rem;
              font-size: 1rem;
            }
            label, .circle {
              font-size: 1.5rem;
              display: inline-block;
              background-color: #394c8f;
              border-radius: 50%;
              width: 2.1rem;
              height: 2.1rem;
              text-align: center;
              color: white;
              margin-right: 0.75rem;
              position: relative;
            }
        `}
      </style>
      <form>
        <label htmlFor="email">e</label>
        <input
          type="email"
          id="email"
          name="email"
          onChange={handleEmail}
          onKeyDown={keyDown}
          value={email}
        />
        <label htmlFor="password">p</label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={handlePassword}
          onKeyDown={keyDown}
          value={password}
        />
        {mode == modes.SIGNING_UP ? (
          <>
            <label htmlFor="secret">s</label>
            <input
              type="secret"
              id="secret"
              name="secret"
              onChange={handleSecret}
              onKeyDown={keyDown}
              value={secret}
            />
          </>
        ) : (
          ""
        )}
      </form>
      {mode == modes.LOGGING_IN ? (
        <>
          <button onClick={submitLogin}>Log In</button>
          <p>
            Or do you want to{" "}
            <a href="#" onClick={changeToSignUp}>
              create a new account?
            </a>
          </p>
        </>
      ) : (
        <>
          <button onClick={submitSignUp}>Sign Up</button>
          <p>
            Or do you want to{" "}
            <a href="#" onClick={changeToLogIn}>
              log in to an existing account?
            </a>
          </p>
        </>
      )}
    </>
  )
}

SignInUp.propTypes = {
  mode: PropTypes.number.isRequired,
  setMode: PropTypes.func.isRequired,
  user: PropTypes.string.isRequired,
  setUser: PropTypes.func.isRequired,
  setRacers: PropTypes.func.isRequired,
  changeToLogIn: PropTypes.func.isRequired,
  changeToSignUp: PropTypes.func.isRequired,
}

export default SignInUp
