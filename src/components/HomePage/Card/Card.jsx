import React from 'react';
import PropTypes from 'prop-types';
import s from './Card.scss';

class Card extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			finalProduct: this.props.finalProduct ? this.props.finalProduct : undefined,
		};
		this.parsePrice = this.parsePrice.bind(this);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (prevState.finalProduct !== nextProps.finalProduct) {
			return {
				finalProduct: [...nextProps.finalProduct],
			};
		}
		return null;
	}

	parsePrice(p) {
		return p.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' });
	}

	render() {
		const [products] = this.state.finalProduct;
		if (products && products.length > 0) {
			return products.map((cv, ind) => (
				<div key={ind} className={s.cproduct}>
					<img alt="Simple product" src={cv.productImage} />
					<footer>
						<h3>{cv.coating}</h3>
						<h3><strong>Size:</strong> {cv.size}</h3>
						<h3><strong>Amount:</strong> {cv.amount}</h3>
						<div className={s.cprice}>
							<span>{this.parsePrice(cv.price)}</span>
						</div>
						<button onClick={() => this.props.addProduct(cv)}>
								Add to the cart
						</button>
					</footer>
				</div>
			));
		}
		return '';
	}
}

Card.propTypes = {
	addProduct: PropTypes.func.isRequired,
	finalProduct: PropTypes.arrayOf(PropTypes.any),
};

Card.defaultProps = {
	finalProduct: [],
};

export default Card;
