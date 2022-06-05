import './App.css';
import Audio from './Audio.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Navbar, Nav, Row, Col, Card, Stack } from 'react-bootstrap';
import {Github, FileEarmarkMusicFill} from "react-bootstrap-icons";
import React from 'react';

function App() {
  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" expand="sm">
        <Container>
          <Navbar.Brand id="appTitle" href="#home"><FileEarmarkMusicFill size="60"/>AudioPlayer</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            <Nav >
              <Nav.Link id="Github" href="https://github.com/LuckyLuke16/audiovideo22"><Github size="50"/>    Github</Nav.Link>
            </Nav>
        </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container >
        <br></br>
        <Row>
          <Col>
            <Stack gap={3}>
              <Card className="audio-card">
                <Card.Body>
                  <Stack gap={3}>
                    <Audio
                    value='1'/>
                  </Stack>
                </Card.Body>
              </Card>
            </Stack>
          </Col>
          <Col>
            <Card className='volume-card'>

              <Card.Body>Volume
                <Stack gap={3}>
                  <div>
                    Crossfading
                  </div>

                  <Stack direction="horizontal" gap={4} className="col-md-5 mx-auto">
                    <div >A</div>
                    <div >Master</div>
                    <div >B</div>
                  </Stack>

                </Stack>
              </Card.Body>
            </Card></Col>
          <Col>
            <Stack gap={3}>

              <Card className='audio-card'>
                <Card.Body>
                  <Stack gap={3}>
                    <Audio
                    value='2'/>
                  </Stack>
                </Card.Body>
              </Card>
            </Stack>
          </Col>

        </Row>

      </Container>



    </div>
  );
}

export default App;


