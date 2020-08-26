/**
 * Modified from work by Ashwani Arya
 */

import React from "react"
import PropTypes from "prop-types"
import { render, unmountComponentAtNode } from "react-dom"

const config = {
  success: {
    primaryColor: "#2CC51F",
    secondaryColor: "green",
    label: "Success notification!",
  },
  info: {
    primaryColor: "grey",
    secondaryColor: "grey",
    label: "Info notification!",
  },
  error: {
    primaryColor: "#F55C2C",
    secondaryColor: "red",
    label: "Error notification!",
  },
  warn: {
    primaryColor: "orange",
    secondaryColor: "orange",
    label: "Warning notification!",
  },
}

class ToastTop extends React.Component {
  componentDidMount() {
    this.timeout = setTimeout(() => {
      let tId = this.props.targetId
      this.remove(tId)
    }, this.props.duration * 1000)
  }
  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  }
  remove(id) {
    unmountComponentAtNode(document.getElementById(id))
    if (this.props.onRemove) {
      this.props.onRemove()
    }
  }
  render() {
    let props = this.props
    return (
      <div className="toast-message-container">
        <div id="toast-message" className="toast-message">
          {/* Message to be added here */}
          <div className="title">{props.title || config[props.type].label}</div>
          <div>{props.message}</div>
        </div>
        {/* Static Styling */}
        {/*<style jsx>{`
          .toast-message {
            flex:1;
            background-color: #fff;
            padding: 16px 16px;
            border-radius: 5px;
            font-family: 'Open Sans', sans-serif;
            font-size: 1rem;
            border-left: 12px solid ${config[props.type].primaryColor};
          }
          .title {
            margin-bottom: 8px;
            color: ${config[props.type].primaryColor};
            font-family: 'Playfair Display', serif;
            font-weight: bold;
            font-size: 1.2rem;
          }
      `}</style>*/}
        {/* Dynamic Styling */}
        {/* <style jsx>{`
          @keyframes SlideInOutTop {
            0%{
              transform: translateY(-40px);
              opacity:0;
            }
            ${ props.transitionPercentage}% {
              transform: translateY(0px);
              opacity:1;
            }
            ${ (100 - props.transitionPercentage)}% {
              transform: translateY(0px);
              opacity:1;
            }
            100% {
              transform: translateY(-40px);
              opacity:0;
            }
          }
          .toast-message-container {
              color: #444;
              width: 23rem;
              max-width: 23rem;
              box-shadow: 0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.2);
              margin: 0px 1rem;
              border-radius: 5px;
              animation: SlideInOutTop ${props.duration}s ease-in-out;
          }
          @media (max-width: 400px) {
            .toast-message-container {
              width: 300px;
            }
          }
        `}</style>*/}
      </div>
    )
  }
}
// toast object
export const toast = {
  remove: id => {
    let comId = id || "toast-container"
    let doc = document.getElementById(comId)
    if (doc) unmountComponentAtNode(doc)
  },
  notify: (message, options = null) => {
    let duration = 5
    let type = "info"
    let targetId = "toast-container"
    let title = null
    // let position = 'top'
    let onRemove = null
    if (options) {
      if (options.duration) duration = options.duration
      if (options.type) {
        type = options.type
      }
      if (options.targetId) {
        targetId = options.targetId
      }
      if (options.title) {
        title = options.title
      }
      if (options.onRemove) {
        onRemove = options.onRemove
      }
    }
    let transitionPercentage = 0.3 * (100 / duration)
    render(
      <ToastTop
        message={message}
        slideIn={true}
        type={type || "info"}
        transitionPercentage={transitionPercentage}
        targetId={targetId}
        title={title}
        onRemove={onRemove}
        duration={duration}
      />,
      document.getElementById(targetId)
    )
  },
}

// Toast container
export const ToastContainer = props => {
  let id = props.id || "toast-container"
  return (
    <div id={id} className="toast-container">
      {/*<style jsx>{`
        .toast-container {
          position: fixed;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          left: 0px;
          height: 0px;
          background-color:red;
        }
        .toast-container {
          position: fixed;
          width: 100%;
          top: 20px;
          display: flex;
          flex-direction: column;
          align-items: ${
        (() => {
          if (!props.align) return 'right';
          if (props.align === 'center') return 'center';
          if (props.align === 'left') return 'flex-start';
          if (props.align === 'right') return 'flex-end';
        })()
        };
          left: 0px;
        }
      `}</style>*/}
    </div>
  )
}

ToastContainer.defaultProps = {
  align: "right",
  id: "toast-container",
}

ToastContainer.propTypes = {
  align: PropTypes.string,
  id: PropTypes.string,
}

ToastTop.defaultProps = {
  message: "",
  onRemove: () => {},
  title: "",
  type: "info",
}

ToastTop.propTypes = {
  duration: PropTypes.number.isRequired,
  message: PropTypes.string,
  onRemove: PropTypes.func,
  title: PropTypes.string,
  targetId: PropTypes.string.isRequired,
  transitionPercentage: PropTypes.number.isRequired,
  type: PropTypes.string,
}
