import React from 'react';
import PropTypes from 'prop-types';
import s from './Basket.scss';
import ItemProduct from './ItemProduct/ItemProduct';

class Basket extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			allProducts: this.props.allProducts ? this.props.allProducts : [],
		};
		this.priceSelector = this.priceSelector.bind(this);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (prevState.allProducts !== nextProps.allProducts) {
			return {
				allProducts: nextProps.allProducts,
			};
		}
		return null;
	}

	priceSelector(cart) {
		const price = cart.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);

		return price.toLocaleString('en-GB', {
			currency: 'GBP',
			style: 'currency',
		});
	}

	render() {
		const total = this.state.allProducts
            && this.state.allProducts.length > 0
			? this.priceSelector(this.state.allProducts) : 0;
		if (!(this.state.allProducts)
            || this.state.allProducts
            && this.state.allProducts.length === 0) {
			return (
				<div className={s.h5align}>
					<h5>There's no products in your basket, please add something :)</h5>
				</div>
			);
		}
		return (
			<section>
				<div className={s.gcontainer}>
					<ul className={s.basketAlign}>
						<ItemProduct
							removeProduct={this.props.removeProduct}
							addProduct={this.props.addProduct}
							allProducts={this.state.allProducts ? this.state.allProducts : []}
						/>
					</ul>
					<div className={s.carttotal}>
						<button
							className={s.clearAll}
							onClick={() => this.props.removeAll()}
						>
                            Clear All
						</button>
						<button
							className={s.checkoutButton}
							onClick={() => alert('This is a test, you don\'t have real money to buy, sorry.')}
						>
                            Checkout >
						</button>
						<span>Total: <strong>{total}</strong></span>
					</div>
				</div>
			</section>
		);
	}
}

Basket.propTypes = {
	addProduct: PropTypes.func,
	removeProduct: PropTypes.func,
	removeAll: PropTypes.func,
	allProducts: PropTypes.arrayOf(PropTypes.any),
};

Basket.defaultProps = {
	allProducts: [],
};

export default Basket;
