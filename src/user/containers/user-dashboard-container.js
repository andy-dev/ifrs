import React, { Component } from "react";
import { css } from "@emotion/core";
import { firestore, signOut } from "../../firebase";
import { navigate } from "@reach/router";

import { collectIdsandDocs } from "../../utilities.js";

class UserDashBoardContainer extends Component {
  state = {
    userForms: null,
    basicFormTemplate: null
  };

  get userFormsRef() {
    return firestore
      .collection("users")
      .doc(this.props.user.uid)
      .collection("forms");
  }

  get formTemplatesRef() {
    return firestore
      .collection("formTemplates")
      .where("formName", "==", "Basica");
  }

  componentDidMount = () => {
    this.getUserForms();
    this.getBasicFormTemplate();
  };

  unsubscribeUserForms = null;
  unsubscribeBasicFormTemplates = null;

  getUserForms = () => {
    this.unsubscribeUserForms = this.userFormsRef.onSnapshot(snapshot => {
      const userForms = snapshot.docs.map(doc => {
        return { docId: doc.id, ...doc.data() };
      });
      this.setState({ userForms });
    });
  };

  getBasicFormTemplate = () => {
    this.unsubscribeBasicFormTemplates = this.formTemplatesRef.onSnapshot(
      snapshot => {
        const basicFormTemplate = snapshot.docs.map(collectIdsandDocs)[0];
        this.setState({ basicFormTemplate });
      }
    );
  };

  addFormToUser = () => {
    const { basicFormTemplate } = this.state;

    this.userFormsRef.add(basicFormTemplate);
  };

  deleteForm = formId => {
    this.userFormsRef.doc(formId).delete();
  };

  componentWillUnmount = () => {
    if (typeof this.unsubscribeUserForms === "function") {
      this.unsubscribeUserForms();
    }
    if (typeof this.unsubscribeBasicFormTemplates === "function") {
      this.unsubscribeBasicFormTemplates();
    }
  };

  render() {
    const { userForms } = this.state;

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
        <button onClick={this.addFormToUser}>Add Form</button>

        <div>
          <p>Your Forms</p>
          {userForms !== null &&
            userForms.map((form, i) => {
              return (
                <div key={i}>
                  <p>form doc id: {form.docId}</p>
                  <button
                    onClick={() => {
                      navigate(`form/${form.docId}`);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => this.deleteForm(form.docId)}>
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
