import React from 'react';
import { navigate } from '@reach/router';
import './Header.css';

class Header extends React.Component {
    render() {
        return (
            <div className='header-container'>
                <div className='header'>
                    <img src={null} className='logo' alt='Rapyd X' />
                    <div className='nav'>
                        <button onClick={() => navigate('/')}>Home</button>
                        <button onClick={() => window.open(this.props.storeLink)}>Preview My Store</button>
                        <button onClick={() => navigate('/see-you-soon')}>Sign out</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Header;
