import './App.css'
import { BrowserRouter,Routes, Route } from 'react-router-dom'
import { Register, Login, Upload } from './pages'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/upload' element={<Upload />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
