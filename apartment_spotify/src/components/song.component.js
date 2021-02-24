import React, { Component } from 'react';
import axios from 'axios';
import '../style/edit-device.css';

export default class Song extends Component {
    constructor(props) {
        super(props);
            
        this.state = {
            backgroundColor: '#eeeeee'
        }
        this.props.clicked.bind(this);
        this.onClicked = this.onClicked.bind(this);
    }

    onClicked(){
        // this.props.clicked(this.props.uri)
        console.log('wassupppp');
        this.state.backgroundColor = '#ffffff';
        this.setState(this.state);
    }


    render() {
        return (
            <div style={{textAlign: 'center'}}>
                <div style={{height: "1px", padding: "2px"}}></div>
                <div style={{borderRadius: "10px", background: this.state.backgroundColor, padding: "2px", width: "300px", overflow: 'auto'}} onClick={() => this.props.clicked(this.props.uri)}>
                    <div style={{width:"45px", float:"left", margin:"0px", "margin-left": "10px", 'margin-top': '5px'}}>
                        <img src={this.props.image} alt="" style={{width:"40px"}}/>        
                    </div>
                    <div style={{width:"215px", float:"right", margin:"0px", top:"50%", textAlign:"left", "margin-right": "10px"}}>
                        <div>{this.props.name}</div>
                        <div><strong>{this.props.artist}</strong></div>
                    </div>
                </div>
                <div style={{height: "1px", padding: "2px"}}></div>
            </div>
        )
    } 
}