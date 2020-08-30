import React from "react"
import PropTypes from "prop-types"

const Welcome = ({ clickSignUp, clickLogin }) => {
  return (
    <>
      <style>
        {`
          .number-circle-list {
            list-style: none;
            padding-left: 1rem;
            counter-reset: circle-counter;
          }

          .number-circle-list--list-item {
            counter-increment: circle-counter;
            margin-bottom: 0.25rem;
          }
          .number-circle-list--list-item:before {
            content: counter(circle-counter);
            background-color: gray;
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 50%;
            display: inline-block;
            font-size: 0.75rem;
            line-height: 1.5rem;
            text-align: center;
            margin-right: 0.5rem;
            position: relative;
            top: -2px;
          }
          .number-circle-list--list-item:last-child {
            margin-bottom: 0;
          }
          .number-circle-list--list-item > .number-circle-list--list-item {
            margin-left: 0.25rem;
          }
          .number-circle-list--primary-color > .number-circle-list--list-item:before {
              background-color: #394C8F;
              color: white;
            }
          }
        `}
      </style>
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
