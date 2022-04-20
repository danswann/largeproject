function EmailSuccess() {
    return (
        <h3 className="text-center"             
            style={{
            color:"white",
            fontWeight: "bold",
            marginTop: 900,
            }}>Your account has been successfully verified. You may now return to the app.</h3>
    )
}

function EmailFailure() {
    return (
        <h3 className="text-center"             
            style={{
            color:"white",
            fontWeight: "bold",
            marginTop: 900,
            }}>Your account could not be connected. Try again</h3>
    )
}

function EmailConnect(props) {
    return (
        <div>
            {props.success ? <EmailSuccess /> : <EmailFailure />}
        </div>
    )
}

export default EmailConnect;