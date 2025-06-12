import { Link } from 'react-router-dom'
import {useState, useEffect} from 'react'
import { useAddNewUserMutation } from './usersApiSlice'
import { useNavigate } from 'react-router-dom'


import './usersCSS/NewUserForm.css'

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[0-9]{4}/

const NewUserForm = () => {

    const [addNewUser, {isLoading, isSuccess, isError}] = useAddNewUserMutation()

    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [phone, setPhone] = useState('')
    // const [roles, setRoles] = useState(['Standard'])

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        if (isSuccess) {
            setUsername('')
            setPassword('')
            // setRoles([])
            navigate('/dash/users')
        }
    }, [isSuccess, navigate])

    const onUsernameChanged = (e) => setUsername(e.target.value)
    const onPasswordChanged = (e) => setPassword(e.target.value)
    const onPhoneChanged = (e) => setPhone(e.target.value)

    const canSave = [validUsername, validPassword, phone.length].every(Boolean) && !isLoading

    const onSaveUserClicked = async (e) => {
        e.preventDefault()
        if(canSave){
            await addNewUser({ username, phone, password})
        }
    }

    const handleLogin = () => {
        navigate(
        '/login'
        )
    }

    return(
        <>


            <form className='userForm' onSubmit={onSaveUserClicked}
            >
                <div className="userFormHead">
                    <h2 className='userFormTitle'>Create User</h2>
                </div>
                <div className="userFormBody">

                    <div className="userFormUsernameBlk">
                        <label htmlFor="username" className='userFormLabel'>Username:
                        <span>[3-20 letters]</span>
                        </label>
                        <input
                            className='UserFormInput'
                            type="text" 
                            id='username'
                            autoComplete='off'
                            value={username}
                            onChange={onUsernameChanged}    
                        />
                    </div>

                    <div className="userFormPasswordBlk">
                    <label htmlFor="password" className="userFormLabel">
                    Passcode: <span className=''>[Please enter 4 digit passcode]</span>
                    </label>
                    <input 
                    type="password" className="userFormInput" 
                    id='password'
                    name='password'
                    value={password}
                    onChange={onPasswordChanged}
                    />
                    </div>

                    <div className="userFormPhoneBlk">
                    <label htmlFor="phone" className="userFormlabel">Phone:
                    </label>
                    <input 
                    type="text" 
                    className="userFormLabel"
                    id='phone'
                    name='phone'
                    value={phone} 
                    onChange={onPhoneChanged}
                    />
                    </div>

                </div>
                <div className="userFormFooter">
                    {(canSave) && <button 
                        className='userFormBtn'
                        title='Save'
                    >
                        Create New User
                    </button>}
                </div>

                <div className="userFormLogin">
                    <p>Already A User?</p>
                    <Link to='/login'>Please Login</Link>
                </div>
            </form>
            <div className="loginButtonContainer">
                <h2 className='loginButtonTitle'>Sign Up</h2>
                <div className='loginButtonSlider' onClick={handleLogin}>
                <div className='loginBtn' name='Login'>
                </div>
                </div>
            </div>
        </>
    )

}

export default NewUserForm