import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CreateReadyCheckPage from './pages/Create';
import LiveReadyCheck from './pages/LiveReadyCheck';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './AuthContext';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <AuthProvider>
            <Router>
                <Header />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/create" component={CreateReadyCheckPage} />
                    <Route path="/rsvp/:id" component={LiveReadyCheck} />
                </Switch>
                <Footer />
            </Router>
        </AuthProvider>
    );
}

export default App;
