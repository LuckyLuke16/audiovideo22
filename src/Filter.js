import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Stack, Button } from 'react-bootstrap';
import React from 'react';

export default class Filter extends React.Component{
    constructor(props) {
        console.log("render");
        super(props);
        this.audio = this.props.audio;
        this.lowpassFilter = null;
        this.state = {
            isLowpassOn : false,
            clickedColor: false,
        }
    }
    setFilter(filterTyp){
        console.log(this.audio.audioCtx);
        if(this.audio.audioCtx === null) {
            return;
        }
        switch(filterTyp){
            case "lowpass":
                if(this.state.isLowpassOn === false) {
                    this.setLowpassFilterOn();
                }else
                    this.setLowpassFilterOff();
                this.setState({isLowpassOn: !this.state.isLowpassOn});
                break;
            default:
                break;
        }
    }
    render(){
        return(
            <Card className='filter-card'>
                <Card.Body>Filters
                    <Stack gap={3}>
                        <Button
                                variant={this.state.isLowpassOn ? "warning" : "outline-light"}
                                onClick={() => this.setFilter("lowpass")}
                        >Lowpass Filter</Button>{' '}
                        <Button variant="outline-light">Filter</Button>{' '}
                        <Button variant="outline-light">Filter</Button>{' '}
                    </Stack>
                </Card.Body>
            </Card>
        );
    }

    // updates audio prop from audio component
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.audio !== prevProps.audio){
            this.audio = this.props.audio;
            if(this.props.audio.audioCtx === null)
            {
                console.log("cx is null");
                this.setState({isLowpassOn : false});
            }
        }
    }
    setLowpassFilterOn() {
        console.log("turn on lowpass filter");
        this.lowpassFilter = this.audio.audioCtx.createBiquadFilter();
            this.lowpassFilter.type = "lowpass";
            this.lowpassFilter.frequency.setValueAtTime(500,this.audio.audioCtx.currentTime);
            this.audio.source.disconnect();
            this.audio.source.connect(this.lowpassFilter);
            this.lowpassFilter.connect(this.audio.gainNode);
            this.audio.gainNode.connect(this.audio.analyser);
            this.audio.analyser.connect(this.audio.audioCtx.destination);
    }

    setLowpassFilterOff() {
        console.log("turn off lowpass filter");
        this.audio.source.disconnect();
        this.audio.source.connect(this.audio.gainNode);
        this.audio.gainNode.connect(this.audio.analyser);
        this.audio.analyser.connect(this.audio.audioCtx.destination);
    }
}

