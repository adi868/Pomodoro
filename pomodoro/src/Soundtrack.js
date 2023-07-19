import React from 'react';

class Soundtrack extends React.Component {
  constructor(props) {
    super(props);
    this.soundtrackRef = React.createRef();
    this.state = {
      audioFiles: [], // Array to store the fetched audio file names
    };
  }

  componentDidMount() {
    this.fetchAudioFiles();
  }

//   fetchAudioFiles = async () => {
//     try {
//       const response = await fetch('/sounds'); // Path to your audio files directory
//       console.log(response)
//       const data = await response.json();
//       console.log(data)
//       this.setState({ audioFiles: data });
//     } catch (error) {
//       console.error('Error fetching audio files:', error);
//     }
//   };

  fetchAudioFiles = async () => {
    try {
      const response = await fetch('./api/songs'); // Path to your API endpoint
      const data = await response.json();
      const audioFiles = data.songs.map(song => song.file);
      this.setState({ audioFiles });
    } catch (error) {
      console.error('Error fetching audio files:', error);
    }
  };


  playSoundtrack() {
    this.soundtrackRef.current.play();
  }

  pauseSoundtrack() {
    this.soundtrackRef.current.pause();
  }

//   adjustVolume() {
//     const volume = prompt('Enter volume value (0-1):');
//     this.soundtrackRef.current.volume = parseFloat(volume);
//   }

  render() {
    const { audioFiles } = this.state;

    return (
      <div>
        <audio ref={this.soundtrackRef} loop>
        {audioFiles.map((song, index) => (
          <source key={index} src={`/sounds/${song.file}`} type="audio/mpeg" />
        ))}
        </audio>
        <button onClick={() => this.playSoundtrack()}>Play</button>
        <button onClick={() => this.pauseSoundtrack()}>Pause</button>
        {/* <button onClick={() => this.adjustVolume()}>Adjust Volume</button> */}
      </div>
    );
  }
}

export default Soundtrack;