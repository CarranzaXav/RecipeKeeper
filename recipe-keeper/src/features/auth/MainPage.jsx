import {Link} from 'react-router-dom'

const MainPage = () => {

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-us', { dataStyle: 'full', timeStyle: 'short'}).format(date)

  return (
    <section className='MainPage'>
      <p className='MainPageDate'>{today}</p>
      <h1 className='MainPageTitle'> Welcome to my Recipe Book! </h1>
      <p><Link to='/dash/recipes'>View Recipes</Link></p>
      <p><Link to='/dash/users'>View Users</Link></p>
    </section>
  )
}

export default MainPage