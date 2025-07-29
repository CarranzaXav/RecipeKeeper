import { useState, useEffect} from 'react'
import { useUpdateRecipeMutation, useDeleteRecipeMutation } from './recipesApiSlice'
import { useNavigate } from 'react-router-dom'
import { COURSES } from '../../config/courses'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faStar, faTrash} from '@fortawesome/free-solid-svg-icons'
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
  const [photo, setPhoto] = useState(recipe.photo || [])
  const [photoSource, setPhotoSource] = useState("existing")
  const [photoURL, setPhotoURL] = useState("") 
  const [hours, setHours] = useState(recipe?.time?.hours || '')
  const [minutes, setMinutes] = useState(recipe?.time?.minutes || '')
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

  const [favorited, setFavorited] = useState(() => typeof recipe.favorited === 'object' ? { ...recipe.favorited } : {})

  useEffect(() => {

    if(isSuccess || isDelSuccess){
        setTitle('')
        setCourse([])
        setPhoto([])
        setHours()
        setMinutes()
        setIngredients('')
        setInstructions('')
        setFavorited(recipe.favorited || false)
        navigate('/recipes')
    }
  }, [isSuccess, isDelSuccess, navigate])

  const onTitleChanged = (e) => setTitle(e.target.value)
//   const onPhotoChanged = (e) => setPhoto(e.target.value)
//   const onTimeChanged = (e) => setTime(e.target.value)
  const onHoursChanged = (e) => setHours(Number(e.target.value))
  const onMinutesChanged = (e) => setMinutes(Number(e.target.value))

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

  const errClass = isError || isDelError ? 'errmsg' : ''
  const validTitleClass = !title ? 'form-input--incomplete' : ''
  const validIngreClass = !ingredients ? 'form-input--incomplete' : ''
  const validInstrClass = !instructions ? 'form-input--incomplete' : ''
  
  const errContent = (error?.data?.message || delerror?.data?.message) ?? ""



//   const onSaveRecipeClicked = async (e) => {
    
//     if(canSave){
//         await updateRecipe({
//             id: recipe.id,
//             user: recipe.user,
//             title,
//             course,
//             time:{
//                 hours, minutes
//             },
//             photo,
//             ingredients: ingredients.split(', ').map(i => i.trim()).filter(Boolean),
//             instructions: instructions.split(/[\n]/).map(i => i.trim()).filter(Boolean),
//             favorited
//     })
//     navigate('/recipes')
//     }
//   }

  const onSaveRecipeClicked = async (e) => {
    e.preventDefault()
    if (!canSave) return

    const formData = new FormData()
    formData.append('id', recipe.id)
    formData.append('user', userId)
    formData.append('title', title)
    course.forEach(c => formData.append('course', c))

    if (photoSource === 'upload' && Array.isArray(photo)) {
      photo.forEach(file => formData.append('photo', file))
    } else if (photoSource === 'url' && photoURL) {
      formData.append('photoLink', photoURL)
    } else if (photoSource === 'existing' && recipe.photo) {
      formData.append('photo', JSON.stringify(recipe.photo))
    }

    formData.append('time[hours]', hours || 0)
    formData.append('time[minutes]', minutes || 0)
    ingredients.split(',').forEach(i => formData.append('ingredients[]', i.trim()))
    instructions.split('\n').forEach(i => formData.append('instructions[]', i.trim()))
    formData.append('favorited', JSON.stringify(favorited))

    await updateRecipe(formData)

    navigate('/recipes')
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
    <>
        <p className={errClass}>{errContent}</p>
        <form className="
            w-full md:w-9/10 lg:w-8/10 xl:w-7/10
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
                <div className='
                    cursor-
                    mr-1
                    text-2xl
                    self-center
                ' 
                    title="editRecipeHeadBodyFavorited"
                    onClick={onFavorited}
                    value={favorited}
                >
                    <FontAwesomeIcon icon={faStar} style={{color: favorited?.[userId] ? '#FFD43B' : '#bababa'}}
                    />
                </div>

            <h2 className='
                w-8/10
                grid md:flex
                text-white
                text-xl md:text-2xl lg:text-3xl
                tracking-[3px]
                font-semibold
                justify-items-center 
                justify-center
                px-4
            ' 
                title="editRecipeFormHeadTitle"
            >
                <h3>Edit</h3>
                <p className='
                w-1/2 lg:w-auto
                flex
                justify-center
                text-lg xl:text-2xl 
                xl:self-end
                px-4
                '
                >
                    {recipe.title}
                </p>
                <h3>Recipe</h3>
            </h2>
            <button
                className='text-2xl '
                title='Delete'
                onClick={onDeleteRecipeClicked}
            >
                <FontAwesomeIcon icon={faTrash} className='text-white hover:text-purple-500 cursor-pointer'/>
            </button>
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
                        className={`
                            flex
                            w-full
                            tracking-[2px]
                            text-lg
                            text-purple-500
                            self-center
                            bg-white
                            rounded-lg 
                            p-1.5
                            ${validTitleClass}
                        `}
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
                        <h2>Choose Photo Source:</h2>
                        <h4>(Optional)</h4>
                    </label>

                    <div>
                    {/* <input
                        className='
                           w-6/10
                           p-1
                           rounded-lg
                           resize-none
                           overflow-hidden
                           min-h-10
                           bg-white
                           whitespace-pre-wrap
                        '
                        title='editRecipeFormInput'
                        type="text"
                        id='recipe-photo'
                        name='photo'
                        value={photo}
                        onChange={onPhotoChanged}    
                    /> */}

                    <select 
                    className='
                           w-6/10
                           p-1
                           rounded-lg
                           resize-none
                           overflow-hidden
                           min-h-10
                           bg-white
                           whitespace-pre-wrap
                        '
                        title='editRecipeFormInput'
                    value={photoSource}
                    onChange={e => setPhotoSource(e.target.value)}
                    id='recipe-photo'
                    name='photo'
                    // value={photo}
                    >
                        <option value="existing">Keep Current</option>
                        <option value="upload">Upload New</option>
                        <option value="url">Use Link</option>
                    </select> 

                    {photoSource === "upload" && (
                        <input type="file" multiple onChange={(e) => setPhoto(Array.from(e.target.files))} />
                    )}

                    {photoSource === "url" && (
                        <input
                            type="text"
                            placeholder="https://example.com/image.jpg"
                            value={photoURL}
                            onChange={(e) => setPhotoURL(e.target.value)}
                        />
                    )}

                        {photoSource === "existing" && photo.length > 0 && (
                        <img src={photo[0].url} alt="Current" className="w-24" />
                    )}

                    {/* <input
                        className='
                           w-6/10
                           p-1
                           rounded-lg
                           resize-none
                           overflow-hidden
                           min-h-10
                           bg-white
                           whitespace-pre-wrap
                        '
                        title='editRecipeFormInput'
                        type="file"
                        id='recipe-photo'
                        name='photo'
                        value={photo}
                        onChange={e => setPhoto(Array.from(e.target.files))}    
                    /> */}
                    </div>
                </div>


                <div className='
                    flex
                    my-2.5
                '
                title="editRecipeFormTime">
                    <label
                     className='
                        w-3/10 lg:w-4/10
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
                            w-1/2 lg:w-6/10
                            py-1
                            px-2
                            mb-1.5
                            text-sm md:text-lg
                            justify-end
                            rounded-xl
                            bg-white
                        '
                        title='editRecipeFormInput'
                        id='recipe-hours'
                        type="number" 
                        name='hours'
                        value={hours}
                        onChange={onHoursChanged}
                        placeholder='Hours'
                     />
                     <input 
                        className='
                            w-1/2 lg:w-6/10
                            py-1
                            px-2
                            mb-1.5
                            text-sm md:text-lg
                            justify-end
                            rounded-xl
                            bg-white
                        '
                        title='editRecipeFormInput'
                        id='recipe-minutes'
                        type="number" 
                        name='minutes'
                        value={minutes}
                        onChange={onMinutesChanged}
                        placeholder='Minutes'
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
                        multiple={false}
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
                    className={`
                        w-full
                        bg-white
                        p-1
                        rounded-lg
                        resize-none
                        overflow-hidden
                        min-h-16
                        whitespace-pre-wrap
                        text-sm md:text-lg lg:text-xl
                        ${validIngreClass}
                    `}
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
                    className={`
                        w-full
                        bg-white
                        p-1
                        rounded-lg
                        resize-none
                        overflow-hidden
                        min-h-16
                        whitespace-pre-wrap
                        text-sm md:text-lg lg:text-xl
                        ${validInstrClass}
                    `}
                    title='editRecipeFormInput'
                    name="instructions" id="recipe-instructions"
                    value={instructions} 
                    onChange={onInstructionsChanged}></textarea>
                </div>

                <div id="PrevInstructions">
                        <ul className="px-4">
                            {instructions
                                .split(/[\n]+/) //splitby newline or comma
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
    </>
  )
}

export default EditRecipeForm