
function ConnectionSuccess() {
    return (
        <span style={{color:"green"}}>Spotify account succesfully connected!</span>
    )
}

function ConnectionFailure() {
    return (
        <span style={{color:"red"}}>Spotify account connection failed!</span>
    )
}

function SpotifyConnect(props) {
    return (
        <div>
            <h3>Spotify Account Connection</h3>
            {props.success ? <ConnectionSuccess /> : <ConnectionFailure />}
        </div>
    );
}

export default SpotifyConnect;