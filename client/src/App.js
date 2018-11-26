// client/src/App.js
import React, { Component } from "react";
import axios from "axios";

class App extends Component {
  // Initialize state
  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null
  };

  // Fetch data, polling to see changes in our db
  componentDidMount() {
    this.getDataFromDB();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDB, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  // Kill process when finished
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  // Frontend uses id key of data object in mongoDB use assigned object id
  getDataFromDB = () => {
    fetch("/api/getData")
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  };

  // Put method from backend api, create new query into db
  putDataToDB = message => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post("/api/putData", {
      id: idToBeAdded,
      message: message
    });
  };

  // Delete method using backend api
  deleteFromDB = idToDelete => {
    let objIdToDelete = null;
    this.state.data.forEach(dat => {
      if (dat.id === idToDelete) {
        objIdToDelete = dat.id;
      }
    });

    axios.delete("/api/deleteData", {
      data: {
        id: objIdToDelete
      }
    });
  };

  // User Interface
  render() {
    const { data } = this.state;
    return (
      <div>
        <ul>
          {data.length <= 0 ? "NO ENTRIES YET" : data.map(dat => (
            <li style={{ padding: "10px" }} key={data.message}>
              <span style={{ color: "gray" }}> id: </span> {dat.id} <br />
              <span style={{ color: "gray" }}> data: </span>
              { dat.message }
            </li>
          ))}
        </ul>
        <div style={{ padding: "10px" }}>
        <input
          type="text"
          onChange={e => this.setState({ message: e.target.value })}
          placeholder="add something here"
          style={{ width: "200px" }}
        />
        <button onClick={() => this.putDataToDB(this.state.message)}>
            ADD
        </button>
        </div>
        <div style={{ padding: "10px" }}>
        <input
          type="text"
          style={{ width: "200px" }}
          onChange={ e => this.setState({ idToDelete: e.target.value })}
          placeholder="put id of item to delete here"
          />
        <button onClick={() => this.deleteFromDB(this.state.idToDelete)}>
            DELETE
        </button>
        </div>
        <div style={{ padding: "10px" }}>
          <input
            type="text"
            style={{ width: "200" }}
            onChange={e => this.setState({ idToUpdate: e.target.value })}
            placeholder="id of item to update here"
          />
          <button onClick={() => this.updateDB(this.state.idToUpdate, this.state.updateToApply)}>
            UPDATE
          </button>
        </div>
      { /* Ending Div */ }  
      </div>
    );
  }
}

export default App;