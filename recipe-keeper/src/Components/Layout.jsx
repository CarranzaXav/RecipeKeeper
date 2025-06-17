import {Outlet} from 'react-router-dom'
import Navbar from './Navbar'

const Layout = () => {
  return (
  <>
    <Navbar/>
    <div className="flex
    m-auto 
    w-[85vw] lg:w-[90vw]
    h-full
    justify-self-center justify-center 
    py-6"
    >
      <Outlet/>
    </div>
  </>
    )
}

export default Layout