
import './App.css'
import { PomodoroTimer } from './components/pomodoro-time';

function App() {

  return (
    <div className='container'>
    <h1>Merda pra todo lado</h1>
    <PomodoroTimer
      pomodoroTime={1500}
      shortTime={300}
      longRestTime={900}
      cycles={4}
    />
    </div>
  )
}

export default App
