import React, { Component } from 'react';
import LandingPage from '../landing-page/LandingPage';
import Ship from '../ship/Ship';
import './App.css';

class App extends Component {
  state = {
    ships: [],
    twitchFeed: {},
    selectedShip: null,
    toast: null
  };

  async componentDidMount() {
    try {
      const { baseURL } = this.props;
      const res = await fetch(`${baseURL}/api/ships`);
      const ships = await res.json();
      const twitchRes = await fetch(`${baseURL}/api/twitch-feed`);
      const twitchFeed = await twitchRes.json();
      this.setState({ ships, twitchFeed });
    } catch (err) {
      alert(err);
    }
  }

  componentDidUpdate() {
    if (this.state.toast) {
      setTimeout(() => {
        this.setState({ toast: null });
      }, 3000);
    }
  }

  render() {
    const { ships, selectedShip, twitchFeed, toast } = this.state;    

    return (
      <div className="App">
        { toast ? (
          <div className="toast">{toast}</div>
        ) : null }
        { selectedShip ? (
          <Ship 
            ship={selectedShip} 
            channel={twitchFeed.streams[selectedShip.index].channel}
            onChannelChange={this.onChannelChange}
            onBackClick={this.onBackClick} />
        ) : (
          <LandingPage 
            ships={ships} 
            onShipClick={this.onShipClick}
            onSubmit={this.onSubmit} />
        )}
      </div>
    );
  }

  onShipClick = (selectedShip) => {
    this.setState({ selectedShip });
  };

  onBackClick = () => {
    this.setState({ selectedShip: null });
  };

  onSubmit = async (data) => {
    try {
      const { baseURL } = this.props;
      this.setState({ toast: 'Saving...' });
      
      const res = await fetch(`${baseURL}/api/ships`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (res.status >= 400) {
        throw new Error('Invalid ship name');
      }

      const ship = await res.json();

      this.setState({ 
        toast: null, 
        ships: this.state.ships.concat(ship),
        selectedShip: ship 
      });
    } catch (err) {
      this.setState({ toast: null });
      alert(err);
    }
  };

  onChannelChange = (data) => {
    this.setState({ 
      toast: 'Channel changed',
      twitchFeed: JSON.parse(data) 
    });
  };
}

export default App;
