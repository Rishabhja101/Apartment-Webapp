import React, { Component } from 'react';
import axios from 'axios';
import '../style/edit-device.css';

export default class EditDevice extends Component {
    constructor(props) {
        super(props);
            
        this.state = {
            name: '',
            state: '',
            states: []
        }

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeStates = this.onChangeStates.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
  
    componentDidMount() {
        axios.get('http://10.194.222.20:5000/devices/'+this.props.match.params.id)
          .then(response => {
            this.setState({
              name: response.data.name,
              state: response.data.state,
              states: response.data.states
            })   
        })
          .catch(function (error) {
            console.log(error);
        })
    }

    onChangeName(e) {
        this.setState({
          name: e.target.value
        });
    }

    onChangeStates(e) {
        this.setState({
          states: e.target.value.split(','),
          state: e.target.value.split(',')[0]
        });
      }

    onSubmit(e) {
        var i = 0;
        for (i = 0; i < this.state.states.length; i++){
          this.state.states[i] = this.state.states[i].trim();
        }

        e.preventDefault();
        const device = {
          name: this.state.name,
          state: this.state.state,
          states: this.state.states
        };
    
        console.log(device);
    
        axios.post('http://10.194.222.20:5000/devices/update/'+this.props.match.params.id, device)  
          .then(res => console.log(res.data));
        
        window.location = '/';
    }

    render() {
        return (
            <div>
            <h3>Edit Device</h3>
            <form className="center" onSubmit={this.onSubmit}>
              <div className="textbox"> 
                <label>Name: </label>
                <input  type="text"
                    required
                    className="form-control"
                    value={this.state.name}
                    onChange={this.onChangeName}
                    />
              </div> 
              <div className="textbox"> 
                <label>States: </label>
                <input  type="text"
                    required
                    className="form-control"
                    value={this.state.states}
                    onChange={this.onChangeStates}
                    />
              </div>   
              <div className="form-group">
                <input type="submit" value="Edit Device" className="btn btn-primary" />
              </div>
            </form>
            </div>
        )
    }
}