import HomePage from "../pages/home"
import { Routes, Route } from "react-router-dom"
import './App.css'

function App() {
   return (
    <>
      <Routes>
        <Route path="/"
          element={<HomePage />} />
      </Routes>
    </>
  )
}

export default App
