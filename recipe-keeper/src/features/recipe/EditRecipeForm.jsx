import { useState, useEffect} from 'react'
import { useUpdateRecipeMutation, useDeleteRecipeMutation } from './recipesApiSlice'
import { useNavigate } from 'react-router-dom'
import { COURSES } from '../../../config/courses'


// const EditRecipeForm = ({recipe, users}) => {
const EditRecipeForm = ({recipe}) => {

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
  const [ingredients, setIngredients] = useState(
  Array.isArray(recipe.ingredients)
    ? recipe.ingredients.join(', ')
    : recipe.ingredients
  )
  const [instructions, setInstructions] = useState(
    Array.isArray(recipe.instructions)
    ? recipe.instructions.join(', ')
    : recipe.instructions
  )


//   const [instructions, setInstructions] = useState(recipe.instructions)
  const [favorited, isFavorited] = useState(recipe.favorited)

  useEffect(() => {

    if(isSuccess || isDelSuccess){
        setTitle('')
        setCourse([])
        setPhoto('')
        setTime()
        setIngredients([])
        setInstructions([])
        isFavorited(recipe.favorited || false)
        navigate('/recipes')
    }
  }, [isSuccess, isDelSuccess, navigate])

  const onTitleChanged = (e) => setTitle(e.target.value)
  const onPhotoChanged = (e) => setPhoto(e.target.value)
  const onTimeChanged = (e) => setTime(e.target.value)
//   const onFavorited = (e) => isFavorited(e.target.value)

    const onIngredientsChanged = (e) => {
    setIngredients(e.target.value)
    }

    const onInstructionsChanged = (e) => {
    setInstructions(e.target.value)
    }


  const onCourseChanged = (e) => {
    const values = Array.from(
        e.target.selectedOptions,
        (option) => option.value
    )
    setCourse(values)
  }

  const canSave = [title, ingredients, instructions].every(Boolean) && !isLoading

  const onSaveRecipeClicked = async (e) => {
    
    if(canSave){
        await updateRecipe({
            id: recipe.id,
            user: recipe.user,
            title,
            course,
            time,
            photo,
            ingredients: ingredients.split(',').map(i => i.trim()).filter(Boolean),
            instructions: instructions.split(',').map(i => i.trim()).filter(Boolean),
            favorited
})

    }
  }

  const onDeleteRecipeClicked = async () => {
    await deleteRecipe({id: recipe.id})
  }

  const fields = Object.values(COURSES).map((course) => {
      return (
          <option key={course} value={course}>
              {course}
          </option>
      )
   })

  return (
    <div className='editRecipeFormContainer'>
        <form className='editRecipeForm' onSubmit={e => e.preventDefault()}>
            <div className="editRecipeFormHead">
                <label className="editRecipeFormBodyFavorited"
                >
                    <input 
                        type="checkbox"
                        checked={favorited}
                        onChange={() => isFavorited(prev => !prev)}
                    />
                    Favorited
                    {/* {recipe.favorited ? '⭐' : 'not ⭐'} */}
                </label>

            <h2>Edit {recipe.title} Recipe</h2>
            <button
                className='editRecipeDeleteBtn'
                title='Delete'
                onClick={onDeleteRecipeClicked}
            >🗑</button>
            </div>

            <div className="editRecipeFormBody">

                <div className="editRecipeFormBodyTitle">
                    <label className='editRecipeFormLabel' htmlFor="recipe-title">Title</label>

                    <input 
                        type="text" 
                        className='editRecipeFormInput'
                        id='recipe-title'
                        name='title'
                        autoComplete='off'
                        value={title}
                        onChange={onTitleChanged}
                    />
                </div>

                <div className="editRecipeFormPhoto">
                    <label htmlFor="recipe-photo">Photo(Optional)</label>

                    <input 
                        className='editRecipeFormInput'
                        type="text" 
                        id='recipe-photo'
                        name='photo'
                        value={photo}
                        onChange={onPhotoChanged}    
                    />
                </div>

                <div className="editRecipeFormTime">
                    <label
                     className='editRecipeFormLabel'
                     htmlFor="recipe-time">Time:</label>

                     <input 
                        className='editRecipeFormInput'
                        id='recipe-time'
                        type="number" 
                        name='time'
                        value={time}
                        onChange={onTimeChanged}
                     />
                </div>

                <div className="editRecipeFormCourse">
                    <label 
                    className='editRecipeFormLabel'
                     htmlFor="recipe-course">Select Course</label>

                    <select 
                        name="course" id="recipe-course"
                        className='editRecipeFormSelect'
                        multiple={true}
                        size='1'
                        value={course}
                        onChange={onCourseChanged}
                    >{fields}</select>
                    
                </div>

                <div className="editRecipeFormIngredients">
                    <label 
                        className='editRecipeFormLabel'
                        htmlFor="recipe-ingredients"
                    >Ingredients</label>

                    <textarea 
                    className='editRecipeFormInput'
                    name="ingredients" id="recipe-ingredients"
                    value={ingredients} 
                    onChange={onIngredientsChanged}></textarea>
                </div>

                <div className="editRecipeFormInstructions">
                    <label 
                        className='editRecipeFormLabel'
                        htmlFor="recipe-instructions"
                    >Instructions</label>

                    <textarea 
                    className='editRecipeFormInput'
                    name="instructions" id="recipe-instructions"
                    value={instructions} 
                    onChange={onInstructionsChanged}></textarea>
                </div>
            </div>

            <div className="editRecipeFormFooter">
                {(canSave) && <button
                    className='editRecipeFormSaveBtn'
                    title='Save'
                    onClick={onSaveRecipeClicked}
                >
                Save
                </button>}
            </div>
        </form>
    </div>
  )
}

export default EditRecipeForm