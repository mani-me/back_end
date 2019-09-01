import React from 'react';
import '../static/test.css';

export default class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: []
    }
  }

  render() {
    return (
      <div className='testBody'></div>
    );
  }
}
