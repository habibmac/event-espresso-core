/**
 * External imports
 */
import { Component } from 'react';
import { __ } from '@eventespresso/i18n';

/**
 * FormErrorBoundary
 * catches JavaScript errors produced by the form
 * and displays a fallback UI
 *
 * @param {Function} FormComponent
 * @param {Function} loadHandler a function that supplies the form data
 * @param {Function} submitHandler a function that processes the submitted form
 * @return {Object} FormComponent with added form handling
 */
export class FormErrorBoundary extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			error: null,
			errorInfo: null,
		};
	}

	/**
	 * @function
	 * @param {string} error
	 * @param {Object} info
	 */
	componentDidCatch( error, info ) {
		this.setState( {
			error: error,
			errorInfo: info,
		} );
	}

	render() {
		if ( this.state.errorInfo ) {
			return (
				<div>
					<h2>{ __( 'Something went wrong.', 'event_espresso' ) }</h2>
					<details style={ { whiteSpace: 'pre-wrap' } }>
						{ this.state.error && this.state.error.toString() }
						<br />
						{ this.state.errorInfo.componentStack }
					</details>
				</div>
			);
		}
		return this.props.children;
	}
}
