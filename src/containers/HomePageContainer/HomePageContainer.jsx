import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { API_URL } from '../../constants/config';
import { retrieveDayeProducts } from '../../actions';
import HomePage from '../../components/HomePage/HomePage';
import loadingImg from '../../../static/loadingImage.gif';

class HomePageContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loaded: false,
			retrievedObjet: [],
		};
	}

	componentDidMount() {
		// this.props.retrieveDayeProducts();
		fetch(API_URL)
			.then((response) => {
				if (response.status !== 200) {
					console.log(`Looks like there was a problem. Status Code:  ${response.status}`);
					return;
				}
				response.json().then((data) => {
					this.setState({
						retrievedObjet: [...this.state.retrievedObjet, data],
						loaded: true,
					});
				});
			})
			.catch((error) => {
				console.log(`Fetch Error :-S, ${error}`);
			});
	}

	render() {
		if (this.state.loaded) {
			return <HomePage retrievedObjet={this.state.retrievedObjet} />;
		}
		return (
			<section className="w-100 text-center pt-5 mt-5">
				<object alt="Loading" aria-label="Loading" className="mt-5" width="200" height="200" data={loadingImg} />
			</section>
		);
	}
}

HomePageContainer.propTypes = {
	retrieveDayeProducts: PropTypes.func.isRequired,
};

HomePageContainer.defaultProps = {
	dayeproduct: null,
};

function mapStateToProps(state) {
	return {
		dayeproduct: state.get('dayeproduct').toJS(),
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		retrieveDayeProducts,
	}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePageContainer);
