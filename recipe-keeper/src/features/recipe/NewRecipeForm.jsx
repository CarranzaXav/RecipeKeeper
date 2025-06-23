import { useState, useEffect } from "react"
import { useAddNewRecipeMutation } from "./recipesApiSlice"
import { useNavigate } from "react-router-dom"
import { COURSES } from "../../../config/courses"

import './recipeCSS/NewRecipeForm.css'
import useAuth from "../../hooks/useAuth"

const NewRecipeForm = ({users}) => {
// Authenticate current user
  const {id: userId, username} = useAuth()

  const [addNewRecipe, {isLoading, isSuccess, isError, error}] = useAddNewRecipeMutation()

  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [course, setCourse] = useState([''])
  const [photo, setPhoto] = useState('')
  const [time, setTime] = useState()
  const [ingredients, setIngredients] = useState('')
  const [instructions, setInstructions] = useState('')

  useEffect(() => {
    if (isSuccess) {
        // setUserId('')
        setTitle('')
        setCourse([])
        setPhoto('')
        setTime()
        setIngredients('')
        setInstructions('')
        navigate('/recipes')
    }
  }, [isSuccess, navigate])

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

  const canSave = [username, title, ingredients, instructions].every(Boolean) && !isLoading

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
        <form className="newRecipeForm
        w-full md:w-8/10
        min-h-48
        h-auto
        bg-[var(--FORM-COLOR)]
        p-5
        justify-self-center
        rounded-2xl
        mb-4
        " 
        onSubmit={onSaveRecipeClicked}
        >
            <div className='
                w-full
                h-auto
                flex
                justify-center
                mb-2
            '
                title="newRecipeFormHead"
            >
                <div className='
                    text-white
                    text-2xl md:text-3xl lg:text-4xl
                    tracking-[3px]
                    font-semibold
                ' 
                    title="newRecipeFormHeadTitle"
                >
                    New Recipe
                </div>
            </div>

            <div className='
                w-full
                mx-auto
                bg-[#f9f4fc]
                p-4
                rounded-2xl
                mb-2.5
            '       
                title="newRecipeFormBody"
            >

                <div className=""
                    title="newRecipeFormBodyTitleBlock"
                >
                    {/* <label className='
                        flex
                        w-1/2
                        tracking-[2px]
                        text-lg          self-center       
                    '
                    title="newRecipeFormLabel" htmlFor="title">Title: </label> */}
                    <input 
                        className='
                           flex
                            w-full
                            tracking-[2px]
                            text-lg
                            text-purple-500
                            self-center
                            bg-white
                            rounded-lg 
                            py-1.5
                            px-1
                        '
                        title="newRecipeFormInputTitle"
                        type="text"
                        name="title" 
                        id="title" 
                        value={title}
                        onChange={onTitleChanged}
                        placeholder="Enter Title"
                    />
                </div>

                <div className=''
                    title="newRecipeFormBodyPhotoBlock"
                >
                    <label className='
                        w-full
                        flex
                        text-sm
                        tracking-[2px]
                        self-center
                        py-2
                    '
                        title="newRecipeFormLabel" 
                        htmlFor="photo"
                    >
                        Photo: 
                    </label>
                    <input 
                        className='
                           w-full
                           p-1
                           rounded-lg
                           resize-none
                           overflow-hidden
                           min-h-16
                           bg-white
                           whitespace-pre-wrap 
                        '
                        title="newRecipeFormInput"
                        type="text"
                        name="photo" 
                        id="photo" 
                        value={photo}
                        onChange={onPhotoChanged}
                    />
                </div>

                <div className=''
                    title="newRecipeFormBodyCourseBlock"
                >
                    <label className='
                        w-full
                        flex
                        text-sm
                        tracking-[2px]
                        self-center
                        py-2
                    '
                        title="newRecipeFormLabel" 
                        htmlFor="course"
                    >
                        Course: 
                    </label>
                    <select 
                        name="course" 
                        id="course"
                        className='w-full
                            py-1
                            px-2
                            mb-1.5
                            text-sm md:text-lg
                            justify-end
                            rounded-xl
                            bg-white
                        '
                        title="newRecipeFormSelect"
                        multiple={true}
                        size='1'
                        value={course} 
                        onChange={onCourseChanged}
                    >
                        {fields}
                    </select>
                </div>

                <div className="newRecipeFormBodyTimeBlock">
                    <label className='
                        w-full
                        flex
                        text-sm
                        tracking-[2px]
                        self-center
                        py-2
                    '
                        title="newRecipeFormLabel" htmlFor="time"
                    >
                        Time: 
                    </label>
                    <input 
                        className='
                           w-full
                           p-1
                           rounded-lg
                           resize-none
                           overflow-hidden
                           h-8
                           whitespace-pre-wrap
                           bg-white 
                           mb-2
                        '
                        title="newRecipeFormInput"
                        name="time" 
                        id="time" 
                        type="number"
                        value={time}
                        onChange={onTimeChanged}
                    />
                </div>

                <div className='mb-2'
                title="newRecipeFormBodyIngredientsBlock">
                    {/* <label className="newRecipeFormLabel" htmlFor="ingredients">Ingredients: </label> */}
                    <textarea 
                        className='          w-full
                           bg-white
                           p-1
                           rounded-lg
                           resize-none
                           overflow-hidden
                           min-h-16
                           whitespace-pre-wrap
                           text-sm md:text-lg lg:text-xl
                        '
                        title="newRecipeFormInput"
                        name="ingredients" 
                        id="ingredients"
                        value={ingredients} 
                        onChange={onIngredientsChanged}
                        placeholder="Enter Ingredients..."
                    />
                    {/* Implement Live Preview */}
                </div>

                <div className='' title="newRecipeFormBodyInstructionsBlock">
                    {/* <label className="newRecipeFormLabel" htmlFor="instructions">Instructions: </label> */}
                    <textarea 
                        className='          w-full
                           bg-white
                           p-1
                           rounded-lg
                           resize-none
                           overflow-hidden
                           min-h-16
                           whitespace-pre-wrap
                           text-sm md:text-lg lg:text-xl
                        '
                        title="newRecipeFormInput"
                        name="instructions" 
                        id="instructions"
                        value={instructions}
                        onChange={onInstructionsChanged}
                        placeholder="Enter Instructions (Separate by comma)..."
                    />
                        {/* Implement Live Preview */}
                </div>
            </div>
                <div className='
                    h-15/100
                    w-full
                    flex
                    justify-center
                '
                title="newRecipeFormFooter">
                {(!canSave) &&
                    <button
                        className="
                            h-8/10
                            p-4
                            justify-items-center
                            flex
                            cursor-pointer
                            bg-[var(--BUTTON-COLOR)] hover:bg-white
                            text-white hover:text-[var(--BUTTON-COLOR)]
                            tracking-[2px]
                            font-semibold
                            rounded-2xl
                            border-solid
                            border-t-2 border-t-white 
                            border-l-2 border-l-white 
                            border-b-2 border-b-[#aba6d2] 
                            border-r-2 border-r-[#aba6d2] 
                            hover:shadow-[4px 4px]
                            hover:shadow-[var(--BUTTON-COLOR)]
                            hover:transform-[translate(-4px,-4px)]
                        "
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