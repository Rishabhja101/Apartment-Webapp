import React, { Component } from 'react';
import axios from 'axios';
import '../style/edit-device.css';

export default class Song extends Component {
    constructor(props) {
        super(props);
            
        this.state = {
            title: '',
        }
        this.props.clicked.bind(this);
    }


    render() {
        return (
            <div style={{textAlign: 'center'}}>
                <div style={{height: "1px", padding: "5px"}}></div>
                <div style={{borderRadius: "25px", background: "#eeeeee", padding: "5px", width: "300px", overflow: 'auto'}} onClick={() => this.props.clicked(this.props.uri)}>
                    <div style={{width:"100px", float:"left", margin:"10px", top:"50%"}}>
                        <img src={this.props.image} alt=""/>        
                    </div>
                    <div style={{width:"150px", float:"right", margin:"10px", top:"50%"}}>
                        <div>{this.props.name}</div>
                        <div><strong>{this.props.artist}</strong></div>
                    </div>
                </div>
                <div style={{height: "1px", padding: "5px"}}></div>
            </div>
        )
    } 
}