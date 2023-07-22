import "./App.scss";
import { useEffect, useState } from "react";
import tomato from "./assets/images/tomato.gif";
import tone from "./assets/audio/tone.mp3";
import startTone from "./assets/audio/start.mp3";
import endBreak from "./assets/audio/endBreak.mp3";
import finished from "./assets/audio/finished.mp3";

function Pomodoro() {
  const [start, setStart] = useState(false); // start stop timer
  const [sessionTime, setSessionTime] = useState(25); // set default session time
  const [breakTime, setBreakTime] = useState(5); //set default break time
  const [timer, setTimer] = useState(sessionTime * 60); // convert session time in seconds to milliseconds
  const [running, setRunning] = useState(false); // initial start
  const [isSession, setIsSession] = useState(true); // is a session or a break
  const [roundsNum, setRoundsNum] = useState(4); // input for number of rounds
  const [roundsCount, setRoundsCount] = useState(1); // count of rounds
  const [roundsRef, setRoundsRef] = useState(1); // simultaneously track count
  const [setCount, setSetCount] = useState(1); // count of sets
  const [checked, setChecked] = useState(false); // checkbox check
  const [isTimerUp, setIsTimerUp] = useState(false); // to display banner
  const [volume, setVolume] = useState(1.0); // state to store the volume level
  const [isLongBreak, setIsLongBreak] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const checkbox = document.getElementById("toggleRounds");

  useEffect(() => {
    if (start) {
      if (roundsNum < roundsCount) {
        // don't go over input count
        return;
      }
      const countdown = setInterval(() => {
        setTimer((prevTimer) => {
          // don't go below zero
          return prevTimer > 0 ? prevTimer - 1 : 0;
        });
      }, 1000);
      return () => {
        clearInterval(countdown);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, roundsNum, roundsCount]);

  useEffect(() => {
    if (timer === 0 && start) {
      setIsTimerUp(true);
      setIsSession((prevIsSession) => !prevIsSession);
      if (isSession) {
        playSound(tone);
      } else {
        setRoundsCount((prevCount) => prevCount + 1);
        setRoundsRef((prevCount) => prevCount + 1);
        if (roundsNum < roundsCount + 1) {
          setIsEnd(true);
          playSound(finished);
          setIsLongBreak(false);
          return;
        }
        playSound(endBreak);
      }
      checkBanner();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer]);

  useEffect(() => {
    if (!isSession) {
      if (roundsCount % 4 === 0) {
        //if multiple of four
        setIsLongBreak(true);
        setTimer(1200); // 20 min in ms
      } else {
        setTimer(breakTime * 60);
        setIsLongBreak(false);
      }
    } else {
      setTimer(sessionTime * 60);
      setIsLongBreak(false);
    }
  }, [isSession, roundsNum, roundsCount]);

  useEffect(() => {
    // roundsCount is 5, next level up, add one to setCount and set roundsRef to 1
    if (roundsNum < roundsCount) {
      return;
    }
    if (roundsCount === 5) {
      setSetCount((prevSet) => prevSet + 1);
      setRoundsRef(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundsCount]);

  function togglePlay() {
    setRunning(true);
    if (!start) {
      playSound(startTone);
    }
    setStart(!start);
  }

  function resetTimer() {
    setTimer(1500);
    setBreakTime(5);
    setStart(false);
    setIsTimerUp(false);
    setSessionTime(25);
    setIsSession(true);
    setIsEnd(false);
    setRunning(false);
    setRoundsCount(1);
    setRoundsRef(1);
    setRoundsNum(4);
    setChecked(false);
    checkbox.checked = false;
  }

  function convertMsToMinutesAndSeconds(ms) {
    const minutes = Math.floor(ms / 60);
    const seconds = Math.floor(ms % 60);
    return (
      minutes.toString().padStart(2, "0") +
      ":" +
      seconds.toString().padStart(2, "0")
    );
  }

  function msToTime(ms) {
    const hours = Math.floor(ms / (60 * 60));
    const minutes = Math.floor((ms % (60 * 60)) / 60);

    let formattedTime = "";

    if (hours > 0) {
      formattedTime += `${hours} ${hours === 1 ? "hour" : "hours"}`;
    }

    if (minutes > 0) {
      formattedTime += ` ${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
    }

    return formattedTime.trim();
  }

  function checkBanner() {
    if (setIsTimerUp) {
      setTimeout(() => {
        setIsTimerUp(false);
      }, 8000);
    }
  }

  const playSound = (mp3) => {
    const audio = new Audio(mp3);
    audio.volume = volume; // adjust value from state
    audio.play();
  };

  const handleSession = (e) => {
    const inputValue = parseInt(e.target.value);
    if (!isNaN(inputValue)) { // is a num
      setSessionTime(inputValue);
      setTimer(inputValue * 60); // to minutes
    }
  };

  const handleBreak = (e) => {
    const inputValue = parseInt(e.target.value);
    if (!isNaN(inputValue)) {
      setBreakTime(inputValue);
    }
  };

  const handleChange = (e) => {
    setChecked(e.target.checked);
  };

  const handleRounds = (e) => {
    const inputValue = parseInt(e.target.value);
    setRoundsNum(inputValue);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  return (
    <div className="App">
      <div className="pomodoro">
        <div className="pomodoro__container">
          <div className="pomodoro__inner">
            {isTimerUp && (
              <div className="pomodoro__banner">
                {isSession ? "Break" : "Session"} is up!
              </div>
            )}
            {isEnd && (
              <div className="pomodoro__finished">All done! Great job!</div>
            )}
            <img
              width="200"
              src={tomato}
              className="pomodoro__tomato"
              alt="tomato"
            />
            <span className="pomodoro__type">
              {isLongBreak ? "Long " : ""}
              {isSession ? "Session" : "Break"}
            </span>
            <span className="pomodoro__timer">
              {convertMsToMinutesAndSeconds(timer)}
            </span>
            <div className="pomodoro__buttons">
              <button
                className="pomodoro__button pomodoro__buttons--start"
                onClick={togglePlay}
              >
                {start ? "Stop Timer" : "Start Timer"}
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
                The default is for the{" "}
                <a
                  target="_blank"
                  aria-label="Pomodoro - link opens in a new tab"
                  href="https://en.m.wikipedia.org/wiki/Pomodoro_Technique"
                  rel="noreferrer"
                >
                  Pomodoro
                </a>{" "}
                to run 4 rounds. Each focus session is followed by the defined
                break time. After the 4th focus session, there is a longer, 20
                minute break. You can customize the number of rounds to be more
                or less than the default.
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
                  <span>4 rounds = 1 set</span>
                </div>
              )}
            </div>
            <div className="pomodoro__data">
              <span className="pomodoro__data--set">
                {running && roundsNum > 4 && <span>Set {setCount}</span>}
              </span>
              <span className="pomodoro__data__count">
                {running && (
                  <span>
                    {" "}
                    Round {roundsNum < roundsRef ? roundsRef - 1 : roundsRef}
                  </span>
                )}
              </span>
            </div>
            <div className="pomodoro__total">
              <span className="pomodoro__total__num">
                Total Time:{" "}
                {msToTime((sessionTime * 60 + breakTime * 60) * roundsNum)}
              </span>
            </div>
          </div>
        </div>
        <div className="pomodoro__volume">
          <label htmlFor="volume">Volume</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            id="volume"
            onChange={handleVolumeChange}
          />
        </div>
      </div>
    </div>
  );
}

export default Pomodoro;
