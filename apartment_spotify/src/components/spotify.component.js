import React, { Component } from 'react';
import axios from 'axios';
import '../style/edit-device.css';
import Song from './song.component';

export default class EditDevice extends Component {
    constructor(props) {
        super(props);
            
        this.state = {
            songTitle: '',
            token: 'BQD4kDhG9OKTsPwFrMFnHemUo9ausDdL6XYNfThhrixSflCoR8OAo7Qzg4GOB8XNq2h98wJsjQsTj0TaiV-pKvOCJtk-A4_6l1LqS03VbvIhftfHfI9t0awWiRp6QPUNG0PLKG7jWsfHe7O0DRvcsS5rEl2WsG0Ng78lsG7l3o7k6B-NmS-gPyn_qG_oikNPFeEA3e1B5mUPzZk5U-M-qIIEKzcdd8698aSce_ZQL56vUONm7EOFff8h5VgoQta8k1bWtKA3-i7m9J5tos4w7W8',
            songs: []
        }

        this.onSongTyping = this.onSongTyping.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.addToQueue = this.addToQueue.bind(this);
    }

    async addToQueue(uri){
        const result = await fetch(`https://api.spotify.com/v1/me/player/queue?uri=${uri}`, {
            method: 'POST',
            headers: { 'Authorization' : 'Bearer ' + this.state.token}
        });
    }
  
    componentDidMount() {

    }

    onSongTyping(e) {
      this.setState({
        songTitle: e.target.value,
        token: this.state.token
      });
      this.onSearch(e);
    }

    async onSearch(e) {
      axios.get(`https://api.spotify.com/v1/search?q=${this.state.songTitle}&type=track&limit=10`, {
        headers: {
          'Authorization' : 'Bearer ' + this.state.token
        }}) 
        .then(res => {
          console.log(res.data.tracks.items[0]);
          
          this.state.songs = [];
          var i;
          for (i = 0; i < res.data.tracks.items.length; i++) {
            this.state.songs.push(<Song key={i} name={res.data.tracks.items[i].name} 
                                                artist={res.data.tracks.items[i].artists[0].name} 
                                                image={res.data.tracks.items[i].album.images[2].url} 
                                                uri={res.data.tracks.items[i].uri}
                                                clicked={this.addToQueue}/>);
          }

          var temp = (<div>{this.state.songs.map(song => <div>{song} <ls/><ls/><ls/></div>)}</div>);
          this.state.songs = temp; 

          this.setState(this.state);
          console.log(this.state.songs);
        })
        .catch(err => {
          console.log(err);
        });
    }

    render() {
        return (
            <div>
            <h3>Search for Songs</h3>
              <div className="textbox"> 
                <input  type="text"
                    className="form-control"
                    value={this.state.songTitle}
                    onChange={this.onSongTyping}
                    />
              </div>   
                <button onClick={this.onSearch}>Search</button>
              <div style={{margin: "auto", overflow: 'auto', width:"300px"}}>
                {this.state.songs}
              </div>
            </div>
        )
    } 
}