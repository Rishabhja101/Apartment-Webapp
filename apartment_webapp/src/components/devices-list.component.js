import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Device = props => (
    <tr>
      <td>{props.device.name}</td>
      <td>{props.device.state}</td>
      <td>
        <Link to={"/edit/"+props.device._id}>edit</Link> | <a href="#" onClick={() => { props.deleteDevice(props.device._id) }}>delete</a> 
            | <a href="#" onClick={() => { props.toggleDeviceState(props.device._id) }}>toggle</a>
      </td>
    </tr>
  )

export default class DevicesList extends Component {
    constructor(props) {
        super(props);
        this.deleteDevice = this.deleteDevice.bind(this);
        this.toggleDeviceState = this.toggleDeviceState.bind(this);
        this.state = {devices: []};
    }

    componentDidMount() {
        axios.get('http://localhost:5000/devices/')
         .then(response => {
           this.setState({ devices: response.data });
         })
         .catch((error) => {
            console.log(error);
         })
    }

    toggleDeviceState(id){
        let device = {
            name: '',
            state: '',
            states: []
        };
        
        const devices = this.state.devices;
        devices.forEach((element) => {
            if (element._id == id){
                device.name = element.name;
                device.state = element.state;
                device.states = element.states;
            }
        });
        
        var i;
        for (i = 0; i < device.states.length; i++){
            if (device.state == device.states[i]){
                device.state = device.states[(i + 1) % device.states.length];
                i = device.states.length;
            }
        }

        console.log(device);

        axios.post('http://localhost:5000/devices/update/'+ id, device)  
            .then(res => console.log(res.data));

        window.location = '/';
    }

    deleteDevice(id) {
        axios.delete('http://localhost:5000/devices/'+id)
          .then(res => console.log(res.data));
        this.setState({
          devices: this.state.devices.filter(el => el._id !== id)
        })
    }

    deviceList() {
        return this.state.devices.map(currentdevice => {
          return <Device device={currentdevice} deleteDevice={this.deleteDevice} toggleDeviceState={this.toggleDeviceState} key={currentdevice._id}/>;
        })
    }

    render() {
        return (
            <div>
            <h3>Logged Exercises</h3>
            <table className="table">
              <thead className="thead-light">
                <tr>
                  <th>Name</th>
                  <th>State</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                { this.deviceList() }
              </tbody>
            </table>
            </div>
        )
    }
}