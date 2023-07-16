import { useEffect, useState } from "react";
import "./App.scss";
import tomato from "./tomato.gif";
import tone from "./tone.mp3";
import start from "./start.mp3";

function Pomodoro() {
  const [sessionTime, setSessionTime] = useState(25); //set default session time
  const [breakTime, setBreakTime] = useState(5); //set default break time
  const [roundsNum, setRoundsNum] = useState(4);
  const [checked, setChecked] = useState(false);
  let [timer, setTimer] = useState(sessionTime * 60); // Convert session time to milliseconds, which will later be converted back to min & sec
  let [paused, setPaused] = useState(true);
  const [isTimerUp, setIsTimerUp] = useState(false);
  const [totalTime, setTotalTime] = useState(30);
  //add which set it is on
  //for session input fields

  //TODO: add music options in the background for studying from the spotify API?
  //TODO: after working session is over, add timer for 5 minute break session
  //TODO: ability to change the minutes in both before starting--session and break
  //TODO: auto restart timer? set total study time period--to determine to auto loop or not

  //this
  useEffect(() => {
    let countdown;  //run if paused is false
    if (!paused) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      playSound(start);
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
      playSound(tone);
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
  const playSound = (mp3) => {
    const audio = new Audio(mp3);  //html audio element api
    audio.play();
  };

  const handleSession = (e) => {
    const inputValue = parseInt(e.target.value);
    //if not a number is false(is a number)
    if (!isNaN(inputValue)) {
      setSessionTime(inputValue);
      setTimer(inputValue * 60);  //turn into minutes
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

  function handleChange(e) {
    setChecked(e.target.checked);
  }

  const handleRounds = (e) => {
    setRoundsNum(e.target.value);
  };

  return (
    <div className="App">
      <div className="pomodoro">
        <div className="pomodoro__container">
          <div className="pomodoro__inner">
            {isTimerUp && <div className="pomodoro__banner">Timer is up!</div>}
            <img
              width="200"
              src={tomato}
              className="pomodoro__tomato"
              alt="tomato"
            />
            <span className="pomodoro__type">Session</span>
            <span className="pomodoro__timer">
              {convertMsToMinutesAndSeconds(timer)}
            </span>
            <div className="pomodoro__buttons">
              <button
                className="pomodoro__button pomodoro__buttons--start"
                onClick={togglePlay}
              >
                {paused ? "Start Timer" : "Stop Timer"}
              </button>
              <button
                className="pomodoro__button pomodoro__buttons--reset"
                onClick={resetTimer}
              >
                Reset Timer
              </button>
            </div>
            <div className="pomodoro__timers">
              <div className="pomodoro__timers__timer pomodoro__timers--session">
                <label htmlFor="sessionTime">Session (min)</label>
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
              <div className="pomodoro__timers__timer pomodoro__timers--break">
                <label htmlFor="breakTime">Break (min)</label>
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
            </div>
            <div className="pomodoro__rounds">
              <span className="pomodoro__info">
                The default is for the <a target="_blank" aria-label="Pomodoro - link opens in a new tab" href="https://en.m.wikipedia.org/wiki/Pomodoro_Technique" rel="noreferrer">Pomodoro</a> to run the session 4 times. Each round is separated
                by the defined break time. After the 4th round, there is a longer, 20 minute
                break. You can customize the number of rounds to be more or less than the default.
              </span>
              <div className="pomodoro__rounds__change">
                <label htmlFor="toggleRounds">Change # of rounds</label>
                <input
                  type="checkbox"
                  name="toggleRounds"
                  id="toggleRounds"
                  onChange={handleChange}
                />
              </div>
              {checked && (
                <div className="pomodoro__rounds--toggle">
                  <label htmlFor="rounds">Number of rounds</label>
                  <input
                    value={roundsNum}
                    type="number"
                    step="1"
                    min="1"
                    max="10"
                    name="rounds"
                    id="rounds"
                    onChange={handleRounds}
                  />
                </div>
              )}
            </div>
            <div className="pomodoro__total">
            {/* convert to hours and minutes, value does not change */}
              <span>Total Time: {convertMsToMinutesAndSeconds(timer)}</span>
            </div>
          </div>
        </div>
      </div>
      <footer></footer>
    </div>
  );
}

export default Pomodoro;
