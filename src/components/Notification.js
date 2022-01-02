import React from 'react'
import { useSelector } from 'react-redux'
import Alert from '@material-ui/lab/Alert'

const Notification = () => {
  const notification = useSelector(state => state.notification)

  if (notification === null) {
    return (
      <Alert className='empty'>
        Notifications go here
      </Alert>
    )
  }

  return (
    <Alert severity={notification.type}>
      {notification.message}
    </Alert>
  )
}

export default Notification