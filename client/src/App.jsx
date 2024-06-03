import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CreateReadyCheckPage from './pages/CreateReadyCheckPage';
import RSVPPage from './pages/RSVPPage';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
    return (
        <Router>
            <Header />
            <Switch>
                <Route exact path="/" component={CreateReadyCheckPage} />
                <Route path="/rsvp/:id" component={RSVPPage} />
            </Switch>
            <Footer />
        </Router>
    );
}

export default App;
