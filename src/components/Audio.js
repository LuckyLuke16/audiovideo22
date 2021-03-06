import React from "react";
import {Button} from "react-bootstrap";
import {PauseFill, PlayFill,
    Upload,VolumeMuteFill, VolumeUpFill,VolumeDownFill, VolumeOffFill} from "react-bootstrap-icons";
import Filter from "./Filter";
import Marquee from "react-fast-marquee";


export default class Audio extends React.Component {
  constructor(props) {
    super(props);
    this.analyzerCanvas = React.createRef();
    this.volumeSlider = React.createRef();
    this.playbackSpeedSlider = React.createRef();
    this.progressBar = React.createRef();

      this.state = {
          songPath: process.env.PUBLIC_URL + "basic_beat.wav",
          audioElementNumber: props.value,
          trackName: "basic_beat",
          audioCtx: null,
          analyser: null,
          buffer: null,
          source: null,
          isPlaying: false,
          value: 0.5,
          gainNode: null,
          playbackSpeed: 1,
          titleLength : false,
          lengthOfSong: 0,
          currentTime: 0,
          isCounting: false
    };
  }
  render() {
      let playPauseIcon;
      let volumeIcon;
      if (this.state.isPlaying) {
          playPauseIcon = <PauseFill size="30" />;
      } else {
          playPauseIcon = <PlayFill size="30" />;
      }
      //volume Icon changing with volume value
      if(this.state.value <= 0.3)
          volumeIcon = <VolumeOffFill id="volumeIcon" size="29"></VolumeOffFill>
      if(this.state.value >=0.8)
          volumeIcon = <VolumeUpFill id="volumeIcon" size="29"></VolumeUpFill>
      if(this.state.value === 0){
          volumeIcon = <VolumeMuteFill id="volumeIcon" size="29"></VolumeMuteFill>
      }
      if(this.state.value > 0.3 && this.state.value <0.8)
          volumeIcon = <VolumeDownFill id="volumeIcon" size="29"></VolumeDownFill>
      return (
      <div>
          <Marquee
              play={this.state.titleLength}
              gradient={false}
              pauseOnHover={true}
              pauseOnClick={true}
          >
        <p id="songTitle">{this.state.trackName}</p>
          </Marquee>
          <div
              id="f" className="cardItems">
              <input
                  id="durationSlider"
                  type="range"
                  min={"0"}
                  step={"1"}
                  max={this.state.lengthOfSong}
                  value={this.state.currentTime}
                  className="slider"
                  ref={this.progressBar}
                  onChange={(e) => this.handlePositionOfTheSong(e.target.value)}
              />
          </div>
          <p id="durationOfSongBeginning" className={"currentTime"}>{this.secToMinAndSec(this.state.currentTime)}</p>
          <p id="durationOfSongEnd" className="duration">{this.secToMinAndSec(this.state.lengthOfSong)}</p>
        <div className="cardItems">
            <Button variant="outline-light" onClick={() => this.handlePlayPause()}>
                {playPauseIcon}
            </Button>{" "}
        </div>
        <div className="cardItems">
          <Button variant="outline-light">
            <input
              type="file"
              className="upload"
              id={this.state.audioElementNumber}
              name="file"
              accept=".wav,.mp3,.ogg"
              onChange={() => this.handleFileUpload()}
            />
            {<Upload size="20" />}  Upload Audio
          </Button>{" "}
        </div>
          <div className="cardItems">
              <h6>Playback Speed: {this.state.playbackSpeed}x </h6>
              <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.5"
                  value={this.state.playbackSpeed}
                  className="slider"
                  ref={this.playbackSpeedSlider}
                  onChange={(e) => this.handlePlaybackSpeed(e.target.value)}
              />
          </div>
        <div className="cardItems">
            {volumeIcon}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={this.state.value}
            className="slider"
            ref={this.volumeSlider}
            onChange={(e) => this.handleVolume(e.target.value)}
          />
        </div>

          <div hidden={this.state.audioCtx === null}>
          <canvas id="canvas" ref={this.analyzerCanvas}></canvas>{" "}
        </div>
          <Filter
              audio={this.state}
          />
      </div>
    );
  }

  handlePlayPause(){
      if(this.state.isPlaying === true)
          this.pause();
      else
          this.play();
  }

  play() {
    if (this.state.audioCtx === null) {
      this.state.audioCtx = new AudioContext();
      this.state.gainNode = this.state.audioCtx.createGain();
    }

    if (this.state.audioCtx.state === "suspended") {
      this.state.audioCtx.resume();
      this.setState({isPlaying: true})
      return;
    }
            let audioCtx = this.state.audioCtx;
            let gainNode = this.state.gainNode;
            let source = audioCtx.createBufferSource();
            this.state.source = source;
             let analyser = audioCtx.createAnalyser();
            this.state.analyser = analyser;
            let request = new XMLHttpRequest();
            request.open('GET', this.state.songPath, true);
            request.responseType = 'arraybuffer';
            request.onload = function () {
                let audioData = request.response;
                audioCtx.decodeAudioData(audioData, function (buffer) {
                    source.buffer = buffer;
                    analyser.connect(audioCtx.destination);
                    source.connect(gainNode);
                    gainNode.connect(analyser);
                    source.start(0);
                });
            };
            request.send();
            this.state.gainNode = gainNode;
            this.state.audioCtx = audioCtx;
            this.state.source = source;
            this.state.isPlaying = true;
            this.createVisualization();
            this.handlePlaybackSpeed();
            this.handleVolume();
            this.handlePositionOfTheSong();
            this.state.currentTime = 1;
  }

  pause() {
      if(this.state.audioCtx=== null)
          return
      this.setState({isPlaying: false});
      this.state.audioCtx.suspend();
  }
  /**
   * input file element of the audio component render function gives containing file to song path
   * of component
   */
  handleFileUpload() {
    console.log(this.state.audioElementNumber);
    let input = document.getElementById(this.state.audioElementNumber);
    let curFiles = input.files;
    if (curFiles.item(0) != null) {
      this.setState({ songPath: URL.createObjectURL(curFiles[0]) });
      this.setState({ trackName: curFiles[0].name });
      if(curFiles[0].name.length >= 25){
          this.setState({titleLength: true});
      }else {
          this.setState({titleLength: false});
      }
      if(this.state.audioCtx !== null) {
          this.state.audioCtx.suspend();
      }
      this.setState({ isPlaying: false });
        this.state.audioCtx = null;
    }
  }

  handleVolume() {
    this.setState({ value: this.volumeSlider.current.value });
    if (this.state.audioCtx === null) {
      return;
    }
    this.state.gainNode.gain.value = this.volumeSlider.current.value;
  }

    handlePositionOfTheSong()
    {
        if(this.state.isCounting){
            return;
        }

        this.state.isCounting = true;
        setInterval(() => {
            if(this.state.currentTime >= this.state.lengthOfSong || this.state.isPlaying===false) {
                return;
            }
            this.setState({currentTime: parseFloat(this.state.currentTime) + parseFloat(this.state.playbackSpeed)});
        }, 1000);

        setInterval(() => {
            if(this.state.isPlaying===false){
                return;
            }
             this.setState({lengthOfSong: Math.floor(this.state.source.buffer.duration)});
        }, 1000);
    }

    secToMinAndSec(seconds) {
      if(Math.floor(seconds % 60) < 10 ) {
          return Math.floor(seconds / 60) + ":" + "0" + Math.floor(seconds % 60 ? seconds % 60 : "00");
      }
      return Math.floor(seconds / 60) + ":" + Math.floor(seconds % 60 ? seconds % 60 : "00");
    }

  handlePlaybackSpeed() {
    this.setState({ playbackSpeed: this.playbackSpeedSlider.current.value });
    if (this.state.audioCtx === null) {
      return;
    }
    this.state.source.playbackRate.value =
      this.playbackSpeedSlider.current.value;
  }
  createVisualization() {
    let canvas = this.analyzerCanvas.current;
    let canvasCtx = canvas.getContext("2d");
    let width = canvas.width;
    let height = canvas.height;
    var analyser = this.state.analyser;
    analyser.fftSize = 2048;
    var bufferLength = analyser.fftSize;
    var freqData = new Uint8Array(bufferLength);
    function renderFrame() {
      requestAnimationFrame(renderFrame);
      analyser.getByteTimeDomainData(freqData);
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "rgb(255, 255, 255)";

      const sliceWidth = (width * 1.0) / bufferLength;
      let x = 0;

      canvasCtx.beginPath();
      for (var i = 0; i < bufferLength; i++) {
        const v = freqData[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) canvasCtx.moveTo(x, y);
        else canvasCtx.lineTo(x, y);

        x += sliceWidth;
      }

      canvasCtx.lineTo(width, height / 2);
      canvasCtx.stroke();
    }

    renderFrame();
  }
}

