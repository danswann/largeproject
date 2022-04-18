
function ConnectionSuccess() {
    return (
        <h3 className="text-center" style={{color:"green"}}>Spotify account succesfully connected!</h3>
    )
}

function ConnectionFailure() {
    return (
        <h3 className="text-center" style={{color:"red"}}>Spotify account connection failed!</h3>
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

