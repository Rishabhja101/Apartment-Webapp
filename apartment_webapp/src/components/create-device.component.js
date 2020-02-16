import React, { Component } from 'react';
import axios from 'axios';

export default class CreateDevice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: ''
    }

    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeState = this.onChangeState.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChangeName(e) {
    this.setState({
      name: e.target.value
    });
  }
  
  onChangeState(e) {
    this.setState({
      state: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();
    const device = {
      name: this.state.name
    };
    console.log(device);
    axios.post('http://localhost:5000/devices/add', device)
      .then(res => console.log(res.data));
    window.location = '/';
  }

  render() {
    return (
      <div>
      <h3>Create New Device</h3>
      <form onSubmit={this.onSubmit}>
        <div className="form-group"> 
          <label>Name: </label>
          <input  type="text"
              required
              className="form-control"
              value={this.state.name}
              onChange={this.onChangeName}
              />
        </div>
        <div className="form-group">
          <input type="submit" value="Create Device" className="btn btn-primary" />
        </div>
      </form>
    </div>
    )
  }
}