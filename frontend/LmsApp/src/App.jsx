import {  BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css'
import LandingPage from "./pages/landing.jsx"
import { Login } from "./pages/login.jsx"
import { Signup } from "./pages/signup.jsx"
import Contact from "./pages/contact.jsx"
import Admin from "./pages/admin/admin.jsx"
import User from "./pages/user/user.jsx"
function App() {
   return (
    <>
    
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element = {<Login/>}/>
        <Route path="/signup" element = {<Signup/>}/>
        <Route path = '/contact' element = {<Contact/>}/>
        <Route path="/admin/:username/dashboard" element= {<Admin/>}/>
        <Route path="/:username/home" element={<User/>} />
        
      </Routes>
    </>
  )
}

export default App
