import { useRef, useState, useEffect} from 'react'
import { useNavigate, Link} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faHouseChimney} from '@fortawesome/free-solid-svg-icons'

import { useDispatch} from 'react-redux'
import { setCredentials } from './authSlice';
import { useLoginMutation} from './authApiSlice'

import usePersist from '../../hooks/usePersist'
import './authCSS/Login.css'

const Login = () => {

  const userRef = useRef()
  const errRef = useRef()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [persist, setPersist] = usePersist()

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [login, {isLoading}] = useLoginMutation()

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    setErrMsg('')
  }, [username, password])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
      const { accessToken} = await login({ username, password}).unwrap()
      dispatch(setCredentials({accessToken}))
      setUsername('')
      setPassword('')
      navigate('/', {replace: true})
      // window.location.reload()
    } catch (err) {
      if(!err.status){
        setErrMsg('No Server Response')
      } else if (err.status === 400){
        setErrMsg('Missing Username or Password')
      } else if(err.status === 401){
        setErrMsg('Unauthorized Login')
      } else {
        setErrMsg(err.data?.message)
      }

      if (errRef.current){
        errRef.current.focus()
      }
    }
  }

  const handleUserInput = (e) => setUsername(e.target.value)
  const handlePwdInput = (e) => setPassword(e.target.value)
  const handleToggle = () => setPersist(prev => !prev)

  const handleSignUp = () => navigate('/users/new')
  
  const errClass = errMsg ? 'errmsg': 'offscreen'

  if (isLoading) return <div className='loader'>Loading...</div>

  return (
  <div className="w-full pt-12 h-96">
    <section className='
      grid
      w-9/10 sm:w-8/10 md:w-6/10 lg:w-1/2 xl:w-2/5
      h-72 md:h-60
      my-auto
      px-1.5
      justify-self-center
      bg-[var(--LOGIN-SIGNUP)]
      rounded-t-xl
      '
      title='login'
    >
      <header className="
        py-2.5
        h-16
        flex
        self-center
        justify-center
        "
        title='loginHeader'
      >
        <h2 className='
        text-white
          text-xl sm:text-3xl
          font-semibold
          flex
          self-center
          tracking-[6px]
          '
          title="loginHeaderTitle"
        >
        User Login
        </h2>
      </header>

      <main className="
        w-full
        h-full
        my-4
        justify-items-center
        content-center
        "
        title='loginMain'
      >
        <p ref={errRef} className={errClass} aria-live='assertive'>{errMsg}</p>

        <form 
          onSubmit={handleSubmit} 
          className="w-9/10 justify-center"
          title='loginForm'
        >
          <div className="
            w-full
            justify-items-center
            py-2
            "
            title='loginUsername'
          >
            <input type="text" 
              className='
                py-1 px-2
                bg-white
                text-purple-700
                shadow-md shadow-purple-700
                rounded-xl
                flex
                w-full lg:w-9/10
                justify-center
              '
              title='loginFormInput'
              id='username'
              ref={userRef}
              value={username}
              onChange={handleUserInput}
              autoComplete='off'
              placeholder='Username'
              required
            />
          </div>

          <div className="
            w-full
            justify-items-center
            py-2
          "
          title='loginFormPassword'
          >
            <input 
              type="password"
              className='
                py-1 px-2
                bg-white
                text-purple-700
                shadow-md shadow-purple-700
                rounded-xl
                flex
                w-full lg:w-9/10
                justify-center
              '
              title='loginFormInput'
              id='password'
              placeholder='Passcode'
              onChange={handlePwdInput}
              value={password}
              required
            />
          </div>

          <button 
            className="
              py-1 px-2
              bg-white
              text-purple-700
              shadow-md shadow-purple-700
              rounded-xl
              flex
              w-1/2 lg:w-9/10
              justify-self-center
              justify-center
            "
            title='loginFormBtn'
          >
            Sign In
          </button>

          <div className="
          flex
          justify-center
          my-2
          text-sm
          "
            title='loginFormMainFooter'
          >
            <input 
              type="checkbox" 
              className='loginFormCheckbox
              accent-transparent checked:accent-purple-500/25
              mr-2
              '
              id='persist'
              onChange={handleToggle}
              checked={persist}
            />
            <label htmlFor="persist" className="loginFormTrusted">Trust This Device</label>
          </div>

        </form>

      </main>

      <footer className='loginFormFooter
        h-6
        flex flex-col-reverse

      '>
        <div className="loginFormFooterBtnContainer">
          <Link
            className='loginFormButton
            flex flex-row-reverse
            ' 
            to='/'
          >
            <FontAwesomeIcon icon={faHouseChimney}             className='text-white text-xl'
            />
          </Link>
        </div>
      </footer>
    </section>
    <div 
      className='
        w-9/10 sm:w-8/10 md:w-6/10 lg:w-1/2 xl:w-2/5
        bg-[var(--LOGIN-SIGNUP)]
        rounded-b-2xl
        pb-2.5
        justify-self-center
      '
      title="signupButtonContainer"
      onClick={handleSignUp}
    >
    <h2 className='
      w-full
      flex
      py-2
      text-white
      tracking-[4px]
      text-md sm:text-lg
      justify-center
    '
    title='signupButtonTitle'
    >
      Login
    </h2>
    <div className='
      h-7.75
      w-2/5 md:w-3/10 lg:w-1/5
      rounded-2xl
      bg-purple-200
      justify-self-center
      pb-1.25
      flex
      inset-shadow-sm inset-shadow-[#b393cc]
    ' 
      title='signupButtonSlider'
    >
      <div className='
        h-7.75
        w-1/2
        rounded-2xl
        z-1
        relative
        bg-linear-to-br from-purple-500 from-20% via-[#b393cc] via-50% to-purple-500
        ring ring-purple-400
        right-2px
      '
        title='signupBtn' 
        name='Signup'
      >
      </div>
    </div>
    </div>
  </div>
  );

};

export default Login;

// {
//   "id": "682a4d6ad58aa599643b5948",
//     "username": "XavierCarranza",
//     "password": "1107",
//     "role": ["Admin"]
// }