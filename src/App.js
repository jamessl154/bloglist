import React, { useEffect } from 'react'
import Container from '@material-ui/core/Container'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import blogService from './services/blogService'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import FrontPage from './components/FrontPage'
import RegisterForm from './components/RegisterForm'
import { initializeBlogs } from './reducers/blogsReducer'
import { setUser } from './reducers/userReducer'
import './App.css'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInBloglistUser')
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      // put user object, token included, in the redux store
      dispatch(setUser(user))
      // save the token to a variable for the blogService
      blogService.setToken(user.token)
    }
  }, [])

  return (
    <Container>
      <div className="notification">
        <Notification />
      </div>
      <div className="blog-container">
        <Router>
          <Switch>
            <Route exact path="/login">
              <LoginForm />
            </Route>
            <Route exact path='/register'>
              <RegisterForm />
            </Route>
            <Route exact path='/blogs'>
              {user ? <BlogList /> : <Redirect to="/" />}
            </Route>
            {/* default route, binds to any route that isn't included above */}
            <Route path="/">
              {user ? <Redirect to="/blogs" /> : <FrontPage />}
            </Route>
          </Switch>
        </Router>
      </div>
    </Container>
  )
}

export default App