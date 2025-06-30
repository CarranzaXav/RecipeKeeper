import { Outlet } from "react-router-dom"

const DashLayout = () => {
  return (
    <>
        <div className="w-full md:w-9/10 lg:w-8/10">
            <Outlet/>
        </div>
    </>
  )
}

export default DashLayout