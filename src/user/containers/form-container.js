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

  arrayToObject = array => {
    if (array !== undefined) {
      return array.reduce((obj, item) => {
        obj[item.rank] = item.userResponse;
        return obj;
      }, {});
    } else {
      return {};
    }
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

  handleTextChange = event => {
    // name ~ rank
    const { name, value } = event.target;
    const { userResponses } = this.state;

    userResponses[parseInt(name, 10)] = value;
    this.setState({ userResponses });
  };

  handleNumberChange = event => {
    const { name, value } = event.target;
    const { userResponses } = this.state;

    userResponses[parseInt(name, 10)] = parseInt(value, 10);
    this.setState({ userResponses });
  };

  handleDateChange = event => {
    const { name, value } = event.target;
    const { userResponses } = this.state;
    const data = event.target.dataset.date;

    userResponses[parseInt(name, 10)][data] = parseInt(value, 10);
    this.setState({ userResponses });
  };

  handleBooleanChange = event => {
    const { name, value } = event.target;
    const { userResponses } = this.state;

    userResponses[parseInt(name, 10)] = value === "true" ? true : false;
    this.setState({ userResponses });
  };

  handleSelectionChange = event => {
    const { name, value } = event.target;
    const { userResponses } = this.state;

    userResponses[parseInt(name, 10)] = value;
    this.setState({ userResponses });
  };

  saveToDB = () => {
    const { name, value } = event.target;
    // ojo, esto va hacer un save cada blur
    console.log("name:", name, "value:", value, "Saving To DB");
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
                    onChange={this.handleTextChange}
                    onBlur={this.saveToDB}
                  ></textarea>
                </div>
              );
            } else if (q.inputType === "date") {
              return (
                <div key={q.rank}>
                  <p>{q.question}</p>
                  <br />

                  <input
                    type="text"
                    data-date="day"
                    name={q.rank}
                    value={userResponses[q.rank].day}
                    placeholder="Día"
                    onChange={this.handleDateChange}
                  />
                  <input
                    type="text"
                    data-date="month"
                    name={q.rank}
                    value={userResponses[q.rank].month}
                    placeholder="Mes"
                    onChange={this.handleDateChange}
                  />
                  <input
                    type="text"
                    data-date="year"
                    name={q.rank}
                    placeholder="Año"
                    value={userResponses[q.rank].year}
                    onChange={this.handleDateChange}
                  />
                </div>
              );
            } else if (q.inputType === "number") {
              return (
                <div key={q.rank}>
                  <p>{q.question}</p>
                  <input
                    name={q.rank}
                    type="number"
                    value={userResponses[q.rank]}
                    onChange={this.handleNumberChange}
                  />
                </div>
              );
            } else if (q.inputType === "boolean") {
              return (
                <div key={q.rank}>
                  <p>{q.question}</p>
                  <label htmlFor="si">Si</label>
                  <input
                    type="radio"
                    id="si"
                    name={q.rank}
                    value={true}
                    onChange={this.handleBooleanChange}
                    checked={userResponses[q.rank] === true}
                  />
                  <label htmlFor="no">No</label>
                  <input
                    type="radio"
                    id="no"
                    name={q.rank}
                    value={false}
                    onChange={this.handleBooleanChange}
                    checked={userResponses[q.rank] === false}
                  />
                </div>
              );
            } else if (q.inputType === "selection") {
              return (
                <div key={q.rank}>
                  <label htmlFor="selection">{q.question}</label>

                  <select
                    id="selection"
                    name={q.rank}
                    value={userResponses[q.rank]}
                    onChange={this.handleSelectionChange}
                  >
                    {q.options.map((opt, i) => {
                      return (
                        <option key={i} value={opt.option}>
                          {opt.option}
                        </option>
                      );
                    })}
                  </select>
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
