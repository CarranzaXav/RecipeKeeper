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
    <div className="recipeList flex">

    {(status || isAdmin) ?
      '' :  
      <Link className="recipeListCreate" to='/dash/recipes/new'>
        <div className="recipeListCreateBtn">
          ➕
        </div>
      </Link>
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