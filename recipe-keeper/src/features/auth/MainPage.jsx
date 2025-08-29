import {Link} from 'react-router-dom'
import Loader from '../../Components/Loader'
import { useState, useEffect } from 'react'
import FavoritedRecipes from '../recipe/FavoritedRecipes'
import useAuth from '../../hooks/useAuth'
import RecipeCard from '../recipe/RecipeCard'
import { useGetRecipesQuery } from '../recipe/recipesApiSlice'
import MainPageRecipeCards from '../recipe/MainPageRecipeCards'

const MainPage = () => {

    const {username, isAdmin} = useAuth()

    const {
        data: recipes,
       isLoading, isSuccess, isError, error
      } = useGetRecipesQuery("recipesList")

    const [time, setTime] = useState(() => 
      new Intl.DateTimeFormat('en-us', { timeStyle: 'short'}).format(new Date())
    )

    useEffect(() => {
      const interval = setInterval(() => {
        setTime(
          new Intl.DateTimeFormat('en-us', {timeStyle:'short' }).format(new Date())
        )
      }, 1000)

      return () => clearInterval(interval)
    }, [])
    
    if (isLoading) return <div className='flex mt-24 h-96 justify-center'><Loader/></div>

  if(isSuccess){

  return (
    <section className='
      w-full lg:w-9/10 xl:w-8/10
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
      w-11/10 sm:w-full
      p-2
      pb-4
      md:mb-1
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
        w-full md:w-2/10
        h-auto
        self-end
        justify-end
        text-xs md:text-lg xl:text-2xl
      '
      title='mainPageDate'>
        {time}
      </p>
    </div>

    <div className='
      pb-5
      mb-3
    '
      title="mainPageBody"
    >
      {(username) ? 
        <FavoritedRecipes className="gap-y-4 sm:gap-y-0"/> 
        :
        <MainPageRecipeCards className="gap-y-4 sm:gap-y-0"/>
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