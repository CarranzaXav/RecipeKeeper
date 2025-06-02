import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectUserById, useGetUsersQuery } from "./usersApiSlice";
import { memo } from 'react'

import './usersCSS/User.css'

const User = ({ userId }) => {
  // const user = useSelector((state) => selectUserById(state, userId));

  const {user} = useGetUsersQuery('usersList', {
    selectFromResult: ({data}) => ({
      user: data?.entities[userId],
    }),
  })

  const navigate = useNavigate();

  if (user) {
    const handleEdit = () => navigate(`/dash/users/${userId}`);

    // const userRolesString = user.roles.toString().replaceAll(",", ", ");

    return (
      <div className="userRowContainer">
        <div className="userRow">

          <div className="userCell">{user.username}</div>

          <div className="userCellBtnContainer">
            <button className="userEditBtn" onClick={handleEdit}>Edit</button>
          </div>
          
        </div>
        <div className="userRowLine"></div>
      </div>
    );
  } else return null;
};

const memoizedUser = memo(User)

export default User;
