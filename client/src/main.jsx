import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import CreateReadyCheckPage from './pages/Create';
import LiveReadyCheck from './pages/LiveReadyCheck';
import Home from './pages/Home';
import LoginPage from './pages/Login';
import SignUpPage from './pages/Signup';

ReactDOM.createRoot(document.getElementById('root')).render(
<App />
)