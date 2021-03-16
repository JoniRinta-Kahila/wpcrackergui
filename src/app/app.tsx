import React from 'react';
import { Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ipcRenderer } from 'electron';
import {
  RxMessage,
  TaskStatus,
  TaskType,
} from '_/types/message';
import styles from './app.module.scss';
import {
  HashRouter as Router,
  Link,
  Route,
  Switch,
} from 'react-router-dom';
import ProcessInfo from './components/processInfo/processInfo';
import Main from './components/main/main';

type AppProps = {
  
}

const App: React.FC<AppProps> = ({}) => {
  const [processes, setProcesses] = React.useState<RxMessage[]>([]);
  
  React.useEffect(() => {
    const listener = (event: Electron.IpcRendererEvent, response: string) => {
      setProcesses(JSON.parse(response));
    }
  
    ipcRenderer.on('data-from-backend', listener);
    return () => { ipcRenderer.removeListener('data-from-backend', listener)}
  }, [])

  React.useEffect(() => {
    console.log(processes)
  }, [processes])

  return (
    <Router>    
      <div className={styles.wrapper}>
        <div className={styles.sidebar}>

          {/* <button onClick={() => newEnum()}>
            New
          </button> */}

          <h2>Task list</h2>
          <ul>
            {
              processes.map((task) => {
                return (
                  <Link key={task.Id} to={`/${task.Id}`}>
                  <li key={task.Id} style={{background: task.TaskType === TaskType.BruteForce ? '#ca1dff' : ''}}>
                    {
                      task.Status == TaskStatus.Starting ? <h1>Starting</h1> : 
                      task.Status == TaskStatus.Ready ? <h1>Ready</h1> : 
                      task.Status == TaskStatus.Stopped ? <h1>Stopped</h1> : 

                      <Box className={styles.task}>
                        <CircularProgress
                          variant='determinate' 
                          // color={task.Status === taskStatus.Stopped ? 'primary' : 'secondary'} 
                          value={task.Percentage}
                        />
                        <Typography className={styles.progress} variant="caption" component="div">{`${Math.round(
                          task.Percentage || 0,
                          )}%`}</Typography>
                      </Box>
                    }
                    <span className={styles.title}>{task.Name}</span>
                  </li>
                  </Link>
                )
              })
            }
          </ul>
        </div>
        <div className={styles.main}>
          <Switch>
            <Route exact path='/' render={() => <Main />} />
            <Route exact path='/:processId' render={() => <ProcessInfo data={processes} /> } />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App
