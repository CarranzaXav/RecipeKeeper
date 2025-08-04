import { useGetRecipesQuery } from "./recipesApiSlice"
import RecipeCard from "./RecipeCard"
import Loader from "../../Components/Loader"

const MainPageRecipeCards = () => {

  const {
    data: recipes,
    isLoading, isSuccess, isError, error
  } = useGetRecipesQuery("recipesList")

  if (isLoading) return <Loader/>

  if(isError) return <p className="errmsg">{error?.data?.message}</p>


if(isSuccess && recipes){

    const {ids, entities} = recipes

    const selectRecipes = ids.filter(id => entities[id])

    const shuffleIds = selectRecipes.sort(() => 0.5 - Math.random())
  
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
      {selectRecipes.length > 0 ? recipeContent : <span>No Recipes</span>}
    </div>
  )
}

return null
}

export default MainPageRecipeCards
