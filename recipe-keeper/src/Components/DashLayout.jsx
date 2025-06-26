import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"

const DashLayout = () => {
  return (
    <>
        <div className="dash-container w-full md:w-9/10 lg:w-8/10">
            <Outlet/>
        </div>
    </>
  )
}

export default DashLayout