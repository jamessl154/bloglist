import React from 'react'
import { Link } from 'react-router-dom'
import { Link as HyperLink } from '@material-ui/core'

const UserDisplay = ({ users }) => {
  // UserDisplay, like Blog, is a presentational component
  // so we want to exclude state management, pass users as a prop
  return (
    <>
      <div className='pageTitle'>Users</div>
      { users
        ?
        <table className="usersTable">
          <thead>
            <tr>
              <th>Username</th>
              <th>Blogs added</th>
            </tr>
          </thead>
          <tbody>
            {users.map(x =>
              <tr key={x.id}>
                <td>
                  <HyperLink
                    component={Link}
                    color="secondary"
                    underline="always"
                    to={`/users/${x.id}`}
                  >
                    {x.username}
                  </HyperLink>
                </td>
                <td>{x.blogs.length}</td>
              </tr>
            )}
          </tbody>
        </table>
        :
        null
      }
    </>
  )
}

export default UserDisplay