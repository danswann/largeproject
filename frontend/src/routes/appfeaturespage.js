import "../App.css";
import { Container, Row, Col } from "react-bootstrap";
import { useNav } from "../hooks/useNav";
import "bootstrap/dist/css/bootstrap.min.css";
import "../nav/Nav.css";
import Carousel from "react-bootstrap/Carousel";
import { useState } from "react";

const AppFeaturesPage = () => {
  const appFeaturesRef = useNav("AppFeatures");

  // Tracking the index of the slide that is currently displayed
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

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
        <Row className="container mt-5" style={{ height: "75%" }}>
          {/* Image */}
          <Col
            style={{
              height: "100%",
            }}
          >
            <Carousel
              fade
              activeIndex={index}
              onSelect={handleSelect}
              style={{ right: "12%" }}
            >
              {console.log(index)}
              <Carousel.Item style={{ height: 650, width: 300, left: "25%" }}>
                <img
                  className="d-block w-100"
                  src="./assets/Demos/DemoHome.gif"
                  alt="First slide"
                  style={{ objectFit: "contain" }}
                />
              </Carousel.Item>
              <Carousel.Item style={{ height: 650, width: 300, left: "25%" }}>
                <img
                  className="d-block w-100"
                  src="./assets/Demos/DemoSearch.gif"
                  alt="First slide"
                  style={{ objectFit: "contain" }}
                />
              </Carousel.Item>
              <Carousel.Item style={{ height: 650, width: 300, left: "25%" }}>
                <img
                  className="d-block w-100"
                  src="./assets/Demos/DemoCreate.gif"
                  alt="First slide"
                  style={{ objectFit: "contain" }}
                />
              </Carousel.Item>
              <Carousel.Item style={{ height: 650, width: 300, left: "25%" }}>
                <img
                  className="d-block w-100"
                  src="./assets/Demos/DemoNotifications.gif"
                  alt="First slide"
                  style={{ objectFit: "contain" }}
                />
              </Carousel.Item>
              <Carousel.Item style={{ height: 650, width: 300, left: "25%" }}>
                <img
                  className="d-block w-100"
                  src="./assets/Demos/DemoProfile.gif"
                  alt="First slide"
                  style={{ objectFit: "contain" }}
                />
              </Carousel.Item>
            </Carousel>
          </Col>
          {/* body text */}
          <Col>
            <h1
              className="mt-4"
              style={{ color: "#A57FC1", textAlign: "right" }}
            >
              explore app features
            </h1>
            {index === 0 ? (
              <p
                className="mt-5"
                style={{ textAlign: "right", color: "white" }}
              >
                home
              </p>
            ) : index === 1 ? (
              <p
                className="mt-5"
                style={{ textAlign: "right", color: "white" }}
              >
                search
              </p>
            ) : index === 2 ? (
              <p
                className="mt-5"
                style={{ textAlign: "right", color: "white" }}
              >
                create
              </p>
            ) : index === 3 ? (
              <p
                className="mt-5"
                style={{ textAlign: "right", color: "white" }}
              >
                notifications
              </p>
            ) : index === 4 ? (
              <p
                className="mt-5"
                style={{ textAlign: "right", color: "white" }}
              >
                profile
              </p>
            ) : (
              <p></p>
            )}
          </Col>
        </Row>
      </Container>
    </main>
  );
};

// const styles = StyleSheet.create({});

export default AppFeaturesPage;
