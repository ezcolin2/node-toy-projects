import React, { useState, useEffect } from "react";
import {
  TimerContainer,
  TimerSVG,
  CircleBackground,
  CircleProgress,
  TimerText,
} from "./styles";

// Timer 컴포넌트
const CountdownTimer = () => {
  const [seconds, setSeconds] = useState(5);
  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [seconds]);

  const calculateDashArray = () => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const remaining = (seconds / 5) * circumference;
    return `${remaining} ${circumference}`;
  };

  return (
    <TimerContainer>
      <TimerSVG>
        <CircleBackground cx="50%" cy="50%" r="40" />
        <CircleProgress
          cx="50%"
          cy="50%"
          r="40"
          strokeDasharray={calculateDashArray()}
        />
      </TimerSVG>
      <TimerText>{seconds}</TimerText>
    </TimerContainer>
  );
};

export default CountdownTimer;
