import { secondsToMinutes } from "../utils/second-to-minutes";

interface Props {
  mainTimer: number;
}

export default function Timer(props: Props): JSX.Element{
  return(
    <div className="timer">{secondsToMinutes(props.mainTimer)}</div>
  )
}