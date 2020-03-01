import React, { Component } from "react";
import { css } from "@emotion/core";
import { firestore, signOut } from "../../firebase";
import { navigate } from "@reach/router";

import { collectIdsandDocs } from "../../utilities.js";

class UserDashBoardContainer extends Component {
  state = {
    userForms: null
  };

  get userFormsRef() {
    return firestore
      .collection("users")
      .doc(this.props.user.uid)
      .collection("forms");
  }

  componentDidMount = () => {
    this.getUserForms();
  };

  unsubscribeUserForms = null;

  getUserForms = () => {
    this.unsubscribeUseForms = this.userFormsRef.onSnapshot(snapshot => {
      const userForms = snapshot.docs.map(collectIdsandDocs);
      this.setState({ userForms });
    });
  };

  addForm = () => {
    let form = {
      input1: "",
      input2: ""
    };
    this.userFormsRef.add(form);
  };

  deleteForm = formId => {
    this.userFormsRef.doc(formId).delete();
  };

  componentWillUnmount = () => {
    if (typeof this.unsubscribeUserForms === "function") {
      this.unsubscribeClientSymptoms();
    }
  };

  render() {
    const { userForms } = this.state;
    console.log(userForms);
    return (
      <>
        <h1
          css={css`
            color: #05293b;
            font-weight: 300;
            padding-top: 40px;
            padding-left: 15px;
            text-align: center;
            padding-bottom: 15px;
          `}
        >
          User Dashboard
        </h1>
        <button onClick={signOut}>Sign Out</button>
        <button onClick={this.addForm}>Add Form</button>

        <div>
          <p>Your Forms</p>
          {userForms !== null &&
            userForms.map(form => {
              return (
                <div key={form.id}>
                  <p>form id: {form.id}</p>
                  <button
                    onClick={() => {
                      navigate(`form/${form.id}`);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => this.deleteForm(form.id)}>
                    Delete
                  </button>
                </div>
              );
            })}
        </div>
      </>
    );
  }
}

export default UserDashBoardContainer;
