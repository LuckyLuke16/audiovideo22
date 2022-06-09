import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Card, Stack} from "react-bootstrap";

export default class Crossfade extends React.Component{

    render(){
        return(
            <Card className='volume-card'>

                <Card.Body>
                    <p>Crossfade</p>
                    <Stack gap={3}>
                        <Stack direction="horizontal" gap={4} className="col-md-5 mx-auto">
                        </Stack>
                    </Stack>
                </Card.Body>
            </Card>
        );
    }
}