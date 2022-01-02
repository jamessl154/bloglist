const userReducer = (state = null, action) => {
  switch(action.type) {
  case 'RESET_USER':
    return null
  case 'SET_USER':
    return action.user
  default:
    return state
  }
}

export const resetUser = () => {
  return { type: 'RESET_USER' }
}

export const setUser = (user) => {
  return {
    type: 'SET_USER',
    user
  }
}

export default userReducer