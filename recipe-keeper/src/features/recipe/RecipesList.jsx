import { useGetRecipesQuery } from "./recipesApiSlice"
import { Link } from "react-router-dom"
import RecipeCard from "./RecipeCard"
import Loader from "../../Components/Loader"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faCircleChevronDown} from '@fortawesome/free-solid-svg-icons'
import { useState } from "react"

import useAuth from "../../hooks/useAuth"

const RecipesList = () => {

  const {username} = useAuth()

  const [visibleCount, setVisibleCount] = useState(9);

  const {
    data: recipes,
    isLoading, isSuccess, isError, error
  } = useGetRecipesQuery("recipesList")

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 9)
  }

  if (isLoading) return <Loader/>

  if(isError) return <p className="errmsg">{error?.data?.message}</p>


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
        {(!username) ?
      <Link className="recipeListCreate
       flex 
      bg-gray-300 
       w-full lg:w-8/10
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
      : ''
      }
      <div className="recipeList 
      grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 
      w-full lg:w-full
      h-full
      justify-evenly 
      gap-x-2 gap-y-6">

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
        onScroll={handleLoadMore}
        >
          <FontAwesomeIcon icon={faCircleChevronDown} className="text-purple-300"/>
        </div>
      }
    </div>
  )
}
}

export default RecipesList