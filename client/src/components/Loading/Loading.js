import React from 'react';

import LoadingSVG from '../../assets/loading.svg';

class Loading extends React.Component {
	render() {
		return (
			<span className='loading-container'>
				<img className='lg' src={LoadingSVG} alt='Loading' />
			</span>
		)
	}
}

export default Loading;
