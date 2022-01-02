import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { TextField, Button } from '@material-ui/core'

const AddBlogForm = ({ handleAdd, toggleRef }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const createBlog = (event) => {
    // first creating the blog object,
    // then calling addBlog, sending it to the DB via the backend
    // finally clearing the controlled inputs
    event.preventDefault()

    handleAdd({
      'title' : title,
      'author' : author,
      'url' : url,
    })

    setTitle('')
    setAuthor('')
    setUrl('')
    toggleRef.current.toggleVisibility()
  }

  return (
    <div>
      <form onSubmit={createBlog}>
        <div>
          <br />
          <TextField
            label="Title"
            className='title'
            id='title'
            type='text'
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
          <br />
          <TextField
            label="Author"
            className='author'
            id='author'
            type='text'
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
          <br />
          <TextField
            label="Url"
            className='url'
            id='url'
            type='text'
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <br />
        <Button color="secondary" type='submit'>Add</Button>
      </form>
      <br />
    </div>
  )
}

AddBlogForm.propTypes = {
  handleAdd: PropTypes.func.isRequired,
  toggleRef: PropTypes.object.isRequired
}

export default AddBlogForm