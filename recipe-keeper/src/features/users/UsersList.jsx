import { useGetUsersQuery } from "./usersApiSlice"
import User from './User'
import Loader from "../../Components/Loader"

const UsersList = () => {

  const {data: users, isLoading, isSuccess, isError, error} = useGetUsersQuery('usersList', {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  })

  if (isLoading) return <Loader/>
  
  if (isError) return <p className="errmsg">{error?.data?.message}</p>

  if(isSuccess) {
    const {ids} = users

    const usersContent = ids?.length ? ids.map(userId => <User key={userId} userId={userId} />) : null

    return (
    <div className='w-full lg:w-7/10 
      justify-self-center
      bg-[var(--BORDER-COLOR)]
      rounded-2xl
      font-[Oswald]
      font-light
      tracking-[1px]
      mt-2
      pb-2.5
    ' title="usersList"
    >
      <div className='
        w-8/10
        py-3
        mx-auto
      ' 
      title="usersListHead"
      >
        <div className='
          text-purple-700
          flex
          w-full
          text-3xl
          font-medium
          tracking-[5px]
        ' 
          title="usersListRow"
        >
          <div className='w-1/2' title="usersListRowTitle">
            Users
          </div>
          <div className='
            w-1/2
            flex
            flex-row-reverse
          ' 
          title="usersListRowEdit"
          >
            Edit
          </div>
        </div>
      </div>
        <div className='
          border-b-1
          border-white
          w-9/10
          mx-auto
        '
        title="usersListHeadLine"
        >
        </div>
      <div className="usersListBody">{usersContent}</div>
    </div>

  )}

  return null
}

export default UsersList