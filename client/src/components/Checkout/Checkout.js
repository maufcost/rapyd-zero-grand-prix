import React from 'react';
import Price from 'crypto-price';
import axios from 'axios';
import { navigate } from '@reach/router';

import { IMAGE, VIDEO, CUSTOM, NATIVE, DOMAIN } from '../../utils';
import DefaultStoreImage from '../../assets/me.gif';
import DefaultStoreBanner from '../../assets/arabic-coffee-banner.jpeg';
import DefaultProd from '../../assets/coffee-prod.gif';
import DefaultProd2 from '../../assets/coffee2.jpeg';
import DefaultProd3 from '../../assets/coffee3.png'
import DefaultUser from '../../assets/default-user.png';
import ShoppingCart from '../../assets/shopping-cart.svg';
import Loading from '../Loading/Loading';
import RapydZeroLogo from '../../assets/rzero.svg';

import './Checkout.css';

class Checkout extends React.Component {
    constructor(props) {
        super(props);

        // this.state = {};
        this.state = {
            paymentCurrency: '$', // By default
            selectedImage: null,
            selectedBanner: null,
            user: {
                email: 'michaelscott@dundermifflin.com',
                displayName: 'Michael Scott',
                balanceNative: 100,
                balanceBTC: 0.00001,
                balanceETH: 0.000025,
                store: {
                    displayName: 'Arabic Coffee by MC',
                    storeProfileImage: DefaultStoreImage,
                    storeProfileImageType: IMAGE,
                    storeBannerImage: DefaultStoreBanner,
                    storeProfileVideo: null,
					products: [
                        {
                            price: 25.00,
                            displayName: 'Hazelnut Arabic Beans',
                            description: 'Taste it and be your best self ☕',
                            image: DefaultProd
                        },
                        {
                            price: 35.45,
                            displayName: 'Cinnamon Arabic Beans',
                            description: 'Just the right amount of cinnamon and sugar 👨‍🍳 ☕',
                            image: DefaultProd2
                        },
                        {
                            price: 19.99,
                            displayName: 'Original Arabic Beans',
                            description: 'Going traditional is always a great idea ☕',
                            image: DefaultProd3
                        }
                    ]
                }
            },
            email: '',
            pk: '',
			paymentSuccessful: false,
            selectedProduct: 0,
            loading: true,
			loadingPay: false,
            currentDollarToBTCPrice: null,
            currentDollarToETHPrice: null
        };

        this.processPurchase = this.processPurchase.bind(this);
        this.fromDollarToBTC = this.fromDollarToBTC.bind(this);
        this.fromDollarToETH = this.fromDollarToETH.bind(this);
		this.handleProductSelection = this.handleProductSelection.bind(this);
        this.handlePaymentCurrencyChange = this.handlePaymentCurrencyChange.bind(this);
    }

    componentDidMount() {
        this.setState({ loading: false });
    }

	handleProductSelection(e) {
        this.setState({ selectedProduct: e.target.value });
    }

    // Sending a purchase request to our node.js server.
    async processPurchase(e) {
        e.preventDefault();
        this.setState({ loadingPay: true });

        let amount = this.state.user.store.products[this.state.selectedProduct].price // In native currency (USD)
        if (this.state.paymentCurrency === 'BTC') {
            amount = this.state.currentDollarToBTCPrice;
        } else if (this.state.paymentCurrency === 'ETH') {
            amount = this.state.currentDollarToETHPrice;
        }

        // The amount is sent based on the selected payment currency type.
        // If BTC selected, then the amount sent will be in BTC
        await axios.get(`${DOMAIN}/process-payment`, {
            paymentCurrency: this.state.paymentCurrency,
            amount
        })
		.then(res => {
			console.log(res);
		});

		// @WARNING: For testing purposes only:
		// setTimeout(() => {
		// 	navigate('https://sandboxcheckout.rapyd.net?token=checkout_0e110b8b10eec1b311377888cf3f229d')
		// }, 3000);

        // this.setState({ loadingPay: false });
        // Redirecting user to success page with data about the purchased product
        // and its store.
        navigate('/success', {
            state: {
                storeDisplayName: this.state.user.store.displayName,
                product: this.state.user.store.products[this.state.selectedProduct],
                paymentCurrency: this.state.paymentCurrency,
                amount,
                storeProfileImage: DefaultStoreImage,
                storeBanner: DefaultStoreBanner,
                pk: this.state.pk
            }
        })
    }

    fromDollarToBTC(price) {
        this.setState({ loading: true });
        // Converts USD to BTC
        Price.getCryptoPrice('USD', 'BTC').then(obj => {
            // 1 BTC === obj.price USD
            console.log(price/obj.price)
            this.setState({ loading: false, currentDollarToBTCPrice: (price / obj.price).toFixed(6) });
        }).catch(err => console.log(err));
    }

    fromDollarToETH(price) {
        this.setState({ loading: true });
        // Converts USD to ETH
        Price.getCryptoPrice('USD', 'ETH').then(obj => {
            // 1 ETH === obj.price USD
            console.log(price/obj.price)
            this.setState({ loading: false, currentDollarToETHPrice: (price / obj.price).toFixed(6) });
        }).catch(err => console.log(err));
    }

    handlePaymentCurrencyChange(currency) {
        this.setState({ paymentCurrency: currency });

        // Price in the native currency (USD).
        const price = this.state.user.store.products[this.state.selectedProduct].price;
        if (currency === 'BTC') {
            this.fromDollarToBTC(price);
        } else if (currency === 'ETH') {
            this.fromDollarToETH(price);
        } else {
            // Native currency ($ -> USD)
        }
    }

    render() {
        // Building the store's product options.
        let options = [];
        if (this.state.user.store && this.state.user.store.products.length > 0) {
            options = this.state.user.store.products.map((product, ix) => {
                return <option key={ix} value={ix}>{product.displayName}</option>
            });

            options.push(
                <option key={this.state.user.store.products.length} value={CUSTOM}>
                    Custom value
                </option>
            );
        }

        return (
            <div className='store-container'>
                <div className='store-checkout'>
                    <header>
                        <div className='banner-wrapper'>
                            {this.state.user.store.storeBannerImage && (
                                <img src={this.state.user.store.storeBannerImage} alt='Store banner' />
                            )}
                        </div>

                        {this.state.user.store.storeProfileImageType === IMAGE &&
                         this.state.user.store.storeProfileImage && (
                             <div className='circle'>
                                <div className='store-profile-image-wrapper'>
                                    <img className='store-profile-image' src={this.state.user.store.storeProfileImage} alt='Store' />
                                </div>
                             </div>
                        )}

                        {this.state.user.store.storeProfileImageType === IMAGE &&
                         !this.state.user.store.storeProfileImage && (
                            <div className='store-no-image'></div>
                        )}

                        <footer className='header-footer-checkout'>
                            <h2 className='store-display-name-checkout'>
								{this.state.user.store.displayName}
							</h2>
							<span>Created by <img src={DefaultUser} className='user-pic' alt='User' /> Mauricio Costa</span>
                        </footer>
                    </header>
                    <main>
                        <div className='store-main-left'>
							<div className='store-main-left-top'>
                            	<select onChange={this.handleProductSelection}>{options}</select>
								<img className='cart' src={ShoppingCart} alt='Shopping cart' />
							</div>
                            <div className='product'>
                                <h4>{this.state.user.store.products[this.state.selectedProduct].displayName}</h4>
                                <p className='description'>{this.state.user.store.products[this.state.selectedProduct].description}</p>
                                <p className='price'>
                                    {this.state.loading ? (
                                        <Loading />
                                    ) : (
                                        <span>
                                            {this.state.paymentCurrency}&nbsp;
                                            {this.state.paymentCurrency === '$' && parseInt(this.state.user.store.products[this.state.selectedProduct].price).toFixed(2)}
                                            {this.state.paymentCurrency === 'BTC' && this.state.currentDollarToBTCPrice}
                                            {this.state.paymentCurrency === 'ETH' && this.state.currentDollarToETHPrice}
                                        </span>
                                    )}
                                </p>
                                <img src={this.state.user.store.products[this.state.selectedProduct].image} alt='Product'/>
                            </div>
							<footer className='powered'>
								<p>Powered by <img src={RapydZeroLogo} alt='Rapyd'/></p>
							</footer>
                        </div>
                        <div className='store-main-right'>
                            <label htmlFor='email'>Email</label>
                            <input
                                id='email'
                                type='text'
                                placeholder='E.g. michaelscott@dundermifflin.com'
                                value={this.state.email}
                                onChange={(e) => this.setState({ email: e.target.value })}
                                disabled={this.state.loading}
								autoComplete='off'
                            />
                            {this.state.paymentCurrency !== '$' && (
                                <div className='pk-input-wrapper' style={{ marginTop: '8px' }}>
                                    <label htmlFor='pk'>Wallet's Private Key</label>
                                    <input
                                        id='pk'
                                        type='text'
                                        placeholder='E.g. 3387418aaddb4927209...'
                                        value={this.state.pk}
                                        onChange={(e) => this.setState({ pk: e.target.value })}
                                        disabled={this.state.loading}
										autoComplete='off'
                                    />
                                </div>
                            )}
                            {/* Credit card part -- waiting to have access to Rapyd */}
                            <div className='payment-types' style={{ marginTop: '8px' }}>
                                <input
                                    id='native'
                                    type='radio'
                                    name='currency-type'
                                    value={NATIVE}
                                    onChange={() => this.handlePaymentCurrencyChange('$')}
                                    checked={this.state.paymentCurrency === '$'}
                                    disabled={this.state.loading}
                                />
                                <label htmlFor='native'>{NATIVE}</label>
                                <input
                                    id='BTC'
                                    type='radio'
                                    name='currency-type'
                                    value='BTC'
                                    onChange={() => this.handlePaymentCurrencyChange('BTC')}
                                    checked={this.state.paymentCurrency === 'BTC'}
                                    disabled={this.state.loading}
                                />
                                <label htmlFor='BTC'>BTC</label>
                                <input
                                    id='ETH'
                                    type='radio'
                                    name='currency-type'
                                    value='ETH'
                                    onChange={() => this.handlePaymentCurrencyChange('ETH')}
                                    checked={this.state.paymentCurrency === 'ETH'}
                                    disabled={this.state.loading}
                                />
                                <label htmlFor='ETH'>ETH</label>
                                <button
                                    className='pay-btn'
                                    onClick={this.processPurchase}
                                    disabled={this.state.loading}
                                >
                                {this.state.loadingPay ? (
                                    <Loading />
                                ) : (
                                    <span>
                                        <span id='emoji'>💰</span> &nbsp;Pay {this.state.paymentCurrency}&nbsp;
                                        {this.state.paymentCurrency === '$' && parseInt(this.state.user.store.products[this.state.selectedProduct].price).toFixed(2)}
                                        {this.state.paymentCurrency === 'BTC' && this.state.currentDollarToBTCPrice}
                                        {this.state.paymentCurrency === 'ETH' && this.state.currentDollarToETHPrice}
                                    </span>
                                )}
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        )
    }
}

export default Checkout;
