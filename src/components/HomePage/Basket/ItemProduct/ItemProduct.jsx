import React from 'react';
import PropTypes from 'prop-types';
import s from './ItemProduct.scss';

class ItemProduct extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			allProducts: this.props.allProducts ? this.props.allProducts : [],
		};
		this.calculatePrice = this.calculatePrice.bind(this);
		this.removeQuantity = this.removeQuantity.bind(this);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (prevState.allProducts !== nextProps.allProducts) {
			return {
				allProducts: nextProps.allProducts,
			};
		}
		return null;
	}

	calculatePrice(qt, price) {
		return (qt * price).toLocaleString('en-GB', {
			currency: 'GBP',
			style: 'currency',
		});
	}

	removeQuantity(cv, param) {
		const cleanObject = Object.assign({}, cv, {
			quantity: 0,
		});
		if (param === 'add') {
			this.props.addProduct(cleanObject);
		} else {
			this.props.removeProduct(cleanObject);
		}
	}

	render() {
		if (this.state.allProducts && this.state.allProducts.length > 0) {
			const sorted = this.state.allProducts.sort(
				(a, b) => (a.id - b.id) || a.name.localeCompare(b.name),
			);
			return sorted.map((cv, ind) => (
				<li key={ind} className={s.itemproduct}>
					<img src={cv.productImage} alt="product-preview" />
					<span className={s.title}>{cv.coating}</span>
					<span className={s.title}>{`Size: ${cv.size}`}</span>
					<div className={s.controls}>
						<span onClick={() => {
							this.removeQuantity(cv, 'remove');
						}}
						>-
						</span>
						<span>{cv.quantity}</span>
						<span onClick={() => {
							this.removeQuantity(cv, 'add');
						}}
						>+
						</span>
						<span className={s.price}>{this.calculatePrice(cv.quantity, cv.price)}</span>
					</div>
				</li>
			));
		}
		return '';
	}
}

ItemProduct.propTypes = {
	addProduct: PropTypes.func.isRequired,
	removeProduct: PropTypes.func.isRequired,
	allProducts: PropTypes.arrayOf(PropTypes.any),
};

ItemProduct.defaultProps = {
	allProducts: [],
};

export default ItemProduct;
