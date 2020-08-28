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
  keyDown,
  submitLogin,
  submitSignUp,
  changeToLogIn,
  changeToSignUp,
}) => (
  <>
    <form>
      <label htmlFor="email">email</label>
      <input
        type="email"
        id="email"
        name="email"
        onChange={handleEmail}
        onKeyDown={keyDown}
        value={email}
      />
      <label htmlFor="password">password</label>
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
          <label htmlFor="secret">secret</label>
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

SignInUp.propTypes = {
  mode: PropTypes.number.isRequired,
  handleEmail: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  handlePassword: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  handleSecret: PropTypes.func.isRequired,
  secret: PropTypes.string.isRequired,
  keyDown: PropTypes.func.isRequired,
  submitLogin: PropTypes.func.isRequired,
  submitSignUp: PropTypes.func.isRequired,
  changeToLogIn: PropTypes.func.isRequired,
  changeToSignUp: PropTypes.func.isRequired,
}

export default SignInUp
