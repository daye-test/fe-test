import React from 'react';
import PropTypes from 'prop-types';
import s from './HomePage.scss';
import Header from './Header/Header';
import Card from './Card/Card';
import Basket from './Basket/Basket';

class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			retrievedObjet: [],
			cartLength: 0,
			allProductsAdded: [],
			productArray: [],
			dynamicTab: 'home',
		};
		this.handleXml = this.handleXml.bind(this);
		this.productAdded = this.productAdded.bind(this);
		this.navigation = this.navigation.bind(this);
		this.removeAll = this.removeAll.bind(this);
		this.basketObjects = this.basketObjects.bind(this);
		this.addProduct = this.addProduct.bind(this);
		this.removeProduct = this.removeProduct.bind(this);
		this.searchParam = this.searchParam.bind(this);
	}

	componentDidMount() {
		const [products] = this.state.retrievedObjet;
		if (products) {
			this.basketObjects(products);
		}
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (prevState.retrievedObjet !== nextProps.retrievedObjet) {
			return {
				retrievedObjet: [...nextProps.retrievedObjet],
			};
		}
		return null;
	}

	removeAll() {
		this.setState({
			allProductsAdded: [],
			cartLength: 0,
		});
	}

	productAdded(obj) {
		const cartLength = obj.reduce((acc, cur) => cur.quantity + acc, 0);
		this.setState({
			allProductsAdded: obj,
			cartLength,
		});
	}

	removeProduct(product) {
		const choosedProduct = this.state.productsAddeds.find(p => p.id === product.id);
		const stateWithoutProduct = this.state.productsAddeds.filter(p => p.id !== product.id);
		const canRemoveOne = choosedProduct && choosedProduct.quantity - 1 > 0;
		if (canRemoveOne) {
			const objDif = Object.assign({}, choosedProduct, {
				quantity: choosedProduct.quantity - 1,
			});
			this.setState({
				productsAddeds: [].concat(stateWithoutProduct).concat([objDif]),
			}, () => {
				this.productAdded(this.state.productsAddeds);
			});
		} else {
			this.setState({
				productsAddeds: stateWithoutProduct,
			}, () => {
				this.productAdded(stateWithoutProduct);
			});
		}
	}

	addProduct(product) {
		const choosedProduct = this.state.productArray.find(p => p.id === product.id);
		if (choosedProduct) {
			const alreadyAdded = this.state.allProductsAdded.filter(p => p.id === product.id);
			if (alreadyAdded.length === 0) {
				const objDif = Object.assign({}, choosedProduct, {
					quantity: choosedProduct.quantity + 1,
				});
				this.setState({
					productsAddeds: [].concat(this.state.allProductsAdded).concat([objDif]),
				}, () => {
					this.productAdded(this.state.productsAddeds);
				});
			} else {
				const differentAdded = this.state.allProductsAdded.filter(p => p.id !== product.id);
				const retrieveAdded = this.state.productsAddeds.filter(p => p.id === product.id);
				const modfiedObj = Object.assign({}, retrieveAdded[0], {
					quantity: retrieveAdded[0].quantity + 1,
				});
				this.setState({
					productsAddeds: [].concat(differentAdded).concat([modfiedObj]),
				}, () => {
					this.productAdded(this.state.productsAddeds);
				});
			}
		}
	}

	navigation(id, obj) {
		if (id) {
			this.setState({
				dynamicTab: id,
			}, () => {
				if (obj) {
					this.productAdded(obj);
				}
			});
		}
	}

	basketObjects(products) {
		if (products && products.length > 0) {
			const productFArray = products.map(cv => Object.assign({}, {
				quantity: 0,
				currency: cv.currency,
				price: cv.price,
				productImage: cv.productImage,
				tapons: cv.tapons
					&& typeof cv.tapons !== 'string'
					? Object.assign([], cv.tapons)
					: cv.tapons
					&& typeof cv.tapons === 'string'
						? this.handleXml(cv.tapons)
						: this.handleXml(cv.tampons),
			}));
			const refactorProducts = productFArray.map(cv => cv.tapons.map(pv => Object.assign({}, {
				quantity: cv.quantity,
				currency: cv.currency,
				price: cv.price,
				productImage: cv.productImage,
				size: pv.size,
				amount: pv.amount,
				coating: pv.coating === 'none' ? 'Tampon common' : 'Tampon CBD',
			})));
			const finalObject = [];
			let counter = 0;
			refactorProducts.map(cv => cv.map((pv) => {
				const newObject = Object.assign({}, pv, {
					id: counter,
				});
				counter += 1;
				return finalObject.push(newObject);
			}));
			if (JSON.stringify(finalObject) !== JSON.stringify(this.state.productArray)) {
				this.setState({
					productArray: finalObject,
				});
			}
		}
	}

	searchParam(e) {
		if (e) {
			if (isNaN(e.target.value)) {
				const [products] = this.state.retrievedObjet;
				const fullString = e.target.value.toLowerCase();
				this.basketObjects(products);
				setTimeout(() => {
					const filtered = this.state.productArray.filter(cv => 
						String(cv.coating).toLowerCase().indexOf(fullString) > -1
						|| String(cv.size).toLowerCase().indexOf(fullString) > -1);
					this.setState({
						productArray: filtered,
					});
				}, 100);
			} else {
				const [products] = this.state.retrievedObjet;
				const integerNumber = Number.parseInt(e.target.value);
				this.basketObjects(products);
				setTimeout(() => {
					const filtered = this.state.productArray.filter(cv => 
						String(cv.price).indexOf(String(integerNumber)) > -1);
					this.setState({
						productArray: filtered,
					});
				}, 100);
			}
		}
	}

	handleXml(xml) {
		const emptyTapon = [];
		const responseParser = new DOMParser().parseFromString(xml, 'application/xml');
		const tampons = responseParser.getElementsByTagName('tampon');
		for (let i = 0; i < tampons.length; i += 1) {
			const tapons = {
				size: tampons[i].getElementsByTagName('size')[0].textContent,
				coating: tampons[i].getElementsByTagName('coating')[0].textContent,
				amount: Number.parseInt(tampons[i].getElementsByTagName('amount')[0].textContent),
			};
			emptyTapon.push(tapons);
		}
		return emptyTapon;
	}

	render() {
		const [products] = this.state.retrievedObjet;
		if (this.state.dynamicTab === 'home') {
			return (
				<section>
					<Header
						cartLength={this.state.cartLength}
						navigation={this.navigation}
						allProducts={this.state.allProductsAdded}
					/>
					<div className={`${s.productcontainer} ${s.bggrey}`}>
						<section className={s.spanPosition}>
							<span>{products && products.length > 0 ? products.length : '0'} products found</span>
						</section>
						<div className="form-group">
							<div className="col-12 w-100 pb-3">
								<input
									type="search"
									onChange={(e) => {
										if (e.target.value === '') {
											const [reloadProd] = this.state.retrievedObjet;
											if (reloadProd) {
												this.basketObjects(reloadProd);
											}
										} else {
											this.searchParam(e);
										}
									}}
									className="form-control w-50 mx-auto"
									id="pwd"
									placeholder="Search by: Name, Size or Price"
									name="pwd"
								/>
							</div>
						</div>
						<section className={`${s.gproducts}`}>
							<Card
								addProduct={this.addProduct}
								finalProduct={[this.state.productArray]}
							/>
						</section>
					</div>
				</section>
			);
		} if (this.state.dynamicTab === 'basket') {
			return (
				<section>
					<Header
						cartLength={this.state.cartLength}
						navigation={this.navigation}
						allProducts={this.state.allProductsAdded}
					/>
					<Basket
						addProduct={this.addProduct}
						removeProduct={this.removeProduct}
						removeAll={this.removeAll}
						allProducts={this.state.allProductsAdded}
					/>
				</section>
			);
		}
		return '';
	}
}

HomePage.propTypes = {
	retrievedObjet: PropTypes.arrayOf(PropTypes.any),
};

HomePage.defaultProps = {
	retrievedObjet: [],
};

export default HomePage;
