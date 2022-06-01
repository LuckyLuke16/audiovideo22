import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Stack, Button } from 'react-bootstrap';
import React from 'react';

export default class Filter extends React.Component{
    constructor(props) {
        console.log("render");
        super(props);
        this.audio = this.props.audio;
        this.isLowpassOn = false;
        this.lowpassFilter = null;
    }
    setFilter(filterTyp){
        console.log(this.audio.audioCtx);
        if(this.audio.audioCtx === null) {
            return;
        }
        switch(filterTyp){
            case "lowpass":
                if(this.isLowpassOn === false) {
                    this.setLowpassFilterOn();
                }else
                    this.setLowpassFilterOff();
                this.isLowpassOn = !this.isLowpassOn;
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
                        <Button variant="outline-light"
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
        console.log("update in Props occured");
        if(this.props.audio !== prevProps.audio){
            console.log("change detected");
            this.audio = this.props.audio;
        }
    }

    setLowpassFilterOn() {
            this.lowpassFilter = this.audio.audioCtx.createBiquadFilter();
            this.lowpassFilter.type = "lowpass";
            this.lowpassFilter.frequency.setValueAtTime(500,this.audio.audioCtx.currentTime);
            this.audio.source.disconnect();
            console.log("turn on lowpass filter");
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

