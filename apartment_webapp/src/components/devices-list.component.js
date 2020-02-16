import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Device = props => (
    <tr>
      <td>{props.device.name}</td>
      <td>{props.device.state}</td>
      <td>
        <Link to={"/edit/"+props.device._id}>edit</Link> | <a href="#" onClick={() => { props.deleteDevice(props.device._id) }}>delete</a> 
            | <a href="#" onClick={() => { props.flipDeviceState(props.device._id) }}>flip</a>
      </td>
    </tr>
  )

export default class DevicesList extends Component {
    constructor(props) {
        super(props);
        this.deleteDevice = this.deleteDevice.bind(this);
        this.flipDeviceState = this.flipDeviceState.bind(this);
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

    flipDeviceState(id){
        let device = {
            name: '',
            state: ''
        };
        
        const myArray = this.state.devices;

        myArray.forEach((element, index, array) => {
            if (element._id == id){
                device.name = element.name;
                device.state = element.state;
            }
        });
        
        console.log(device);
        
        if (device.state == 'inactive'){
            device.state = 'active';
        }
        else{
            device.state = 'inactive';
        }

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
          return <Device device={currentdevice} deleteDevice={this.deleteDevice} flipDeviceState={this.flipDeviceState} key={currentdevice._id}/>;
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