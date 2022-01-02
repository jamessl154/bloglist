import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@material-ui/core'

const NavBar = ({ username, handleLogout }) => {
  const location = useLocation()

  return (
    <div className='navigationBar'>
      <div className='navButtons'>
        <Button variant="contained" style={{ 'marginRight': '10px' }} component={Link} to="/blogs" disabled={location.pathname === '/blogs'}>Blogs</Button>
        <Button variant="contained" component={Link} to="/users" disabled={location.pathname === '/users'}>Users</Button>
      </div>
      <div className='logout'>
        <div className='logoutText'>
          {username} is logged in
        </div>
        <Button
          color="secondary"
          variant="outlined"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  )
}

export default NavBar