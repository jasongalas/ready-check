import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
// import LiveReadyCheck from './pages/LiveReadyCheck';
import Home from './pages/Home.jsx';
// import LoginPage from './pages/Login.jsx';
// import SignUpPage from './pages/Signup';
// import ProfilePage from './pages/ProfilePage.jsx'

const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        children: [
            {
                index: true,
                element: <Home/>,
            },
            // {
            //     path: '/login',
            //     element: <LoginPage/>,
            // },
            // {
            //     path: '/signup',
            //     element: <SignUpPage/>,
            // },
            // {
            //     path: `/readycheck/:id`,
            //     element: <LiveReadyCheck/>,
            // },
            // {
            //     path: '/profile/:id',
            //     element: <ProfilePage/>
            // },
            // {
            //     path: '/myprofile',
            //     element: <ProfilePage/>
            // }
        ]
    }
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router = {router}/>
)