import '../App.css'
import { Container, Row, Col } from 'react-bootstrap';
import { useNav } from '../hooks/useNav';
import 'bootstrap/dist/css/bootstrap.min.css';

const ContactPage = () => {
    const aboutRef = useNav('ContactPage');

    return (
        <Container style={{justifyContent:'center', display:'flex'}} ref={aboutRef} id='contactContainer'>
            <Row className="container mt-5">
                {/* body text */}
                <Col>				
                    <h1 className="description mt-4">contact</h1>
                    <p style={{color: 'white'}}>This is the contact section</p>
                </Col>
                {/* Image */}
                <Col>
                    <img
                        src='https://source.unsplash.com/random/600x600/?nature,water'
                        alt='unsplash-img'
                        width="75%"
                    />
                </Col>
            </Row>
        </Container>  
    )
};

// const styles = StyleSheet.create({});

export default ContactPage;

