import {Link} from 'react-router-dom'
import Loader from '../../Components/Loader'
import { useState, useEffect } from 'react'
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
    <section className='
      w-full md:w-9/10 xl:w-8/10
      h-auto
      bg-[#c9b9d6]
      xl:mt-3
      p-6
      rounded-2xl
      border-4 lg:border-8
      border-t-purple-200 border-l-purple-200
      border-r-purple-400/50 border-b-purple-400/50

    ' 
      title='mainPage'
    >
    <div className='
      grid md:flex
      w-11/10 md:w-full
      p-2
      pb-4
      justify-self-center
    ' 
      title="mainPageHead"
    >
      <h1 className='
        w-full md:8/10
        text-lg md:text-2xl lg:text-4xl
        text-white
      ' 
        title='mainPageTitle'
      > 
        Welcome to my Recipe Book! 
      </h1>
      <p className='
        flex
        w-full
        h-auto
        self-end
        justify-end
        text-xs md:text-lg xl:text-2xl
      '
      title='mainPageDate'>
        {today}
      </p>
    </div>

    <div className='
      pb-5
    '
      title="mainPageBody"
    >
      {(username) ? 
        <FavoritedRecipes className="
          grid md:flex
          grid-cols-1 md:grid-cols-3
          gap-y-4 md:gap-y-0
          md:gap-x-4 
        "
        /> 
        :
        <div className="
          grid md:flex
          grid-cols-1 md:grid-cols-3
          gap-y-4 md:gap-y-0
          md:gap-x-4 
        "
          title='mainPageBodyRecipeCards'
        >
        {recipeContent}
        </div>
        }
    </div>

    <div className='
      bg-[var(--FORM-COLOR)]
      w-full sm:w-7/10 lg:w-5/10
      text-sm md:text-xl lg:text-2xl
      mb-6
      py-6 px-2
      rounded-2xl
      inset-shadow-sm inset-4 inset-shadow-purple-700
      justify-self-center
    ' 
      title="mainPageLinks"
    >
      <p >
        <Link className='
        flex
        w-full
        text-purple-400
        tracking-[3px]
        font-semibold
        justify-center
        '
        title='mainPageRecipeLink' 
        to='/recipes'>
        VIEW ALL RECIPES
        </Link>
      </p>

      {(isAdmin) &&
      <p>
        <Link className='
        flex
        w-full
        text-purple-400
        pt-2
        tracking-[3px]
        font-semibold
        justify-center
        ' 
        title='mainPageUserLink'
        to='/dash/users'>
        View Users
        </Link>
      </p>
      }
    </div>
    </section>
  )}

  return null
}

export default MainPage