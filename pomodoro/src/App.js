import {useEffect, useState} from 'react';
import './App.scss';
import tomato from './tomato.gif';
import tone from './tone.mp3';

function Pomodoro() {
  let [timer, setTimer] = useState(1500) //25 minutes in seconds
  //customize number of minutes to something else. input field
  let [paused, setPaused] = useState(true);
  const [isTimerUp, setIsTimerUp] = useState(false);


  //TODO: add sound effects and message when the timer is over
  //TODO: add music options in the background for studying from the spotify API?

  //this
  useEffect(() => {
    let countdown;

    //run if paused is false
    if (!paused) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => {
      clearInterval(countdown);
    };
  }, [paused]);
  //returned cleanup clears the interval when the component unmounts. useEffect with a cleanup function returned = componentWillUnmount. whenever the paused state changes, the effect is triggered--tied to toggle play


function togglePlay(){
  //always use the setter function to update the state value. trigger rerender of the component with the updated state value.
  setPaused(!paused)
}


function resetTimer(){
  setTimer(1500);
  setPaused(true)
  setIsTimerUp(false)
}

useEffect(() => {
  if (timer === 0) {
    setIsTimerUp(true);
    setPaused(true);
    playSound();
  }
}, [timer]);
//timer as a dependency, event only triggered when the timer value changes. will update isTimerUp when the timer reaches zero

const playSound = () => {
  //html audio element api
  const audio = new Audio(tone);
  audio.play();
}

function convertMsToMinutesAndSeconds(ms) {
  const minutes = Math.floor(ms / 60); 
  const seconds = Math.floor(ms % 60); 
  return minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0')
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
