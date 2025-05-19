import {Outlet} from 'react-router-dom'
import Navbar from './Navbar'

const Layout = () => {
  return (
  <>
    <Navbar/>
    <div className="layoutContainer">
      <Outlet/>
    </div>
  </>
    )
}

export default Layout