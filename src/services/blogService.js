import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

// Format correctly for use.
// Stored here in memory, used in add and remove blog requests
const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const addBlog = async (newBlog) => {

  // https://github.com/axios/axios#instance-methods
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const addLikes = async (id, update) => {
  const response = await axios.put(`${baseUrl}/${id}`, update)
  return response.data
}

const removeBlog = async (id) => {

  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)

  return response
}

const addComment = async (id, comment) => {
  let commentObject = { comment }
  const response = await axios.post(`${baseUrl}/${id}/comments`, commentObject)
  return response.data
}

const blogService = {
  getAll, addBlog, setToken,
  addLikes, removeBlog, addComment
}

export default blogService