import { useGetRecipesQuery } from "./recipesApiSlice"
import { Link } from "react-router-dom"
import RecipeCard from "./RecipeCard"

import './recipeCSS/FavoritedRecipes.css'

const FavoritedRecipes = () => {

  const {
    data: recipes,
    isLoading, isSuccess, isError, error
  } = useGetRecipesQuery("recipesList")

  if (isLoading) return <p>Loading...</p>

  if(isError) return <p className="errmsg">{error?.data?.message}</p>


if(isSuccess){
  const {ids, entities} = recipes

  const favoritedIds = ids.filter(id => entities[id]?.favorited)

  const shuffleIds = favoritedIds.sort(() => 0.5 - Math.random())

  const limited = shuffleIds.slice(0,3) 

  const recipeContent = limited.map(id => <RecipeCard key={id} recipeCardId={id}/>)

  return (
    <div className="recipeList flex">
      {recipeContent}
    </div>
  )
}

return null
}

export default FavoritedRecipes
