import {useNavigate, useParams} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {selectRecipeById, useGetRecipesQuery} from './recipesApiSlice'

import './recipeCSS/Recipe.css'

const Recipe = () => {

  const {id} = useParams()

  const {recipe} = useGetRecipesQuery('recipesList', {
    selectFromResult: ({data}) => ({
        recipe: data?.entities[id]
    })
  })

  const navigate = useNavigate()

  if (!recipe) return <p>Recipe not found</p>

  const handleEdit = () => navigate(`/dash/recipes/${id}`)

  return (
    <div className="recipe">
    <div className="recipeHeader">
        <div className="recipeTitle">{recipe.title}</div>
        <div className="recipeFavorited">
            {recipe.favorited ? <span>Favorited</span> : '⭐'}
        </div>
    </div>
        
        <div className="recipeTime">{recipe.time} mins</div>
        <div className="recipePhoto">{recipe.photo}</div>
        <div className="recipeCourse">{recipe.course}</div>
        <ul className='recipeIngredients'>
            {recipe.ingredients.map((ing, index) =>(
                <li key={index}>{ing}</li>
            ))}
        </ul>
        <ol className="recipeInstructions">
            {recipe.instructions.map((step, index) => (
                <li key={index}>{step}</li>
            ))}
        </ol>
        <div className="recipeEditContainer">
            <button className="recipeEditBtn"
            onClick={handleEdit}
            >
            Edit
            </button>
        </div>
    </div>
  )
}

export default Recipe