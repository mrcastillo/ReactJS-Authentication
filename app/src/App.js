import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import SessionContextProvider from "./context/SessionContext";

import Navbar from "./components/Navbar";
import Homepage from "./components/Homepage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import TestLogin from "./components/TestLogin";
import AuthRedirect from './components/AuthRedirect';
import Profile from "./components/Profile";
import Logout from "./components/Logout";
//Providers



class App extends Component {
  render(){
    return(
      <div className={"app-container"}>
        <SessionContextProvider>
            <Router>
                <Navbar />
                
                <Switch>
                  <Route path={"/login"}>
                    <AuthRedirect hideOnLogin={true}>
                      <Login />
                    </AuthRedirect>
                  </Route>

                  <Route path={"/logout"}>
                    <AuthRedirect>
                      <Logout />
                    </AuthRedirect>
                  </Route>

                  <Route path={"/signup"}>
                    <AuthRedirect hideOnLogin={true}>
                      <Signup />
                    </AuthRedirect>
                  </Route>
  
                  <Route path={"/account"}>
                    <AuthRedirect>
                     <Profile />
                    </AuthRedirect>
                      
                  </Route>

                  <Route path={"/test"}>
                      <TestLogin />
                  </Route>

                  <Route path={"/"}>
                    <Homepage />
                  </Route>

                </Switch>
                
            </Router>
          </SessionContextProvider>
      </div>
    )
  }
}
 
export default App;
