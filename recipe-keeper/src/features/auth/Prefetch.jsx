import {store} from '../../app/store'
import { recipesApiSlice } from '../recipe/recipesApiSlice'
import { usersApiSlice } from '../users/usersApiSlice'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const Prefetch = () => {
    useEffect(() => {
        const recipes = store.dispatch(recipesApiSlice.endpoints.getRecipes.initiate())
        const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate())

        return () => {
            recipes.unsubscribe()
            users.unsubscribe()
        }
    }, [])

    return <Outlet/>
}

export default Prefetch
