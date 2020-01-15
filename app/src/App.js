import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import SessionContextProvider from "./context/SessionContext";

import Navbar from "./components/Navbar";
import Homepage from "./components/Homepage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AuthRedirect from './components/AuthRedirect';
import Profile from "./components/Profile";
import Logout from "./components/Logout";
import Forum from "./components/Forum";
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

                  <Route path={"/logout"} component={Logout} />

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

                  <Route path={"/forum"} component={Forum} />
                  <Route path={"/"} component={Homepage} />
                </Switch>
                
            </Router>
          </SessionContextProvider>
      </div>
    )
  }
}
 
export default App;
