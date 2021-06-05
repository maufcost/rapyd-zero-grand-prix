import React from 'react';
import Price from 'crypto-price';
import axios from 'axios';
import { navigate } from '@reach/router';

import { IMAGE, VIDEO, CUSTOM, NATIVE } from '../../utils';
import Dog from '../../assets/dog.jpg';
import ShoppingCart from '../../assets/shopping-cart.svg';

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
                    displayName: 'Pet my Pet Clothes',
                    storeProfileImage: Dog,
                    storeProfileImageType: IMAGE,
                    storeBannerImage: Dog,
                    storeProfileVideo: null,
                    products: [
                        {
                            price: 123.45,
                            displayName: 'Product 1',
                            description: 'A description 1',
                            image: Dog
                        },
                        {
                            price: 456.45,
                            displayName: 'Product 2',
                            description: 'A description 2',
                            image: Dog
                        },
                        {
                            price: 789.99,
                            displayName: 'Product 3',
                            description: 'A description 3',
                            image: Dog
                        }
                    ]
                }
            },
            email: '',
            pk: '',
            selectedProduct: 0,
            loading: true,
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
        this.setState({ loading: true });

        let amount = this.state.user.store.products[this.state.selectedProduct].price // In native currency (USD)
        if (this.state.paymentCurrency === 'BTC') {
            amount = this.state.currentDollarToBTCPrice;
        } else if (this.state.paymentCurrency === 'ETH') {
            amount = this.state.currentDollarToETHPrice;
        }

        // The amount is sent based on the selected payment currency type.
        // If BTC selected, then the amount sent will be in BTC
        await axios.get('http://localhost:5000/payment', {
            paymentCurrency: this.state.paymentCurrency,
            amount
        })
		.then(res => {
			console.log(res);
		});

        // this.setState({ loading: false });
        // Redirecting user to success page with data about the purchased product
        // and its store.
        navigate('/success', {
            state: {
                storeDisplayName: this.state.user.store.displayName,
                product: this.state.user.store.products[this.state.selectedProduct],
                paymentCurrency: this.state.paymentCurrency,
                amount,
                storeProfileImage: Dog,
                storeBanner: Dog,
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
                            <h2 className='store-display-name-checkout'>{this.state.user.store.displayName}</h2>
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
                                        <span>Loading...</span>
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
                            <footer>
                                <p>Powered by Rapyd X</p>
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
                                {this.state.loading ? (
                                    <span>Loading...</span>
                                ) : (
                                    <span>
                                        Pay {this.state.paymentCurrency}&nbsp;
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
