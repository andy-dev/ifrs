import React, { Component } from "react";
import { Router, Link, navigate } from "@reach/router";
import { firestore } from "../../firebase";
import Calendar from "./components/calendar.js";

class FormContainer extends Component {
  state = {
    form: null,
    userResponses: null
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

        const userResponses = this.arrayToObject(form.form);
        this.setState({ form, userResponses });
      });
  };

  arrayToObject = array =>
    array.reduce((obj, item) => {
      obj[item.rank] = item.userResponse;
      return obj;
    }, {});

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

  handleChange = event => {
    // name ~ rank
    const { name, value } = event.target;
    const { userResponses } = this.state;

    userResponses[parseInt(name, 10)] = value;
    this.setState({ userResponses });
  };

  render() {
    const { form, userResponses } = this.state;
    return (
      <>
        <h1>Form</h1>
        <Link to="/">Dashboard</Link>
        {/* <RenderFormQuestions form={form} /> */}

        {form !== null &&
          form.form.map(q => {
            if (q.inputType === "string") {
              return (
                <div key={q.rank}>
                  <label htmlFor={q.rank}>{q.question}</label>
                  <br />
                  <textarea
                    id={q.rank}
                    name={q.rank}
                    rows="5"
                    cols="33"
                    value={userResponses[q.rank]}
                    onChange={this.handleChange}
                  ></textarea>
                </div>
              );
            } else if (q.inputType === "date") {
              return (
                <div key={q.rank}>
                  <p>{q.question}</p>
                  <br />
                  <Calendar></Calendar>
                </div>
              );
            } else if (q.inputType === "number") {
              return (
                <div key={q.rank}>
                  <p>{q.question}</p>
                  <input type="number" />
                </div>
              );
            } else if (q.inputType === "boolean") {
              return (
                <div key={q.rank}>
                  <p>{q.question}</p>
                  <label htmlFor="huey">Si</label>
                  <input type="radio" id="huey" name="drone" value="si" />
                  <label htmlFor="huey">No</label>
                  <input type="radio" id="huey" name="drone" value="no" />
                </div>
              );
            }
          })}
        {/* <pre>
          <code>{JSON.stringify(form, null, 4)}</code>
        </pre> */}
      </>
    );
  }
}

export default FormContainer;
