/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import timerWorker from "./workers/timer.js";
import SoundUrl from "./sounds/alarm.wav";
import exercisesData from "./exercises/exercises.json";
import "./App.css";

const myTimer = new Worker(timerWorker);

function App(props) {
  const alarmSound = new Audio(SoundUrl);
  // State values
  const [timer, setTimer] = useState(2700000);
  const [running, setRunning] = useState("stop");
  const [timerMinutes, setTimerMinutes] = useState(45);
  const [intervalId, setTntervalId] = useState(0);
  const [m, setM] = useState(0);
  const [s, setS] = useState(0);
  const [progressBar, setProgressBar] = useState(100);
  const [showModal, setShowModal] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [theme, setTheme] = useState(true);
  const [random, setRandom] = useState(0);
  const [value, setValue] = useState(0);

  useEffect(() => {
    setM(timerMinutes);
    setS(0);
  }, [timerMinutes]);

  useEffect(() => {
    playing ? alarmSound.play() : alarmSound.pause();
  }, [playing]);

  useEffect(() => {
    setProgressBar((timer / (timerMinutes * 60000)) * 100);
  }, [timer]);

  myTimer.onmessage = (e) => {
    if (e.data.timer >= 0) {
      setTimer(e.data.timer);
      setM(Math.floor(e.data.timer / 60000));
      setS(Math.floor((e.data.timer / 1000) % 60));
      setTntervalId(e.data.intervalId);
      document.title =
        String(m).padStart(2, "0") +
        ":" +
        String(s).padStart(2, "0") +
        " | Simple Pomodoro Time Tracker";
      // do stuff when timer runs out
    } else {
      sendMessage(timer, false, intervalId);
      setM(timerMinutes);
      setS(0);
      setProgressBar(100);
      if (!playing) {
        setPlaying(true);
      }
      setShowModal(true);
      setRunning("stop");
      document.title = "Work's done! | Simple Pomodoro Time Tracker";
    }
  };

  function startTimer() {
    // set to "running"
    var finishTime = 0;
    if (running === "stop") {
      // add a second for timer to start correctly
      finishTime = Date.now() + timerMinutes * 60000 + 1000;
      setRunning("play");
      sendMessage(finishTime, true, intervalId);
      getRandom();
    } else if (running === "pause") {
      finishTime = Date.now() + timer;
      setRunning("play");
      sendMessage(finishTime, true, intervalId);
      getRandom();
    }
  }

  function stopTimer() {
    if (running === "play" || running === "pause") {
      document.title = "Simple Pomodoro Time Tracker";
      // set state to not running
      setRunning("stop");
      sendMessage(timer, false, intervalId);
      setM(timerMinutes);
      setS(0);
      setProgressBar(100);
    }
  }

  function pauseTimer() {
    if (running === "play") {
      document.title =
        "|| " +
        String(m).padStart(2, "0") +
        ":" +
        String(s).padStart(2, "0") +
        " | Simple Pomodoro Time Tracker";
      // set state to not running
      setRunning("pause");
      sendMessage(timer, false, intervalId);
    }
  }

  function sendMessage(fT, s, id) {
    myTimer.postMessage({
      finishTime: fT,
      status: s,
      intervalId: id,
    });
  }

  function setTime(time) {
    if (running === "stop") {
      setTimerMinutes(time);
    }
  }

  function getRandom() {
    let randExercise = Math.floor(
      Math.random() * exercisesData.exercises.length
    );
    let randValue = Math.floor(Math.random() * 3 + 1);
    setRandom(randExercise);
    if (randValue === 1) {
      setValue(exercisesData.exercises[randExercise].value1);
    } else if (randValue === 2) {
      setValue(exercisesData.exercises[randExercise].value2);
    } else if (randValue === 3) {
      setValue(exercisesData.exercises[randExercise].value3);
    } else {
      // fallback
      setValue(exercisesData.exercises[randExercise].value1);
    }
  }

  return (
    <div className={theme ? "dark fh" : "light fh"}>
      <div className="timer container">
        <div className="text-center">
          <div className="countdown d-flex justify-content-center">
            <div className={theme ? "light minutes" : "dark minutes"}>
              <h1>{String(m).padStart(2, "0")}</h1>
              <h4>Minutes</h4>
            </div>
            <div className={theme ? "dark seconds" : "light seconds"}>
              <h1>{String(s).padStart(2, "0")}</h1>
              <h4>Seconds</h4>
            </div>
          </div>

          <div
            className={
              theme ? "dark progress mx-auto" : "light progress mx-auto"
            }
          >
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: progressBar + "%" }}
              aria-valuenow={progressBar}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>

          <div className="controls text-center">
            {running === "play" ? (
              <button onClick={pauseTimer}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  className="bi bi-pause-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z" />
                </svg>
              </button>
            ) : (
              <button onClick={startTimer}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  className="bi bi-play-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
                </svg>
              </button>
            )}
            <button onClick={stopTimer}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                className="bi bi-stop-fill"
                viewBox="0 0 16 16"
              >
                <path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z" />
              </svg>
            </button>
          </div>
          <div className="settings text-center">
            <button
              onClick={() => setTime(30)}
              disabled={running === "stop" ? false : true}
              className={theme ? "dark" : "light"}
            >
              30
            </button>
            <button
              onClick={() => setTime(45)}
              disabled={running === "stop" ? false : true}
              className={theme ? "dark" : "light"}
            >
              45
            </button>
            <button
              onClick={() => setTime(60)}
              disabled={running === "stop" ? false : true}
              className={theme ? "dark" : "light"}
            >
              60
            </button>
            <button
              onClick={() => setTime(75)}
              disabled={running === "stop" ? false : true}
              className={theme ? "dark" : "light"}
            >
              75
            </button>
            <button
              onClick={() => setTime(90)}
              disabled={running === "stop" ? false : true}
              className={theme ? "dark" : "light"}
            >
              90
            </button>
          </div>
          <div className="theme-button">
            <button onClick={() => setTheme(!theme)}>
              {theme ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="#F7D002"
                  stroke="#F7D002"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-sun"
                >
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="#121619"
                  stroke="#121619"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="feather feather-moon"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={`modal fade ${showModal ? "show" : ""}`}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className={theme ? "dark modal-content" : "light modal-content"}>
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">
                {exercisesData.exercises[random].title}
              </h5>
              <button
                className={theme ? "dark close" : "light close"}
                onClick={() => setShowModal(false)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="row align-items-center">
                <div className="col-sm-4 text-center">
                  <img
                    src={"/exercises/" + exercisesData.exercises[random].image}
                  />
                </div>
                <div className="col-sm-8">
                  <h3 className="text-center">
                    {exercisesData.exercises[random].name} {value}
                  </h3>
                  <p>{exercisesData.exercises[random].description}</p>
                </div>
              </div>
            </div>
            <div className="modal-footer justify-content-center">
              <button
                className="btn btn-primary"
                onClick={() => setShowModal(false)}
              >
                I'm ready for my next work session!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
