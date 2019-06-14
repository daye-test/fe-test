import React from 'react';
import PropTypes from 'prop-types';
import s from './Header.scss';

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cartLength: this.props.cartLength ? this.props.cartLength : 0,
			basketActive: false,
			allProducts: this.props.allProducts ? this.props.allProducts : [],
		};
		this.toggleNav = this.toggleNav.bind(this);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (prevState.cartLength
				!== nextProps.cartLength
				|| prevState.allProducts
				!== nextProps.allProducts) {
			return {
				allProducts: nextProps.allProducts,
				cartLength: nextProps.cartLength,
			};
		}
		return null;
	}

	toggleNav(e) {
		if (e && e.target) {
			this.props.navigation(e.target.id, this.state.allProducts);
			this.setState({
				basketActive: e.target.id === 'basket',
			});
		}
	}

	render() {
		return (
			<section>
				<nav className={s.topnav} id="myTopnav">
					<img alt="Daye Logo" onClick={(e) => { this.toggleNav(e); }} id="home" className={s.cursorPointer} width="110" src="https://daye.cdn.prismic.io/daye/6fdbc3afdb4959f982fc2193d5334d67b8e56c03_fav310x150.png" />
					<a id="basket" className={this.state.basketActive ? s.basketActive : ''} onClick={(e) => { this.toggleNav(e); }} href="javascript:void(0)">Basket <strong>({this.state.cartLength})</strong></a>
					<a id="home" onClick={(e) => { this.toggleNav(e); }} href="javascript:void(0)">Home</a>
				</nav>
			</section>
		);
	}
}

Header.propTypes = {
	cartLength: PropTypes.number,
	navigation: PropTypes.func.isRequired,
	allProducts: PropTypes.arrayOf(PropTypes.any),
};

Header.defaultProps = {
	cartLength: 0,
	allProducts: [],
};

export default Header;
