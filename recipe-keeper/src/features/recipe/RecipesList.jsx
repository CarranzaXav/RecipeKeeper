import { useGetRecipesQuery } from "./recipesApiSlice"
import { Link } from "react-router-dom"
import RecipeCard from "./RecipeCard"

const RecipesList = () => {

  const {
    data: recipes,
    isLoading, isSuccess, isError, error
  } = useGetRecipesQuery("recipesList")

  // const createNewRecipe() => {}

  if (isLoading) <p>Loading...</p>

  if(isError) <p className="errmsg">{error?.data?.message}</p>


if(isSuccess){
  const {ids} = recipes

  const recipeContent = ids?.length ? ids.map(recipeCardId => <RecipeCard key={recipeCardId} recipeCardId={recipeCardId}/>) : null

  return (
    <div className="recipesList">
      {recipeContent}
      <Link to='/dash/recipes/new'>
        <div className="recipeListCreateBtn">
          '➕'
        </div>
      </Link>
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