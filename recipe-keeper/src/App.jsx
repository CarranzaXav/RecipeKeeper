import { useState } from 'react'
import Layout from './Components/Layout'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import MainPage from './features/auth/MainPage'
import DashLayout from './Components/DashLayout'
import RecipesList from './features/recipe/RecipesList'
import Recipe from './features/recipe/Recipe'
import UsersList from './features/users/UsersList'
import Login from './features/auth/Login'
import NewRecipe from './features/recipe/NewRecipe'
import Prefetch from './features/auth/Prefetch'
import EditRecipe from './features/recipe/EditRecipe'
import PersistLogin from './features/auth/PersistLogin'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<MainPage/>}/>
        <Route path='login' element={<Login/>}/>

        <Route element={<PersistLogin/>}>
        <Route element={<Prefetch/>}>
          <Route path='dash' element={<DashLayout/>}>

            {/* Recipes Route */}
            <Route  path='recipes'>
              <Route index element={<RecipesList/>}/>
              <Route path=':id' element={<Recipe/>}/>
              <Route path='edit/:id' element={<EditRecipe/>}/>
              <Route path='new' element={<NewRecipe/>} />
            </Route>

            {/* Users Route */}
            <Route  path='users'>
              <Route index element={<UsersList/>}/>
            </Route>

          </Route> {/*End of Dash*/}
        </Route> {/*End of Prefetch*/}
        </Route>

      </Route>
    </Routes>
  )
}

export default App
