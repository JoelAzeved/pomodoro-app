import  { useCallback, useEffect, useState } from 'react';
import { useInterval } from '../hooks/use-interval';
import { Button } from './button';
import Timer from './timer';

import bellStart from '../sounds/src_sounds_bell-start.mp3';
import bellFinish from '../sounds/src_sounds_bell-finish.mp3';
import { secondsToTimes } from '../utils/seconds-to-time';

const audioStartWorking = new Audio(bellStart);
const audioFinishWorking = new Audio(bellFinish);

interface Props {
  pomodoroTime : number;
  shortTime: number;
  longRestTime: number;
  cycles: number;
}

export function PomodoroTimer(props: Props): JSX.Element {

  const [mainTime, setMainTime] = useState(props.pomodoroTime);
  const [timeCounting, setTimeCounting] = useState(false);
  const [working, setWorking] = useState(false);
  const [resting, setResting] = useState(false);
  const [cyclesQtd, setCylcesQtd] = useState(new Array(props.cycles -1).fill(true));

  const [completedCycles, setCompletedCycles] = useState(0);
  const [fullWorkingTime, setWorkingTimes] = useState(0);
  const [numberOfPomodoros, setNumberOfPomodoro] = useState(0);

  useInterval(() => {
    setMainTime(mainTime -1);
    if(working) setWorkingTimes(fullWorkingTime + 1);
  },timeCounting ? 1000 : null );

  const configWork = useCallback(() => {
    setTimeCounting(true);
    setWorking(true);
    setResting(false);
    setMainTime(props.pomodoroTime);
    audioStartWorking.play();
  }, [setTimeCounting, setWorking, setResting, props.pomodoroTime])

  const configRest = useCallback((long: boolean) => {
    setTimeCounting(true);
    setWorking(false);
    setResting(true);
    if(long) {
      setMainTime(props.longRestTime);
    }else {
      setMainTime(props.shortTime);
    }
    audioFinishWorking.play();
  }, [setTimeCounting, setWorking, setResting, props.longRestTime, props.shortTime])


  useEffect(() => {
    if (working) document.body.classList.add('working');
    if (resting) document.body.classList.remove('working');

    if (mainTime > 0) return;
    if(working && cyclesQtd.length > 0) {
      configRest(false);
      cyclesQtd.pop();
    } else if (working && cyclesQtd.length <= 0) {
      configRest(true);
      setCylcesQtd(new Array(props.cycles -1).fill(true));
      setCompletedCycles(completedCycles + 1);
    }

    if(working) setNumberOfPomodoro(numberOfPomodoros +1);
    if(resting) configWork();

  }, [working, resting, mainTime, configRest, setCylcesQtd, cyclesQtd, configWork, numberOfPomodoros, props.cycles, completedCycles, ]);

  return(
    <div className="pomodoro">
      <h2>You are: {working ? 'Working' : 'Resting'}</h2>
      <Timer  mainTimer = {mainTime}/>
      <div className="controls">
      <Button text='working'  className='working' onClick={configWork}/>
      <Button text='rest' onClick={() => configRest(false)}/>
      <Button text={timeCounting ? 'Pause' : 'Play'} className={!working && !resting ? 'hidden': ''} onClick={()=> setTimeCounting(!timeCounting)}/>
      </div>
      <div className="details">
        <p>Ciclos concluidos: {completedCycles}</p>
        <p>Horas trabalhadas: {secondsToTimes(fullWorkingTime)}</p>
        <p>Pomodoros concluidos: {numberOfPomodoros}</p>
      </div>
    </div>
  )
}