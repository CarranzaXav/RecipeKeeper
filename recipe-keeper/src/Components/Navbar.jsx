import {Link} from 'react-router-dom'
import './ComponentsCSS/Navbar.css'
import { useSendLogoutMutation } from '../features/auth/authApiSlice'
import useAuth from '../hooks/useAuth'

const Navbar = () => {

  const {status, isAdmin} = useAuth()
  const [sendLogout, {isLoading, isSuccess, isError, error}] = useSendLogoutMutation()

  return (
    <header className="navbarContainer">
      <div className="navbarContainer">
        <Link className='navbarTitleContainer' to='/'>
          <h1 className='navbarTitle'>Recipe Keeper</h1>
        </Link>
        {/* {(status || isAdmin) ?
        '' :  
        
        } */}
        {(!status || !isAdmin) ?
          <nav className='navbarButtonContainer'>
            <Link to='/users/new'>
              Sign Up
            </Link>
          </nav> 
        : 
          <nav className='navbarButtonContainer'>
          <button
            className='navbarLogoutBtn'
            title='Logout'
            onClick={sendLogout}
          >
            Logout
          </button> 
        </nav>
        }
      </div>
    </header>  
)
}

export default Navbar