import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Stack, Button } from 'react-bootstrap';
import React from 'react';

export default class Filter extends React.Component{
    constructor(props) {
        super(props);
        this.audio = this.props.audio;
        this.lowpassFilter = null;
        this.highpassFilter = null;
        this.state = {
            isLowpassOn : false,
            isHighpassOn : false,
            clickedColor: false,
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
                        <Button variant="outline-light">Filter</Button>{' '}
                    </Stack>
                </Card.Body>
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
        this.audio.source.connect(this.audio.gainNode);
        this.audio.gainNode.connect(this.audio.analyser);
        this.audio.analyser.connect(this.audio.audioCtx.destination);
    }

    setHighpassFilterOn() {
        this.highpassFilter = this.audio.audioCtx.createBiquadFilter();
        this.highpassFilter.type = "highpass";
        this.highpassFilter.frequency.setValueAtTime(2000,this.audio.audioCtx.currentTime);
        this.audio.source.disconnect();
        this.audio.source.connect(this.highpassFilter);
        this.highpassFilter.connect(this.audio.gainNode);
        this.audio.gainNode.connect(this.audio.analyser);
        this.audio.analyser.connect(this.audio.audioCtx.destination);
    }
}

