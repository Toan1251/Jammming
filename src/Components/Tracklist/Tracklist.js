import React from 'react';
import './Tracklist.css';
import Track from '../Track/Track'

class Tracklist extends React.Component {
    render(){
        const trackItems = this.props.tracks.map(track => <Track key={track.id} track={track} onAdd={this.props.onAdd} onRemove={this.props.onRemove} isRemoval={this.props.isRemoval} />)
        return (
            <div className="TrackList">
                {/* <!-- You will add a map method that renders a set of Track components  --> */}
                <ul>{trackItems}</ul>
            </div>
        )
    }
}

export default Tracklist;