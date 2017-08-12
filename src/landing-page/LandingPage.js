import React from 'react';
import Form from '../form/Form';
import './LandingPage.css';

const LandingPage = ({ ships, onShipClick, onSubmit }) => (
  <div className="LandingPage flex-col">
    <h2 className="flex-row align-center"><b>Twitch Cruise</b></h2>
    <div className="flex-row flex-main">
      <div className="flex-main border-right">
        <h3>Board a ship</h3>
        <ul className="ships">
          {ships.map((ship, i) => (
            <li key={i}>
              <button onClick={() => onShipClick(ship)}>{ship.name}</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-main">
        <h3>Or create one</h3>
        <Form onSubmit={onSubmit} />
      </div>
    </div>
  </div>
);

export default LandingPage;
