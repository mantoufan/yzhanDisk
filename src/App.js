import './App.css'
import { BrowserRouter,Routes, Route } from 'react-router-dom'
import { Register, Login, Upload } from './pages'
import { LogContext } from './stores/context'

import { useState } from 'react'

function App() {
  const [logs, setLogs] = useState([])
  return (
    <LogContext.Provider value={{ value: logs, setValue: setLogs }}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />}/>
          <Route path='/register' element={<Register />}/>
          <Route path='/upload' element={<Upload />}/>
        </Routes>
      </BrowserRouter>
    </LogContext.Provider>
  )
}

export default App
