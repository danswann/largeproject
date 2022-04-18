import '../App.css'
import { Container, Row, Col } from 'react-bootstrap';
import { useNav } from '../hooks/useNav';
import 'bootstrap/dist/css/bootstrap.min.css';

const DownloadPage = () => {
    const aboutRef = useNav('DownloadPage');

    return (
		<main ref={aboutRef} id='downloadContainer'>
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
						<h1 className="description mt-4">download our app</h1>
						<p style={{color: 'white'}}>click here to download</p>				
					</Col>
				</Row>
			</Container>
		</main>

	);

};

export default DownloadPage;