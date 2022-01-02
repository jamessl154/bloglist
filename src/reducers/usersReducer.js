import usersService from '../services/usersService'

const usersReducer = (state = null, action) => {
  switch (action.type) {
  case 'INIT_USERS':
    return action.users
  case 'REMOVE_FROM_BLOGS_ARRAY': {
    // find user in users array
    let foundUser = state.find((x) => x.id === action.blog.user.id)
    // remove the blog from the blogs array of the user
    foundUser = {
      ...foundUser,
      blogs: foundUser.blogs.filter((x) => x.id !== action.blog.id)
    }
    // return new users array
    let newUsers = state.map((x) => foundUser.id === x.id ? foundUser : x)
    return newUsers
  }
  case 'ADD_TO_BLOGS_ARRAY': {
    let b = action.blog
    let newBlog = {
      author: b.author,
      id: b.id,
      likes: b.likes,
      title: b.title,
      url: b.url,
      user: b.user.id,
    }
    let foundUser = state.find((x) => x.id === b.user.id)
    foundUser = { ...foundUser, blogs: foundUser.blogs.concat(newBlog) }
    let newUsers = state.map((x) => foundUser.id === x.id ? foundUser : x)
    return newUsers
  }
  default:
    return state
  }
}

export const initializeUsers = () => {
  return async (dispatch) => {
    const users = await usersService.getAll()
    dispatch({
      type: 'INIT_USERS',
      users
    })
  }
}

export const removeFromBlogsArray = (blog) => {
  return {
    type: 'REMOVE_FROM_BLOGS_ARRAY',
    blog
  }
}

export const addToBlogsArray = (blog) => {
  return {
    type: 'ADD_TO_BLOGS_ARRAY',
    blog
  }
}

export default usersReducer