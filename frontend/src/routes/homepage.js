import "../App.css";
import { Container, Row, Col } from "react-bootstrap";
import { useNav } from "../hooks/useNav";
import "bootstrap/dist/css/bootstrap.min.css";
import "../nav/Nav.css";

function HomePage() {
  const homeRef = useNav("HomePage");
  return (
    // /style={{marginTop: 25, marginBottom: 300}}
    <main ref={homeRef} id="homeContainer">
      {/* description */}

      <Container
        style={{
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
          height: "100vh",
          width: "100%",
          borderBottom: "1px solid lightgrey",
        }}
      >
        <Row className="container mt-5">
          {/* body text */}
          <Col>
            <h1 className="description text-left text-bold">
              discover new sounds
            </h1>
            <p className="mt-5" style={{ color: "white" }}>
              <strong>soundlink</strong> is a social media platform that
              emphasizes playlist sharing via its mobile app
            </p>
            <p style={{ color: "white" }}>
              users have the ability to post playlists through their spotify
              account
            </p>
            <p style={{ color: "white" }}>
              both followers and non-followers can interact with your content
              via likes, comments, reposts, and messages
            </p>
          </Col>
          {/* phone screen image */}
          <Col>
            <img src="/assets/mockup2.png" width="100%" alt="" />
          </Col>
        </Row>
      </Container>
    </main>
  );
}

export default HomePage;

// {/* navbar */}
// {/* <Navbar class="navbar navbar-expand-lg navbar-dark" variant="dark">
//     <Container>
//         <NavLink class="navbar-brand" href="#"><img src="/assets/soundlinklogo.png" width="50%" alt=""/></NavLink>
//         <button
//             class="navbar-toggler"
//             type="button"
//             variant="flat"
//             data-bs-toggle="collapse"
//             data-bs-target="#navbarNavAltMarkup"
//             aria-controls="navbarNavAltMarkup"
//             aria-expanded="false"
//             aria-label="Toggle navigation">
//         <span class="navbar-toggler-icon"></span>
//         </button>
//         <Container class="collapse navbar-collapse" id="navbarNavAltMarkup">
//             <Container className="navbar-nav justify-content-end">
//                 <NavLink className="nav-link active" aria-current="page" href="#">home</NavLink>
//                 <NavLink className="nav-link" href="#">about us</NavLink>
//                 <NavLink className="nav-link" href="#">contact</NavLink>
//                 <NavLink className="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">download</NavLink>
//             </Container>
//         </Container>
//     </Container>
// </Navbar> */}
