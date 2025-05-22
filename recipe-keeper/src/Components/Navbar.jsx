import {Link} from 'react-router-dom'
import './ComponentsCSS/Navbar.css'

const Navbar = () => {
  return (
    <header className="navbarContainer">
      <div className="navbarContainer">
        <Link className='navbarTitleContainer' to='/'>
          <h1 className='navbarTitle'>Recipe Keeper</h1>
        </Link>
        <nav className='navbarButtonContainer'>
          {/* add nav buttons in a bit */}
        </nav>
      </div>
    </header>  
)
}

export default Navbar