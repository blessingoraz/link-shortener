import React, { Component } from 'react';
import moment from 'moment';
import '../styles/App.css';
import Header from './Header';

class App extends Component {
  state = {
    showTable: false,
    linkText: '',
    enabled: false,
    linkUrls: []
  }

  getLinkAnalytics = (id) => {
    const url = `https://www.googleapis.com/urlshortener/v1/url?key=${process.env.REACT_APP_URL_KEY}&shortUrl=${id}&projection=FULL`
    return fetch(url)
      .then((res) => res.json())
      .then((res) => {
        let { analytics, id, longUrl } = res;
        const { linkUrls } = this.state;
        let linkObj = {
          numberOfClicks: analytics.allTime.shortUrlClicks,
          created: moment().startOf('day').fromNow(),
          shortUrl: id,
          longUrl: longUrl
        }
        const newlinkUrl = [...linkUrls, linkObj];
        this.setState({ linkUrls: newlinkUrl });
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
        this.setState({ linkText: '', showTable: true, enabled: false })
      })
      .catch((err) => console.log(err, 'should get an error here'))
  }

  showUrl = () => {
    if (this.state.showTable) {
      return (
        <div>
          <table>
            <thead>
              <tr>
                <th className="tableHeader">LINK</th>
                <th className="tableHeader">VISITS</th>
                <th className="tableHeader">LAST VISITED</th>
              </tr>
            </thead>
            <tbody>
              {this.state.linkUrls.map((urlObj, index) => {
                let string = urlObj.longUrl;
                let trimmedLongUrl = (string.length > 48) ? `${string.substring(0, 48)}...` : string;

                return (
                  <tr key={index}>
                    <td>
                      <div>
                        <p>{urlObj.shortUrl}</p>
                        <p>{trimmedLongUrl}
                        </p>
                      </div>
                    </td>
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
            onChange={(event) => this.setState({ linkText: event.target.value, enabled: true })} />
          <button
            onClick={this.shortenLink}
            disabled={!this.state.enabled}
            className={(this.state.linkText.length === 0) ? "disable" : "enable"}>Shorten this link</button>
        </div>

        <div className="titleTextContainer">
          <p className="titleText">Previously shortened by you <span className="spanText">Clear history</span></p>
        </div>

        {this.showUrl()}

      </div>
    );
  }
}
export default App;
