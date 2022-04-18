import '../App.css'
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNav } from '../hooks/useNav';
import 'bootstrap/dist/css/bootstrap.min.css';

const DownloadPage = () => {
    const aboutRef = useNav('DownloadPage');

    return (
		<main ref={aboutRef} id='downloadContainer' style={{marginBottom: 300}}>
			<Container style={{justifyContent:'center', display:'flex'}}>
				<Row className="container mt-5">
					{/* download buttons */}
					<Col style={{justifyContent:'center', display:'flex', flexDirection:'column', alignItems:'center'}}>
						<img
							src='/assets/downloadAppStore.png'					
							height="250px"
							width="250px"
							alt=""
						/>
						<img
							src='/assets/downloadGooglePlay.png'
							height="250px"
							width="250px"
							alt=""
						/>
					</Col>
					{/* body text */}
					<Col>				
						<h1 className="mt-4" style={{color:"#A57FC1", textAlign: 'right'}}>download our app</h1>
						<p className="mt-5" style={{textAlign: 'right', color: 'white'}}>click here to download</p>				
					</Col>
				</Row>
			</Container>
		</main>

	);

};

export default DownloadPage;