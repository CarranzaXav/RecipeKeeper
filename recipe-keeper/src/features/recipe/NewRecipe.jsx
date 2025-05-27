import { useGetRecipesQuery } from "./recipesApiSlice"
import NewRecipeForm from './NewRecipeForm'
import { useGetUsersQuery } from "../users/usersApiSlice"

const NewRecipe = () => {

    const {users} = useGetUsersQuery('usersList', {
        selectFromResult: ({data}) => ({
            users: data?.ids.map((id) => data?.entities[id]),
        }),
    })

    if (!users?.length) {
        return (
        <div className="loader">Loading ...</div>
        )}

  return (
    <div>
        <NewRecipeForm users={users}/>
    </div>
  )
}

export default NewRecipe