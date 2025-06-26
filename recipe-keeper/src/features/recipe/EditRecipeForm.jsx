import { useState, useEffect} from 'react'
import { useUpdateRecipeMutation, useDeleteRecipeMutation } from './recipesApiSlice'
import { useNavigate } from 'react-router-dom'
import { COURSES } from '../../../config/courses'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faStar} from '@fortawesome/free-solid-svg-icons'
import useAuth from '../../hooks/useAuth'


const EditRecipeForm = ({recipe}) => {

  const {id: userId} = useAuth()

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

  const [favorited, setFavorited] = useState(() => {
    const initial = typeof recipe.favorited === 'object' ? { ...recipe.favorited } : {}
    return initial
  })

  useEffect(() => {

    if(isSuccess || isDelSuccess){
        setTitle('')
        setCourse([])
        setPhoto('')
        setTime()
        setIngredients([])
        setInstructions([])
        setFavorited(recipe.favorited || false)
        navigate('/recipes')
    }
  }, [isSuccess, isDelSuccess, navigate])

  const onTitleChanged = (e) => setTitle(e.target.value)
  const onPhotoChanged = (e) => setPhoto(e.target.value)
  const onTimeChanged = (e) => setTime(e.target.value)

  const onFavorited = () => {
    setFavorited(prev => ({
        ...prev,
        [userId]: !prev?.[userId]
    }))
  }


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
    navigate('/recipes')
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
        <form className="
            w-full md:w-8/10
            min-h-48
            h-auto
            bg-[var(--FORM-COLOR)]
            p-5
            justify-self-center
            rounded-2xl
            mb-4
        " 
            title='editRecipeForm' 
            onSubmit={e => e.preventDefault()}
        >
            <div className='
                w-full
                h-auto
                flex
                justify-center
                mb-2
            '
                title="editRecipeFormHead"
            >
                <div className="editRecipeHeadBodyFavorited cursor-pointer"
                    onClick={onFavorited}
                    value={favorited}
                >
                    <FontAwesomeIcon icon={faStar} style={{color: favorited?.[userId] ? '#FFD43B' : '#bababa'}}
                    />
                </div>

            <h2 className='
                text-white
                text-2xl md:text-3xl lg:text-4xl
                tracking-[3px]
                font-semibold
            ' 
                title="editRecipeFormHeadTitle"
            >
                Edit {recipe.title} Recipe
            </h2>
            <button
                className='editRecipeDeleteBtn'
                title='Delete'
                onClick={onDeleteRecipeClicked}
            >🗑</button>
            </div>

            <div className='
                w-full
                mx-auto
                bg-[#f9f4fc]
                p-4
                rounded-2xl
                mb-2.5
            '  
                title="editRecipeFormBody"
            >

                <div className='' title="editRecipeFormBodyTitle">                    
                <input 
                        type="text" 
                        className='
                            flex
                            w-full
                            tracking-[2px]
                            text-lg
                            text-purple-500
                            self-center
                            bg-white
                            rounded-lg 
                            p-1.5 
                        '
                        title='editRecipeFormInput'
                        id='recipe-title'
                        name='title'
                        autoComplete='off'
                        value={title}
                        onChange={onTitleChanged}
                    />
                </div>

                 <div className='
                flex
                    my-3
                '
                    title="editRecipeFormPhoto"
                >
                    <label htmlFor="recipe-photo"
                    className='
                        w-4/10
                        grid
                        text-sm
                        tracking-[2px]
                        self-center
                        py-2
                    '
                        title='editRecipeFormLabel'
                    >
                        <h2>Photo</h2>
                        <h4>(Optional)</h4>
                    </label>


                    <input
                        className='
                           w-6/10
                           p-1
                           rounded-lg
                           resize-none
                           overflow-hidden
                           min-h-16
                           bg-white
                           whitespace-pre-wrap
                        '
                        title='editRecipeFormInput'
                        type="text"
                        id='recipe-photo'
                        name='photo'
                        value={photo}
                        onChange={onPhotoChanged}    
                    />
                </div>


                <div className='
                    flex
                    my-2.5
                '
                title="editRecipeFormTime">
                    <label
                     className='
                        w-3/10
                        flex
                        text-sm
                        tracking-[2px]
                        self-center
                        py-2
                     '
                     title='editRecipeFormLabel'
                     htmlFor="recipe-time"
                     >
                        Time:
                     </label>

                     <input 
                        className='
                            w-7/10
                            py-1
                            px-2
                            mb-1.5
                            text-sm md:text-lg
                            justify-end
                            rounded-xl
                            bg-white
                        '
                        title='editRecipeFormInput'
                        id='recipe-time'
                        type="number" 
                        name='time'
                        value={time}
                        onChange={onTimeChanged}
                     />
                </div>

                <div className='flex'
                    title="editRecipeFormCourse"
                >
                    <label className='
                        w-4/10
                        flex
                        text-sm
                        tracking-[2px]
                        self-center
                        py-2
                    '
                        title='editRecipeFormLabel'
                     htmlFor="recipe-course">
                        Select Course
                    </label>

                    <select 
                        name="course" id="recipe-course"
                        className='
                            w-6/10
                            py-1
                            px-2
                            mb-1.5
                            text-sm md:text-lg
                            justify-end
                            rounded-xl
                            bg-white
                        '
                        title='editRecipeFormSelect'
                        multiple={true}
                        size='1'
                        value={course}
                        onChange={onCourseChanged}
                    >{fields}</select>
                    
                </div>

                <div className='
                    grid
                    my-3
                '
                    title="editRecipeFormIngredients"
                >
                    <label className='
                        w-full
                        flex
                        text-sm
                        tracking-[2px]
                        self-center
                        py-2
                    '
                        title='editRecipeFormLabel'
                        htmlFor="recipe-ingredients"
                    >
                        Ingredients
                    </label>

                    <textarea 
                    className='
                        w-full
                        bg-white
                        p-1
                        rounded-lg
                        resize-none
                        overflow-hidden
                        min-h-16
                        whitespace-pre-wrap
                        text-sm md:text-lg lg:text-xl
                    '
                    title='editRecipeFormInput'
                    name="ingredients" id="recipe-ingredients"
                    value={ingredients} 
                    onChange={onIngredientsChanged}>
                    </textarea>

                    <div id="PrevIngredients">
                        <ul className="px-4">
                            {ingredients
                                .split(/[\n,]+/) //splitby newline or comma
                                .filter(item => item.trim() !== '')//remove empty entries
                                .map((item, index)=> (
                                    <li className="
                                        list-disc
                                        pl-2
                                    " 
                                        key={index}>{item.trim()}
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>

                <div className="editRecipeFormInstructions">
                    <label className='
                        w-full
                        flex
                        text-sm
                        tracking-[2px]
                        self-center
                        py-2
                    '
                        title='editRecipeFormLabel'
                        htmlFor="recipe-instructions"
                    >
                        Instructions
                    </label>

                    <textarea 
                    className='
                        w-full
                        bg-white
                        p-1
                        rounded-lg
                        resize-none
                        overflow-hidden
                        min-h-16
                        whitespace-pre-wrap
                        text-sm md:text-lg lg:text-xl
                    '
                    title='editRecipeFormInput'
                    name="instructions" id="recipe-instructions"
                    value={instructions} 
                    onChange={onInstructionsChanged}></textarea>
                </div>

                <div id="PrevInstructions">
                        <ul className="px-4">
                            {instructions
                                .split(/[\n,]+/) //splitby newline or comma
                                .map((item, index) => item.trim())
                                .filter(item => item.trim() !== '') //remove empty entries
                                .map((item, index)=> (
                                    <li className="list-decimal
                                    pl-2
                                    " key={index}>{item.trim()}</li>
                                ))
                            }
                        </ul>
                    </div>

            </div>

            <div className='
                h-15/100
                w-full
                flex
                justify-center
            '
                title="editRecipeFormFooter"
            >
                {(canSave) && 
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
                    title='Save'
                    onClick={onSaveRecipeClicked}
                >
                Save
                </button>}
            </div>
        </form>
  )
}

export default EditRecipeForm