import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CreateReadyCheckPage from './pages/CreateReadyCheckPage';
import RSVP from './pages/RSVP';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
    return (
        <Router>
            <Header />
            <Switch>
                <Route exact path="/" page={Home} />
                <Route exact path="/create" component={CreateReadyCheckPage} />
                <Route path="/rsvp/:id" page={RSVP} />
            </Switch>
            <Footer />
        </Router>
    );
}

export default App;
