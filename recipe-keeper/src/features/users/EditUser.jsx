import { useParams } from "react-router-dom";
import { useGetUsersQuery } from "./usersApiSlice";
import EditUserForm from "./EditUserForm";
import Loader from "../../Components/Loader";

const EditUser = () => {

    const { id } = useParams()

    const { user } = useGetUsersQuery('usersList', {
        selectFromResult: ({ data }) => ({
            user: data?.entities[id]
        }),
    })

    if(!user) return <div className='flex mt-24 h-96 justify-center'><Loader/></div>

    return <EditUserForm user={user} />

}

export default EditUser