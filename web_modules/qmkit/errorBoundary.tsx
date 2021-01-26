import React from 'react';
import ErrorPage from '../../src/error/index_result'

export default class ErrorBoundary extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = { hasError: false, uuid: '', error: '', fetchStatus: '', msg: '' };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true, fetchStatus: "TypeError", error, msg: 'data error' });
  }
  static   getDerivedStateFromProps(props, current_state) {
    if (props.uuid !== current_state.uuid) {
      return {
        hasError: false,
        uuid: props.uuid
      }
    }
    return null;
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      // return <h1>Something went wrong.</h1>;
      return (<ErrorPage errorObj={this.state} />)
    }
    return this.props.children;
  }


}
