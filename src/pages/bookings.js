/* eslint-disable no-console */

import React, { useState, useEffect } from "react"
import { Link } from "gatsby"

import { toast } from "../components/toast"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Bookings from "../components/bookings"
import Welcome from "../components/welcome"
import Racer from "../components/racer"
import SignInUp from "../components/signinup"

import modes from "../lib/modes"

const SecondPage = () => {
  const [user, setUser] = useState(null)
  const [mode, setMode] = useState(modes.WELCOME)
  const [racers, setRacers] = useState(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [secret, setSecret] = useState("")

  useEffect(() => {
    // hooks require that async function is defined before being called; this checks for a token
    async function fetchData() {
      const res = await fetch("/.netlify/functions/polltoken")
      if (res.status == 200) {
        const data = await res.json()
        setUser(data.id)
        setRacers(data.racers)
        setMode(modes.SIGNED_IN)
      }
    }
    if (!user) {
      // send to an endpoint to see whether there's a token embedded ...
      fetchData()
    }
  }, [user])

  // capture <enter> key from an input and react accordingly
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
    // if successfui ...
    if (status === 201) {
      toast.notify("Your account is being set up", {
        type: "success",
        title: "Success",
        duration: 2,
      })
      setUser(data.user_id)
      setMode(modes.SIGNED_IN)
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

  const changeToSignUp = e => {
    e.preventDefault()
    setMode(modes.SIGNING_UP)
  }

  const changeToLogIn = e => {
    e.preventDefault()
    setMode(modes.LOGGING_IN)
  }

  const handleLogout = async e => {
    e.preventDefault
    setUser(null)
    setMode(modes.WELCOME)
    setRacers(null)
    const res = await fetch("/.netlify/functions/logout")
    if (res.status == 200) {
      toast.notify("You have been logged out", {
        type: "success",
        title: "Success",
        duration: 2,
      })
    }
  }

  return (
    <Layout>
      <SEO title="Page two" />
      <Link to="/">Go back to the homepage</Link>
      <h2>Friday Night Training</h2>
      {mode == modes.WELCOME ? (
        <Welcome clickSignUp={changeToSignUp} clickLogin={changeToLogIn} />
      ) : (
        ""
      )}
      {!user && mode != modes.WELCOME ? (
        <SignInUp
          mode={mode}
          handleEmail={handleEmail}
          email={email}
          handlePassword={handlePassword}
          password={password}
          handleSecret={handleSecret}
          secret={secret}
          keyDown={keyDown}
          submitLogin={submitLogin}
          submitSignUp={submitSignUp}
          changeToLogIn={changeToLogIn}
          changeToSignUp={changeToSignUp}
        />
      ) : (
        ""
      )}
      {user ? (
        <>
          <hr />
          {racers && racers.length > 0 ? (
            <div>
              <p>
                There {racers.length === 1 ? "is" : "are"} {racers.length}{" "}
                {racers.length === 1 ? "racer" : "racers"} on your account. Do
                you want to <a href="#">add another racer</a>?
              </p>
              <div className="racerlist">
                {racers.map((racer, idx) => (
                  <Racer
                    // eslint-disable-next-line react/no-array-index-key
                    key={idx}
                    tabNum={idx}
                    name={racer}
                    status="normal"
                    //   clickhandler={handleRacerClick}
                    userid={user}
                  />
                ))}
              </div>
              <p>
                Tap/click on a racer&apos;s name above to add or remove them
                from the training list.
              </p>
            </div>
          ) : (
            <p>
              Please <a href="#">add a racer</a>.
            </p>
          )}
          <Bookings weekday="Friday" />
          <button onClick={handleLogout}>Log out</button>
        </>
      ) : (
        ""
      )}

      <hr />
      <p id="disclaimer">
        This booking system uses cookies for user-account authentication
      </p>
    </Layout>
  )
}

export default SecondPage
