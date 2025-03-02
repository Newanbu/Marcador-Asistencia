import './App.css'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom'
import Login from './routes/Login'
import Menu from './routes/Menu'
import {AuthProvider} from './contexts/useAuth'
import PrivateRoute from './components/private_route'
import Listado from './routes/Users'
import Sidebar from './navbar/Sidebar'
import AgregarHora from './horas/hora_entrada/agregar_hora'
import AgregarHoraSalida from './horas/hora_salida/agregar_hora_salida'

function App() {
  return (
    <>
      <ChakraProvider>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path='/Login' element={<Login/>}/>
              <Route path='/' element={<PrivateRoute><Menu/> <Sidebar /></PrivateRoute>}/>
              <Route path='/usuarios'  element={<PrivateRoute><Listado/> <Sidebar /></PrivateRoute>}/>
              <Route path='/entrada'  element={<PrivateRoute><AgregarHora/> <Sidebar /></PrivateRoute>}/>
              <Route path='/salida'  element={<PrivateRoute><AgregarHoraSalida/> <Sidebar /></PrivateRoute>}/>
            </Routes>
          </AuthProvider>
        </Router>
        {/* Codigo creado por JOHN E. SELTI ALCAYAGA */}
      </ChakraProvider>
    </>
  )
}

export default App
