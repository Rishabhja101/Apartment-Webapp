import React, { Component } from 'react';
import axios from 'axios';
import '../style/edit-device.css';
import Song from './song.component';

export default class EditDevice extends Component {
    constructor(props) {
        super(props);
            
        this.state = {
            songTitle: '',
            token: '"BQCuuUqR664phQ3P59YZ8sVZyGQYmZMpcki8WZn5cTpo_3rCuHbhQ81LRFtR15pIp6D1T_ajgGKbIdZcUFNOVpm9fGdREI0ftinyYOpo4nL9A6tJnh5ai6iudV17hiuHCE2KszekTzbccVKpsjui12P7Ow',
            songs: []
        }

        this.onSongTyping = this.onSongTyping.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.addToQueue = this.addToQueue.bind(this);
    }

    

    async addToQueue(uri){
        axios.get('http://localhost:8888/token', {}) 
        .then(res => {
          console.log(res.data);
          this.state.token = res.data; 

          this.setState(this.state);
        })
        const result = await fetch(`https://api.spotify.com/v1/me/player/queue?uri=${uri}`, {
            method: 'POST',
            headers: { 'Authorization' : 'Bearer ' + this.state.token}
        });
        alert("Your song has been added to the queue");
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
                {/* <button onClick={this.onSearch}>Search</button> */}
              <div style={{margin: "auto", overflow: 'auto', width:"300px"}}>
                {this.state.songs}
              </div>
            </div>
        )
    } 
}