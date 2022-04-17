import '../App.css'
import { Container, Row, Col } from 'react-bootstrap';
import { useNav } from '../hooks/useNav';
import 'bootstrap/dist/css/bootstrap.min.css';

function HomePage() {
    const aboutRef = useNav('HomePage');

    return (
        <main ref={aboutRef} id='homeContainer'>
            {/* navbar */}
            {/* <Navbar class="navbar navbar-expand-lg navbar-dark" variant="dark">
                <Container>
                    <NavLink class="navbar-brand" href="#"><img src="/assets/soundlinklogo.png" width="50%" alt=""/></NavLink>
                    <button 
                        class="navbar-toggler" 
                        type="button" 
                        variant="flat"
                        data-bs-toggle="collapse" 
                        data-bs-target="#navbarNavAltMarkup" 
                        aria-controls="navbarNavAltMarkup" 
                        aria-expanded="false" 
                        aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                    </button>
                    <Container class="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <Container className="navbar-nav justify-content-end">
                            <NavLink className="nav-link active" aria-current="page" href="#">home</NavLink>
                            <NavLink className="nav-link" href="#">about us</NavLink>
                            <NavLink className="nav-link" href="#">contact</NavLink>
                            <NavLink className="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">download</NavLink>
                        </Container>
                    </Container>         
                </Container>
            </Navbar> */}
            {/* description */}
            <Container style={{justifyContent:'center', display:'flex'}}>
                <Row className="container mt-5">
                    {/* body text */}
                    <Col>
                        <h1 className="description text-left text-bold">discover new sounds</h1>        
                        <h5 className="mt-5" style={{color:'white'}}>share your playlists with the world</h5>                                                             
                        <h5 className="mt-5" style={{color:'white'}}>join soundlink today</h5>
                    </Col>
                    {/* phone screen image */}
                    <Col>
                        <img
                            src="/assets/iphoneScreenDummy.jpg"
                            width="75%"
                            alt=""                            
                        />
                    </Col>
                </Row>
            </Container>
        </main>        
    )    
}

export default HomePage;

