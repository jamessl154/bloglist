import React from 'react'
import { useParams } from 'react-router'
import { useDispatch } from 'react-redux'
import { Button, Link, TextField } from '@material-ui/core'

import { addComment } from '../reducers/blogsReducer'
import { notifyWith } from '../reducers/notificationReducer'

const SingleBlog = ({ blogs, handleLike }) => {
  const dispatch = useDispatch()
  let id = useParams().id
  let blog = blogs.find((x) => x.id === id)

  const handleAddComment = (event) => {
    event.preventDefault()
    if (!event.target.comment.value) {
      dispatch(notifyWith('Comment field is blank', 'error'))
      return
    }
    dispatch(addComment(blog.id, event.target.comment.value))
    dispatch(notifyWith(`Added a new comment to ${blog.title}!`, 'success'))
    event.target.comment.value = ''
  }

  if (blogs && blog) {
    return (
      <div className='whiteText'>
        <div className="smallPageTitle">&quot;{blog.title}&quot; by {blog.author}</div>
        Url:{' '}<Link underline='always' color="secondary" href={blog.url}>{blog.url}</Link><br />
        Total Likes: {blog.likes}{' '}
        <Button onClick={() => handleLike(blog)}>&#128077;</Button>
        <br />
        <span>added by {blog.user.username}</span><br />
        <div className="smallPageTitle">Comments</div>
        <form className="commentForm" onSubmit={handleAddComment}>
          <TextField
            variant="filled"
            label="New Comment"
            color="secondary"
            name="comment"
            multiline
          />
          <div className="commentButton">
            <Button
              color="secondary"
              type="submit"
            >
              Add Comment
            </Button>
          </div>
        </form>
        {blog.comments.length ?
          <ul>
            {blog.comments.map((x) =>
              // generate unique key
              <li key={x + Math.round(Math.random() * 100000)}>
                {x}
              </li>
            )}
          </ul>
          : <p>No comments found...</p>
        }
      </div>
    )
  } else {
    return (
      <>
        <p>{id} is not a valid blog id</p>
      </>
    )
  }
}

export default SingleBlog