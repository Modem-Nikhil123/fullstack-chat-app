import './App.css'
import {BrowserRouter,Routes,Route, Navigate} from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from 'react'
import {Loader} from 'lucide-react'
import {Toaster} from 'react-hot-toast'
function App() {
  const { theme } = useThemeStore();
  const {authUser,checkAuth,isCheckingAuth,onlineUsers}=useAuthStore();
  useEffect(()=>{
    checkAuth();
  },[])
  console.log({authUser});
  console.log(onlineUsers);
  if(isCheckingAuth && !authUser) 
  {
    return(
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin'/>
      </div>
    )
  }
  return (
    <div data-theme={theme}>

    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path='/' element={authUser?<HomePage/>:<Navigate to='/login'/>}></Route>
      <Route path='/signup' element={!authUser?<SignupPage/>:<Navigate to='/'/>}></Route>
      <Route path='/login' element={!authUser?<LoginPage/>:<Navigate to='/'/>}></Route>
      <Route path='/profile' element={authUser?<ProfilePage/>:<Navigate to='/login'/>}></Route>
      <Route path='/settings' element={<SettingsPage/>}></Route>
    </Routes>
    </BrowserRouter>
    <Toaster
  position="top-center"
  reverseOrder={false}/>
    </div>
  ) 
}

export default App;
