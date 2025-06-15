import { useGetRecipesQuery } from "./recipesApiSlice"
import { Link } from "react-router-dom"
import RecipeCard from "./RecipeCard"

import useAuth from "../../hooks/useAuth"

const RecipesList = () => {

  const {username,status, isAdmin} = useAuth()

  const {
    data: recipes,
    isLoading, isSuccess, isError, error
  } = useGetRecipesQuery("recipesList")

  // const createNewRecipe() => {}

  if (isLoading) return <p>Loading...</p>

  if(isError) return <p className="errmsg">{error?.data?.message}</p>


if(isSuccess){
  const {ids} = recipes

  // const favoritedIds = ids.filter(id => entities[id]?.favorited)

  // let filteredIds;
  // if( || )

  const recipeContent = ids?.length ? ids.map(recipeCardId => <RecipeCard key={recipeCardId} recipeCardId={recipeCardId}/>) : null

  return (
    <div
      className="
      w-full lg:w-8/10
      h-full
      "
    >
        {(username) ?
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
    </div>
  )
}
}

export default RecipesList


  // const {ids} = recipes

  // const recipeContent = ids?.length
  // ? ids.map(recipeId => <Recipe key={recipeId} recipeId={recipeId} />) : null

  // return (
  //   <div className="recipesList">
  //     {recipeContent}
  //   </div>
  // )