import { useGetRecipesQuery } from "./recipesApiSlice"
import { Link } from "react-router-dom"
import RecipeCard from "./RecipeCard"

import './recipeCSS/FavoritedRecipes.css'
import useAuth from "../../hooks/useAuth"

const FavoritedRecipes = () => {

  const {id:userId} = useAuth()

  const {
    data: recipes,
    isLoading, isSuccess, isError, error
  } = useGetRecipesQuery("recipesList")

  if (isLoading) return <p>Loading...</p>

  if(isError) return <p className="errmsg">{error?.data?.message}</p>


if(isSuccess && recipes && userId){

  const {ids, entities} = recipes

  // const favoritedIds = ids.filter(id => entities[id]?.favorited)

  const favoritedIds = ids.filter( id => {
    const recipe = entities[id]
    return recipe?.favorited?.[userId] === true
  })

  const shuffleIds = favoritedIds.sort(() => 0.5 - Math.random())

  const limited = shuffleIds.slice(0,3) 

  const recipeContent = limited.map(id => <RecipeCard key={id} recipeCardId={id}/>)

  return (
    <div className="recipeList favoritedList flex">
      {favoritedIds.length > 0 ? recipeContent : <span>No Favorites</span>}
    </div>
  )
}

return null
}

export default FavoritedRecipes
