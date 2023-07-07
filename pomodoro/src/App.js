import tomato from './t.gif';
import {useEffect, useState} from 'react';
import './App.scss';

function Pomodoro() {
  //customize number of minutes to something else. input field
  const [timer, setTimer] = useState(1500) //25 minutes in seconds
  let [paused, setPaused] = useState(true);
  const [isTimerUp, setIsTimerUp] = useState(false);


  //TODO: add sound effects and message when the timer is over
  //TODO: add music options in the background for studying from the spotify API?

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
  setPaused(true)
}


  if(timer === 0){
    setIsTimerUp(true)
  }

function convertMsToMinutesAndSeconds(ms) {
  const minutes = Math.floor(ms / 60); 
  const seconds = Math.floor((ms % 60)); 
  return minutes.toString() + ":" + ((seconds == 0) ? "00" : seconds.toString())
}

  return (
    <div className="App">
      <div className="App-main">
        <h1>Pomodoro</h1>
      <img width="200" src={tomato} className="tomato" alt="tomato" />
        <div className="container">
          <button onClick={togglePlay}>{paused ? 'Start Timer' : 'Stop Timer'}</button>
          <button onClick={resetTimer}>Reset Timer</button>
          <span>{convertMsToMinutesAndSeconds(timer)}</span>
          {isTimerUp && <div className="banner">Timer is up!</div>}
        </div>
      </div>
      <footer></footer>
    </div>
  );
}

export default Pomodoro;
