import axios from "axios";
axios.defaults.withCredentials = true;

/*sessionStatus Function
This function checks and returns the current state of the users session.
Accepts a dispatch function, from SessionContext
Uses the "SESSIOIN_STATE" switch for the SessionReducer
Waits until the Axios request is completed to return value
Returns session object which gets updated on SessionContext
Used when app is first loaded to check if user already has active session
Used in AuthRedirect to protect links from unauth access
*/
export const sessionStatus = async (dispatch) => {
    const serverSession = await axios("http://localhost:8080/forum/session");
    
    dispatch({
        type: "SESSION_STATE",
        serverSession
    });
}

export const sessionDestroy = async (dispatch) => {
    const destroyedSession = await axios("http://localhost:8080/forum/logout");
    
    dispatch({
        type: "SESSION_DESTROY",
        destroyedSession
    });
}


export const fakeSession = async (dispatch) => {
    const fakeSession = await axios("http://localhost:8080/forum/fakelogin");

    dispatch({
        type: "FAKE_LOGIN",
        fakeSession
    })
}