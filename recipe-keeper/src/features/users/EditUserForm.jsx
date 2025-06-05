import {useState, useEffect} from 'react'
import { useUpdateUserMutation, useDeleteUserMutation } from './usersApiSlice'
import { useNavigate } from 'react-router-dom'
import {ROLES} from '../../../config/roles'
import useAuth from '../../hooks/useAuth'

const USER_REGEX =/^[A-z_]{3,20}$/
const PWD_REGEX =/^[0-9]{4}$/

const EditUserForm = ({user}) => {
    // State and mutation hooks
    const [updateUser, {isLoading, isSuccess, isError, error}] = useUpdateUserMutation()

    const [deleteUser, {isSuccess: isDelSuccess, isError: isDelError, error: delerror}] = useDeleteUserMutation()

    const navigate = useNavigate()

    const {isAdmin} = useAuth()
    // Form State
    const [username, setUsername] = useState(user.username)
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [phone, setPhone] = useState(user?.phone || '')
    const [roles, setRoles] = useState(user.roles);
    const [active, setActive] = useState(user.active)

    // Validations
    useEffect(() => {
    setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
    setValidPassword(PWD_REGEX.test(password))
    }, [password])

    // Navigation after success
    useEffect(() => {
        console.log(isSuccess)
        if(isSuccess || isDelSuccess){
            setUsername('')
            setPassword('')
            setPhone('')
            setRoles([])
            navigate('/dash/users')
        }
    }, [isSuccess, isDelSuccess, navigate])

    // handlers
    const onUsernameChanged = (e) => setUsername(e.target.value)
    const onPasswordChanged = (e) => setPassword(e.target.value)
    const onPhoneChanged = (e) => setPhone(e.target.value)
    const onActiveChanged = () => setActive((prev) => !prev)

    const onSaveUserClicked = async (e) => {
        if(password) {
            await updateUser({
                id: user.id,
                username,
                password,
                phone,
                active
            })
        } else {
            await updateUser({ id: user.id, username, phone, active})
        }
    }

    const onDeleteUserClicked = async () => {
        await deleteUser({ id: user.id })
    }

    let canSave
    if(password) {
        canSave= [validUsername, validPassword, phone].every(Boolean) && !isLoading
    } else {
        canSave = [validUsername, phone].every(Boolean) && !isLoading
    }

    // CSS classes for form validation
    const errClass = isError || isDelError ? 'errmsg' : 'offscreen'
    const validUserClass = !validUsername ? 'formInput--incomplete' : ''
    const validPWDClass = password && !validPassword ? 'formInput--incomplete' : ''
    const validPhoneClass = !phone ? 'formInput--incomplete' : ''

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

  return (
    <>
        <p className={errClass}>{errContent}</p>

        <form 
            className='editUserForm'
            onSubmit={(e) => e.preventDefault()}
        >
            <div className="editUserFormHead">
                <h2 className="editUserFormTitle">Edit User</h2>
                {(isAdmin) && <button className="editUserFormDeleteButton"
                    onClick={onDeleteUserClicked}
                >Delete</button>}
            </div>

            <div className="editUserFormBody">

               <div className="editUserFormUsername">
                    <label htmlFor="user-username" className="editUserFormLabelUsername">
                    </label>

                    <input 
                        type="text" 
                        className={`editUserFormInput ${validUserClass}`} 
                        id='user-username'
                        value={username}
                        name='user-username'
                        onChange={onUsernameChanged}
                        autoComplete='off'
                    />
               </div>

                <div className="editUserFormPassword">
                    <label htmlFor="user-password" className="editUserFormLabelPassword">
                        Passcode
                        <span>Must be 4 digits</span>
                    </label>
                    
                    <input 
                        type="password" 
                        className={`editUserFormInput ${validPWDClass}`} 
                        id='user-password'
                        name='password'
                        value={password}
                        onChange={onPasswordChanged}
                    />
                </div>

                <div className="editUserFormPhone">
                    <label htmlFor="user-phone" className="editUserFormLabelPhone">Phone:</label>
                    
                    <input 
                        type="tel" className="editUserFormInput"
                        id='user-phone'
                        name='user-phone' 
                        value={phone}
                        onChange={onPhoneChanged}
                    />
                </div>
                
                <div className="editUserFormActive">
                    <label htmlFor="user-active" className="editUserFormLabelActive">Active: </label>
                    
                    <input 
                        type="checkbox" className="editUserFormInput" 
                        id='user-active'
                        name='user-active'
                        checked={active}
                        onChange={onActiveChanged}    
                    />
                </div>
                
                
            </div>

            <div className="editUserFormFooter">
                {(canSave) && 
                
                <button 
                    className='editUserFormSaveButton'
                    onClick={onSaveUserClicked}
                    title='Save'
                >
                    Save
                </button>

                }
            </div>
        </form>
    </>
  )
}

export default EditUserForm