import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Stack, Button } from 'react-bootstrap';
import React from 'react';
import './Equalizer.css';

export default class Filter extends React.Component{
    constructor(props) {
        super(props);
        this.audio = this.props.audio;
        //filter nodes
        this.lowpassFilter = null;
        this.highpassFilter = null;
        // equalizer nodes
        this.lowshelfNode = null;
        this.lowshelfSlider = React.createRef();
        this.peakingNode1 = null
        this.peakingNode2 = null
        this.peakingNode3 = null
        this.highshelfNode = null;
        this.highshelfSlider = React.createRef();
        this.state = {
            isLowpassOn : false,
            isHighpassOn : false,
            clickedColor: false,
            // equalizer nodes SliderValues
            lowshelfValue: 0,
            highshelfValue: 0,

        }
    }

    setFilter(filterTyp){
        if(this.audio.audioCtx === null) {
            return;
        }
        switch(filterTyp){
            case "lowpass":
                if(this.state.isHighpassOn)
                    return;
                this.setState({isLowpassOn: !this.state.isLowpassOn}, function () {
                    if (this.state.isLowpassOn === true) {
                        this.setLowpassFilterOn();
                    } else
                        this.turnFilterOff();
                });
                break;
            case "highpass":
                if(this.state.isLowpassOn)
                    return;
                this.setState({isHighpassOn: !this.state.isHighpassOn}, function () {
                    if (this.state.isHighpassOn === true) {
                        this.setHighpassFilterOn();
                    } else {
                        this.turnFilterOff();
                    }
                });
                break;
            default:
                break;
        }
    }
    render(){
        return(
            <Card className='filter-card'>
                <Card.Body>
                    <p>Filters</p>
                    <Stack gap={3}>
                        <Button
                            variant={this.state.isLowpassOn ? "warning" : "outline-light"}
                            onClick={() => this.setFilter("lowpass")}
                        >Lowpass Filter</Button>{' '}
                        <Button
                            variant={this.state.isHighpassOn ? "warning" : "outline-light"}
                            onClick={() => this.setFilter("highpass")}
                        >Highpass Filter</Button>{' '}
                        <Button variant="outline-light">Equalizer</Button>{' '}
                    </Stack>

                </Card.Body>
                <Card
                    className='equalizer-card'
                    hidden={this.isHidden}
                >
                    <Card.Body>
                        <p>5-Band-Equalizer</p>
                        <Stack gap={3}>
                            <Stack direction="horizontal" gap={4} className="col-md-5 mx-auto">
                            </Stack>
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
                                className="eqslider"
                            />
                            <input
                                id="equalizer3"
                                type="range"
                                min="-20"
                                max="20"
                                step="1"
                                className="eqslider"
                            />
                            <input
                                id="equalizer4"
                                type="range"
                                min="-20"
                                max="20"
                                step="1"
                                className="eqslider"
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
        if(this.props.audio !== prevProps.audio){
            this.audio = this.props.audio;
            if(this.props.audio.audioCtx === null)
            {
                this.setState({isLowpassOn : false});
                this.setState({isHighpassOn : false});
                this.lowshelfNode = null;
            }else {
                // initialize equalizer nodes when audioCtx is initialized
                if(this.lowshelfNode === null){
                    this.lowshelfNode = this.audio.audioCtx.createBiquadFilter();
                    this.lowshelfNode.type = "lowshelf";
                    this.lowshelfNode.frequency.value = 300;
                    this.lowshelfNode.gain.setValueAtTime(this.lowshelfSlider.current.value, this.audio.audioCtx.currentTime);
                    this.highshelfNode = this.audio.audioCtx.createBiquadFilter();
                    this.highshelfNode.type = "highshelf";
                    this.highshelfNode.frequency.value = 4000;
                    this.highshelfNode.gain.setValueAtTime(this.highshelfSlider.current.value, this.audio.audioCtx.currentTime);
                    this.audio.source.disconnect();
                    this.audio.source.connect(this.lowshelfNode);
                    this.lowshelfNode.connect(this.highshelfNode);
                    this.highshelfNode.connect(this.audio.gainNode);
                    this.audio.gainNode.connect(this.audio.analyser);
                    this.audio.analyser.connect(this.audio.audioCtx.destination);
                }
            }
        }
    }

    setLowpassFilterOn() {
            this.lowpassFilter = this.audio.audioCtx.createBiquadFilter();
            this.lowpassFilter.type = "lowpass";
            this.lowpassFilter.frequency.setValueAtTime(500,this.audio.audioCtx.currentTime);
            this.audio.source.disconnect();
            this.audio.source.connect(this.lowpassFilter);
            this.lowpassFilter.connect(this.audio.gainNode);
            this.audio.gainNode.connect(this.audio.analyser);
            this.audio.analyser.connect(this.audio.audioCtx.destination);

    }

    turnFilterOff() {
        this.audio.source.disconnect();
        this.audio.source.connect(this.lowshelfNode);
        this.setEqualizerNodes();
    }

    setHighpassFilterOn() {
        this.highpassFilter = this.audio.audioCtx.createBiquadFilter();
        this.highpassFilter.type = "highpass";
        this.highpassFilter.frequency.setValueAtTime(2000,this.audio.audioCtx.currentTime);
        this.audio.source.disconnect();
        this.audio.source.connect(this.highpassFilter);
        this.highpassFilter.connect(this.lowshelfNode);
        this.setEqualizerNodes()
        // this.highpassFilter.connect(this.lowshelfNode);
        // this.lowshelfNode.connect(this.audio.gainNode);
        // this.audio.gainNode.connect(this.audio.analyser);
        // this.audio.analyser.connect(this.audio.audioCtx.destination);
    }

    setEqualizerNodes(){
        this.lowshelfNode.connect(this.highshelfNode);
        this.highshelfNode.connect(this.audio.gainNode);
        this.audio.gainNode.connect(this.audio.analyser);
        this.audio.analyser.connect(this.audio.audioCtx.destination);
    }

    changeLowshelfGain() {
        this.setState({ lowshelfValue: this.lowshelfSlider.current.value });
        if (this.audio.audioCtx === null) {
            return;
        }
        this.lowshelfNode.gain.setValueAtTime(this.lowshelfSlider.current.value, this.audio.audioCtx.currentTime);
    }

    changeHighshelfGain() {
        this.setState({ highshelfValue: this.highshelfSlider.current.value });
        if (this.audio.audioCtx === null) {
            return;
        }
        this.highshelfNode.gain.setValueAtTime(this.highshelfSlider.current.value, this.audio.audioCtx.currentTime);
    }
}

