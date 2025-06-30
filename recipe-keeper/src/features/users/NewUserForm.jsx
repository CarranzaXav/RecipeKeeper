import {useState, useEffect} from 'react'
import { useAddNewUserMutation } from './usersApiSlice'
import { useNavigate } from 'react-router-dom'

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[0-9]{4}/

const NewUserForm = () => {

    const [addNewUser, {isLoading, isSuccess, isError, error}] = useAddNewUserMutation()

    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [phone, setPhone] = useState('')

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

    const errClass = isError ? 'errmsg' : ''
    const validUserClass = !validUsername ? 'formInput--incomplete' : ''
    const validPWDClass = password && !validPassword ? 'formInput--incomplete' : ''
    const validPhoneClass = !phone ? 'formInput--incomplete' : ''

    const errContent = (error?.data?.message) ?? ''

    return(
        <>

        <p className={errClass}>{errContent}</p>

        <div className='w-full pt-12 h-96'>
            <form className='
                grid
                w-9/10 sm:w-8/10 md:w-6/10 lg:w-1/2 xl:w-2/5
                h-72 md:h-60
                my-auto
                px-1.5
                justify-self-center
                bg-[var(--LOGIN-SIGNUP)]
                rounded-t-xl
                ' 
                title='userForm'
                onSubmit={onSaveUserClicked}
            >
                <div className="
                    py-2
                    flex
                    self-center
                    justify-center
                    "
                    title='userFormHead'
                >
                    <h2 className='
                        text-white
                        text-xl sm:text-3xl
                        font-semibold
                        flex
                        self-center
                        tracking-[6px]
                        '
                        title='userFormTitle'
                    >
                    Create User
                    </h2>
                </div>
                <div className="
                    w-full
                    justify-items-center
                    content-center
                    "
                    title='userFormBody'
                 >

                    <div className="
                        w-9/10
                        justify-items-center
                        py-2
                        "
                        title='userFormUsernameBlk'
                    >
                        <input
                            className={`
                            py-1 px-2
                            bg-white
                            text-purple-700
                            shadow-md shadow-purple-700
                            rounded-xl
                            flex
                            w-full lg:w-9/10
                            justify-center
                            ${validUserClass}
                            `}
                            title='userFormInput'
                            type="text" 
                            id='username'
                            autoComplete='off'
                            value={username}
                            placeholder='Username [3-20 letters]'
                            onChange={onUsernameChanged}    
                        />
                    </div>

                    <div className="
                        w-9/10
                        justify-items-center
                        py-2
                        "
                        title='userFormPasswordBlk'
                    >
                        <input 
                            type="password" 
                            className={`
                                py-1 px-2
                                bg-white
                                text-purple-700
                                shadow-md shadow-purple-700
                                rounded-xl
                                flex
                                w-full lg:w-9/10
                                justify-center
                                ${validPWDClass}
                                `}
                            title='userFormInput' 
                            id='password'
                            name='password'
                            placeholder='Create 4 Digit Passcode'
                            value={password}
                            onChange={onPasswordChanged}
                        />
                    </div>

                    <div className="
                        w-9/10
                        justify-items-center
                        py-2"
                        title='userFormPhoneBlk'
                    >

                        <input 
                            type="text" 
                            className={`
                            py-1 px-2
                            bg-white
                            text-purple-700
                            shadow-md shadow-purple-700
                            rounded-xl
                            flex
                            w-full lg:w-9/10
                            justify-center
                            ${validPhoneClass}
                            `}
                            title='userFormInput'
                            id='phone'
                            name='phone'
                            placeholder='Enter Phone #'
                            value={phone} 
                            onChange={onPhoneChanged}
                        />
                    </div>

                </div>
                <div className="
                    justify-self-center
                    justify-center
                    w-8/10 sm:w-3/5 md:w-1/2
                    "
                    title='userFormFooter'
                >
                    {(canSave) && <button 
                        className='
                            py-1 px-2
                            bg-purple-700
                            font-bold
                            text-sm
                            text-white
                            shadow-md shadow-white
                            rounded-xl
                            w-full
                            tracking-[2px]
                        '
                        title='userFormBtnSave'
                        name='Save'
                    >
                        Create New User
                    </button>}
                </div>

            </form>

            <div className="
                w-9/10 sm:w-8/10 md:w-6/10 lg:w-1/2 xl:w-2/5
                bg-[var(--LOGIN-SIGNUP)]
                rounded-b-2xl
                pb-2.5
                justify-self-center
                "
                title='loginButtonContainer'
                onClick={handleLogin}
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
                    title='loginButtonTitle'
                >
                Sign Up
                </h2>
                <div className='
                        h-7.75
                        w-2/5 md:w-3/10 lg:w-1/5
                        rounded-2xl
                        bg-[var(--BGCOLOR)]
                        justify-self-center
                        pb-1.25
                        flex flex-row-reverse
                        inset-shadow-sm inset-shadow-[#b393cc]
                    ' 
                    title='loginButtonSlider'
                >
                    <div className='
                        h-7.75
                        w-1/2
                        rounded-2xl
                        z-1
                        relative
                        bg-linear-to-br from-purple-500 from-20% via-[#b393cc] via-50% to-purple-500
                        ring ring-purple-400
                        left-2px
                    ' 
                        name='Login'
                        title='loginBtn'
                    >
                    </div>
                </div>
            </div>
        </div>
        </>
    )

}

export default NewUserForm