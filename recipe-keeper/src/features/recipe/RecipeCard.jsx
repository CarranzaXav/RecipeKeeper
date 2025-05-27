import { useSelector } from "react-redux"
import { selectRecipeById } from "./recipesApiSlice"
import { useGetRecipesQuery } from "./recipesApiSlice"
import { useNavigate } from "react-router-dom"

const RecipeCard = ({recipeCardId}) => {

    const {recipe} = useGetRecipesQuery('recipesList', {
        selectFromResult: ({data}) => ({
            recipe: data?.entities[recipeCardId]
        })
      })

    const navigate = useNavigate()

    if (!recipe) return null

    const handleEdit = () => navigate(`/dash/recipes/${recipeCardId}`)

    const viewRecipeCard = () => navigate(`/dash/recipes/${recipeCardId}`)

  return (

    <div className="recipeCard">
        <div className="recipeCardeHeader">
            <div className="recipeCardTitle">{recipe.title}</div>
            <div className="recipeCardFavorited">{recipe.favorited ? 
           <span>Favorited</span> : '⭐'}</div>
        </div>

        <div className="recipeCardPhoto">{recipe.photo || "📷"}</div>

        <div className="recipeCardFooter">
            <div className="recipeCardViewContainer">
                <button className="recipeViewBtn" onClick={viewRecipeCard}>View</button>
            </div>

            <div className="recipeCardEditContianer">
                <button className="recipeEditBtn" onClick={handleEdit}>Edit</button>
            </div>
        </div>
    </div>

  )
}

export default RecipeCard