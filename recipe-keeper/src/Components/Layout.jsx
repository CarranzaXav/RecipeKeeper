import {Outlet} from 'react-router-dom'
import Navbar from './Navbar'
import './ComponentsCSS/Layout.css'

const Layout = () => {
  return (
  <>
    <Navbar/>
    <div className="m-auto w-[80vw] justify-self-center py-6">
      <Outlet/>
    </div>
  </>
    )
}

export default Layout