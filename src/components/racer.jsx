import React from "react"
import PropTypes from "prop-types"

const colors = {
  normal: "white",
  highlight: "white",
  unused: "#333",
}
const bgcolors = {
  normal: "#394c8f",
  highlight: "#d79022",
  unused: "#bbb",
}

const Racer = ({ name, status, clickhandler, userid, tabNum }) => {
  const handleClick = e => {
    e.preventDefault()
    clickhandler(userid, name)
  }

  return (
    <>
      <style>
        {`
          .lozenge {
            box-sizing: content-box;
            display: inline-block;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            background-color: ${bgcolors[status]};
            color: ${colors[status]};
            margin-bottom: 0.5rem;
            margin-right: 1.0rem;
            min-width: 200px;
          }
          .clickable {
            cursor: pointer;
          }
          .clickable:hover {
            box-shadow: 0 8px 30px rgba(0,0,0,0.12);
          }
        `}
      </style>
      {userid ? (
        <div
          className="lozenge clickable"
          role="menuitem"
          tabIndex={tabNum}
          onClick={handleClick}
          status={status}
        >
          {name}
        </div>
      ) : (
        <div className="lozenge">{name}</div>
      )}
    </>
  )
}

Racer.defaultProps = {
  status: "normal",
  clickhandler: () => {},
  userid: "",
  tabNum: -1,
}

Racer.propTypes = {
  name: PropTypes.string.isRequired,
  status: PropTypes.string,
  clickhandler: PropTypes.func,
  userid: PropTypes.string,
  tabNum: PropTypes.number,
}

export default Racer
