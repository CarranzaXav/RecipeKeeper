import { useGetRecipesQuery } from "./recipesApiSlice"
import { Link } from "react-router-dom"
import RecipeCard from "./RecipeCard"

import './recipeCSS/RecipesList.css'
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
    <div className="recipeList 
    grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 
    w-8/10
    justify-evenly gap-x-2 gap-y-6">

    {(username) ?
      <Link className="recipeListCreate flex 
      bg-gray-300 
       w-full md:w-sm 
       h-48  md:h-md
       px-[0.75em] py-[0.5em]
       rounded-xl
       inset-shadow-gray-500 inset-shadow-sm
       " 
       to='/dash/recipes/new'
      >
        <div className="recipeListCreateBtn">
          ➕
        </div>
      </Link>
      : ''
      }

      {recipeContent}

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