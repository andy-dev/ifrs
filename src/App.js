import React, { useContext } from "react";
import { render } from "react-dom";
import UserProvider from "./providers/UserProvider";
import { UserContext } from "./providers/UserProvider";

import { collectIdsandDocs } from "./utilities.js";
import { signOut, firestore } from "./firebase.js";

import SignIn from "./signIn.js";
import SignUp from "./signUp.js";

// Containers
import UserRoutingContainer from "./user/containers/user-routing-container.js";

const App = () => {
  const user = useContext(UserContext);

  if (user !== null) {
    return (
      <React.StrictMode>
        <UserRoutingContainer user={user} />
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
