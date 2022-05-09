import React from "react";
import {Button} from "react-bootstrap";
import {MusicNote, PauseFill, PlayFill} from "react-bootstrap-icons";




export default class Audio extends React.Component{
    state = {
        song: process.env.PUBLIC_URL + 'basic_beat.wav',
        audioCtx: null,
        buffer: null,
    }

    render() {
        return (
            <div>
                <div>
                    track position
                </div>
                <Button
                    variant="outline-light"
                    onClick={() => this.load()}>
                    <PlayFill size="30" />
                </Button>{' '}
                <Button variant="outline-light"
                        onClick={() => this.pause()}>
                <PauseFill size="30" /></Button>{' '}

                <div>
                    speed
                </div>
                <div>
                    <MusicNote size="30" />
                    <Button variant="outline-light">
                        <input type="file"
                               id="dateien"
                               name="file"
                               accept=".wav,.mp3,.ogg"
                               onChange={() => this.handleFileUpload()}
                        />Choose Audio</Button>{' '}

                </div>
                <div>
                    visualisation
                </div>

            </div>

        )
    }
    load() {
        console.log(this.state.song);
        let audioCtx = new AudioContext();
        let source = audioCtx.createBufferSource();

        let request = new XMLHttpRequest();

        request.open('GET', this.state.song, true);
        request.responseType = 'arraybuffer';

        request.onload = function() {
            let audioData = request.response;
            audioCtx.decodeAudioData(audioData, function(buffer) {
                console.log("start");
                source.buffer = buffer;
                source.connect(audioCtx.destination);
                source.loop = true;
                source.start(0);
                //let float32Data = buffer.getChannelData(0);
                //let dataView = new DataView(float32Data.buffer);
            });
        };
        request.send();
    }
    pause(){
        let audioCtx = this.state.audioCtx;
        if(audioCtx.state = "running"){
            console.log("paused");
            audioCtx.suspend();
        }

    }

    /**
     * input file element of the audio component render function gives containing file to song path
     * of component
     */
    handleFileUpload() {
        const input = document.querySelector('input');
        const curFiles = input.files;
        if(curFiles.item(0)!=null) {
            this.state.song = URL.createObjectURL(curFiles[0]);
        }

    }
}

