/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from '../../../utils/axios-custome';

export default function TimerCountdown({ targetDate, exchange, fetchExchangeDetails }) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [timer, setTimer] = useState(null);

  const secondsToTime = (secs) => {
    const days = Math.floor(secs / (60 * 60 * 24));
    const hours = Math.floor((secs % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((secs % (60 * 60)) / 60);
    const seconds = secs % 60;

    return { d: days, h: hours, m: minutes, s: seconds };
  };

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const difference = target - now;
    // console.log("echange time",exchange);
    if (difference <= 0) {
      clearInterval(timer);
      setTime({ d: 0, h: 0, m: 0, s: 0 });

        // axios
        // .patch(`deposits/exchange/expired/${exchange.id}`)
        // .then(() => {
        //   fetchExchangeDetails();
        // })
        // .catch((err) => console.log(err));

      return;
    }

    return Math.floor(difference / 1000);
  };

  useEffect(() => {
    const initialSeconds = calculateTimeLeft();
    setTime(secondsToTime(initialSeconds || 0));

    const newTimer = setInterval(() => {
      const remainingTime = calculateTimeLeft();
      if (!remainingTime) return;

      if (remainingTime > 0) {
        setTime(secondsToTime(remainingTime));
      } else {
        clearInterval(newTimer);
      }
    }, 1000);

    setTimer(newTimer);

    return () => clearInterval(newTimer);
  }, [targetDate]);

  const getTimerString = (num) => (num < 10 ? "0" + num.toString() : num.toString());

  return (
    <div className="REM flex items-center justify-center gap-1">
      {time.d === 0 && time.h === 0 && time.m === 0 && time.s === 0 ? (
        <h2>Vui lòng đợi...</h2>
      ) : (
        <div
          className={`REM flex items-center justify-center text-white rounded-md ${
            time.d === 0 ? "bg-red-600" : "bg-gray-900"
          }`}
        >
          <div className="grid grid-cols-2 gap-2 md:gap-0 px-2 rounded-md">
            <span className="inline-block w-[1ch] text-center">
              {getTimerString(time.d).charAt(0)}
            </span>
            <span className="inline-block w-[1ch] text-center">
              {getTimerString(time.d).charAt(1)}
            </span>
          </div>
          :
          <div className="grid grid-cols-2 gap-2 md:gap-0 px-2 rounded-md">
            <span className="inline-block w-[1ch] text-center">
              {getTimerString(time.h).charAt(0)}
            </span>
            <span className="inline-block w-[1ch] text-center">
              {getTimerString(time.h).charAt(1)}
            </span>
          </div>
          :
          <div className="grid grid-cols-2 gap-2 md:gap-0 px-2 rounded-md">
            <span className="inline-block w-[1ch] text-center">
              {getTimerString(time.m).charAt(0)}
            </span>
            <span className="inline-block w-[1ch] text-center">
              {getTimerString(time.m).charAt(1)}
            </span>
          </div>
          :
          <div className="grid grid-cols-2 gap-2 md:gap-0 px-2 rounded-md">
            <span className="inline-block w-[1ch] text-center">
              {getTimerString(time.s).charAt(0)}
            </span>
            <span className="inline-block w-[1ch] text-center">
              {getTimerString(time.s).charAt(1)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}