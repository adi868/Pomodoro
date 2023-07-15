import { useEffect, useState } from "react";
import "./App.scss";
import tomato from "./tomato.gif";
import tone from "./tone.mp3";

function Pomodoro() {
  const [sessionTime, setSessionTime] = useState(25); //set default session time
  const [breakTime, setBreakTime] = useState(5); //set default break time
  let [timer, setTimer] = useState(sessionTime * 60); // Convert session time to milliseconds, which will later be converted back to min & sec
  let [paused, setPaused] = useState(true);
  const [isTimerUp, setIsTimerUp] = useState(false);
  const [totalTime, setTotalTime] = useState(30);
  //for session input fields

  //TODO: add music options in the background for studying from the spotify API?
  //TODO: after working session is over, add timer for 5 minute break session
  //TODO: ability to change the minutes in both before starting--session and break
  //TODO: auto restart timer? set total study time period--to determine to auto loop or not

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

  function togglePlay() {
    //always use the setter function to update the state value. trigger rerender of the component with the updated state value.
    setPaused(!paused);
  }

  function resetTimer() {
    setTimer(1500);
    setPaused(true);
    setIsTimerUp(false);
  }

  useEffect(() => {
    if (timer === 0) {
      setIsTimerUp(true);
      setPaused(true);
      playSound();
    }
  }, [timer]);
  //timer as a dependency, event only triggered when the timer value changes. will update isTimerUp when the timer reaches zero

  function convertMsToMinutesAndSeconds(ms) {
    const minutes = Math.floor(ms / 60);
    const seconds = Math.floor(ms % 60);
    return (
      minutes.toString().padStart(2, "0") +
      ":" +
      seconds.toString().padStart(2, "0")
    );
  }
  const playSound = () => {
    //html audio element api
    const audio = new Audio(tone);
    audio.play();
  };

  //timer not go off when set to 0
  const handleSession = (e) => {
    const inputValue = parseInt(e.target.value);
    //if not a number is false(is a number)
    if (!isNaN(inputValue)) {
      setSessionTime(inputValue);
      //turn into minutes
      setTimer(inputValue * 60);
      setTotalTime(breakTime + sessionTime);
    }
  };

  const handleBreak = (e) => {
    //set up functionality for this.
    const inputValue = parseInt(e.target.value);
    if (!isNaN(inputValue)) {
      setBreakTime(inputValue);
      setTotalTime(breakTime + sessionTime);
      //setTimer(inputValue)
    }
  };

  return (
    <div className="App">
      <div className="pomodoro">
        <div className="pomodoro_container">
        <h1 className="pomodoro_heading">Pomodoro</h1>
        <div className="pomodoro_inner">
        <img width="200" src={tomato} className="tomato" alt="tomato" />
          <p>Session</p>
          <p>{convertMsToMinutesAndSeconds(timer)}</p>
          <button onClick={togglePlay}>
            {paused ? "Start Timer" : "Stop Timer"}
          </button>
          <button onClick={resetTimer}>Reset Timer</button>
          {isTimerUp && <div className="banner">Timer is up!</div>}
          <section className="timer-section">
            <div className="session">
              <label htmlFor="sessionTime">Session Length (min)</label>
              <input
                name="sessionTime"
                id="sessionTime"
                type="number"
                min="0"
                max="60"
                step="5"
                value={sessionTime}
                onChange={handleSession}
              />
            </div>
            <div className="break">
              <label htmlFor="breakTime">Break Length (min)</label>
              <input
                value={breakTime}
                step="1"
                max="30"
                min="0"
                type="number"
                name="breakTime"
                id="breakTime"
                onChange={handleBreak}
              />
            </div>
          </section>
          <p>
            Each Pomodoro can run for a specified number of rounds. The default
            is for the Pomodoro to run 4 times.
          </p>
          <p>Number of rounds: 4</p>
          <span>Total Time: {totalTime * 4}</span>
        </div>
        </div>
      </div>
      <footer></footer>
    </div>
  );
}

export default Pomodoro;
