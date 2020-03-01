import React from "react";
import { Router, Link, navigate } from "@reach/router";
import UserDashBoardContainer from "./user-dashboard-container.js";
import FormContainer from "./form-container.js";

const UserRoutingContainer = props => {
  return (
    <>
      <Router>
        <UserDashBoardContainer
          user={props.user}
          path="/"
        ></UserDashBoardContainer>
        <FormContainer path="form/:id" user={props.user}></FormContainer>
      </Router>
    </>
  );
};

export default UserRoutingContainer;
