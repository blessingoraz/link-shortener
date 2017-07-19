import React, { Component } from 'react';
import moment from 'moment';
import '../styles/App.css';
import Header from './Header';

class App extends Component {
  state = {
    linkText: '',
    showTable: false,
    enabled: false,
    linkUrls: []
  }

  getLinkAnalytics = (id) => {
    const url = `https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyB7GmxoabBEAvt4u-tDzdsEUUVgjQ6EBhw&shortUrl=${id}&projection=FULL`
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
    const url = `https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyB7GmxoabBEAvt4u-tDzdsEUUVgjQ6EBhw`;
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

  showCopyUrlText = (id) => {
    if(this.state.showIndex === id) {
      return (
        <p className="copyUrlText">click to copy url</p>
      )
    }
  }

  showUrl = () => {
    if (this.state.showTable) {
      return (
        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th className="tableHeader">LINK</th>
                <th className="tableHeader" >VISITS</th>
                <th className="tableHeader">LAST VISITED</th>
              </tr>
            </thead>
            <tbody>
              {this.state.linkUrls.map((urlObj, index) => {
                let longUrlString = urlObj.longUrl;
                let trimmedLongUrl = (longUrlString.length > 40) ? `${longUrlString.substring(0, 48)}...` : longUrlString;

                return (
                  <tr 
                    key={index}
                    onMouseEnter={() => this.setState({ showIndex: index })}
                    onMouseLeave={() => this.setState({ showIndex: ''})}>
                    <td>
                      <div>
                        <div className="copyTextContainer">
                          <p className="primaryText">{urlObj.shortUrl}</p>
                          {this.showCopyUrlText(index)}
                        </div>
                        <p className="secondaryText">{trimmedLongUrl}</p>
                      </div>
                    </td>
                    <td className="primaryText">{urlObj.numberOfClicks}</td>
                    <td className="primaryText">{urlObj.created}</td>
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
            value={this.state.linkText}
            placeholder="link here"
            onChange={(event) => this.setState({linkText: event.target.value, enabled: true })} />
          <button
            onClick={this.shortenLink}
            disabled={!this.state.enabled}
            className={(this.state.urlText === 0) ? "disable" : "enable"}>Shorten this link</button>
        </div>

        <div className="titleTextContainer">
          <p className="titleText">Previously shortened by you</p>
          <p className="spanText" onClick={() => this.setState({ linkUrls: [], showTable: false })}>Clear history</p>
        </div>

        {this.showUrl()}

      </div>
    );
  }
}
export default App;
