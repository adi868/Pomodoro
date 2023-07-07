import tomato from './t.gif';
import {useEffect, useState} from 'react';
import './App.scss';

function Pomodoro() {
  const [timer, setTimer] = useState(1500) //25 minutes in seconds
  let [paused, setPaused] = useState(true)

  useEffect(() => {
    let countdown;

    if (!paused) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => {
      clearInterval(countdown);
    };
  }, [paused]);


function togglePlay(){
  setPaused(!paused)
  console.log(paused)
}


function resetTimer(){
  setTimer(1500);
}


  return (
    <div className="App">
      <div className="App-main">
      <img width="200" src={tomato} className="tomato" alt="tomato" />
        <h1>Pomodoro</h1>
        <div className="container">
          <button onClick={togglePlay}>{paused ? 'Start Timer' : 'Stop Timer'}</button>
          <button onClick={resetTimer}>Reset Timer</button>
          <p>{timer} seconds</p>
        </div>
      </div>
      <footer></footer>
    </div>
  );
}

export default Pomodoro;
