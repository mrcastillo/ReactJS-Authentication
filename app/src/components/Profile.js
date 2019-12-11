import React from "react";

const Profile = () => {
    return ( 
        <div className={"profile"}>
            <h1>Account Settings</h1>
            <p>Change your profile settings here.</p>

            <h3>Username: EyesClosed</h3>
            <h3>Created: December 10, 2019</h3>
            <h3>Posts: 11</h3>

            <div>
                <h1>Change Password</h1>
                <p>Change Password</p>

                <h1>Delete Account</h1>
                <p>Delete my Account</p>
            </div>
        </div>
     );
}
 
export default Profile;