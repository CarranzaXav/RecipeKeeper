import { useGetRecipesQuery } from "./recipesApiSlice"
import NewRecipeForm from './NewRecipeForm'
import { useGetUsersQuery } from "../users/usersApiSlice"
import Loader from "../../Components/Loader"

const NewRecipe = () => {

    const {users} = useGetUsersQuery('usersList', {
        selectFromResult: ({data}) => ({
            users: data?.ids.map((id) => data?.entities[id]),
        }),
    })

    if (!users?.length) return <Loader/>

  return (
    <div>
        <NewRecipeForm users={users}/>
    </div>
  )
}

export default NewRecipe