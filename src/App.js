import React, { useContext } from "react";
import { render } from "react-dom";
import UserProvider from "./providers/UserProvider";
import { UserContext } from "./providers/UserProvider";

import { collectIdsandDocs } from "./utilities.js";
import { signOut } from "./firebase.js";

import SignIn from "./signIn.js";
import SignUp from "./signUp.js";

const App = () => {
  const user = useContext(UserContext);

  if (user !== null) {
    console.log(user);
    return (
      <React.StrictMode>
        <p>We have a user</p>
        <SignIn></SignIn>
        <button onClick={signOut}>Sign Out User</button>
      </React.StrictMode>
    );
  } else if (user === "admin") {
    return (
      <React.StrictMode>
        <p>User is admin</p>
      </React.StrictMode>
    );
  } else {
    return (
      <React.StrictMode>
        <SignIn></SignIn>
        <SignUp></SignUp>
        <button onClick={signOut}>Sign Out User</button>
      </React.StrictMode>
    );
  }
};

render(
  <UserProvider>
    <App></App>
  </UserProvider>,
  document.getElementById("root")
);
