import React from "react"
import PropTypes from "prop-types"

import modes from "../lib/modes"

const SignInUp = ({
  mode,
  handleEmail,
  email,
  handlePassword,
  password,
  handleSecret,
  secret,
  submitLogin,
  submitSignUp,
  changeToLogIn,
  changeToSignUp,
}) => {
  // capture <enter> key and react accordingly
  const keyDown = e => {
    if (e.keyCode == 13) {
      e.preventDefault()
      const fakeE = { preventDefault: () => {} }
      if (mode == modes.LOGGING_IN) {
        submitLogin(fakeE)
      } else {
        submitSignUp(fakeE)
      }
    }
  }

  return (
    <>
      <style>
        {`
          input {
              border: 1px solid #d79022;
              min-width: 20rem;
              margin-bottom: 0.75rem;
              border-radius: 0.25rem;
              padding: 0.5rem 0 0.5rem 0.2rem;
              font-size: 1rem;
            }
            label, .circle {
              font-size: 1.5rem;
              display: inline-block;
              background-color: #394c8f;
              border-radius: 50%;
              width: 2.1rem;
              height: 2.1rem;
              text-align: center;
              color: white;
              margin-right: 0.75rem;
              position: relative;
            }
        `}
      </style>
      <form>
        <label htmlFor="email">e</label>
        <input
          type="email"
          id="email"
          name="email"
          onChange={handleEmail}
          onKeyDown={keyDown}
          value={email}
        />
        <label htmlFor="password">p</label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={handlePassword}
          onKeyDown={keyDown}
          value={password}
        />
        {mode == modes.SIGNING_UP ? (
          <>
            <label htmlFor="secret">s</label>
            <input
              type="secret"
              id="secret"
              name="secret"
              onChange={handleSecret}
              onKeyDown={keyDown}
              value={secret}
            />
          </>
        ) : (
          ""
        )}
      </form>
      {mode == modes.LOGGING_IN ? (
        <>
          <button onClick={submitLogin}>Log In</button>
          <p>
            Or do you want to{" "}
            <a href="#" onClick={changeToSignUp}>
              create a new account?
            </a>
          </p>
        </>
      ) : (
        <>
          <button onClick={submitSignUp}>Sign Up</button>
          <p>
            Or do you want to{" "}
            <a href="#" onClick={changeToLogIn}>
              log in to an existing account?
            </a>
          </p>
        </>
      )}
    </>
  )
}

SignInUp.propTypes = {
  mode: PropTypes.number.isRequired,
  handleEmail: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  handlePassword: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  handleSecret: PropTypes.func.isRequired,
  secret: PropTypes.string.isRequired,
  submitLogin: PropTypes.func.isRequired,
  submitSignUp: PropTypes.func.isRequired,
  changeToLogIn: PropTypes.func.isRequired,
  changeToSignUp: PropTypes.func.isRequired,
}

export default SignInUp
