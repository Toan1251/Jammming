import './App.css';
import React from 'react'
import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
// import FakeData from '../../FakeData';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // searchResults: FakeData.searchReasults,
      // playlistName: FakeData.playlistName,
      // playlistTracks: FakeData.playlistTracks
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    }
    this.addTrack = this.addTrack.bind(this)
    this.removeTrack = this.removeTrack.bind(this)
    this.updatePlaylistName = this.updatePlaylistName.bind(this)
    this.savePlaylist = this.savePlaylist.bind(this)
    this.search = this.search.bind(this)
  }

  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id) !== undefined) {
      return;
    }
    const newTracks = [...this.state.playlistTracks, track]
    this.setState({playlistTracks: newTracks});
  }

  removeTrack(track){
    const newTracks = this.state.playlistTracks.filter(savedTrack => savedTrack.id !== track.id);
    this.setState({playlistTracks: newTracks});
  }

  updatePlaylistName(name){
    this.setState({playlistName: name});
  }

  async savePlaylist(){
    // return this.state.playlistTracks.map(track => track.uri)
    const tracksURI = this.state.playlistTracks.map(track => track.uri)
    await Spotify.savePlaylist(this.state.playlistName, tracksURI);
    this.setState({
      playlistName: 'New Playlist',
      playlistTracks: []
    })
  }

  async search(searchTerm){
    const result = await Spotify.search(searchTerm);
    this.setState({searchResults: result});
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          {/* <!-- Add a SearchBar component --> */}
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            {/* <!-- Add a SearchResults component --> */}
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            {/* <!-- Add a Playlist component --> */}
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} 
            onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}
  
export default App;
