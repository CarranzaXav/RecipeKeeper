import {useNavigate, useParams} from 'react-router-dom'
import {useUpdateRecipeMutation, useDeleteRecipeMutation, useGetRecipesQuery} from './recipesApiSlice'
import useAuth from "../../hooks/useAuth"

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faStar, faTrash} from '@fortawesome/free-solid-svg-icons'
import Loader from '../../Components/Loader'

const Recipe = () => {

  const {id: userId, isAdmin} = useAuth()

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

  const [deleteRecipe] = useDeleteRecipeMutation()

  const navigate = useNavigate()

  if(isLoading) return <Loader/>

  if (!recipe && isSuccess) return <p>Recipe not found</p>

  const handleEdit = () => navigate(`/dash/recipes/edit/${id}`)

   const onDeleteRecipeClicked = async () => {
    await deleteRecipe({id: recipe.id})
    navigate('/recipes')
  }

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
            text-lg md:text-2xl
            px-1
          ' 
        title="recipeTitle"
        >
            {recipe.title}
        </div>

        {(userId) &&
        <div className='
            w-2/10 md:w-15/100 lg:w-18/100
            text-xl md:text-2xl
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
            text-sm md:text-base
            pl-4
            my-1
          ' 
        title="recipeTime"
        >
            {/* {recipe.time} mins */}
            {recipe.time?.hours > 0 && `${recipe.time.hours} hr`}
            {recipe.time?.hours > 0 && recipe.time?.minutes > 0 && ' '}
            {recipe.time?.minutes > 0 && `${recipe.time.minutes} min`}
        </div>
        <div className='
            w-full
            h-64 md:h-96
            flex
            justify-center
            mb-4
          ' 
        title="recipePhoto"
        >

          {recipe.photo?.length > 0 ? (
            <img 
              src={recipe.photo[0].url} 
              alt={recipe.title} 
              className="recipeImage w-full md:w-2/3 h-full rounded-xl"
            />
          ) : (
            <p
              className='bg-gray-300 w-full flex justify-center items-center text-3xl rounded-xl'
            >
            📷
            </p>
          )}

            {/* <img 
                src={recipe.photo?.[0]?.url || "/images/placeholder.jpg"}                 
                alt={recipe.title} 
                
            /> */}
        </div>
        <div className=' flex justify-center' 
        title="recipeCourse"
        >
          Course:  {recipe.course}
        </div>

        <ul className='
            w-full
            p-4
            text-sm 
            list-disc
            md:grid md:grid-cols-2
          ' 
        title='recipeIngredients'
        >
            {recipe.ingredients.map((ing, index) =>(
                <li className='pr-2 py-1' key={index}>{ing}</li>
            ))}
        </ul>

        <ol className='
            w-full
            p-4
            text-base md:text-lg
            list-decimal
          ' 
        title="recipeInstructions"
        >
            {recipe.instructions.map((step, index) => (
                <li className='pl-1' key={index}>{step}</li>
            ))}
        </ol>

        <div className='
            w-full
            flex
            relative
            bottom-0
            justify-between
          ' 
        title="recipeEditFooter"
        >
          {(isAdmin) && <button
            className='text-2xl '
            title='Delete'
            onClick={onDeleteRecipeClicked}
          >
              <FontAwesomeIcon icon={faTrash} className='text-white hover:text-purple-500 cursor-pointer'/>
          </button>}

      {userId === recipe.user && 
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
        }
        </div>
    </div>
  )
}

export default Recipe