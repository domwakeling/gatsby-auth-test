/* eslint-disable no-console */
import React, { useState, useEffect } from "react"
import { Link } from "gatsby"

import { toast } from "../components/toast"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Bookings from "../components/bookings"
import Welcome from "../components/welcome"
// import Racer from "../components/racer"
import SignInUp from "../components/signinup"
import UserRacers from "../components/usersracers"

import modes from "../lib/modes"

const SecondPage = () => {
  const [user, setUser] = useState(null)
  const [loggingOut, setLoggingOut] = useState(false)
  const [mode, setMode] = useState(modes.WELCOME)
  const [racers, setRacers] = useState(null)
  const [racerName, setRacerName] = useState("")
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
    if (!user && !loggingOut) {
      // send to an endpoint to see whether there's a token embedded ...
      fetchData()
    }
  }, [user])

  // capture <enter> key from 'add racer' input and divert
  const keyDownName = e => {
    if (e.keyCode == 13) {
      e.preventDefault()
      const fakeE = { preventDefault: () => {} }
      handleAddRacer(fakeE)
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

  const handleName = e => {
    e.preventDefault()
    setRacerName(e.target.value)
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
    // if successful ...
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
    setLoggingOut(false)
  }

  const changeToLogIn = e => {
    e.preventDefault()
    setMode(modes.LOGGING_IN)
    setLoggingOut(false)
  }

  const changeToAddRacer = e => {
    e.preventDefault()
    setMode(modes.ADDING_RACER)
  }

  const changeToSignedIn = e => {
    e.preventDefault()
    setMode(modes.SIGNED_IN)
    setLoggingOut(false)
  }

  const handleLogout = async e => {
    e.preventDefault
    setLoggingOut(true)
    const res = await fetch("/.netlify/functions/logout")
    setUser(null)
    setMode(modes.WELCOME)
    setRacers(null)
    if (res.status == 200) {
      toast.notify("You have been logged out", {
        type: "success",
        title: "Success",
        duration: 2,
      })
    }
  }

  const handleAddRacer = async e => {
    e.preventDefault
    const body = { id: user, name: racerName }
    const res = await fetch("/.netlify/functions/newracer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const status = res.status
    const data = await res.json()
    if (status == 200) {
      let currRacers = await racers
      if (currRacers.indexOf(racerName) < 0) {
        // confirm doesn't already exist => already protected in API
        currRacers = [...currRacers, racerName]
        toast.notify("Racer added", {
          type: "success",
          title: "Success",
          duration: 2,
        })
        setRacers(currRacers)
        setRacerName("")
      } else {
        toast.notify("Racer already exists", {
          type: "warn",
          title: "Warning",
          duration: 2,
        })
      }
    } else {
      toast.notify(data.message, {
        type: "error",
        title: "Error",
        duration: 2,
      })
    }
  }

  const pageTitle = () => {
    switch (mode) {
      case modes.WELCOME:
        return "Training Booking System"
      case modes.SIGNING_UP:
        return "Sign Up"
      case modes.LOGGING_IN:
        return "Sign In"
      case modes.ADDING_RACER:
        return "Add Racer"
      default:
        return `${"Friday"} Night Training`
    }
  }

  return (
    <Layout>
      <SEO title="Page two" />
      <Link to="/">Go back to the homepage</Link>
      <h2>{pageTitle()}</h2>
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
            <UserRacers
              racers={racers}
              mode={mode}
              user={user}
              changeToAddRacer={changeToAddRacer}
            />
          ) : (
            <p>
              Please{" "}
              <a href="#" onClick={changeToAddRacer}>
                add a racer
              </a>
              .
            </p>
          )}
          {mode == modes.ADDING_RACER ? (
            <>
              <form>
                <label htmlFor="name">n</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  onChange={handleName}
                  onKeyDown={keyDownName}
                  value={racerName}
                />
              </form>
              <button onClick={handleAddRacer}>Add racer</button>
              <p>
                Or{" "}
                <a href="#" onClick={changeToSignedIn}>
                  go back
                </a>
                .
              </p>
            </>
          ) : (
            ""
          )}
          {mode == modes.SIGNED_IN ? <Bookings weekday="Friday" /> : ""}
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
