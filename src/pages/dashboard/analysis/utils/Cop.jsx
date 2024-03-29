import React from 'react';
import { cop } from '../components/Charts';
/**
 * 减少使用 dangerouslySetInnerHTML
 */

export default class Cop extends React.Component {
  main = null;

  componentDidMount() {
    this.renderToHtml();
  }

  componentDidUpdate() {
    this.renderToHtml();
  }

  renderToHtml = () => {
    const { children } = this.props;

    if (this.main) {
      this.main.innerHTML = cop(children);
    }
  };

  render() {
    return (
      <span
        ref={ref => {
          this.main = ref;
        }}
      />
    );
  }
}
