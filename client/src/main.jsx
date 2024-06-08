import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
// import LiveReadyCheck from './pages/LiveReadyCheck';
import Home from './pages/Home.jsx';
import LoginPage from './pages/Login.jsx';
import SignUpPage from './pages/Signup';
import Profile from './pages/ProfilePage.jsx'
import Social from './pages/Social.jsx';
import ReadyCheck from './pages/LiveReadyCheck.jsx';
import ReadyCheckList from './pages/ReadyCheckList.jsx';
import FriendProfile from './pages/FriendProfile.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        children: [
            {
                index: true,
                element: <Home/>
            },
            {
                path: '/login',
                element: <LoginPage/>
            },
            {
                path: '/signup',
                element: <SignUpPage/>,
            },
            {
                path: '/myprofile',
                element: <Profile/>
            },
            {
                path: '/social',
                element: <Social/>
            },
            {
                path: '/readycheck/:id',
                element: <ReadyCheck/>
            },
            {
                path: `/readychecks`,
                element: <ReadyCheckList/>,
            },
            {
                path: '/profile/:id',
                element: <FriendProfile/>
            },
            
        ]
    }
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router = {router}/>
)