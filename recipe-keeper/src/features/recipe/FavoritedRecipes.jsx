import { useGetRecipesQuery } from "./recipesApiSlice"
import { Link } from "react-router-dom"
import RecipeCard from "./RecipeCard"
import Loader from "../../Components/Loader"

import useAuth from "../../hooks/useAuth"

const FavoritedRecipes = () => {

  const {id:userId} = useAuth()

  const {
    data: recipes,
    isLoading, isSuccess, isError, error
  } = useGetRecipesQuery("recipesList")

  if (isLoading) return <Loader/>

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
    <div className=" 
      w-full
      grid
      grid-cols-1 sm:grid-cols-3
      sm:flex 
      sm:gap-x-4 
      gap-y-4 sm:gap-y-0
    "
    title='favoritedList'
    >
      {favoritedIds.length > 0 ? recipeContent : <span>No Favorites</span>}
    </div>
  )
}

return null
}

export default FavoritedRecipes
