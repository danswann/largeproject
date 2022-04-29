import "../App.css";
import { Container, Row, Col } from "react-bootstrap";
import { useNav } from "../hooks/useNav";
import "bootstrap/dist/css/bootstrap.min.css";
import "../nav/Nav.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

const AppFeaturesPage = () => {
  const appFeaturesRef = useNav("AppFeatures");

  return (
    <main
      ref={appFeaturesRef}
      id="appFeaturesContainer"
      style={{ marginBottom: 300 }}
    >
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
        <Row
          className="container mt-5"
          style={{ height: "75%", backgroundColor: "red" }}
        >
          {/* Image */}
          <Col
            style={{
              height: "100%",
              backgroundColor: "yellow",
            }}
          >
            <Carousel infiniteLoop={true} dynamicHeight={true}>
              <div>
                <img
                  src="./assets/Demos/DemoHome.gif"
                  alt=""
                  height={"100%"}
                  style={{
                    objectFit: "contain",
                  }}
                />
              </div>
              <div>
                <img
                  src="./assets/Demos/DemoSearch.gif"
                  alt=""
                  style={{
                    objectFit: "contain",
                  }}
                />
              </div>
              <div>
                <img
                  src="./assets/Demos/DemoCreate.gif"
                  alt=""
                  style={{
                    objectFit: "contain",
                  }}
                />
              </div>
            </Carousel>
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

// const styles = StyleSheet.create({});

export default AppFeaturesPage;
