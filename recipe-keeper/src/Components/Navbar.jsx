import {Link} from 'react-router-dom'
import './ComponentsCSS/Navbar.css'
import { useSendLogoutMutation } from '../features/auth/authApiSlice'
import useAuth from '../hooks/useAuth'
import { useState } from 'react'

const Navbar = () => {

  const {status, isAdmin} = useAuth()
  const [sendLogout, {isLoading, isSuccess, isError, error}] = useSendLogoutMutation()

  return (
    <header className="navbarContainer">
      <div className="navbarHome">
        <Link className='navbarTitleContainer' to='/'>
          <h1 className='navbarTitle'>Recipe Keeper</h1>
        </Link>
      </div>

        {(!status || !isAdmin) ?
          <nav className='navbarButtonContainer'>
            <Link to='/users/new'>
              <p className='navBtn'>
              Sign Up
              </p>
              <p className='navBtnHolder'>🍕</p>
            </Link>
          </nav> 
        : 
          <nav className='navbarButtonContainer'>
          <div
            className='navbarLogoutBtn'
            title='Logout'
            onClick={sendLogout}
          >
           <p className='navBtn'>
              Logout
              </p>
              <p className='navBtnHolder'>🍕</p>
          </div> 
        </nav>
        }
    </header>  
)
}

export default Navbar