import {useNavigate, useParams} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {selectRecipeById, useGetRecipesQuery} from './recipesApiSlice'

import './recipeCSS/Recipe.css'

const Recipe = () => {

  const {id} = useParams()

//   const {recipe} = useGetRecipesQuery('recipesList', {
//     selectFromResult: ({data}) => ({
//         recipe: data?.entities[id]
//     })
//   })

// Data Called
    const {
        data,
        isLoading,
        isSuccess,
        isError
    } = useGetRecipesQuery('recipesList')

    const recipe = data?.entities[id]
// End of Data Called

  const navigate = useNavigate()

  if(isLoading) return <p>Loading ...</p>

  if (!recipe && isSuccess) return <p>Recipe not found</p>

  const handleEdit = () => navigate(`/dash/recipes/edit/${id}`)

  return (
    <div className="recipe">
    <div className="recipeHeader">
        <div className="recipeTitle">{recipe.title}</div>
        <div className="recipeFavorited">
            {recipe.favorited ? <span>Favorited</span> : '⭐'}
        </div>
    </div>
        
        <div className="recipeTime">{recipe.time} mins</div>
        <div className="recipePhoto">
            <img 
                src={recipe.photo || "/images/placeholder.jpg"} 
                alt={recipe.title} 
                className="recipeImage"
            />
        </div>
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