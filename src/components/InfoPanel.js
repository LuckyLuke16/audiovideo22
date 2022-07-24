import '../css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Card, Stack} from "react-bootstrap";

export default class InfoPanel extends React.Component{

    render(){
        return(
            <Card className='volume-card'>
                <Card.Body>
                    <p
                        id="textInCenter"
                    >
                        This frontend application was developed as a tool to play two audio files simultaneously.
                        The basic functionalities include stopping audio files as well as uploading local files
                        or changing the playback speed. With the help of the "Web Audio API" you can also manipulate the audio data or apply filters.
                        This project was developed as a part of the "Basics of
                        multimedia: audio - and video engineering" course by three students from the "University of
                        Applied Sciences" in Berlin.
                        <br/>(Artur Horch, Ekaterina Losik, Justin Max Grothe)
                    </p>
                    <Stack gap={3}>
                        <Stack direction="horizontal" gap={4} className="col-md-5 mx-auto">
                        </Stack>
                    </Stack>
                </Card.Body>
            </Card>
        );
    }
}
