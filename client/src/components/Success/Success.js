import React from 'react';
import { navigate } from '@reach/router';

import './Success.css'

class Success extends React.Component {
	render() {
		console.log(this.props.location.state)
		// Parsing data from purchased product and its store.
		const curr = this.props.location.state.paymentCurrency;
		const amount = this.props.location.state.amount
		const productDisplayName = this.props.location.state.product.displayName;

		return (
			<div className='success-container'>
				<div className='success'>
					<header>
						<div className='banner-wrapper'>
							{this.props.location.state.storeBanner && (
								<img src={this.props.location.state.storeBanner} alt='Store banner' />
							)}
						</div>

						{this.props.location.state.storeProfileImage && (
							 <div className='circle'>
								<div className='store-profile-image-wrapper'>
									<img
										className='store-profile-image'
										src={this.props.location.state.storeProfileImage}
										alt='Store'
									/>
								</div>
							 </div>
						)}

						{!this.props.location.state.storeProfileImage && (
							<div className='store-no-image'></div>
						)}

						<footer className='header-footer-checkout'>
							<h2 className='store-display-name-checkout'>{this.props.location.state.storeDisplayName}</h2>
						</footer>
					</header>
					<section>
						<p>
							Congratulations! 🎉
							You just bought {productDisplayName} for {curr}&nbsp;{amount} from&nbsp;
							{this.props.location.state.storeDisplayName}
						</p>
						<small>We emailed your receipt to your email. Have a wonderful day!</small>
						<br />
						<button onClick={() => navigate('/')}>Explore more products</button>
					</section>
				</div>
			</div>
		)
	}
}

export default Success;
