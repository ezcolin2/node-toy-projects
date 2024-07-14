import styled from 'styled-components';

// Styled components 정의
export const TimerContainer = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
`;

export const TimerSVG = styled.svg`

  transform: rotate(-90deg);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const CircleBackground = styled.circle`
  fill: none;
  stroke: #e0e0e0;
  stroke-width: 8;
`;

export const CircleProgress = styled.circle`
  fill: none;
  stroke: #00bcd4;
  stroke-width: 8;
  stroke-dasharray: ${props => `${props.strokeDasharray}`};
  transition: stroke-dasharray 1s linear;
`;

export const TimerText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
  font-weight: bold;
  color: #333;
`;