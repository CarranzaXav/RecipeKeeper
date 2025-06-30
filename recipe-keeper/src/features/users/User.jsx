import { useNavigate } from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUserPen} from '@fortawesome/free-solid-svg-icons'

import { useGetUsersQuery } from "./usersApiSlice";
import { memo } from 'react'

const User = ({ userId }) => {

  const {user} = useGetUsersQuery('usersList', {
    selectFromResult: ({data}) => ({
      user: data?.entities[userId],
    }),
  })

  const navigate = useNavigate();

  if (user) {
    const handleEdit = () => navigate(`/dash/users/${userId}`);

    return (
      <div className='w-full mx-auto' title="userRowContainer">
        <div className='flex
          justify-self-center
          w-4/5
          py-3
          px-1.5
        ' title="userRow">

          <div className='
            w-1/2
            text-purple-800
            font-medium
            tracking-[2px]
            text-sm md:text-lg lg:text-xl
          ' 
          title="userCell"
          >
            {user.username}
          </div>

          <div className='
            w-1/2
            flex
            flex-row-reverse
            text-sm md:text-lg lg:text-xl
          '
            title="userCellBtnContainer"
          >
            <button className="
              cursor-pointer
            "
              title="userEditBtn" 
              onClick={handleEdit}
            >
              <FontAwesomeIcon icon={faUserPen} style={{color: 'oklch(43.8% 0.218 303.724)'}}/>
            </button>
          </div>
          
        </div>
        <div className='
          border-b-2 border-dashed border-white
          w-9/10
          mx-auto
        '
          title="userRowLine"></div>
      </div>
    );
  } else return null;
};

const memoizedUser = memo(User)

export default memoizedUser;
