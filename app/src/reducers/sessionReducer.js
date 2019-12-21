
export const sessionReducer = (state, action) => {
    switch(action.type) {
        case "SESSION_SET": 
            const user = action.loginSession.user;
            const newState = {...state, user}
            return newState;

        case "SESSION_STATE":
            const sessionStatus = action.serverSession.data;
            return sessionStatus;

        case "SESSION_DESTROY":
            const destroyedSession = action.destroyedSession.data;
            console.log("session destroy activeated", destroyedSession)
            return destroyedSession;

        case "FAKE_LOGIN":
            console.log("login activated")
            const fakeSession = action.fakeSession.data;
            return fakeSession;
        default:
            return state;
    }
}