import "../App.css";
import { Container, Row, Col } from "react-bootstrap";
import { useNav } from "../hooks/useNav";
import "bootstrap/dist/css/bootstrap.min.css";
import "../nav/Nav.css";
import Carousel from "react-bootstrap/Carousel";
import { useState } from "react";
import { MobileView, BrowserView } from "react-device-detect";

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
      <BrowserView>
        {console.log("BROWSER VIEW")}
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
                interval={null}
                style={{ right: "12%" }}
              >
                {console.log(index)}
                <Carousel.Item
                  style={{
                    height: 650,
                    width: 300,
                    left: "25%",
                    marginBottom: 70,
                  }}
                >
                  <img
                    className="d-block w-100"
                    src="./assets/Demos/DemoHome.gif"
                    alt="Home Slide"
                    style={{ objectFit: "contain" }}
                  />
                </Carousel.Item>
                <Carousel.Item
                  style={{
                    height: 650,
                    width: 300,
                    left: "25%",
                    marginBottom: 70,
                  }}
                >
                  <img
                    className="d-block w-100"
                    src="./assets/Demos/DemoSearch.gif"
                    alt="Search Slide"
                    style={{ objectFit: "contain" }}
                  />
                </Carousel.Item>
                <Carousel.Item
                  style={{
                    height: 650,
                    width: 300,
                    left: "25%",
                    marginBottom: 70,
                  }}
                >
                  <img
                    className="d-block w-100"
                    src="./assets/Demos/DemoCreate.gif"
                    alt="Create Slide"
                    style={{ objectFit: "contain" }}
                  />
                </Carousel.Item>
                <Carousel.Item
                  style={{
                    height: 650,
                    width: 300,
                    left: "25%",
                    marginBottom: 70,
                  }}
                >
                  <img
                    className="d-block w-100"
                    src="./assets/Demos/DemoNotifications.gif"
                    alt="Notifications Slide"
                  />
                </Carousel.Item>
                <Carousel.Item
                  style={{
                    height: 650,
                    width: 300,
                    left: "25%",
                    marginBottom: 70,
                  }}
                >
                  <img
                    className="d-block w-100"
                    src="./assets/Demos/DemoProfile.gif"
                    alt="Profile Slide"
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
                  <strong style={{ fontSize: 26 }}>home</strong> <br />
                  interact with posts by liking, commenting, or reposting
                  <br />
                  view posts created by users you follow
                </p>
              ) : index === 1 ? (
                <p
                  className="mt-5"
                  style={{ textAlign: "right", color: "white" }}
                >
                  <strong style={{ fontSize: 26 }}>search</strong> <br />
                  view the most popular users on <strong>soundlink</strong>{" "}
                  <br />
                  search for users via the search bar
                </p>
              ) : index === 2 ? (
                <p
                  className="mt-5"
                  style={{ textAlign: "right", color: "white" }}
                >
                  <strong style={{ fontSize: 26 }}>create</strong> <br />
                  link your spotify account and share <br />
                  your music taste to the world
                </p>
              ) : index === 3 ? (
                <p
                  className="mt-5"
                  style={{ textAlign: "right", color: "white" }}
                >
                  <strong style={{ fontSize: 26 }}>notifications</strong> <br />
                  see who is interacting with you and your posts <br />
                  create conversations with <strong>soundlink</strong> users
                </p>
              ) : index === 4 ? (
                <p
                  className="mt-5"
                  style={{ textAlign: "right", color: "white" }}
                >
                  <strong style={{ fontSize: 26 }}>profile</strong> <br />
                  view your posts and what you have liked <br />
                  share a little bit about yourself with a bio
                </p>
              ) : (
                <p></p>
              )}
            </Col>
          </Row>
        </Container>
      </BrowserView>

      {/* MOBILE VERSION */}
      <MobileView>
        <Container
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100%",
            borderBottom: "1px solid lightgrey",
          }}
        >
          <Row>
            {/* body text */}
            <Col style={{ marginTop: 150 }}>
              <h1
                className="mt-4"
                style={{ color: "#A57FC1", textAlign: "right" }}
              >
                explore app features
              </h1>
              {index === 0 ? (
                <p
                  className="mt-5"
                  style={{ textAlign: "right", color: "white", fontSize: 20 }}
                >
                  <strong style={{ fontSize: 26 }}>home</strong> <br />
                  interact with posts by liking, commenting, or reposting view
                  posts created by users you follow
                </p>
              ) : index === 1 ? (
                <p
                  className="mt-5"
                  style={{ textAlign: "right", color: "white", fontSize: 20 }}
                >
                  <strong style={{ fontSize: 26 }}>search</strong> <br />
                  view the most popular users on <strong>soundlink</strong>{" "}
                  <br />
                  search for users via the search bar
                </p>
              ) : index === 2 ? (
                <p
                  className="mt-5"
                  style={{ textAlign: "right", color: "white", fontSize: 20 }}
                >
                  <strong style={{ fontSize: 26 }}>create</strong> <br />
                  link your spotify account and share <br />
                  your music taste to the world
                </p>
              ) : index === 3 ? (
                <p
                  className="mt-5"
                  style={{ textAlign: "right", color: "white", fontSize: 20 }}
                >
                  <strong style={{ fontSize: 26 }}>notifications</strong> <br />
                  see who is interacting with you and your posts <br />
                  create conversations with <strong>soundlink</strong> users
                </p>
              ) : index === 4 ? (
                <p
                  className="mt-5"
                  style={{ textAlign: "right", color: "white", fontSize: 20 }}
                >
                  <strong style={{ fontSize: 26 }}>profile</strong> <br />
                  view your posts and what you have liked <br />
                  share a little bit about yourself with a bio
                </p>
              ) : (
                <p></p>
              )}
            </Col>
          </Row>
          <Row className="container mt-5">
            {/* Image */}
            <Col>
              {/* Carousel controls the slideshow, carousel items nested within contain the desired image */}
              <Carousel
                fade
                activeIndex={index}
                onSelect={handleSelect}
                interval={null}
              >
                {console.log(index)}
                <Carousel.Item
                  style={{
                    height: 1412,
                    width: 620,
                    marginBottom: 70,
                  }}
                >
                  <img
                    className="d-block w-100"
                    src="./assets/Demos/DemoHome.gif"
                    alt="Home Slide"
                    style={{ objectFit: "contain" }}
                  />
                </Carousel.Item>
                <Carousel.Item
                  style={{
                    height: 1412,
                    width: 620,
                    marginBottom: 70,
                  }}
                >
                  <img
                    className="d-block w-100"
                    src="./assets/Demos/DemoSearch.gif"
                    alt="Search Slide"
                    style={{ objectFit: "contain" }}
                  />
                </Carousel.Item>
                <Carousel.Item
                  style={{
                    height: 1412,
                    width: 620,
                    marginBottom: 70,
                  }}
                >
                  <img
                    className="d-block w-100"
                    src="./assets/Demos/DemoCreate.gif"
                    alt="Create Slide"
                    style={{ objectFit: "contain" }}
                  />
                </Carousel.Item>
                <Carousel.Item
                  style={{
                    height: 1412,
                    width: 620,
                    marginBottom: 70,
                  }}
                >
                  <img
                    className="d-block w-100"
                    src="./assets/Demos/DemoNotifications.gif"
                    alt="Notifications Slide"
                  />
                </Carousel.Item>
                <Carousel.Item
                  style={{
                    height: 1412,
                    width: 620,
                    marginBottom: 70,
                  }}
                >
                  <img
                    className="d-block w-100"
                    src="./assets/Demos/DemoProfile.gif"
                    alt="Profile Slide"
                  />
                </Carousel.Item>
              </Carousel>
            </Col>
          </Row>
        </Container>
      </MobileView>
    </main>
  );
};

export default AppFeaturesPage;
