import React, { useState } from "react"
import PropTypes from "prop-types"
import { toast } from "../toast"

const AddRacer = ({ user, racers, setRacers, changeToSignedIn }) => {
  const [racerName, setRacerName] = useState("")

  const handleName = e => {
    e.preventDefault()
    setRacerName(e.target.value)
  }

  // capture <enter> key from 'add racer' input and divert
  const keyDownName = e => {
    if (e.keyCode == 13) {
      e.preventDefault()
      const fakeE = { preventDefault: () => {} }
      handleAddRacer(fakeE)
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

  return (
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
  )
}

AddRacer.propTypes = {
  user: PropTypes.string.isRequired,
  racers: PropTypes.array.isRequired,
  setRacers: PropTypes.func.isRequired,
  changeToSignedIn: PropTypes.func.isRequired,
}

export default AddRacer
