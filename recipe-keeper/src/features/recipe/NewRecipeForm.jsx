import { useState, useEffect } from "react"
import { useAddNewRecipeMutation } from "./recipesApiSlice"
import { useNavigate } from "react-router-dom"
import { COURSES } from "../../../config/courses"

import './recipeCSS/NewRecipeForm.css'

const NewRecipeForm = ({users}) => {

  const [addNewRecipe, {isLoading, isSuccess, isError, error}] = useAddNewRecipeMutation()

  const navigate = useNavigate()

  const [userId, setUserId] = useState(users?.[0]?.id || '')
  const [title, setTitle] = useState('')
  const [course, setCourse] = useState([''])
  const [photo, setPhoto] = useState('')
  const [time, setTime] = useState()
  const [ingredients, setIngredients] = useState('')
  const [instructions, setInstructions] = useState('')

  useEffect(() => {
    if (isSuccess) {
        setUserId('')
        setTitle('')
        setCourse([])
        setPhoto('')
        setTime()
        setIngredients('')
        setInstructions('')
        navigate('/recipes')
    }
  }, [isSuccess, navigate])

  const onUserIdChanged = (e) => setUserId(e.target.value)
  const onTitleChanged = (e) => setTitle(e.target.value)
  const onPhotoChanged = (e) => setPhoto(e.target.value)
  const onTimeChanged = (e) => setTime(e.target.value)

const onIngredientsChanged = (e) => {
    setIngredients(e.target.value)
    autoResizeTextarea(e.target)
    }

const onInstructionsChanged = (e) => {
    setInstructions(e.target.value)
    autoResizeTextarea(e.target)
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
    e.preventDefault()
    if(canSave){
        await addNewRecipe({
            user: userId,
            title, 
            // split ingredients and instruction 
            // into arrays before mutation
            ingredients: ingredients.split(/[\s\n,]+/).map(i => i.trim()).filter(Boolean),
            instructions: instructions.split(/[\s\n,]+/).map(i => i.trim()).filter(Boolean),
        })
    }
  }

  const fields = Object.values(COURSES).map((course) => {
    return (
        <option key={course} value={course}>
            {course}
        </option>
    )
  })

  const autoResizeTextarea = (element) => {
    if(element) {
        element.style.height = 'auto';
        element.style.height = `${element.scrollHeight}px`
    }
  }

  useEffect(() => {
    const ingredientsBox = document.getElementById('ingredients');
    const instructionsBox = document.getElementById('instructions');
    autoResizeTextarea(ingredientsBox);
    autoResizeTextarea(instructionsBox)
  }, [ingredients, instructions])

  return (
    <>
        <form className="newRecipeForm" onSubmit={onSaveRecipeClicked}>
            <div className="newRecipeFormHead">
                <div className="newRecipeFormHeadTitle">New Recipe</div>
            </div>

            <div className="newRecipeFormBody">

                <div className="newRecipeFormBodyTitleBlock flex">
                    <label className="newRecipeFormLabel" htmlFor="title">Title: </label>
                    <input 
                        className="newRecipeFormInputTitle"
                        type="text"
                        name="title" 
                        id="title" 
                        value={title}
                        onChange={onTitleChanged}
                    />
                </div>

                <div className="newRecipeFormBodyPhotoBlock flex">
                    <label className="newRecipeFormLabel" htmlFor="photo">Photo: </label>
                    <input 
                        className="newRecipeFormInput"
                        type="text"
                        name="photo" 
                        id="photo" 
                        value={photo}
                        onChange={onPhotoChanged}
                    />
                </div>

                <div className="newRecipeFormBodyCourseBlock flex">
                    <label className="newRecipeFormLabel" htmlFor="course">Course: </label>
                    <select 
                        name="course" 
                        id="course"
                        className="newRecipeFormSelect"
                        multiple={true}
                        size='1'
                        value={course} 
                        onChange={onCourseChanged}
                    >
                        {fields}
                    </select>
                </div>

                <div className="newRecipeFormBodyTimeBlock flex">
                    <label className="newRecipeFormLabel" htmlFor="time">Time: </label>
                    <input 
                        className="newRecipeFormInput"
                        name="time" 
                        id="time" 
                        type="number"
                        value={time}
                        onChange={onTimeChanged}
                    />
                </div>

                <div className="newRecipeFormBodyIngredientsBlock flex">
                    <label className="newRecipeFormLabel" htmlFor="ingredients">Ingredients: </label>
                    <textarea 
                        className="newRecipeFormInput"
                        name="ingredients" 
                        id="ingredients"
                        value={ingredients} 
                        onChange={onIngredientsChanged}
                    />
                    {/* Implement Live Preview */}
                </div>

                <div className="newRecipeFormBodyInstructionsBlock flex">
                    <label className="newRecipeFormLabel" htmlFor="instructions">Instructions: </label>
                    <textarea 
                        className="newRecipeFormInput"
                        name="instructions" 
                        id="instructions"
                        value={instructions}
                        onChange={onInstructionsChanged}
                    />
                        {/* Implement Live Preview */}
                </div>
            </div>
                <div className="newRecipeFormFooter">
                {(canSave) &&
                    <button
                        className="newRecipeFormBtn"
                        title="Save"
                        // disabled={!canSave}
                    >
                        UPLOAD
                    </button>
                }
                </div>
        </form>
    </>
  )
}

export default NewRecipeForm