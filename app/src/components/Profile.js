import React, { useContext } from "react";
import AuthRedirect from '../components/AuthRedirect';
import { Switch, Route, useRouteMatch } from "react-router-dom";
import ChangePasswordForm from "./ChangePasswordForm";
import RemoveAccount from "./RemoveAccount";

import Account from "./Account";

const Profile = () => {
    const { path, url } = useRouteMatch();
    return ( 
        <div className={"account"}>
            <Switch>
                <Route path={`${path}/passwordsettings`}>
                    <AuthRedirect>
                        <ChangePasswordForm />
                    </AuthRedirect>
                </Route>

                <Route path={`${path}/deleteaccount`}>
                    <AuthRedirect>
                        <RemoveAccount />
                    </AuthRedirect>
                </Route>
                
                <Route path={`${path}`}>
                    <Account />
                </Route>
        
            </Switch>
        </div>
    );
}
 
export default Profile;