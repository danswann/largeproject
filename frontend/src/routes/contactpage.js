import '../App.css'
import { Container, Row, Col } from 'react-bootstrap';
import { useNav } from '../hooks/useNav';
import 'bootstrap/dist/css/bootstrap.min.css';

const ContactPage = () => {
    const aboutRef = useNav('ContactPage');

    return (
        <main ref={aboutRef} id='contactContainer' style={{marginBottom: 300}}>
            <Container style={{justifyContent:'center', display:'flex'}}>
                <Row className="container mt-5">
                    {/* body text */}
                    <Col>				
                        <h1 className="description mt-4">contact</h1>
                        <p className="mt-5" style={{color: 'white'}}>This is the contact section</p>
                    </Col>
                    {/* Image */}
                    <Col>
                        <img
                            src='https://source.unsplash.com/random/600x600/?nature,water'
                            alt='unsplash-img'
                            width="100%"
                        />
                    </Col>
                </Row>
            </Container>
        </main>
          
    )
};

// const styles = StyleSheet.create({});

export default ContactPage;

