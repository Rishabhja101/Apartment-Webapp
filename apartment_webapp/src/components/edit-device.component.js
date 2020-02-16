import React, { Component } from 'react';
import axios from 'axios';

export default class EditDevice extends Component {
    constructor(props) {
        super(props);
            
        this.state = {
            name: '',
            state: ''
        }

        this.onChangeName = this.onChangeName.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
  
    componentDidMount() {
        axios.get('http://localhost:5000/devices/'+this.props.match.params.id)
          .then(response => {
            this.setState({
              name: response.data.name,
              state: response.data.state
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

    onSubmit(e) {
        e.preventDefault();
    
        const device = {
          name: this.state.name,
          state: this.state.state
        };
    
        console.log(device);
    
        axios.post('http://localhost:5000/devices/update/'+this.props.match.params.id, device)  
          .then(res => console.log(res.data));
        
        window.location = '/';
    }

    render() {
        return (
            <div>
            <h3>Edit Device</h3>
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
                <input type="submit" value="Edit Device" className="btn btn-primary" />
              </div>
            </form>
            </div>
        )
    }
}