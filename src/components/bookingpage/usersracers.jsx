import React from "react"
import PropTypes from "prop-types"
import modes from "../../lib/modes"
import Racer from "./racer"
import { getNextDay } from "./bookings"
import { toast } from "../toast"
import { mutate } from "swr"

const UserRacers = ({ racers, mode, user, changeToAddRacer }) => {
  const handleRacerClick = async (userid, name) => {
    if (mode == modes.FRIDAY || mode == modes.TUESDAY) {
      const bookingDay = getNextDay(
        mode == modes.FRIDAY ? modes.FRIDAY : modes.TUESDAY
      )
      const body = {
        day: bookingDay[0],
        userid,
        name,
        mode,
      }
      const res = await fetch("/.netlify/functions/addbooking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const status = res.status
      const data = await res.json()
      // if successfui ...
      if (status === 200) {
        toast.notify(data.message, {
          type: "success",
          title: "Success",
          duration: 2,
        })
        // call mutate to refresh screen
        const nextFri = getNextDay(modes.FRIDAY)
        const nextTue = getNextDay(modes.TUESDAY)
        mutate(
          `/.netlify/functions/getbookings?fri=${nextFri[0]}&tue=${nextTue[0]}`
        )
      } else {
        // not successful, notify using information from API
        toast.notify(data.message, {
          type: "error",
          title: "Error",
        })
      }
    }
  }

  return (
    <div>
      <p>
        There {racers.length === 1 ? "is" : "are"} {racers.length}{" "}
        {racers.length === 1 ? "racer" : "racers"} on your account.
      </p>
      <div className="racerlist">
        {racers.map((racer, idx) => (
          <Racer
            // eslint-disable-next-line react/no-array-index-key
            key={idx}
            tabNum={idx}
            name={racer}
            status="normal"
            clickhandler={handleRacerClick}
            userid={user}
          />
        ))}
      </div>
      <p>
        Do you want to{" "}
        <a href="#" onClick={changeToAddRacer}>
          add another racer
        </a>
        ?
      </p>
      {mode == modes.TUESDAY || mode == modes.FRIDAY ? (
        <p>
          Tap/click on a racer&apos;s name above to add or remove them from the
          training list.
        </p>
      ) : (
        ""
      )}
    </div>
  )
}

UserRacers.propTypes = {
  racers: PropTypes.array.isRequired,
  mode: PropTypes.number.isRequired,
  user: PropTypes.string.isRequired,
  changeToAddRacer: PropTypes.func.isRequired,
}

export default UserRacers
