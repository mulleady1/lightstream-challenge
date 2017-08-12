import React, { Component } from 'react';
import io from 'socket.io-client';
import './Ship.css';

const USER = localStorage.user || (localStorage.user = `User_${Math.random()}`);

class Ship extends Component {
  state = {
    messages: [],
    text: ''
  };

  componentDidMount() {
    this._scroll = true;
    this.initWebsocket(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.initWebsocket(nextProps)
  }

  componentDidUpdate() {
    if (this._scroll) {
      this._scroll = false;
      setTimeout(() => {
        if (this._list) {
          this._list.scrollTop = this._list.scrollHeight - this._list.getBoundingClientRect().height;
        }
      }, 100);
    }
  }

  componentWillUnmount() {
    this.socket.close();
  }

  initWebsocket = (props) => {
    const { ship } = props;
    if (this.socket) {
      this.socket.close();
    }

    const socket = this.socket = io(`http://localhost:3004/${ship.name}`);

    socket.on('connect', () => {
      socket.on('init', (messages) => {
        this.setState({ messages });
      });

      socket.on('chat', (message) => {
        this.setState({ 
          messages: this.state.messages.concat(message)
        });
      });

      socket.on('change_channel', this.props.onChannelChange);
    });
  };

  renderChat = () => {
    const messages = this.state.messages.map((m, i) => (
      <li key={i}>
        <div>From <b>{m.user}</b></div>
        <div>At <b>{m.created}</b></div>
        <div><b>{m.text}</b></div>
      </li>
    ));

    return (
      <div className="flex-col">
        <h4>Chat</h4>
        <ul ref={node => this._list = node} className="chat flex-main">{messages}</ul>
        <div className="flex-row">
          <input value={this.state.text} onChange={this.onChange} />
          <button onClick={this.onSubmit}>SUBMIT</button>
        </div>
      </div>
    );
  };

  renderChannel = () => {
    return (
      <div>
        <iframe src={`http://player.twitch.tv/?channel=${this.props.channel.name}`} />
      </div>
    )
  };

  render() {
    return (
      <div className="Ship flex-col">
        <header>
          <button onClick={this.props.onBackClick}>Back</button>
          <h3>Ship: <b>{this.props.ship.name}</b></h3>
        </header>
        <div className="flex-main flex-row">
          {this.renderChat()}
          {this.renderChannel()}
        </div>
      </div>
    );
  }

  onChange = (e) => {
    this.setState({ text: e.target.value });
  };

  onSubmit = () => {
    this.socket.emit('chat', { 
      text: this.state.text,
      user: USER,
      created: new Date()
    });

    this._scroll = true;
    this.setState({ text: '' });
  };

}

export default Ship;
