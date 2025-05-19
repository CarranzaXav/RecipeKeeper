import {Link} from 'react-router-dom'

const Navbar = () => {
  return (
    <header>
      <div className="navbarContainer">
        <Link to='/'>
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