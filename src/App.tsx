import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SignIn from './pages/security/SignIn.tsx'
import LogIn from './pages/security/LogIn.tsx'
import MainPage from './pages/MainPage'
import NewTodo from "./pages/NewTodo.jsx";
import UpdatePage from "./pages/UpdatePage.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import ProtectedRoute from "./pages/security/ProtectedRoute.tsx"
import NewCategory from "./pages/NewCategory.tsx";
function App() {

    const router = createBrowserRouter([
        {
            path: "/",
            element: <LogIn/>
        },
        {
            path: "/signin",
            element:<SignIn/>
        },
        {
            path: "/home",
            element:<ProtectedRoute><MainPage/></ProtectedRoute>
        },
        {
            path: "/newtodo",
            element:<ProtectedRoute><NewTodo/></ProtectedRoute>
        },
        {
            path: "/newcategory",
            element:<ProtectedRoute><NewCategory/></ProtectedRoute>
        },
        {
            path: "/home/:id",
            element:<ProtectedRoute><UpdatePage/></ProtectedRoute>
        },
        {
            path: "/home/userprofile",
            element:<ProtectedRoute><UserProfile/></ProtectedRoute>
        },

    ])

  return (
      <RouterProvider router={router}/>
  )
}

export default App
