import '../App.css'
import { Container, Row, Col } from 'react-bootstrap';
import { useNav } from '../hooks/useNav';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../nav/Nav.css';

const DownloadPage = () => {
    const aboutRef = useNav('DownloadPage');

    return (
		<main ref={aboutRef} id='downloadContainer' style={{marginBottom: 300}}>
			<Container style={{justifyContent:'center', display:'flex'}}>
				<Row className="container mt-5">
					{/* download buttons */}
					<Col style={{
							justifyContent:'center', 
							display:'flex', 
							flexDirection:'column',
							marginTop: 250, 							
							// alignItems:'center'
						}}>
						<img
							src='/assets/downloadAppStore.png'					
							height="55%"
							width="55%"
							alt=""
							style={{paddingBottom: 10}}
						/>						
						<img
							src='/assets/downloadGooglePlay.png'
							height="55%"
							width="55%"
							alt=""
							style={{paddingTop: 10}}
						/>
					</Col>
					{/* body text */}
					<Col>				
						<h1 className="mt-4" style={{color:"#A57FC1", textAlign: 'right'}}>share your playlists with the world</h1>
						<p className="mt-5" style={{textAlign: 'right', color: 'white'}}>join soundlink today for free</p>				
                        <p style={{textAlign: 'right', color: 'white'}}>available on both iphone and android</p>
					</Col>
				</Row>
			</Container>
		</main>

	);

};

export default DownloadPage;