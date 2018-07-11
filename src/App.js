import React, { Component } from 'react';
import './App.css';

const audioCxt = new (window.AudioContext || window.webkitAudioContext)();

class App extends Component {
  constructor() {
    super();
    this.state = {
      audioInputs: [],
      audioOutputs: [],
      audioInput: '',
      audioOutput: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.updateAudio = this.updateAudio.bind(this);
    this.disconnectNodes = this.disconnectNodes.bind(this);
    this.connectNodes = this.connectNodes.bind(this);
  }

  componentDidMount() {
    navigator.mediaDevices.getUserMedia({audio: true})
      .then(() => navigator.mediaDevices.enumerateDevices())
      .then((devices) => {
        const audioInputs = devices.filter(device => device.kind === 'audioinput');
        const audioOutputs = devices.filter(device => device.kind === 'audiooutput');

        this.setState({
          audioInputs,
          audioOutputs
        })
      });
    this.audio = new Audio();
  }

  handleChange(name) {
    return (event) => {
      this.setState({[name]: event.target.value}, () => {this.updateAudio(name)});
    };
  }

  updateAudio(name) {
    if(name === 'audioInput' && this.state.audioInput) {
      this.getDevice(this.state.audioInput).then((stream) => {
        this.disconnectNodes();
        this.audioSource = audioCxt.createMediaStreamSource(stream);
        this.connectNodes();
      });
    } else if(name === 'audioOutput' && this.state.audioOutput) {
      this.getDevice(this.state.audioOutput).then((stream) => {
        this.disconnectNodes();
        this.audioDestination = audioCxt.createMediaStreamDestination(stream);
        this.connectNodes();
      });
    }
  }

  getDevice(deviceId) {
    return navigator.mediaDevices.getUserMedia({audio: {deviceId}});
  }

  disconnectNodes() {
    this.audioSource && this.audioSource.disconnect();
  }

  connectNodes() {
    if(this.audioSource && this.audioDestination) {
      this.audio.pause();
      this.audioSource.connect(this.audioDestination);
      this.audio.src = URL.createObjectURL(this.audioDestination.stream);
      this.audio.setSinkId(this.state.audioOutput);
      this.audio.play();
    }
  }

  render() {
    const {audioInputs, audioOutputs} = this.state;
    return (
      <div className="App">
        <div className="SelectDevice">
          <label>
            Audio Input:
            <select onChange={this.handleChange('audioInput')}>
              {
                audioInputs.map((option, index) =>
                  <option
                    key={option.deviceId}
                    value={option.deviceId}
                  >
                    {option.label || `device ${index}`}
                  </option>
                )
              }
            </select>
          </label>
          <label>
            Audio Output:
            <select onChange={this.handleChange('audioOutput')}>
              {
                audioOutputs.map((option, index) =>
                  <option
                    key={option.deviceId}
                    value={option.deviceId}
                  >
                    {option.label || `device ${index}`}
                  </option>
                )
              }
            </select>
          </label>
        </div>
      </div>
    );
  }
}

export default App;