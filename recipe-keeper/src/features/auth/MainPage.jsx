import {Link} from 'react-router-dom'
import Loader from '../../Components/Loader'
import { useState, useEffect } from 'react'
import './authCSS/MainPage.css'
import FavoritedRecipes from '../recipe/FavoritedRecipes'
import useAuth from '../../hooks/useAuth'

const MainPage = () => {

    const {username, isAdmin} = useAuth()

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      const timer = setTimeout(() => setIsLoading(false), 3000)
      return () => clearTimeout(timer)
    }, [])

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-us', { dataStyle: 'full', timeStyle: 'short'}).format(date)
    
    // if (isLoading) return  <Loader/>
    if (isLoading) return  <p>... Loading</p>

  return (
    <section className='mainPage'>
    <div className="mainPageHead">
      <h1 className='mainPageTitle'> Welcome to my Recipe Book! </h1>
      <p className='mainPageDate'>{today}</p>
    </div>

    <div className="mainPageBody">
      <FavoritedRecipes/>
    </div>

    <div className="mainPageLinks">
      <p ><Link className='mainPageRecipeLink' to='/dash/recipes'>VIEW ALL RECIPES</Link></p>

      {(isAdmin) &&
      <p><Link className='mainPageUserLink' to='/dash/users'>View Users</Link></p>
      }
    </div>
    </section>
  )
}

export default MainPage