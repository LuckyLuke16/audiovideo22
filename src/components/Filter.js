import "../css/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Stack, Button } from "react-bootstrap";
import React from "react";
import "../css/Equalizer.css";

export default class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.audio = this.props.audio;
    //filter nodes
    this.lowpassFilter = null;
    this.highpassFilter = null;
    // equalizer nodes and sliders
    this.lowshelfNode = null;
    this.lowshelfSlider = React.createRef();
    this.peakingNode1 = null;
    this.peaking1Slider = React.createRef();
    this.peakingNode2 = null;
    this.peaking2Slider = React.createRef();
    this.peakingNode3 = null;
    this.peaking3Slider = React.createRef();
    this.highshelfNode = null;
    this.highshelfSlider = React.createRef();
    this.state = {
      isLowpassOn: false,
      isHighpassOn: false,
      isBitcrusherOn: false,
      clickedColor: false,
      // equalizer nodes SliderValues
      lowshelfValue: 0,
      peaking1Value: 0,
      peaking2Value: 0,
      peaking3Value: 0,
      highshelfValue: 0,
    };
  }

  setFilter(filterTyp) {
    if (this.audio.audioCtx === null) {
      return;
    }
    switch (filterTyp) {
      case "lowpass":
        if (this.state.isHighpassOn || this.state.isBitcrusherOn) return;
        this.setState({ isLowpassOn: !this.state.isLowpassOn }, function () {
          if (this.state.isLowpassOn === true) {
            this.setLowpassFilterOn();
          } else this.turnFilterOff();
        });
        break;
      case "highpass":
        if (this.state.isLowpassOn || this.state.isBitcrusherOn) return;
        this.setState({ isHighpassOn: !this.state.isHighpassOn }, function () {
          if (this.state.isHighpassOn === true) {
            this.setHighpassFilterOn();
          } else {
            this.turnFilterOff();
          }
        });
        break;
      case "bitcrusher":
        if (this.state.isHighpassOn || this.state.isLowpassOn) return;
        this.setState(
          { isBitcrusherOn: !this.state.isBitcrusherOn },
          function () {
            if (this.state.isBitcrusherOn === true) {
              this.setBitscusherOn();
            } else this.turnFilterOff();
          }
        );
        break;
      default:
        break;
    }
  }
  render() {
    return (
      <Card className="filter-card">
        <Card.Body>
          <p>Filters</p>
          <Stack gap={3}>
            <Button
              variant={this.state.isLowpassOn ? "warning" : "outline-light"}
              onClick={() => this.setFilter("lowpass")}
            >
              Lowpass Filter
            </Button>{" "}
            <Button
              variant={this.state.isHighpassOn ? "warning" : "outline-light"}
              onClick={() => this.setFilter("highpass")}
            >
              Highpass Filter
            </Button>{" "}
            <Button
              variant={this.state.isBitcrusherOn ? "warning" : "outline-light"}
              onClick={() => this.setFilter("bitcrusher")}
            >
              Bitcrusher
            </Button>{" "}
          </Stack>
        </Card.Body>
        <Card className="equalizer-card" hidden={this.isHidden}>
          <Card.Body>
            <p>5-Band-Equalizer</p>
            <Stack gap={3}>
              <Stack
                direction="horizontal"
                gap={4}
                className="col-md-5 mx-auto"
              ></Stack>
              <input
                id="equalizer1"
                type="range"
                min="-20"
                max="20"
                step="1"
                value={this.state.lowshelfValue}
                className="eqslider"
                ref={this.lowshelfSlider}
                onChange={(e) => this.changeLowshelfGain(e.target.value)}
              />
              <input
                id="equalizer2"
                type="range"
                min="-20"
                max="20"
                step="1"
                value={this.state.peaking1Value}
                className="eqslider"
                ref={this.peaking1Slider}
                onChange={() => this.changePeaking1Gain()}
              />
              <input
                id="equalizer3"
                type="range"
                min="-20"
                max="20"
                step="1"
                value={this.state.peaking2Value}
                className="eqslider"
                ref={this.peaking2Slider}
                onChange={() => this.changePeaking2Gain()}
              />
              <input
                id="equalizer4"
                type="range"
                min="-20"
                max="20"
                step="1"
                value={this.state.peaking3Value}
                className="eqslider"
                ref={this.peaking3Slider}
                onChange={() => this.changePeaking3Gain()}
              />
              <input
                id="equalizer5"
                type="range"
                min="-20"
                max="20"
                step="1"
                value={this.state.highshelfValue}
                className="eqslider"
                ref={this.highshelfSlider}
                onChange={(e) => this.changeHighshelfGain(e.target.value)}
              />
            </Stack>
          </Card.Body>
        </Card>
      </Card>
    );
  }

  // is called whenever a prop is changed
  // updates audio props from audio component
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.audio !== prevProps.audio) {
      this.audio = this.props.audio;
      if (this.props.audio.audioCtx === null) {
        this.setState({ isLowpassOn: false });
        this.setState({ isHighpassOn: false });
        this.setState({ isBitcrusherOn: false });
        this.lowshelfNode = null;
      } else {
        // initialize equalizer nodes when audioCtx is initialized
        if (this.lowshelfNode === null) {
          this.lowshelfNode = this.audio.audioCtx.createBiquadFilter();
          this.lowshelfNode.type = "lowshelf";
          this.lowshelfNode.frequency.value = 300;
          this.lowshelfNode.gain.setValueAtTime(
            this.lowshelfSlider.current.value,
            this.audio.audioCtx.currentTime
          );
          this.highshelfNode = this.audio.audioCtx.createBiquadFilter();
          this.highshelfNode.type = "highshelf";
          this.highshelfNode.frequency.value = 4000;
          this.highshelfNode.gain.setValueAtTime(
            this.highshelfSlider.current.value,
            this.audio.audioCtx.currentTime
          );
          this.peakingNode1 = this.audio.audioCtx.createBiquadFilter();

          this.peakingNode1.type = "peaking";
          this.peakingNode1.frequency.value = 2150;
          this.peakingNode1.gain.setValueAtTime(
            this.peaking1Slider.current.value,
            this.audio.audioCtx.currentTime
          );

          this.peakingNode2 = this.audio.audioCtx.createBiquadFilter();
          this.peakingNode2.type = "peaking";
          this.peakingNode2.frequency.value = 1000;
          this.peakingNode2.gain.setValueAtTime(
            this.peaking2Slider.current.value,
            this.audio.audioCtx.currentTime
          );

          this.peakingNode3 = this.audio.audioCtx.createBiquadFilter();
          this.peakingNode3.type = "peaking";
          this.peakingNode3.frequency.value = 3000;
          this.peakingNode3.gain.setValueAtTime(
            this.peaking3Slider.current.value,
            this.audio.audioCtx.currentTime
          );

          this.audio.source.disconnect();
          this.audio.source.connect(this.lowshelfNode);
          this.setEqualizerNodes();
        }
      }
    }
  }

  setLowpassFilterOn() {
    this.lowpassFilter = this.audio.audioCtx.createBiquadFilter();
    this.lowpassFilter.type = "lowpass";
    this.lowpassFilter.frequency.setValueAtTime(
      500,
      this.audio.audioCtx.currentTime
    );
    this.audio.source.disconnect();
    this.audio.source.connect(this.lowpassFilter);
    this.lowpassFilter.connect(this.lowshelfNode);
    this.setEqualizerNodes();
  }

  turnFilterOff() {
    this.audio.source.disconnect();
    this.audio.source.connect(this.lowshelfNode);
    this.setEqualizerNodes();
  }

  setHighpassFilterOn() {
    this.highpassFilter = this.audio.audioCtx.createBiquadFilter();
    this.highpassFilter.type = "highpass";
    this.highpassFilter.frequency.setValueAtTime(
      2000,
      this.audio.audioCtx.currentTime
    );
    this.audio.source.disconnect();
    this.audio.source.connect(this.highpassFilter);
    this.highpassFilter.connect(this.lowshelfNode);
    this.setEqualizerNodes();
  }

  setEqualizerNodes() {
    this.lowshelfNode.connect(this.peakingNode1);
    this.peakingNode1.connect(this.peakingNode2);
    this.peakingNode2.connect(this.peakingNode3);
    this.peakingNode3.connect(this.highshelfNode);
    this.highshelfNode.connect(this.audio.gainNode);
    this.audio.gainNode.connect(this.audio.analyser);
    this.audio.analyser.connect(this.audio.audioCtx.destination);
  }

  // onchange functions for gain values og equalizer nodes
  changeLowshelfGain() {
    this.setState({ lowshelfValue: this.lowshelfSlider.current.value });
    if (this.audio.audioCtx === null) {
      return;
    }
    this.lowshelfNode.gain.setValueAtTime(
      this.lowshelfSlider.current.value,
      this.audio.audioCtx.currentTime
    );
  }

  changeHighshelfGain() {
    this.setState({ highshelfValue: this.highshelfSlider.current.value });
    if (this.audio.audioCtx === null) {
      return;
    }
    this.highshelfNode.gain.setValueAtTime(
      this.highshelfSlider.current.value,
      this.audio.audioCtx.currentTime
    );
  }

  changePeaking1Gain() {
    this.setState({ peaking1Value: this.peaking1Slider.current.value });
    if (this.audio.audioCtx === null) {
      return;
    }
    this.peakingNode1.gain.setValueAtTime(
      this.peaking1Slider.current.value,
      this.audio.audioCtx.currentTime
    );
  }

  changePeaking2Gain() {
    this.setState({ peaking2Value: this.peaking2Slider.current.value });
    if (this.audio.audioCtx === null) {
      return;
    }
    this.peakingNode2.gain.setValueAtTime(
      this.peaking2Slider.current.value,
      this.audio.audioCtx.currentTime
    );
  }

  changePeaking3Gain() {
    this.setState({ peaking3Value: this.peaking3Slider.current.value });
    if (this.audio.audioCtx === null) {
      return;
    }
    this.peakingNode3.gain.setValueAtTime(
      this.peaking3Slider.current.value,
      this.audio.audioCtx.currentTime
    );
  }

  //A Bitcrusher is an audio effect that produces distortion by reducing of the resolution or bandwidth of digital audio data
  setBitscusherOn() {
    var bufferSize = 4096;
    var bitcrusher = this.audio.audioCtx.createScriptProcessor(bufferSize, 2, 2);
    bitcrusher.bits = 4;
    bitcrusher.normfreq = 0.2;
    var step = Math.pow(0.5, bitcrusher.bits);
    var phaser = 0;
    var last = 0;
    var channelCount = 2;
    bitcrusher.onaudioprocess = function (e) {
      for (var j = 0; j < channelCount; ++j) {
        var input = e.inputBuffer.getChannelData(j);
        var output = e.outputBuffer.getChannelData(j);
        for (var i = 0; i < bufferSize; i++) {
          phaser += bitcrusher.normfreq;
          if (phaser >= 1.0) {
            phaser -= 1.0;
            last = step * Math.floor(input[i] / step + 0.5);
          }
          output[i] = last;
        }
      }
    };
    this.audio.source.disconnect();
    this.audio.source.connect(bitcrusher);
    bitcrusher.connect(this.lowshelfNode);
    this.setEqualizerNodes();
  }
}
