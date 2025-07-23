import { Routes, Route } from "react-router-dom"
import './App.css'
import LandingPage from "../pages/landing.jsx"
import { Login } from "../pages/login.jsx"

function App() {
   return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element = {<Login/>}/>
      </Routes>
    </>
  )
}

export default App
