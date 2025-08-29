import { useGetRecipesQuery } from "./recipesApiSlice"
import RecipeCard from "./RecipeCard"
import Loader from "../../Components/Loader"

const MainPageRecipeCards = () => {

// State and Mutation hooks
  const {
    data: recipes,
    isLoading, isSuccess, isError, error
  } = useGetRecipesQuery("recipesList")

// Loader
  if (isLoading) return <Loader/>
// Error Message
  if(isError) return <p className="errmsg">{error?.data?.message}</p>

// Success Content
  if(isSuccess && recipes){

    // Extract recipe state
    const {ids, entities} = recipes

    // Filter recipes
    const selectRecipes = ids.filter(id => entities[id])

    // Randomize recipes
    const shuffleIds = selectRecipes.sort(() => 0.5 - Math.random())
  
    // Limiter - set to 3
    const limited = shuffleIds.slice(0,3) 
  
    // Map RecipeCards
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
      {selectRecipes.length > 0 ? recipeContent : <span>No Recipes</span>}
    </div>
  )
}

return null
}

export default MainPageRecipeCards
