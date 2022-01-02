import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'

// https://reactjs.org/docs/forwarding-refs.html
// forwardRef => the component can access the ref passed to it
const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => setVisible(!visible)

  // the ref of this component now has the toggleVisibility
  // as a method. The state of this component can be changed
  // from its parent which is not possible without refs
  useImperativeHandle(ref, () =>  {
    return {
      toggleVisibility
    }
  })
  // https://reactjs.org/docs/hooks-reference.html#useimperativehandle
  // useImperativeHandle customizes the instance value that
  // is exposed to parent components when using ref

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button color="secondary" onClick={toggleVisibility}>{props.buttonLabel}</Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button color='secondary' onClick={toggleVisibility}>Cancel</Button>
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

export default Togglable