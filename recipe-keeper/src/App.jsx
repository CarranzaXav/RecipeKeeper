import { useState } from 'react'
import Layout from './Components/Layout'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import MainPage from './features/auth/MainPage'
import DashLayout from './Components/DashLayout'
import RecipesList from './features/recipe/RecipesList'
import UsersList from './features/users/UsersList'
import Login from './features/auth/Login'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<MainPage/>}/>
        <Route path='login' element={<Login/>}/>

        <Route path='dash' element={<DashLayout/>}>

          {/* Recipes Route */}
          <Route  path='recipes'>
            <Route index element={<RecipesList/>}/>
          </Route>

          {/* Users Route */}
          <Route  path='users'>
            <Route index element={<UsersList/>}/>
          </Route>

        </Route>

      </Route>
    </Routes>
  )
}

export default App
