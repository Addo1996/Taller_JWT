import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/Login'
import Perfil from './pages/Perfil'

function App() {
   return (
      <AuthProvider>
         <BrowserRouter>
         
         <Routes>

            <Route path = "/login" element = {<Login/>}/>

            <Route element = {<ProtectedRoute/>}>
            
            <Route path = "/perfil" element={<Perfil/>}/>
            
            </Route>

            <Route path = "*" element={<Navigate to="/login" replace />}/>


         </Routes>
         
         
         </BrowserRouter>

      </AuthProvider>

   )
}

export default App
