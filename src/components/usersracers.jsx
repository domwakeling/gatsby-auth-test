import React from "react"
import PropTypes from "prop-types"
import modes from "../lib/modes"
import Racer from "./racer"

const UserRacers = ({ racers, mode, user, changeToAddRacer }) => (
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
          //   clickhandler={handleRacerClick}
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
    {mode == modes.SIGNED_IN ? (
      <p>
        Tap/click on a racer&apos;s name above to add or remove them from the
        training list.
      </p>
    ) : (
      ""
    )}
  </div>
)

UserRacers.propTypes = {
  racers: PropTypes.array.isRequired,
  mode: PropTypes.number.isRequired,
  user: PropTypes.string.isRequired,
  changeToAddRacer: PropTypes.func.isRequired,
}

export default UserRacers
