import { Outlet } from "react-router-dom"
import './ComponentsCSS/DashLayout.css'
import Navbar from "./Navbar"

const DashLayout = () => {
  return (
    <>
        {/* <Navbar/> */}
        <div className="dash-container">
            <Outlet/>
        </div>
    </>
  )
}

export default DashLayout