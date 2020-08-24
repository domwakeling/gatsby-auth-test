import React from "react"
import useSWR from "swr"
// import { useCurrentUser } from '../lib/hooks';
import Racer from "./racer"
// import fetcher from '../lib/fetch';

const fetcher = url => fetch(url).then(r => r.json())

// const getFriday = () => {
//   const date = new Date()
//   // eslint-disable-next-line no-mixed-operators
//   date.setDate(date.getDate() + ((12 - date.getDay()) % 7))
//   const ds0 =
//     `0${date.getDate()}`.slice(-2) +
//     `0${date.getMonth()}`.slice(-2) +
//     date.getFullYear()
//   let ds1 = date.toDateString().split(" ")
//   ds1 = `${ds1[2]} ${ds1[1]} ${ds1[3]}`
//   return [ds0, ds1]
// }

const Bookings = () => {
  // const ds = getFriday()
  const ds = ["28082020", "28 August 2020"]
  const { data, error } = useSWR(
    `/.netlify/functions/getbookings/${ds[0]}`,
    fetcher,
    { refreshInterval: 1000 }
  )

  if (error) return <div>failed to load</div>

  if (!data) {
    return (
      <div>
        <h2>
          Bookings for
          {ds[1]}
        </h2>
        <p>loading...</p>
        <br />
      </div>
    )
  }

  console.log("Data:", data)

  const idxs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
  return (
    <div>
      <h2>Bookings for {ds[1]}</h2>
      <br />
      <div className="racerlist">
        {idxs.map(i =>
          data && data.data && data.data.racers.length > i ? (
            <Racer
              key={i}
              tabNum={i}
              name={data.data.racers[i].name}
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

export default Bookings
