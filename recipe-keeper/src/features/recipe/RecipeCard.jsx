import { useSelector } from "react-redux"
import { selectRecipeById, useUpdateRecipeMutation } from "./recipesApiSlice"
import { useGetRecipesQuery } from "./recipesApiSlice"
import { useNavigate } from "react-router-dom"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faStar, faEye, faPenToSquare} from '@fortawesome/free-solid-svg-icons'

import useAuth from "../../hooks/useAuth"

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

    const viewRecipeCard = () => navigate(`/recipes/${recipeCardId}`)
    

  return (

    <div 
    className=" 
      w-full 
      h-64 m:h-48 lg:h-72
      bg-[var(--FORM-COLOR)] 
      px-[0.75em] py-[0.5em]
      rounded-xl
      inset-shadow-sm inset-shadow-purple-700
    "
    title='recipeCard'
    >
        <div className=" 
          flex
          w-full
          h-1/10
          justify-center
          mb-2
        "
        title="recipeCardHeader"
        >
            <div className="
            w-8/10
            text-sm lg:text-xl
            "
            title='recipeCardTitle'
            >
              {recipe.title}
            </div>

            {(username) && 
            <div className="
            w-1/10
            text-xl
            cursor-pointer
            self-start
            "
              title="recipeCardFavorited"
              onClick={handleFavorited}
            >
             <FontAwesomeIcon icon={faStar} style={{color: isFavorited ? '#FFD43B' : '#bababa'}}/>
            </div>}
        </div>

        <div className="
          h-3/4
          w-full
          flex
          items-center
          justify-center
          rounded-xl
          bg-white
          text-4xl
        "
          title="recipeCardPhoto"
        >
          {(recipe.photo) ? 
        <img 
                src={recipe.photo} 
                alt={recipe.title} 
                className="recipeImage w-11/10 h-14/10"
            />
          :
          "📷"}
        </div>

        {/* User Can Only Edit Their Own Recipes */}
        <div className=" 
          justify-self-center
          h-auto
          w-9/10
          pt-1
          flex
        "
          title="recipeCardFooter"
        >
            <div className="w-1/2" title='recipeCardEditContainer'>
        {userId === recipe.user &&
                <button className="
                  text-2xl
                  text-white
                  bg-transparent
                  border-none
                  cursor-pointer
                  hover:text-purple-500
                " 
                  onClick={handleEdit}
                  name="recipeCardEditBtn"
                >
                  <FontAwesomeIcon icon={faPenToSquare} />
                </button>
        }
            </div>

            <div className="
              w-1/2 
              flex
              justify-end
            "
              title='recipeCardViewContainer'
            >
                <button className="
                  bg-transparent
                  border-none
                  text-2xl
                  cursor-pointer
                " 
                  onClick={viewRecipeCard}
                  title='recipeCardViewButton'
                >
                    <FontAwesomeIcon  className='
                    text-white
                    hover:text-purple-500
                    '
                      title="recipeCardViewBtn"
                      icon={faEye} 
                    />
                </button>
            </div>
        </div>
    </div>
  )
}

export default RecipeCard