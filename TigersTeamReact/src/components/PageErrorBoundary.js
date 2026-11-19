import React from 'react';
import PropTypes from 'prop-types';
import PageFailure from './PageFailure';

export default class PageErrorBoundary extends React.Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidUpdate(previousProps) {
    if (this.state.failed && previousProps.resetKey !== this.props.resetKey) {
      this.setState({ failed: false });
    }
  }

  render() {
    if (this.state.failed) {
      return <PageFailure />;
    }
    return this.props.children;
  }
}

PageErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  resetKey: PropTypes.string,
};
