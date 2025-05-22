import {Link} from 'react-router-dom'
import Loader from '../../Components/Loader'
import { useState, useEffect } from 'react'

const MainPage = () => {

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      const timer = setTimeout(() => setIsLoading(false), 3000)
      return () => clearTimeout(timer)
    }, [])

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-us', { dataStyle: 'full', timeStyle: 'short'}).format(date)
    
    // if (isLoading) return  <Loader/>
    if (isLoading) return  <p>... Loading</p>

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