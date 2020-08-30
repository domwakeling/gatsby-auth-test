/* eslint-disable no-console */
import React, { useState, useEffect } from "react"
import { Link } from "gatsby"

import { toast } from "../components/toast"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Bookings from "../components/bookingpage/bookings"
import BookingHeader from "../components/bookingpage/bookingheader"
import Welcome from "../components/bookingpage/welcome"
import SignInUp from "../components/bookingpage/signinup"
import UserRacers from "../components/bookingpage/usersracers"
import AddRacer from "../components/bookingpage/addracer"

import modes from "../lib/modes"

const SecondPage = () => {
  const [user, setUser] = useState(null)
  const [loggingOut, setLoggingOut] = useState(false)
  const [mode, setMode] = useState(modes.WELCOME)
  const [racers, setRacers] = useState(null)

  useEffect(() => {
    // hooks require that async function is defined before being called; this checks for a token
    async function fetchData() {
      const res = await fetch("/.netlify/functions/polltoken")
      if (res.status == 200) {
        const data = await res.json()
        setUser(data.id)
        setRacers(data.racers)
        setMode(modes.FRIDAY)
      }
    }
    if (!user && !loggingOut) {
      // send to an endpoint to see whether there's a token embedded ...
      fetchData()
    }
  }, [user])

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
    setMode(modes.FRIDAY)
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

  return (
    <Layout>
      <SEO title="Page two" />
      <Link to="/">Go back to the homepage</Link>
      <BookingHeader mode={mode} setMode={setMode} />
      {mode == modes.WELCOME ? (
        <Welcome clickSignUp={changeToSignUp} clickLogin={changeToLogIn} />
      ) : (
        ""
      )}
      {!user && mode != modes.WELCOME ? (
        <SignInUp
          mode={mode}
          setMode={setMode}
          setUser={setUser}
          setRacers={setRacers}
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
            <AddRacer
              user={user}
              racers={racers}
              setRacers={setRacers}
              changeToSignedIn={changeToSignedIn}
            />
          ) : (
            ""
          )}
          {mode == modes.FRIDAY || mode == modes.TUESDAY ? (
            <Bookings mode={mode} user={user} />
          ) : (
            ""
          )}
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
