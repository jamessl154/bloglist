import React from 'react'
import { useParams } from 'react-router'

const User = ({ users }) => {
  // conditionally render the component
  if (users) {
    const id = useParams().id
    let selectedUser = users.filter((x) => x.id === id)
    return (
      <div className='whiteText'>
        <div className='smallPageTitle'>User: {selectedUser[0].username}</div>
        <h3>Blogs added:</h3>
        {selectedUser[0].blogs.length ?
          <ul>
            {selectedUser[0].blogs.map(x =>
              <li key={x.id}>
              &quot;{x.title}&quot;
              </li>
            )}
          </ul>
          : <p>No blogs found...</p>
        }
      </div>
    )
  }
  else return null
}

export default User