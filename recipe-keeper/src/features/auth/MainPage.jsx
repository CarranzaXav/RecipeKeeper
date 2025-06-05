import {Link} from 'react-router-dom'
import Loader from '../../Components/Loader'
import { useState, useEffect } from 'react'
import './authCSS/MainPage.css'
import FavoritedRecipes from '../recipe/FavoritedRecipes'
import useAuth from '../../hooks/useAuth'
import RecipeCard from '../recipe/RecipeCard'
import { useGetRecipesQuery } from '../recipe/recipesApiSlice'

const MainPage = () => {

    const {username, isAdmin} = useAuth()

    const {
        data: recipes,
       isLoading, isSuccess, isError, error
      } = useGetRecipesQuery("recipesList")

    // const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      const timer = setTimeout(() => isLoading, 1000)
      return () => clearTimeout(timer)
    }, [])

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-us', { dataStyle: 'full', timeStyle: 'short'}).format(date)
    
    // if (isLoading) return  <Loader/>
    if (isLoading) return  <p>... Loading</p>

  if(isSuccess){
    const {ids, entities} = recipes

    // const favoritedIds = ids.filter(id => entities[id]?.favorited)

    const selectRecipes = ids.filter(id => entities[id])

    const shuffleIds = selectRecipes.sort(() => 0.5 - Math.random())
  
    const limited = shuffleIds.slice(0,3) 
  
    const recipeContent = limited.map(id => <RecipeCard key={id} recipeCardId={id}/>)

  return (
    <section className='mainPage'>
    <div className="mainPageHead">
      <h1 className='mainPageTitle'> Welcome to my Recipe Book! </h1>
      <p className='mainPageDate'>{today}</p>
    </div>

    <div className="mainPageBody">
    {(username) ? 
      <FavoritedRecipes/> :
      <div className="mainPageBodyRecipeCards flex">
      {recipeContent}
      </div>
      }
    </div>

    <div className="mainPageLinks">
      <p ><Link className='mainPageRecipeLink' to='/recipes'>VIEW ALL RECIPES</Link></p>

      {(isAdmin) &&
      <p><Link className='mainPageUserLink' to='/dash/users'>View Users</Link></p>
      }
    </div>
    </section>
  )}

  return null
}

export default MainPage