import React from "react"
import PropTypes from "prop-types"

//   const colors = {
//     normal: 'white',
//     highlight: 'white',
//     unused: '#333',
//   };
//   const bgcolors = {
//     normal: '#394c8f',
//     highlight: '#d79022',
//     unused: '#bbb',
//   };

const Racer = ({ name, status, clickhandler, userid, tabNum }) => {
  const handleClick = e => {
    e.preventDefatul()
    clickhandler(userid, name)
  }

  return (
    <>
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
