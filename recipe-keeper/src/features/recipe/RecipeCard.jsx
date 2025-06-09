import { useSelector } from "react-redux"
import { selectRecipeById, useUpdateRecipeMutation } from "./recipesApiSlice"
import { useGetRecipesQuery } from "./recipesApiSlice"
import { useNavigate } from "react-router-dom"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faStar, faEye, faPenToSquare} from '@fortawesome/free-solid-svg-icons'

import useAuth from "../../hooks/useAuth"

import './recipeCSS/RecipeCard.css'

const RecipeCard = ({recipeCardId, props}) => {

    const {id: userId, username} = useAuth()

    const {recipe, refetch} = useGetRecipesQuery('recipesList', {
        selectFromResult: ({data}) => ({
            recipe: data?.entities[recipeCardId]
        }),
        refetchOnFocus: true,
        refetchOnReconnect: true,
        refetchOnMountOrArgChange: false
      })

    const [updateRecipe] = useUpdateRecipeMutation()

    const navigate = useNavigate()

//     const handleFavorited = async () => {
//     if (recipe && username) {
//     const currentStatus = recipe.favorited?.[userId];
//     const updatedStatus = !currentStatus;

//     console.log("🟡 Favorite toggle clicked", {
//       userId,
//       recipeId: recipe.id,
//       currentStatus,
//       updatedStatus
//     });

//     try {
//       const result = await updateRecipe({
//         id: recipe.id,
//         user: recipe.user,
//         title: recipe.title,
//         course: recipe.course,
//         time: recipe.time,
//         photo: recipe.photo,
//         ingredients: recipe.ingredients,
//         instructions: recipe.instructions,
//         favorited: {
//           ...recipe.favorited,
//           [userId]: updatedStatus
//         }
//       }).unwrap();

//       console.log("🟢 Updated recipe returned from server:", result);
//     } catch (err) {
//       console.error("🔴 Failed to favorite the recipe", err);
//     }
//   }
// };

const handleFavorited = async () => {
  if (!recipe || !userId) return;

  // Clone favorited object or initialize empty
  const favoritedMap = typeof recipe.favorited === 'object' ? { ...recipe.favorited } : {};

  const currentStatus = !!favoritedMap[userId];
  const updatedStatus = !currentStatus;

  // Update user's favorited flag
  favoritedMap[userId] = updatedStatus;

  console.log("🟡 Toggling favorite", {
    recipeId: recipe.id,
    userId,
    from: currentStatus,
    to: updatedStatus,
  });


  try {
    await updateRecipe({
      id: recipe.id,
      favorited: favoritedMap,
    }).unwrap();

    await refetch()
  } catch (err) {
    console.error("🔴 Favorite toggle failed", err);
  }
};


    const isFavorited = !!recipe.favorited?.[userId]

    if (!recipe) return null

    const handleEdit = () => navigate(`/dash/recipes/edit/${recipeCardId}`)

    const viewRecipeCard = () => navigate(`/dash/recipes/${recipeCardId}`)
    

  return (

    <div className="recipeCard">
        <div className="recipeCardHeader flex">
            <div className="recipeCardTitle">{recipe.title}</div>
            {(username) && <div className="recipeCardFavorited"
                onClick={handleFavorited}
            >
            {/* {recipe.favorited?.[userId] ? 
            <FontAwesomeIcon icon={faStar} style={{color: "#FFD43B",}} />
             : <FontAwesomeIcon icon={faStar} style={{color: "#bababa",}} />} */}
             <FontAwesomeIcon icon={faStar} style={{color: isFavorited ? '#FFD43B' : '#bababa'}}/>
            </div>}
        </div>

        <div className="recipeCardPhoto">{recipe.photo || "📷"}</div>

        {/* User Can Only Edit Their Own Recipes */}
        <div className="recipeCardFooter flex">
            <div className="recipeCardEditContainer">
        {userId === recipe.user &&
                <button className="recipeCardEditBtn" onClick={handleEdit}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                </button>
        }
            </div>

            <div className="recipeCardViewContainer">
                <button className="recipeCardViewButton" onClick={viewRecipeCard}>
                    <FontAwesomeIcon  className='recipeCardViewBtn'icon={faEye} />
                </button>
            </div>
        </div>
    </div>
  )
}

export default RecipeCard