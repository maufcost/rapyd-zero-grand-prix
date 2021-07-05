import React from 'react';
import { navigate } from '@reach/router';

import RapydZeroLogo from '../../assets/rzero2.svg';
import DefaultUser from '../../assets/default-user-2.png';

import './Header.css';

class Header extends React.Component {
    render() {
        return (
            <div className='header-container'>
                <div className='header'>
                    <img src={RapydZeroLogo} className='logo' alt='Rapyd X' />
                    <div className='nav'>
                        <button id='home-btn' onClick={() => navigate('/')}>Home</button>
                        <button
							className='special'
							onClick={() => window.open(this.props.storeLink)}
						>
							<img src={DefaultUser} className='user-pic' alt='User' />
							Preview My Store
						</button>
                        <button onClick={() => navigate('/see-you-soon')}>Sign out</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Header;
