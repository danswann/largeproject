import "../App.css";
import { Container, Row, Col } from "react-bootstrap";
import { useNav } from "../hooks/useNav";
import "bootstrap/dist/css/bootstrap.min.css";
import "../nav/Nav.css";

const DownloadPage = () => {
  const downloadRef = useNav("DownloadPage");
  return (
    <main ref={downloadRef} id="downloadContainer">
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
          {/* download buttons */}
          <Col
            style={{
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              marginTop: 250,
              // alignItems:'center'
            }}
          >          
          <img
            src="/assets/downloadAppStore.png"
            height="50%"
            width="56%"
            alt=""
            style={{ paddingBottom: 10 }}/>

          <a href="https://expo.dev/artifacts/eas/jKeHEGCBPHjk3PgPK5knL7.apk"
              style={{
              // display: "flex",
              height:"50%",
              width:"75%" }}>
            <img
              src="https://uploads-ssl.webflow.com/5e71ed41f21ba5aeba14497f/5ec7db7df972fafdfaba03d7_android-apk-button.png"
              width= "75%"
              alt=""
              style={{ paddingTop: 10 }}/>
          </a>            
          </Col>
          {/* body text */}
          <Col>
            <h1
              className="mt-4"
              style={{ color: "#A57FC1", textAlign: "right" }}
            >
              share your playlists with the world
            </h1>
            <p className="mt-5" style={{ textAlign: "right", color: "white" }}>
              join <strong>soundlink</strong> today for free
            </p>
            <p style={{ textAlign: "right", color: "white" }}>
              available on both iphone and android
            </p>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default DownloadPage;
