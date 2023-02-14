import axios from 'axios';

let accessToken
const SpotifyAPI = 'https://api.spotify.com/v1'
// const clientId = process.env.CLIENT_ID
// const redirectUri = process.env.URI


const Spotify = {
    getAccessToken() {
        console.log(process.env.REACT_APP_CLIENT_ID);
        console.log(process.env.REACT_APP_URI)
        if (accessToken != null) {
            return accessToken
        }
        const accessTokenMatching = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatching = window.location.href.match(/expires_in=([^&]*)/)
        if (accessTokenMatching != null && expiresInMatching != null) {
            accessToken = accessTokenMatching[1];
            const expiresIn = Number(expiresInMatching[1])
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        }
        else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${process.env.REACT_APP_URI}`
            return null;
        }
    },

    async search(term) {
        const token = Spotify.getAccessToken()
        try {
            const res = await axios.get(`${SpotifyAPI}/search?type=track&q=${term}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': "application/json",
                }
            });
            const data = await res.data;
            const tracks = data.tracks.items.map(track => {
                return {
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                }
            })
            return tracks
        } catch (e) {
            console.log(e);
            return
        }
    },

    async savePlaylist(name, tracksURI){
        if(name == null || tracksURI == null){
            return;
        }
        const token = Spotify.getAccessToken();
        let userId
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': "application/json",
        }
        try{
            const res = await axios.get(`${SpotifyAPI}/me`, {
                headers: headers
            })
            const data = await res.data;
            userId = data.id;
        }catch(e){
            console.log(e)
            return
        }

        let playlistId
        try {
            const res = await axios.post(`${SpotifyAPI}/users/${userId}/playlists`, {
                name: name
            }, {
                headers: headers
            })
            const data = await res.data;
            playlistId = data.id
        }catch(e){
            console.log(e);
            return
        }

        let snapshotId
        try{
            const res = await axios.post(`${SpotifyAPI}/playlists/${playlistId}/tracks`,{
                uris: tracksURI,
                position: 0
            },{
                headers: headers,
            });
            const data = await res.data;
            snapshotId = data.snapshot_id;
            return snapshotId
        }catch(e){
            console.log(e);
            return
        }
    }
}


export default Spotify