import './App.css';
import Audio from './Audio.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Stack, Button } from 'react-bootstrap';
import React from 'react';

export default class Filter extends React.Component{
    constructor(props) {
        console.log("render");
        super(props);
        this.state = {
            nodeBeforeFilter : this.props.before,
            nodeAfterFilter : this.props.after,
        }
         if(this.props.audioCtx === null) {
             console.log('schlecht');
             return;
         }
        this.lowpassFilter = this.props.audioCtx;
        this.setFilter(this.props.nodeBeforeFilter,this.props.nodeAfterFilter,this.props.audioCtx);
        console.log("gut");
    }
    setFilter(nodeOne, nodeTwo, context){
        this.lowpassFilter = context.createBiquadFilter();
        this.lowpassFilter.type = "lowpass";
        this.lowpassFilter.frequency.setValueAtTime(500,context.currentTime);
        nodeOne.connect(this.lowpassFilter);
        this.lowpassFilter.connect(nodeTwo);
    }
    render(){
        return(
            <Card className='filter-card'>
                <Card.Body>Filters
                    <Stack gap={3}>
                        <Button variant="outline-light">Lowpass Filter</Button>{' '}
                        <Button variant="outline-light">Filter</Button>{' '}
                        <Button variant="outline-light">Filter</Button>{' '}
                    </Stack>
                </Card.Body>
            </Card>
        );
    }



}
