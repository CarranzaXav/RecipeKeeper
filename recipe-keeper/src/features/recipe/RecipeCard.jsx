import { useSelector } from "react-redux"
import { selectRecipeById, useUpdateRecipeMutation } from "./recipesApiSlice"
import { useGetRecipesQuery } from "./recipesApiSlice"
import { useNavigate } from "react-router-dom"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faStar} from '@fortawesome/free-solid-svg-icons'

import useAuth from "../../hooks/useAuth"

import './recipeCSS/RecipeCard.css'

const RecipeCard = ({recipeCardId, props}) => {

    const {username} = useAuth()

    const {recipe} = useGetRecipesQuery('recipesList', {
        selectFromResult: ({data}) => ({
            recipe: data?.entities[recipeCardId]
        })
      })

    const [updateRecipe] = useUpdateRecipeMutation()

    const navigate = useNavigate()

    const handleFavorited = async () => {
        if(recipe && username) {
            try{
                await updateRecipe({
                    id: recipe.id,
                    user: recipe.user,
                    title: recipe.title,
                    ingredients: recipe.ingredients,
                    instructions: recipe.instructions,
                    // photo: recipe.photo,
                    favorited: !recipe.favorited
                }).unwrap()
            } catch (err){
                console.error('Failed to Favorite the Recipe')
            }
        }
    }

    if (!recipe) return null

    const handleEdit = () => navigate(`/dash/recipes/edit/${recipeCardId}`)

    const viewRecipeCard = () => navigate(`/dash/recipes/${recipeCardId}`)

  return (

    <div className="recipeCard">
        <div className="recipeCardHeader flex">
            <div className="recipeCardTitle">{recipe.title}</div>
            {(username) && <div className="recipeCardFavorited"
                onClick={handleFavorited}
            >{recipe.favorited ? 
            <FontAwesomeIcon icon={faStar} style={{color: "#FFD43B",}} />
             : <FontAwesomeIcon icon={faStar} style={{color: "#bababa",}} />}
            </div>}
        </div>

        <div className="recipeCardPhoto">{recipe.photo || "📷"}</div>

        {/* User Can Only Edit Their Own Recipes */}
        {(!username) &&
        <div className="recipeCardFooter flex">
            <div className="recipeCardEditContainer">
                <button className="recipeCardEditBtn" onClick={handleEdit}>Edit</button>
            </div>

            <div className="recipeCardViewContainer">
                <button className="recipeViewBtn" onClick={viewRecipeCard}>View</button>
            </div>
        </div>}
    </div>
  )
}

export default RecipeCard