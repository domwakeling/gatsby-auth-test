import React from "react"
import PropTypes from "prop-types"

const Welcome = ({ clickSignUp, clickLogin }) => {
  return (
    <>
      <p>
        Please either{" "}
        <a href="#" onClick={clickLogin}>
          sign in
        </a>{" "}
        or{" "}
        <a href="#" onClick={clickSignUp}>
          sign up
        </a>
        .
      </p>
      <br />
      <h2>How it works</h2>
      <ol className="number-circle-list number-circle-list--primary-color">
        <li className="number-circle-list--list-item">Create an account</li>
        <li className="number-circle-list--list-item">
          Add racers to your account
        </li>
        <li className="number-circle-list--list-item">
          Add your racers to the booking list
        </li>
      </ol>
    </>
  )
}

Welcome.propTypes = {
  clickLogin: PropTypes.func.isRequired,
  clickSignUp: PropTypes.func.isRequired,
}

export default Welcome
