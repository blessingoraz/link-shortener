import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    linkText: ''
  }

  shortenLink = () => {
    const url = `https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyD_orNx_Zw_3SZ7CsuAJB_t9n4RPVB6d9g`;
    return fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({'longUrl': this.state.linkText})
    })
      .then((res) => res.json())
      .then((res) => console.log(res, "res"))
      .catch((err) => console.log(err, 'should get an error here'))
  }

  render() {
    return (
      <div className="container">
        <input
          type="text"
          placeholder="link here"
          value={this.state.linkText}
          onChange={(event) => this.setState({ linkText: event.target.value })} />
        <button onClick={this.shortenLink}>shorten</button>
      </div>
    );
  }
}

export default App;
