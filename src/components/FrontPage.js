import React from 'react'
import { Button } from '@material-ui/core'
import { Link } from 'react-router-dom'

const FrontPage = () => {
  return (
    <div>
      <div className='frontpage-title-text'>BlogList</div>
      <div className='frontpage-buttons'>
        <div className='button-gap'>
          <Button component={Link} to="/login" color="secondary">Login</Button>
          <Button component={Link} to="/register" color="secondary">Register</Button>
        </div>
      </div>
    </div>
  )
}

export default FrontPage