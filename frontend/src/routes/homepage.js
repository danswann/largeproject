import '../App.css'
// import Container from 'react-bootstrap/Container'
// import Navbar from 'react-bootstrap/Navbar';
// import Nav from 'react-bootstrap/Nav';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function HomePage() {
    return (
        <main>            
            {/* <Navbar class="navbar navbar-expand-lg navbar-light bg-light fixed-top" >
                <Container>
                    <Navbar.Brand class="navbar-brand" href="#"><img src="/assets/soundlinklogo.png" alt="" style={styles.logo}/></Navbar.Brand>
                    <Nav className="description">                    
                        <Nav.Link href="#home" className="description">home</Nav.Link>
                        <Nav.Link href="#aboutus">about us</Nav.Link>
                        <Nav.Link href="#contact">contact</Nav.Link>
                        <Nav.Link class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">download</Nav.Link>
                    </Nav>
                </Container>
            </Navbar> */}
            <Navbar class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
                <Container>
                    <Nav.Link class="navbar-brand" href="#"><img src="/assets/soundlinklogo.png" width="65%" alt=""/></Nav.Link>
                    <button 
                        class="navbar-toggler" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#navbarNavAltMarkup" 
                        aria-controls="navbarNavAltMarkup" 
                        aria-expanded="false" 
                        aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                    </button>
                    <Container class="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
                        <Container className="navbar-nav">
                            <Nav.Link className="nav-link active" aria-current="page" href="#">home</Nav.Link>
                            <Nav.Link className="nav-link" href="#">about us</Nav.Link>
                            <Nav.Link className="nav-link" href="#">contact</Nav.Link>
                            <Nav.Link className="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">download</Nav.Link>
                        </Container>
                    </Container>         
                </Container>
            </Navbar>
            <h3 className="description">discover new sounds</h3>              
        </main>        
    )    
}

// const styles = StyleSheet.create({
//     logo: {
//         width: "65%",
//     },
// })

export default HomePage;

