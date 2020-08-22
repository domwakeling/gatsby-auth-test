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

const Racer = ({ name, status, clickhandler, userid, tabNum }) => (
  <>
    {userid ? (
      <div
        className="lozenge clickable"
        role="menuitem"
        tabIndex={tabNum}
        onClick={() => clickhandler(userid, name)}
        status={status}
      >
        {name}
      </div>
    ) : (
      <div className="lozenge">{name}</div>
    )}
  </>
)

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
