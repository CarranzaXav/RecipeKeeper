import { useState, useEffect } from "react"
import { useAddNewRecipeMutation } from "./recipesApiSlice"
import { useNavigate } from "react-router-dom"
import { COURSES } from "../../config/courses"

import useAuth from "../../hooks/useAuth"

const NewRecipeForm = ({users}) => {
// Authenticate current user
  const {id: userId, username} = useAuth()

  const [addNewRecipe, {
    isLoading, 
    isSuccess, 
    isError, 
    error
  }] = useAddNewRecipeMutation()

  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [course, setCourse] = useState([''])
  const [photo, setPhoto] = useState([])
  const [photoSource, setPhotoSource] = useState("")
  const [photoURL, setPhotoURL] = useState("")
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [ingredients, setIngredients] = useState('')
  const [instructions, setInstructions] = useState('')

  useEffect(() => {
    if (isSuccess) {
        setTitle('')
        setCourse([])
        setPhoto([])
        setHours()
        setMinutes()
        setIngredients('')
        setInstructions('')
        navigate('/recipes')
    }
  }, [isSuccess, navigate])

    const onTitleChanged = (e) => setTitle(e.target.value)
    const onHoursChanged = (e) => setHours(e.target.value)
    const onMinutesChanged = (e) => setMinutes(e.target.value)

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
        if(!canSave) return

        const formData = new FormData()
        formData.append('user', userId)
        formData.append('title', title)
        course.forEach(c => formData.append('course', c))

        if(photoSource === 'upload' && Array.isArray(photo)) {
            photo.forEach(file => formData.append('photo', file))
        } else if ( photoSource === 'url' && photoURL){
            formData.append('photoLink', photoURL)
        }

        formData.append('time[hours]', hours || 0)
        formData.append('time[minutes]', minutes || 0)
        formData.append('ingredients', JSON.stringify(
            ingredients.split(',').map(i => i.trim()).filter(Boolean)
        ))

        formData.append('instructions', JSON.stringify(
            instructions.split('\n').map(i => i.trim()).filter(Boolean)
        ))
        await addNewRecipe(formData)

    //     for (let [key, value] of formData.entries()) {
    //   console.log(key, value)
    // }


        navigate('/recipes')    
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

    const errClass = isError ? "errmsg" : ""
    const validTitleClass = !title ? 'form-input--incomplete' : ''
    const validIngreClass = !ingredients ? 'form-input--incomplete' : ''
    const validInstrClass = !instructions ? 'form-input--incomplete' : ''

    const errContent = (error?.data?.message) ?? ""

  return (
    <>
        <p className={errClass}>{errContent}</p>

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
        title="newRecipeForm"
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
                    <input 
                        className={`
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
                            ${validTitleClass}
                        `}
                        title="newRecipeFormInputTitle"
                        type="text"
                        name="title" 
                        id="title" 
                        value={title}
                        onChange={onTitleChanged}
                        placeholder="Enter Title"
                    />
                </div>

                <div className='flex my-3'
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
                        <h2>Choose Photo Source:</h2>
                        <h4>(Optional)</h4>                    
                    </label>

                    <select 
                        className="
                           w-6/10
                           p-1
                           rounded-lg
                           resize-none
                           overflow-hidden
                           min-h-10
                           bg-white
                           whitespace-pre-wrap" 
                        id="recipe-photo"
                        title="newRecipeFormInput"
                        value={photoSource}
                        onChange={e => setPhotoSource(e.target.value)}
                        name="name"
                    >
                        <option value="">Select A Method</option>
                        <option value="upload">Upload Image</option>
                        <option value="url">Image Link</option>
                    </select>

                    {photoSource === '' && (
                        photo.length > 0 && photo[0].url ? (
                            <img src={photo[0].url} alt="Current" className="w-24 rounded" />
                        ) : (
                            <div className="w-24 h-24 flex items-center justify-center bg-white border border-gray-300 text-xl rounded">
                            📷
                            </div>
                        )
                    )}

                    {photoSource === 'upload' && (
                        <input 
                            type="file"
                            multiple
                            onChange={(e) => setPhoto(Array.from(e.target.files))} 
                        />
                    )}

                    {photoSource === 'url' && (
                        <input 
                            type="text"
                            placeholder=""
                            value={photoURL}
                            onChange={(e) => setPhotoURL(e.target.value)} 
                        />
                    )}
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
                           w-1/2
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
                        name="hours" 
                        id="hours" 
                        type="number"
                        value={hours}
                        onChange={onHoursChanged}
                        placeholder="0 Hours"
                    />
                    <input 
                        className='
                           w-1/2
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
                        name="minutes" 
                        id="minutes" 
                        type="number"
                        value={minutes}
                        onChange={onMinutesChanged}
                        placeholder="0 Minutes"
                    />
                </div>

                <div className='mb-2'
                title="newRecipeFormBodyIngredientsBlock">

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
                        title="newRecipeFormInput"
                        name="ingredients" 
                        id="ingredients"
                        value={ingredients} 
                        onChange={onIngredientsChanged}
                        placeholder="Enter Ingredients..."
                    />

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

                <div className='' title="newRecipeFormBodyInstructionsBlock">
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
                        title="newRecipeFormInput"
                        name="instructions" 
                        id="instructions"
                        value={instructions}
                        onChange={onInstructionsChanged}
                        placeholder="Enter Instructions (Separate by new line)..."
                    />

                    <div id="PrevInstructions">
                        <ul className="px-4">
                            {instructions
                                .split(/[\n]+/) //splitby newline
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
            </div>
                <div className='
                    h-15/100
                    w-full
                    flex
                    justify-center
                '
                title="newRecipeFormFooter">
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
                        title="Save"
                        type="submit"
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