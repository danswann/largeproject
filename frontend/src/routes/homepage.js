import '../App.css'
// import Container from 'react-bootstrap/Container'
// import Navbar from 'react-bootstrap/Navbar';
// import Nav from 'react-bootstrap/Nav';
import { Container, Nav, Navbar, NavLink } from 'react-bootstrap';
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
            <Navbar class="navbar navbar-expand-lg navbar-dark" variant="dark">
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

