import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectRecipeById } from "./recipesApiSlice"
import { selectAllUsers } from "../users/usersApiSlice"
import EditRecipeForm from './EditRecipeForm'

const EditRecipe = () => {
    const { id } = useParams()

    const recipe = useSelector(state => selectRecipeById(state, id))
    const users = useSelector(selectAllUsers)

  return recipe && users ? <EditRecipeForm recipe={recipe} users={users} /> : <p>Loading ...</p>
}

export default EditRecipe