import React from "react"
import PropTypes from "prop-types"
import useSWR from "swr"
import Racer from "./racer"

const fetcher = url => fetch(url).then(r => r.json())

export const getNextDay = day => {
  const dayNum = day == "Tuesday" ? 9 : 12
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

const Bookings = ({ weekday }) => {
  const ds = getNextDay(weekday)
  // update the booking data every minute; code elsewhere to trigger a refresh when user tries
  // to change their own booking data
  const { data, error } = useSWR(
    `/.netlify/functions/getbookings/${ds[0]}`,
    fetcher,
    { refreshInterval: 60 * 1000 }
  )

  if (error) return <div>failed to load</div>

  if (!data) {
    return (
      <div>
        <h2>Bookings for {ds[1]}</h2>
        <p>loading...</p>
        <br />
      </div>
    )
  }

  const idxs =
    weekday == "Tuesday"
      ? [0, 1, 2, 3, 4, 5]
      : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
      
  return (
    <div>
      <h2>Bookings for {ds[1]}</h2>
      <br />
      <div className="racerlist">
        {idxs.map(i =>
          data && data.racers && data.racers.length > i ? (
            <Racer
              key={i}
              tabNum={i}
              name={data.racers[i].name}
              status="normal"
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
  weekday: PropTypes.string.isRequired,
}

export default Bookings
