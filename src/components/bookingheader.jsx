import React from "react"
import PropTypes from "prop-types"
import modes from "../lib/modes"

const BookingHeader = ({ mode, setMode }) => {
  const changeDay = e => {
    e.preventDefault()
    setMode(mode == modes.FRIDAY ? modes.TUESDAY : modes.FRIDAY)
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
      case modes.FRIDAY:
        return "Friday Night Training"
      case modes.TUESDAY:
        return "Tuesday Night Training"
      default:
        return `Training Booking System`
    }
  }

  return (
    <>
      <h2>{pageTitle()}</h2>
      {mode == modes.FRIDAY || mode == modes.TUESDAY ? (
        <p>
          Do you want to{" "}
          <a href="#" onClick={changeDay}>
            see {mode == modes.FRIDAY ? "Tuesday" : "Friday"} instead
          </a>
          ?
        </p>
      ) : (
        ""
      )}
    </>
  )
}

BookingHeader.propTypes = {
  mode: PropTypes.number.isRequired,
  setMode: PropTypes.func.isRequired,
}

export default BookingHeader
