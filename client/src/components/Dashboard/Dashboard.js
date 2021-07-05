import React from 'react';
import Price from 'crypto-price';
import axios from 'axios';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Header from '../Header/Header';
import Stats from '../Stats/Stats';
import Loading from '../Loading/Loading';

import { IMAGE, VIDEO, CUSTOM, NATIVE, ROOT, DOMAIN } from '../../utils';
import DefaultStoreImage from '../../assets/me.gif';
import DefaultStoreBanner from '../../assets/arabic-coffee-banner.jpeg';
import DefaultProd from '../../assets/coffee-prod.gif';
import DefaultProd2 from '../../assets/coffee2.jpeg';
import DefaultProd3 from '../../assets/coffee3.png'
import ShoppingCart from '../../assets/shopping-cart.svg';
import RapydZeroLogo from '../../assets/rzero.svg';

import './Dashboard.css';

// To fetch:

// User's display name
// User's email
// storeId
// Balance in native currency
// Balance in bitcoin
// Balance in Ether

// Store profile image type (image or video)
// Store profile image src
// Store products (to fill the options in the <select>)
// Each store product should have a price, display name, description, and image

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        // this.state = {};

		// Mock store
        this.state = {
            paymentCurrency: '$', // By default
            selectedImage: null,
            selectedBanner: null,
            user: {
                email: 'michaelscott@dundermifflin.com',
<<<<<<< HEAD
                displayName: 'Marcus Figs',
                balanceNative: 422.09,
                balanceBTC: 0.00072,
                balanceETH: 0.0185,
=======
                displayName: 'Mauricio Costa',
                balanceNative: 131.92,
                balanceBTC: 0.00001,
                balanceETH: 0.000025,
>>>>>>> efe09a97b8cd5e453320e300add028a711c17caf
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
            selectedProduct: 0,
            loading: true,
			loadingDisburse: false,
			transferSuccess: false,
            openAddNewProductSection: false,
            addProductName: '',
            addProductDescription: '',
            addProductPrice: 1,
            copied: false,
			bankAccountNumber: '',
			rapydWalletNumber: '',
			transferAmount: '',
            currentDollarToBTCPrice: null,
            currentDollarToETHPrice: null
        };

		this.closeAdd = this.closeAdd.bind(this);
        this.saveStore = this.saveStore.bind(this);
        this.getStoreLink = this.getStoreLink.bind(this);
		this.transferMoney = this.transferMoney.bind(this);
        this.fromDollarToBTC = this.fromDollarToBTC.bind(this);
        this.fromDollarToETH = this.fromDollarToETH.bind(this);
        this.addProductToStore = this.addProductToStore.bind(this);
        this.handleAddStoreImage = this.handleAddStoreImage.bind(this);
        this.handleAddStoreBanner = this.handleAddStoreBanner.bind(this);
        this.handleProductSelection = this.handleProductSelection.bind(this);
        this.handleStoreImageSubmission = this.handleStoreImageSubmission.bind(this);
        this.handleStoreBannerSubmission = this.handleStoreBannerSubmission.bind(this);
        this.handlePaymentCurrencyChange = this.handlePaymentCurrencyChange.bind(this);
    }

    componentDidMount() {
        this.setState({ loading: false });
    }

    handleProductSelection(e) {
        this.setState({ selectedProduct: e.target.value });
    }

    saveStore() {}

    handleStoreImageSubmission(e) {
        const files = e.target.files;
        if (files && typeof files !== 'undefined' && files.length > 0) {
            const file = files[0];
			this.setState({ storeProfileImage: file });
        }
    }

    handleStoreBannerSubmission(e) {
        const files = e.target.files;
        if (files && typeof files !== 'undefined' && files.length > 0) {
            const file = files[0];
			this.setState({ storeBannerImage: file });
        }
    }

    handleAddStoreImage() {}

    handleAddStoreBanner() {}

	closeAdd() {
		this.setState({ openAddNewProductSection: false });
	}

    // Generates a compact store link based on the user's store name.
    getStoreLink() {
        const name = this.state.user.store.displayName.split(" ");
        let n = '';
        for (let i = 0; i < name.length; i++) {
            for (let j = 0; j < name[i].length; j++) {
                n += name[i][j].toLowerCase();
            }
        }
        return `${ROOT}/store/${n}`;
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

    // Adds a product to the user's store.
    addProductToStore() {
        if (this.state.addProductName.trim() !== '' && this.state.addProductDescription.trim() !== '') {
            let products = this.state.user.store.products;
            products.push({
                price: this.state.addProductPrice,
                displayName: this.state.addProductName.trim(),
                description: this.state.addProductDescription.trim(),
                image: DefaultProd
            });
            this.setState({
                user: {
                    store: { ...this.state.user.store, products },
                    ...this.state.user
                },
				addProductName: '',
				addProductDescription: '',
				addProductPrice: 0,
				openAddNewProductSection: false
            });
        }
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

<<<<<<< HEAD
	async transferMoney() {
		this.setState({ loadingDisburse: true });
		await axios.get(`${DOMAIN}/disburse`, {
            paymentCurrency: this.state.paymentCurrency,
            amount: this.state.amound
        })
		.then(res => {
			// console.log(res);
			// Update state of disburse if successful.
=======
	transferMoney() {
		this.setState({ loadingDisburse: true });
		setTimeout(() => {
>>>>>>> efe09a97b8cd5e453320e300add028a711c17caf
			this.setState({
				loadingDisburse: false,
				transferSuccess: true,
				bankAccountNumber: '',
				rapydWalletNumber: '',
				transferAmount: ''
			});
<<<<<<< HEAD
		});
=======
		}, 3000);
>>>>>>> efe09a97b8cd5e453320e300add028a711c17caf
	}

    render() {
        // Creating the <option>s for the store.
        let options = [], yourProducts = [];
        if (this.state.user && this.state.user.store && this.state.user.store.products.length > 0) {
            options = this.state.user.store.products.map((product, ix) => {
                return <option key={ix} value={ix}>{product.displayName}</option>
            });

            options.push(
                <option key={this.state.user.store.products.length} value={CUSTOM}>
                    Custom value
                </option>
            );

            yourProducts = this.state.user.store.products.map((product, ix) => {
                return (
                    <div key={ix} className='added-product'>
                        <span>{product.displayName}</span>
                        <span>{product.description}</span>
                        <span>{product.price}</span>
                    </div>
                )
            });
        }

		let transferBtnClassName = 'transfer-btn';
		transferBtnClassName += this.state.transferSuccess ? ' dg' : '';

        return (
            <div className='dashboard-container'>
                <Header
                    storeLink={this.getStoreLink()}
                />
                <div className='dashboard'>

                    {/* Shows a brief greeting + user balances */}
                    <div className='greetings'>
                        <h2 className='welcome'>Welcome back 👋</h2>
						<h2 className='name'>{this.state.user.displayName}</h2>
						<main className='greetings-main'>
	                        <div className='balances'>
								<h3>Your store balance is:</h3>
								<section>
		                            <div className='balance'>
		                                <span>Your native currency <span className='curr'>USD</span></span>
		                                <p>${parseInt(this.state.user.balanceNative).toFixed(2)}</p>
		                            </div>
		                            <div className='balance'>
		                                <span>Bitcoin balance <span className='curr'>BTC</span></span>
		                                <p>BTC {this.state.user.balanceBTC}</p>
		                            </div>
		                            <div className='balance'>
		                                <span>Ether balance <span className='curr'>ETH</span></span>
		                                <p>ETH {this.state.user.balanceETH}</p>
		                            </div>
								</section>
	                        </div>
							<Stats />
						</main>
                    </div>

                    {/* Space to edit user's store and add products to the store */}
                    <div className='edit'>
                        <div className='products-added'>
                            <h2>Add new products to your store in real-time</h2>

                            {this.state.openAddNewProductSection ? (
                                <section className='add-products-section'>
                                    <button
                                        className='close-btn'
                                        onClick={this.closeAdd}
                                    >
                                        Close
                                    </button>

                                    <label htmlFor='add-product-display-name'>Name: </label>
                                    <input
                                        id='add-product-display-name'
                                        type='text'
                                        value={this.state.addProductName}
                                        onChange={e => this.setState({ addProductName: e.target.value })}
                                        placeholder='Cat Box Pro 2000'
										autoComplete='off'
                                    ></input>

                                    <label htmlFor='add-product-description'>Description: </label>
                                    <input
                                        id='add-product-description'
                                        type='text'
                                        value={this.state.addProductDescription}
                                        onChange={e => this.setState({ addProductDescription: e.target.value })}
                                        placeholder='The only one you will ever need'
										autoComplete='off'
                                    ></input>

                                    <label htmlFor='add-product-price'>Price $</label>
                                    <input
                                        id='add-product-price'
                                        type='number'
                                        value={this.state.addProductPrice}
                                        onChange={e => this.setState({ addProductPrice: e.target.value })}
                                        min='1'
										autoComplete='off'
                                    ></input>
									<button className='add-product-btn' onClick={this.handleAddStoreImage}>Add product image </button>
                                    <button className='add-product-btn' onClick={this.addProductToStore}>🤘 Add product</button>
                                </section>
                            ) : (
                                <button onClick={() => this.setState({ openAddNewProductSection: true })}>Add a new product to my store</button>
                            )}

                            <div className='your-products'>
                                <p>Products you have already added</p>
                                <div className='your-products-list'>{yourProducts}</div>
                            </div>
                        </div>

                        <div className='edit-header'>
                            <h3>Customize your store</h3>
                            <p>It's a great idea to customize your store before sending your personal link to your customers</p>
                        </div>

                        <div className='store'>
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

                                <footer className='header-footer'>
                                    <h2 className='store-display-name'>{this.state.user.store.displayName}</h2>

                                    <div className='buttons'>
                                        <button className='btn-add-store-image' onClick={this.handleAddStoreImage}>
                                            {this.state.selectedImage ? (
                                                <span>✅ Profile image selected</span>
                                            ) : (
                                                <span>Add store's profile image</span>
                                            )}
                                            <input type='file' onChange={this.handleStoreImageSubmission} />
                                        </button>

                                        <button className='btn-add-store-image' onClick={this.handleAddStoreBanner}>
                                            {this.state.selectedBanner ? (
                                                <span>✅ Banner selected</span>
                                            ) : (
                                                <span>Add store banner</span>
                                            )}
                                            <input type='file' onChange={this.handleStoreBannerSubmission} />
                                        </button>

                                        <CopyToClipboard text={this.getStoreLink()}
                                            onCopy={() => this.setState({ copied: true })}>
                                            <button>
                                                {this.state.copied ? (
                                                    <span>✅ Store link copied</span>
                                                ) : (
                                                    <span>Get store link</span>
                                                )}
                                            </button>
                                        </CopyToClipboard>

                                        <button onClick={this.saveStore}>Save store</button>
                                    </div>
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
                                        disabled
										autoComplete='off'
                                    />
                                    {/* Credit card part -- waiting to have access to Rapyd */}
                                    <div className='payment-types'>
                                        <input
                                            id='native'
                                            type='radio'
                                            name='currency-type'
                                            value={NATIVE}
                                            onChange={() => this.handlePaymentCurrencyChange('$')}
                                            checked={this.state.paymentCurrency === '$'}
                                        />
                                        <label htmlFor='native'>{NATIVE}</label>
                                        <input
                                            id='BTC'
                                            type='radio'
                                            name='currency-type'
                                            value='BTC'
                                            onChange={() => this.handlePaymentCurrencyChange('BTC')}
                                            checked={this.state.paymentCurrency === 'BTC'}
                                        />
                                        <label htmlFor='BTC'>BTC</label>
                                        <input
                                            id='ETH'
                                            type='radio'
                                            name='currency-type'
                                            value='ETH'
                                            onChange={() => this.handlePaymentCurrencyChange('ETH')}
                                            checked={this.state.paymentCurrency === 'ETH'}
                                        />
                                        <label htmlFor='ETH'>ETH</label>
                                        <button className='pay-btn' onClick={e => e.preventDefault()}>
                                            {this.state.loading ? (
                                            	<Loading />
                                            ) : (
                                                <span>
                                                    💰 &nbsp;Pay {this.state.paymentCurrency}&nbsp;
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
						<div className='disburse'>
							<h2>Disburse now</h2>
							<p>Register your bank account and transfer money from your Rapyd wallet and store balance.</p>
							<section>
								<div>
									<label>Bank account #:</label>
									<input
										value={this.state.bankAccountNumber}
										type='text'
										onChange={e => this.setState({ bankAccountNumber: e.target.value })}
										autoComplete='off'
									/>
								</div>
								<div>
									<label>Rapyd wallet #:</label>
									<input
										value={this.state.rapydWalletNumber}
										type='text'
										onChange={e => this.setState({ rapydWalletNumber: e.target.value })}
										autoComplete='off'
									/>
									<small>Don't worry! We automatically generated one for you.</small>
								</div>
								<div>
									<label>Amount:</label>
									<input
										value={this.state.transferAmount}
										type='text'
										onChange={e => this.setState({ transferAmount: e.target.value })}
										autoComplete='off'
									/>
								</div>
								<button
									className={transferBtnClassName}
									onClick={this.transferMoney}
								>
									{this.state.loadingDisburse ? (
										<Loading />
									) : (
										<p>
											{this.state.transferSuccess ? (
												<span>Transfer Succeeded ✅</span>
											) : (
												<span>Transfer</span>
											)}
										</p>
									)}
								</button>
							</section>
						</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Dashboard;
