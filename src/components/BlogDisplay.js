import React, { useRef } from 'react'

import Blog from './Blog'
import AddBlogForm from './AddBlogForm'
import Togglable from './Togglable'

const BlogDisplay = ({ handleAdd, handleRemove, blogs, handleLike, user }) => {
  const toggleRef = useRef()

  return (
    <div>
      <div className='pageTitle'>Blogs</div>
      <div className='blogGrid'>
        {blogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            handleLike={() => handleLike(blog)}
            handleRemove={() => handleRemove(blog)}
          />)}
      </div>
      <Togglable
        buttonLabel="Add a new Blog"
        ref={toggleRef}
      >
        {/*
          pass toggleRef as a ref to Togglable
          but as a prop to AddBlogForm
        */}
        <AddBlogForm handleAdd={handleAdd} toggleRef={toggleRef} />
      </Togglable>
    </div>
  )
}

export default BlogDisplay