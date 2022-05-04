import './App.css';
import Audio from './Audio.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Navbar, Nav, Row, Col, Card, Stack, Button } from 'react-bootstrap';
import { PlayFill, PauseFill, MusicNote } from "react-bootstrap-icons";
import React from 'react'

function App() {
  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" expand="sm">
        <Container>
          <Navbar.Brand href="#home">app name</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#link">Github</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container md>
        <br></br>
        <Row>
          <Col>
            <Stack gap={3}>
              <Card className="audio-card">
                <Card.Body>Audio 1 track name
                  <Stack gap={3}>
                    <div>
                      track position
                    </div>
                    <Audio/>
                    <div>
                      speed
                    </div>
                    <div>
                      <MusicNote size="30" />
                      <Button variant="outline-light">Choose Audio</Button>{' '}
                    </div>
                    <div>
                      visualisation
                    </div>
                  </Stack>
                </Card.Body>
              </Card>
              <Card className='filter-card'>
                <Card.Body>Filters
                  <Stack gap={3}>
                    <Button variant="outline-light">Filter</Button>{' '}
                    <Button variant="outline-light">Filter</Button>{' '}
                    <Button variant="outline-light">Filter</Button>{' '}
                  </Stack>
                </Card.Body>
              </Card>
            </Stack></Col>
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
                <Card.Body>Audio 2 track name
                  <Stack gap={3}>

                    <div>
                      position
                    </div>
                    <div>
                      <Button variant="outline-light" ><PlayFill size="30" /></Button>{' '}
                      <Button variant="outline-light" ><PauseFill size="30" /></Button>{' '}
                    </div>
                    <div>
                      speed
                    </div>

                    <div>
                      <MusicNote size="30" />
                      <Button variant="outline-light">Choose Audio</Button>{' '}
                    </div>
                    <div>
                      visualisation
                    </div>
                  </Stack>
                </Card.Body>
              </Card>
              <Card className='filter-card'>
                <Card.Body>Filters
                  <Stack gap={3}>
                    <Button variant="outline-light">Filter</Button>{' '}
                    <Button variant="outline-light">Filter</Button>{' '}
                    <Button variant="outline-light">Filter</Button>{' '}
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


