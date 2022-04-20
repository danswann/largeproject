function PasswordSuccess() {
    return (
        <h3 className="text-center"             
            style={{
            color:"white",
            fontWeight: "bold",
            marginTop: 900,
            }}>Thank you for verifying your email! 
            You may now go back to the app to change your password.</h3>        
    )
}

function PasswordFailure() {
    return (
        <h3 className="text-center"             
            style={{
            color:"red",
            fontWeight: "bold",
            marginTop: 900,
            }}>We couldn't verify your email, try again</h3>   
    )    
}

function PasswordValidation(props) {
    return (
        <div>            
            {props.success ? <PasswordSuccess /> : <PasswordFailure />}
        </div>
    );
}

export default PasswordValidation;