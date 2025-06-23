import {Link} from 'react-router-dom'
import { useSendLogoutMutation } from '../features/auth/authApiSlice'
import useAuth from '../hooks/useAuth'
import { useState, useEffect } from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBurger} from '@fortawesome/free-solid-svg-icons'

const Navbar = () => {

  const {username} = useAuth()
  const [sendLogout, {isLoading, isSuccess, isError, error}] = useSendLogoutMutation()
  const [isHovered, setIsHovered] = useState(false)

  useEffect (() => {
      setIsHovered(false)
  },[username])

  const hoverClass = isHovered ? 'invisible' : 'duration-300 ease-in-out text-purple-400'
  const hiddenClass = isHovered ? '' : 'invisible'

  const hover = () => {
    setIsHovered(prev => (!prev))
  }

  return (
    <header className="navbarContainer
      flex
      w-full
      bg-[var(--NAVBAR)]
      text-white
    ">
      <div className="navbarHome
        px-[2%] py-[5px]
        w-9/10
        items-center
        flex
      ">
        <Link className='navbarTitleContainer w-8/10' to='/'>
          <h1 className='navbarTitle text-2xl text-white hover:text-purple-700 
         font-semibold tracking-[1px]'>Recipe Keeper</h1>
        </Link>
      </div>

        {(username) ?
          <nav className='navbarButtonContainer
            w-2/10
            ml-1/10
            flex
            justify-end
            py-2
            pr-[2%] hover:pr-0
            cursor-pointer
            bg-linear-270 from-[#b393cc] from-75% to-[var(--NAVBAR)]'
            onMouseEnter={hover}
            onMouseLeave={hover}
          >
          <div
            className={`navbarLogoutBtn flex items-center font-semibold tracking-[2px] `}
            title='Logout'
            onClick={sendLogout}
          >
           <p className={`navBtn 
              flex
              ${hiddenClass}
              text-white hover:text-purple-700
              tracking-[2px]
              font-semibold
              `}>
              Logout
            </p>
            <p className={`navBtnHolder text-4xl ${hoverClass}`}>
              <FontAwesomeIcon icon={faBurger} style={{color: "white"}} />
            </p>
          </div> 
        </nav>
        :
          <nav className='navbarButtonContainer
            w-2/10
            ml-1/10 hover:ml-0
            flex
            justify-end
            py-2
            pr-[2%] hover:pr-0
            cursor-pointer
            bg-linear-270 from-[#b393cc] from-75% to-[var(--NAVBAR)]'
            onMouseEnter={hover}
            onMouseLeave={hover}
          >
            <Link to='/users/new' className='flex
            items-center
            text-xl
            font-semibold
            tracking-[2px]
            '>
              <p className={`navBtn
              ${hiddenClass}
              text-white hover:text-purple-700
              tracking-[2px]
              font-semibold
              flex
              `}>
              Sign Up
              </p>
              <p className={`navBtnHolder ${hoverClass} text-4xl`}>
              <FontAwesomeIcon icon={faBurger} style={{color: 'white'}} />
              </p>
            </Link>
          </nav> 

        }
    </header>  
)
}

export default Navbar