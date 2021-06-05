import React from 'react';
import { Router } from '@reach/router';

import Dashboard from './components/Dashboard/Dashboard';
import Checkout from './components/Checkout/Checkout';
import Success from './components/Success/Success';
import SignOut from './components/SignOut/SignOut';

import './App.css';

class App extends React.Component {
    render() {
        return (
            <div className='App'>
                <Router>
                    <Dashboard path='/' />
                    <Checkout path='/store/:storeId' />
                    <Success path='/success' />
                    <SignOut path='/see-you-soon' />
                </Router>
            </div>
        )
    }
}

export default App;
