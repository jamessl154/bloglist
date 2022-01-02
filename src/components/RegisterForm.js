import React, { useState } from 'react'
import { TextField, Button } from '@material-ui/core'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { notifyWith } from '../reducers/notificationReducer'
import { setUser } from '../reducers/userReducer'
import usersService from '../services/usersService'
import blogService from '../services/blogService'

const RegisterForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const dispatch = useDispatch()
  const history = useHistory()

  const handleRegister = async (event) => {
    event.preventDefault()

    if (password !== confirmation) {
      dispatch(notifyWith('Password and Confirmation Password do not match', 'error'))
      setPassword('')
      setConfirmation('')
      return
    }

    try {
      const user = await usersService.registerUser({
        username, password
      })

      window.localStorage.setItem(
        'loggedInBloglistUser',
        JSON.stringify(user)
      )

      dispatch(notifyWith(`${username} registered and logged in successfully!`, 'success'))
      blogService.setToken(user.token)
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
      setConfirmation('')
      history.push('/')
    } catch (e) {
      dispatch(notifyWith(e.response.data.error, 'error'))
      console.log(e.response.data.error)
    }
  }

  return (
    <div>
      <div className='frontpage-title-text'>BlogList</div>
      <div className="center-form">
        <form data-cy='registerForm' onSubmit={handleRegister}>
          <div className="input-fields">
            <TextField
              variant="standard"
              id='username'
              label='Username'
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
            <TextField
              variant="standard"
              id='password'
              label='Password'
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
            <TextField
              variant="standard"
              id='confirmation'
              label='Confirm Password'
              type="password"
              value={confirmation}
              name="Confirmation"
              onChange={({ target }) => setConfirmation(target.value)}
            />
          </div>
          <div className='frontpage-buttons'>
            <div className='button-gap'>
              <Button color='secondary' data-cy='registerButton' type="submit">Register</Button>
              <Button component={Link} to="/" color="secondary">Back</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterForm