import React from 'react';
import './App.css';
import ReactRelativeTimer from './ReactRelativeTimer';

function App() {
  return (
    <div className="App">
      <ReactRelativeTimer className="Timer" formatMessage={({ mills, seconds, minutes }) => { return `${mills} ${seconds} ${minutes}`}} updateInterval={1000}/>
    </div>
  );
}

export default App;
