import { Routes, Route } from "react-router-dom"
import './App.css'
import LandingPage from "../pages/landing.jsx"

function App() {
   return (
    <>
      <Routes>
        <Route path="/"
          element={<LandingPage />} />
      </Routes>
    </>
  )
}

export default App
