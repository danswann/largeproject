import '../App.css'
import { Container, Row, Col } from 'react-bootstrap';
import { useNav } from '../hooks/useNav';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../nav/Nav.css';

const AboutPage = () => {
    const aboutRef = useNav('AboutPage');

    return (
        <main ref={aboutRef} id='aboutContainer' style={{marginBottom: 300}}>
            <Container style={{
                    justifyContent:'center', 
                    display:'flex',
                    alignItems: 'center',
                    height: '100vh',
                    width: "100%",
                    borderBottom: "1px solid lightgrey",
                }}>
                <Row className="container mt-5">
                    {/* body text */}
                    <Col>				
                        <h1 className="description mt-4">meet the team</h1>
                        <p className="mt-5" style={{color: 'white'}}>
                            pictured from left to right: 
                            <br></br><br></br>
                            roberto, doug, will, jason, sebastian, jinan, daniel
                        </p>
                    </Col>
                    {/* Image */}
                    <Col>
                        <img
                            src='./assets/group.jpg'
                            alt=""
                            width="100%"
                        />
                    </Col>
                </Row>
            </Container>
        </main>
          
    )
};

// const styles = StyleSheet.create({});

export default AboutPage;

