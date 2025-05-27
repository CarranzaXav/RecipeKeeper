import { useGetUsersQuery } from "./usersApiSlice"
import User from './User'
import './usersCSS/UsersList.css'

const UsersList = () => {

  const {data: users, isLoading, isSuccess, isError, error} = useGetUsersQuery()

  if (isLoading) return <p>Loading...</p>
  
  if (isError) return <p className="errmsg">{error?.data?.message}</p>

  if(isSuccess) {
    const {ids} = users

    const usersContent = ids?.length ? ids.map(userId => <User key={userId} userId={userId} />) : null

    return (
    <div className="usersList">
      <div className="usersListHead">
        <div className="usersListRow">
          <div className="usersListRowTitle">Users</div>
          <div className="usersListRowEdit">Edit</div>
        </div>
      </div>
        <div className="usersListHeadLine"></div>
      <div className="usersListBody">{usersContent}</div>
    </div>

  )}

  return null
}

export default UsersList