import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CreateReadyCheckPage from './pages/Create';
import LiveReadyCheck from './pages/LiveReadyCheck';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './pages/Login';
import SignUpPage from './pages/Signup';

function App() {
    return (
        <Router>
            <Header />
            <Switch>
                <Route exact path="/" page={Home} />
                <Route exact path="/create" component={CreateReadyCheckPage} />
                <Route path="/rsvp/:id" page={LiveReadyCheck} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
            </Switch>
            <Footer />
        </Router>
    );
}

export default App;
