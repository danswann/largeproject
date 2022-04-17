import '../App.css'
import { Container, Row, Col } from 'react-bootstrap';
import { useNav } from '../hooks/useNav';
import 'bootstrap/dist/css/bootstrap.min.css';

const AboutPage = () => {
    const aboutRef = useNav('AboutPage');

    return (
		<main ref={aboutRef} id='aboutContainer'>
			<Container style={{justifyContent:'center', display:'flex'}}>
				<Row className="container mt-5">
					{/* Image */}
					<Col>
						<img
							src='https://source.unsplash.com/random/600x600/?nature,water'							
							width="75%"
							alt='unsplash-img'							
						/>
					</Col>
					{/* body text */}
					<Col>				
						<h1 className="description mt-4">about us</h1>
						<h5 style={{color: 'white'}}>This is the about section</h5>				
					</Col>
				</Row>
			</Container>
		</main>

	);

};

export default AboutPage;