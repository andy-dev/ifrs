import React, { Component } from "react";
import { Router, Link, navigate } from "@reach/router";
import { firestore } from "../../firebase";

class FormContainer extends Component {
  state = {
    form: null
  };

  unsubscribeFromForm = null;

  get userFormsRef() {
    return firestore
      .collection("users")
      .doc(this.props.user.uid)
      .collection("forms");
  }

  componentDidMount() {
    this.getForm(this.props.id);
  }

  getForm = async docId => {
    this.unsubscribeFromForm = this.userFormsRef
      .doc(docId)
      .onSnapshot(snapshot => {
        const form = { ...snapshot.data(), id: docId };
        this.setState({ form });
      });
  };

  componentDidUpdate() {
    const { form } = this.state;
    if (form === null || form.id !== this.props.id) {
      this.getForm(this.props.id);
    }
  }

  componentWillUnmount = () => {
    if (typeof this.unsubscribeFromForm === "function") {
      this.unsubscribeFromForm();
    }
  };

  render() {
    const { form } = this.state;
    return (
      <>
        <h1>Form</h1>
        <Link to="/">Dashboard</Link>
        <pre>
          <code>{JSON.stringify(form, null, 4)}</code>
        </pre>
      </>
    );
  }
}

export default FormContainer;
