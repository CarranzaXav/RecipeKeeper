import {useNavigate, useParams} from 'react-router-dom'
import {useUpdateRecipeMutation, selectRecipeById, useGetRecipesQuery} from './recipesApiSlice'
import useAuth from "../../hooks/useAuth"

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faStar} from '@fortawesome/free-solid-svg-icons'
import Loader from '../../Components/Loader'

const Recipe = () => {

  const {id: userId, username} = useAuth()

  const {id} = useParams()

// Data Called
    const {
        recipe,
        isLoading,
        isSuccess,
        isError,
    } = useGetRecipesQuery('recipesList', {
        selectFromResult: ({data}) => ({
            recipe: data?.entities[id]
        }),
        refetchOnFocus: true,
        refetchOnReconnect: true,
        refetchOnMountOrArgChange: false
      })

// End of Data Called

    const [updateRecipe] = useUpdateRecipeMutation()

  const navigate = useNavigate()

  if(isLoading) return <Loader/>

  if (!recipe && isSuccess) return <p>Recipe not found</p>

  const handleEdit = () => navigate(`/dash/recipes/edit/${id}`)

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

    console.log("Submitting PATCH with:", {
  id: recipe?.id,
  favorited: favoritedMap
  })


    try {
        await updateRecipe({
        id: recipe.id || id,
        user: recipe.user,
        favorited: favoritedMap,
        }).unwrap();

        // await refetch()
    } catch (err) {
        console.error("🔴 Favorite toggle failed", err);
    }
  };


const isFavorited = userId && recipe?.favorited?.[userId]


  return (
    <div 
        className='
            w-full md:w-8/10 lg:w-7/10
            h-auto 
            flex
            flex-col
            md:m-4
            bg-[var(--BORDER-COLOR)]
            p-4
            rounded-2xl
        ' 
        title="recipe">
    <div className='
        flex
        w-full
      '
        title="recipeHeader"
    >
        <div className='
            w-8/10
            text-2xl
            px-1
          ' 
        title="recipeTitle"
        >
            {recipe.title}
        </div>

        {(userId) &&
        <div className='
            w-2/10 md:w-15/100 lg:w-18/100
            text-lg md:text-2xl
            self-center
            flex flex-row-reverse
          '
        title="recipeFavorited" 
        onClick={handleFavorited}
        >
            <FontAwesomeIcon icon={faStar} style={{color: isFavorited ? '#FFD43B' : '#bababa'}} />
        </div>
        }
    </div>
        
        <div className='
            w-full
            text-sm
          ' 
        title="recipeTime"
        >
            {recipe.time} mins
        </div>
        <div className='
            w-full
          ' 
        title="recipePhoto"
        >
            <img 
                src={recipe.photo || "/images/placeholder.jpg"} 
                alt={recipe.title} 
                className="recipeImage"
            />
        </div>
        <div className='' 
        title="recipeCourse"
        >
            {recipe.course}
        </div>

        <ul className='
            w-full
            p-4
            text-sm 
            list-disc
            grid grid-cols-2
          ' 
        title='recipeIngredients'
        >
            {recipe.ingredients.map((ing, index) =>(
                <li className='px-1' key={index}>{ing}</li>
            ))}
        </ul>

        <ol className='
            w-full
            p-4
            text-lg
            list-decimal
          ' 
        title="recipeInstructions"
        >
            {recipe.instructions.map((step, index) => (
                <li className='pl-1' key={index}>{step}</li>
            ))}
        </ol>

      {userId === recipe.user && 
        <div className='
            w-full
            flex
            flex-row-reverse
            relative
            bottom-0
          ' 
        title="recipeEditContainer"
        >
            <button className='
                text-[var(--BORDER-COLOR)]
                p-2
                font-extrabold
                tracking-[2px]
                bg-white
                border-2
                border-white
                rounded-4xl
            ' 
            title="recipeEditBtn"
            onClick={handleEdit}
            >
            Edit
            </button>
        </div>}
    </div>
  )
}

export default Recipe