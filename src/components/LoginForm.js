import React, { useState } from 'react'
import { TextField, Button } from '@material-ui/core'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import loginService from '../services/loginService'
import blogService from '../services/blogService'
import { setUser } from '../reducers/userReducer'
import { notifyWith } from '../reducers/notificationReducer'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const history = useHistory()
  const dispatch = useDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedInBloglistUser',
        JSON.stringify(user)
      )
      dispatch(notifyWith(`${username} logged in successfully!`, 'success'))
      // Save the token in a variable for the blogService
      blogService.setToken(user.token)
      // user contains the name, username and token of the logged in user
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
      history.push('/')
    } catch (exception) {
      dispatch(notifyWith('Wrong username or password.', 'error'))
      console.log(exception)
    }
  }

  return (
    <div>
      <div className='frontpage-title-text'>BlogList</div>
      <div className="center-form">
        <form data-cy='loginForm' onSubmit={handleLogin}>
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
          </div>
          <div className='frontpage-buttons'>
            <div className='button-gap'>
              <Button color='secondary' data-cy='loginButton' type="submit">Login</Button>
              <Button component={Link} to="/" color="secondary">Back</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginForm