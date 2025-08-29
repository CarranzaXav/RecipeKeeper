import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectRecipeById } from "./recipesApiSlice"
import { selectAllUsers } from "../users/usersApiSlice"
import EditRecipeForm from './EditRecipeForm'
import Loader from "../../Components/Loader"

const EditRecipe = () => {
//Route param
  const { id } = useParams()

//Selectors 
  const recipe = useSelector(state => selectRecipeById(state, id))
  const users = useSelector(selectAllUsers)

// Content
  return recipe && users ? <EditRecipeForm recipe={recipe} users={users} /> : <div className='flex mt-24 h-96 justify-center'><Loader/></div>
}

export default EditRecipe