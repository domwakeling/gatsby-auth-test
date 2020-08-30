import React from "react"
import PropTypes from "prop-types"
import useSWR from "swr"
import Racer from "./racer"
import modes from "../lib/modes"

const fetcher = url => fetch(url).then(r => r.json())

export const getNextDay = mode => {
  const dayNum = mode == modes.TUESDAY ? 9 : 12
  const date = new Date()
  date.setDate(date.getDate() + ((dayNum - date.getDay()) % 7))
  const ds0 =
    `0${date.getDate()}`.slice(-2) +
    `0${date.getMonth() + 1}`.slice(-2) +
    date.getFullYear()
  let ds1 = date.toDateString().split(" ")
  ds1 = `${ds1[2]} ${ds1[1]} ${ds1[3]}`
  return [ds0, ds1]
}

const Bookings = ({ mode, user }) => {
  const nextFri = getNextDay(modes.FRIDAY)
  const nextTue = getNextDay(modes.TUESDAY)

  // update the booking data every minute; code elsewhere to trigger a refresh when user tries
  // to change their own booking data

  const {
    data,
    error,
  } = useSWR(
    `/.netlify/functions/getbookings?fri=${nextFri[0]}&tue=${nextTue[0]}`,
    fetcher,
    { refreshInterval: 60 * 1000 }
  )
  if (error) return <div>failed to load</div>

  if (!data) {
    return (
      <div>
        <h2>Bookings for {mode == modes.FRIDAY ? nextFri[1] : nextTue[1]}</h2>
        <p>loading...</p>
        <br />
      </div>
    )
  }

  const idxs = Array.from(Array(mode == modes.TUESDAY ? 6 : 15).keys())

  return (
    <div>
      <h2>Bookings for {mode == modes.FRIDAY ? nextFri[1] : nextTue[1]}</h2>
      <br />
      <div className="racerlist">
        {idxs.map(i =>
          data && data.racers && data.racers[mode].length > i ? (
            <Racer
              key={i}
              tabNum={i}
              name={data.racers[mode][i].name}
              status={
                data.racers[mode][i].userid == user ? "highlight" : "normal"
              }
            />
          ) : (
            <Racer key={i} name="free" status="unused" />
          )
        )}
      </div>
    </div>
  )
}

Bookings.propTypes = {
  mode: PropTypes.number.isRequired,
  user: PropTypes.string.isRequired,
}

export default Bookings
