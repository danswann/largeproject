
function ConnectionSuccess() {
    return (
        <h3 className="text-center"             
            style={{
            color: "white",
            fontWeight: "bold",
            marginTop: 900,
            // justifyContent: "center",
            // verticalAlign: "middle",
            // position: "relative",
            // top: "25%",
            // bottom: "25%",
            }}>Spotify account successfully connected!</h3>
    )
}

function ConnectionFailure() {
    return (
        <h3 className= "text-center"             
            style={{
            color:"red",
            fontWeight: "bold",
            marginTop: 900,
            }}>Spotify failed to connect! Try again.</h3>
    )
}

function SpotifyConnect(props) {
    return (
        <div style={{justifyContent: "center", textAlign: "center", verticalAlign: "middle"}}>            
            {props.success ? <ConnectionSuccess /> : <ConnectionFailure />}
        </div>
    );
}

export default SpotifyConnect;

