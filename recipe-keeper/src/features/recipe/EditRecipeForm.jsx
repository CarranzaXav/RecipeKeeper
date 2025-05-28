import { useState, useEffect} from 'react'
import { useUpdateRecipeMutation, useDeleteRecipeMutation } from './recipesApiSlice'
import { useNavigate } from 'react-router-dom'

const EditRecipeForm = ({recipe, users}) => {

  const [updateRecipe, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useUpdateRecipeMutation()

  const [deleteRecipe, {
    isSuccess: isDelSuccess,
    isError: isDelError,
    error: delerror
  }] = useDeleteRecipeMutation()

  const navigate = useNavigate()

  const [title, setTitle] = useState(recipe.title)
  const [course,setCourse] = useState(recipe.course)
  const [photo, setPhoto] = useState(recipe.photo)
  const [time, setTime] = useState(recipe.time)
  const [ingredients, setIngredients] = useState(recipe.ingredients)
  const [instructions, setInstructions] = useState(recipe.instructions)
  const [favorited, isFavorited] = useState(recipe.favorited)

  useEffect(() => {

    if(isSuccess || isDelSuccess){
        setTitle('')
        setCourse([''])
        setPhoto('')
        setTime()
        setIngredients([])
        setInstructions([])
        navigate('/dash/recipes')
    }
  }, [isSuccess, isDelSuccess, navigate])

  const onTitleChanged = (e) => setTitle(e.target.value)
  const onPhotoChanged = (e) => setPhoto(e.target.value)
  const onTimeChanged = (e) => setTime(e.target.value)
  const onFavorited = (e) => isFavorited(e.target.value)

  const onIngredientsChanged = (e) => {
    setIngredients(e.target.value)
    // autoResizeTextarea(e.target.value)
    }

  const onInstructionsChanged = (e) => {
    setInstructions(e.target.value)
    // autoResizeTextarea(e.target.value)
    }

  const onCourseChanged = (e) => {
    const values = Array.from(
        e.target.selectedOptions,
        (option) => option.value
    )
    setCourse(values)
  }

  const canSave = [userId, title, ingredients, instructions].every(Boolean) && !isLoading

  const onSaveRecipeClicked = async (e) => {
    if(canSave){
        await updateRecipe({id: recipe.id, user: userId, title, course, time, photo, time, ingredients, instructions, favorited})
    }
  }

  const onDeleteRecipeClicked = async () => {
    await deleteNote({id: recipe.id})
  }

  return (
    <div>EditRecipeForm</div>
  )
}

export default EditRecipeForm