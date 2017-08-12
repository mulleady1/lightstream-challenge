import React, { Component } from 'react';
import './Form.css';

class Form extends Component {
  state = {
    name: ''
  };

  render() {
    return (
      <div className="Form">
        <input type="text" value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} />
        <button onClick={() => this.props.onSubmit(this.state)}>CREATE</button>
      </div>
    );
  }

}

export default Form;
