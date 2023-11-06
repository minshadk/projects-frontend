import './App.css'
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'
import Dashboard from './pages/dashboard/Dashboard'
import Project from './pages/project/Project'
import Create from './pages/create/Create'
import Login from './pages/login/Login'
import Navbar from './components/navbar/Navbar'
import Sidebar from './components/sidebar/Sidebar'
import Signup from './pages/signup/Signup'
import { useAuthContext } from './hooks/useAuthContext'
import OnlineUsers from './components/OnlineUsers'

function App() {
  const { user } = useAuthContext()

  return (
    <div className="App">
      <BrowserRouter>
        {user && <Sidebar />}
        <div className="container">
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={user ? <Dashboard /> : <Login />}
            />
            <Route path="/create" element={<Create />} />
            <Route path="/projects/:projectId" element={<Project />} />
            <Route
              path="/login"
              element={user ? <Navigate to="/" /> : <Login />}
            />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
        {user && <OnlineUsers />}
      </BrowserRouter>
    </div>
  )
}

export default App
