import React from 'react';

class SignOut extends React.Component {
	render() {
		return (
			<div className='sign-out'>
				<p>You have been successfully signed out. We hope to see you soon 😊</p>
				<small>
					This is just a demo and your account is a demo account (i.e. no authentication has been involved
					just yet). All addresses and payments have been recorded, but they don't yet represent real money for
					safety reasons and for the purposes of the Rapyd Hackathon.
				</small>
			</div>
		)
	}
}

export default SignOut;
