import { useRef, useState, useEffect} from 'react'
import { useNavigate, Link} from 'react-router-dom'

import { useDispatch} from 'react-redux'
import { setCredentials } from './authSlice';
import { useLoginMutation} from './authApiSlice'

import usePersist from '../../hooks/usePersist'

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
  
  const errClass = errMsg ? 'errmsg': 'offscreen'

  if (isLoading) return <div className='loader'>Loading...</div>

  return (
  <>
    <section className="login">
      <header className="loginHeader">
        <h1 className="loginHeaderTitle">User Login</h1>
      </header>
      <main className="loginMain">
        <p ref={errRef} className={errClass} aria-live='assertive'>{errMsg}</p>

        <form onSubmit={handleSubmit} className="loginForm">
          <div className="loginUsername">
            <label htmlFor="username" className="loginFormLabel">
              Username:
            </label>
            <input type="text" 
              className='loginFormInput'
              id='username'
              ref={userRef}
              value={username}
              onChange={handleUserInput}
              autoComplete='off'
              required
            />
          </div>

          <div className="loginFormPassword">
            <label htmlFor="password" className="loginFormLabel">
            Passcode:
            </label>
            <input 
              type="password"
              className='loginFormInput'
              id='password'
              onChange={handlePwdInput}
              value={password}
              required
            />
          </div>

          <button className="loginFormBtn">Sign In</button>

          <div className="loginFormMainFooter">
            <label htmlFor="persist" className="loginFormTrusted">Trust This Device:</label>
            <input 
              type="checkbox" 
              className='loginFormCheckbox'
              id='persist'
              onChange={handleToggle}
              checked={persist}
            />
          </div>

        </form>

      </main>

      <footer className='loginFormFooter'>
        <div className="loginFormFooterBtnContainer">
          <Link className='loginFormButton' to='/'>Back to Home</Link>
        </div>
      </footer>
    </section>
  </>
  );

};

export default Login;

// {
//   "id": "682a4d6ad58aa599643b5948",
//     "username": "XavierCarranza",
//     "password": "1107",
//     "role": ["Admin"]
// }