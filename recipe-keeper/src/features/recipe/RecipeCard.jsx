import { useSelector } from "react-redux"
import { selectRecipeById } from "./recipesApiSlice"
import { useGetRecipesQuery } from "./recipesApiSlice"
import { useNavigate } from "react-router-dom"

import './recipeCSS/RecipeCard.css'

const RecipeCard = ({recipeCardId, props}) => {

    const {recipe} = useGetRecipesQuery('recipesList', {
        selectFromResult: ({data}) => ({
            recipe: data?.entities[recipeCardId]
        })
      })

    const navigate = useNavigate()

    if (!recipe) return null

    const handleEdit = () => navigate(`/dash/recipes/edit/${recipeCardId}`)

    const viewRecipeCard = () => navigate(`/dash/recipes/${recipeCardId}`)

  return (

    <div className="recipeCard">
        <div className="recipeCardHeader flex">
            <div className="recipeCardTitle">{recipe.title}</div>
            <div className="recipeCardFavorited">{recipe.favorited ? 
            '⭐' : <span>Not Fav</span> }
            </div>
        </div>

        <div className="recipeCardPhoto">{recipe.photo || "📷"}</div>

        <div className="recipeCardFooter flex">
            <div className="recipeCardEditContainer">
                <button className="recipeCardEditBtn" onClick={handleEdit}>Edit</button>
            </div>

            <div className="recipeCardViewContainer">
                <button className="recipeViewBtn" onClick={viewRecipeCard}>View</button>
            </div>
        </div>
    </div>

  )
}

export default RecipeCard