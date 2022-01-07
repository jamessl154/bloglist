import React from 'react'
import { Alert } from '@material-ui/lab'

const Loading = () => {
  return (
    <div>
      <div className='notification'>
        <Alert className='empty'>
          Loading...
        </Alert>
      </div>
      <div className='loading-container'>
        <div className='loading'>
          Loading...
        </div>
      </div>
    </div>
  )
}

export default Loading