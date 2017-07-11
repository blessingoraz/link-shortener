import React, { Component } from 'react';
import moment from 'moment';
import '../styles/App.css';
import Header from './Header';

class App extends Component {
  state = {
    showTable: false,
    linkText: '',
    linkUrls: []
  }

  getLinkAnalytics = (id) => {
    const url = `https://www.googleapis.com/urlshortener/v1/url?key=${process.env.REACT_APP_URL_KEY}&shortUrl=${id}&projection=FULL`
    return fetch(url)
      .then((res) => res.json())
      .then((res) => {
        let { analytics, id, longUrl } = res;
        let linkObj = {
          numberOfClicks: analytics.allTime.shortUrlClicks,
          created: moment().startOf('day').fromNow(),
          shortUrl: id,
          longUrl: longUrl
        }
        this.state.linkUrls.push(linkObj);
      })
      .catch((err) => console.log(err, 'should get an error here'))
  }

  shortenLink = () => {
    const { linkText } = this.state;
    const url = `https://www.googleapis.com/urlshortener/v1/url?key=${process.env.REACT_APP_URL_KEY}`;
    return fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 'longUrl': linkText })
    })
      .then((res) => res.json())
      .then((res) => {
        this.getLinkAnalytics(res.id);
        this.setState({ linkText: '', showTable: true })
      })
      .catch((err) => console.log(err, 'should get an error here'))
  }

  showUrl = () => {
    if (this.state.linkUrls.length > 0 && this.state.showTable) {
      return (
        <div>
          <table>
            <thead>
              <tr>
                <th>LINK</th>
                <th>VISITS</th>
                <th>LAST VISITED</th>
              </tr>
            </thead>
            <tbody>
              {this.state.linkUrls.map((urlObj, index) => {
                return (
                  <tr key={index}>
                    <td>{urlObj.shortUrl}</td>
                    <td>{urlObj.numberOfClicks}</td>
                    <td>{urlObj.created}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="container">
        <Header />
        <div className="inputContainer">
          <input
            type="text"
            placeholder="link here"
            value={this.state.linkText}
            onChange={(event) => this.setState({ linkText: event.target.value })} />
          <button
            onClick={this.shortenLink}
            className={(this.state.linkText.length === 0) ? "disable" : "enable"}>Shorten this link</button>
        </div>

        <p>Previously shortened by you <span className="spanText">Clear history</span></p>

        {this.showUrl()}
      </div>
    );
  }
}

export default App;
