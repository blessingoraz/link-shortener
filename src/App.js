import React, { Component } from 'react';
import moment from 'moment';
import './App.css';

class App extends Component {
  state = {
    linkText: '',
    linkUrls: []
  }

  getLinkAnalytics = (id) => {
    const url = `https://www.googleapis.com/urlshortener/v1/url?key=${process.env.REACT_APP_URL_KEY}&shortUrl=${id}&projection=FULL`
    return fetch(url)
      .then((res) => res.json())
      .then((res) => {
        let {analytics,created, id, longUrl } = res;
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
    const { linkText, shortUrls } = this.state;
    const url = `https://www.googleapis.com/urlshortener/v1/url?key=${process.env.REACT_APP_URL_KEY}`;
    return fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({'longUrl': linkText})
    })
      .then((res) => res.json())
      .then((res) => {
        this.getLinkAnalytics(res.id)
      })
      .catch((err) => console.log(err, 'should get an error here'))
  }

  showUrl = () => {
    if(this.state.linkUrls) {
      console.log(this.state.linkUrls, "hello")      
    }
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

        {this.showUrl()}
      </div>
    );
  }
}

export default App;
