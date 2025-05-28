import {store} from '../../app/store'
import { recipesApiSlice } from '../recipe/recipesApiSlice'
import { usersApiSlice } from '../users/usersApiSlice'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const Prefetch = () => {
    useEffect(() => {
        console.log('Prefetch: subscribing')
        const recipes = store.dispatch(recipesApiSlice.endpoints.getRecipes.initiate())
        const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate())

        return () => {
            console.log('Prefetch: unsubscribing')
            recipes.unsubscribe()
            users.unsubscribe()
        }
    }, [])

    return <Outlet/>
}

export default Prefetch
