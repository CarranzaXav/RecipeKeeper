import { useSelector } from "react-redux";
import { selectCurrentToken } from '../features/auth/authSlice'
import {jwtDecode} from 'jwt-decode'

const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    let isAdmin = false
    let status = 'Standard'
    let roles = []

    if(token) {
        try{
            const decoded = jwtDecode(token)
            const { username, roles:userRoles } = decoded.UserInfo || {}

            if(userRoles){
                roles = userRoles
                isAdmin = roles.includes('Admin')

                if(isAdmin) status = 'Admin'

                return {username, roles, status, isAdmin}
            }
        }
        catch(err) {
            console.error('Failed to decode token', err)
        }
    }

  return { username: '', roles:[], isAdmin, status}
}

export default useAuth
