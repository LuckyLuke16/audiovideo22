import React from "react";
import {Button} from "react-bootstrap";
import {PauseFill, PlayFill} from "react-bootstrap-icons";

export default class Audio extends React.Component{
    state = {
        song: process.env.PUBLIC_URL + 'freejazz.wav',
        audioCtx: null,
        buffer: null,
    }
    render() {
        return (
            <div>
                <Button
                    variant="outline-light"
                    onClick={() => this.load()}>
                    <PlayFill size="30" />
                </Button>{' '}
                <Button variant="outline-light"
                        onClick={() => this.play()}>
                <PauseFill size="30" /></Button>{' '}
            </div>
        )
    }
    load() {
        let audioCtx = new AudioContext();
        let source = audioCtx.createBufferSource();

        let request = new XMLHttpRequest();

        request.open('GET', 'example.mp3', true);
        request.responseType = 'arraybuffer';

        request.onload = function() {
            let audioData = request.response;
            console.log(audioCtx);
            audioCtx.decodeAudioData(audioData, function(buffer) {
                console.log("start");
                source.buffer = buffer;
                source.connect(audioCtx.destination);
                source.loop = true;
                source.start(0);
                let float32Data = buffer.getChannelData(0);
                let dataView = new DataView(float32Data.buffer);
            });
        };
        request.send();
    }
}

