import { useGetRecipesQuery } from "./recipesApiSlice"
import { Link } from "react-router-dom"
import RecipeCard from "./RecipeCard"
import Loader from "../../Components/Loader"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faCircleChevronDown} from '@fortawesome/free-solid-svg-icons'
import { useState } from "react"

import useAuth from "../../hooks/useAuth"
import { useEffect } from "react"

const RecipesList = () => {

  // User Authentication
  const {username} = useAuth()

// State and mutation hooks
  const {
    data: recipes,
    isLoading, isSuccess, isError, error
  } = useGetRecipesQuery("recipesList")
  
  const [visibleCount, setVisibleCount] = useState(9);

// Handlers
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 9)
  }

// Scroll loader effect 
  useEffect(() => {
    const handleScroll = () => {
      const windowTop = window.scrollY
      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight

      if (windowTop + windowHeight >= docHeight - 150) {
        handleLoadMore()
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

// Loader
  if (isLoading) return <div className='flex mt-24 h-96 justify-center'><Loader/></div>

// Error Message
  if(isError) return <p className="errmsg">{error?.data?.message}</p>

// Success Message
  if(isSuccess){

  const {ids} = recipes

  const recipeContent = ids?.length ? ids.slice(0,visibleCount).map(recipeCardId => <RecipeCard key={recipeCardId} recipeCardId={recipeCardId}/>) : null

  return (
    <div
      className="
      w-full lg:w-8/10
      h-full
      "
    >
        {(username) &&
      <Link className="recipeListCreate
       flex 
      bg-gray-300 
       w-full sm:w-9/10 lg:w-8/10
       justify-self-center
       h-28  md:h-20 lg:h-16
       px-[0.75em] py-[0.5em]
       rounded-xl
       inset-shadow-gray-500 inset-shadow-sm
       mb-4
       " 
       to='/dash/recipes/new'
      >
        <div className="recipeListCreateBtn
        flex
        w-full 
        justify-center
        self-center
        text-4xl
        "
        >
          ➕
        </div>
      </Link>
      }
      <div className="recipeList 
      grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 
      w-full lg:w-full
      h-full
      justify-evenly 
      justify-items-center
      gap-x-2 gap-y-6"
      >
        {recipeContent}
      </div>
      {visibleCount < ids.length &&
        <div className="
          w-full
          mt-2
          text-lg lg:text-4xl
          flex
          justify-center
        "
        onClick={handleLoadMore}
        >
          <FontAwesomeIcon icon={faCircleChevronDown} className="text-purple-300 cursor-pointer"/>
        </div>
      }
    </div>
  )
}
}

export default RecipesList