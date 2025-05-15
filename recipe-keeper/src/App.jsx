import { useState } from 'react'
import Layout from './Components/Layout'
import Main from './Components/Main'
import './App.css'
import { Routes, Route } from 'react-router-dom'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout/>}/>
        <Route index element ={<Main/>}/>
    </Routes>
  )
}

export default App
