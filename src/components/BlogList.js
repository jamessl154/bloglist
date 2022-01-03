import React, { useEffect } from 'react'
import { BrowserRouter as Router, Switch, useHistory, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import UserDisplay from './UserDisplay'
import User from './User'
import SingleBlog from './SingleBlog'
import BlogDisplay from './BlogDisplay'
import NavBar from './NavBar'
import { postBlog, deleteBlog, likeBlog } from '../reducers/blogsReducer'
import { notifyWith } from '../reducers/notificationReducer'
import { initializeUsers, removeFromBlogsArray } from '../reducers/usersReducer'
import { resetUser } from '../reducers/userReducer'

const BlogList = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const users = useSelector(state => state.users)

  useEffect(() => {
    dispatch(initializeUsers())
  }, [dispatch])

  const handleRemove = (blog) => {
    if (window.confirm(`Remove "${blog.title}" by ${blog.author}?`)) {
      dispatch(deleteBlog(blog))
      dispatch(notifyWith(`"${blog.title}" removed from the blogs list!`, 'success'))
      dispatch(removeFromBlogsArray(blog))
    }
  }

  const handleAdd = (newBlog) => {
    const { title, author, url } = newBlog
    if (!title || !author || !url) {
      dispatch(notifyWith('Please fill in all fields', 'error'))
      return
    }
    dispatch(postBlog(newBlog))
    dispatch(notifyWith(`"${newBlog.title}" by ${newBlog.author} added`, 'success'))
  }

  const handleLike = (blog) => {
    // The backend returns a populated user field (mongoose method)
    // when we send GET requests to api/blogs.
    // However, when we send PUT request we need to omit those
    // populated fields or we get 400 Bad requests
    let updatedBlog = { ...blog, likes: blog.likes + 1 , user: blog.user.id }
    dispatch(likeBlog(updatedBlog))
    dispatch(notifyWith(`Liked "${blog.title}"!`, 'success'))
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInBloglistUser')
    dispatch(notifyWith(`${user.username} logged out successfully!`, 'success'))
    dispatch(resetUser())
    history.push('/')
  }

  return (
    <div>
      <Router>
        <NavBar username={user.username} handleLogout={handleLogout} />
        <Switch>
          <Route exact path="/blogs">
            <BlogDisplay
              handleAdd={handleAdd}
              handleRemove={handleRemove}
              handleLike={handleLike}
              user={user}
              blogs={blogs}
            />
          </Route>
          <Route exact path='/blogs/:id'>
            <SingleBlog blogs={blogs} handleLike={handleLike} />
          </Route>
          <Route exact path="/users">
            <UserDisplay users={users}/>
          </Route>
          <Route exact path="/users/:id">
            <User users={users} />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default BlogList