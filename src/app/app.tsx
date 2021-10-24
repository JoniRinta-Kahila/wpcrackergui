import React from 'react';
import { Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ipcRenderer } from 'electron';
import {
  RxMessage,
  TaskStatus,
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
import { useDarkmodeContext } from './context/darkmodeContextProvider';
import { AiOutlinePlus } from 'react-icons/ai';

type AppProps = {
  
}

const taskBgColor = (status: TaskStatus) => {
  if (status === TaskStatus.Running) return '#ca1dff';
  if (status === TaskStatus.Stopped) return '#ff0000';
  if (status === TaskStatus.Ready) return '#21ff00';
  if (status === TaskStatus.Starting) return '#f7ff00';
}

const taskTxtColor = (status: TaskStatus) => {
  if (status === TaskStatus.Running) return '#000000';
  if (status === TaskStatus.Stopped) return '#000000';
  if (status === TaskStatus.Ready) return '#000000';
  if (status === TaskStatus.Starting) return '#000000';
}

let listUpdater = 0;

const App: React.FC<AppProps> = ({}) => {
  const [processes, setProcesses] = React.useState<RxMessage[]>([]);

  // TODO add themes
  const { setUseDarkmode, useDarkmode } = useDarkmodeContext();
  
  React.useEffect(() => {
    const listener = (event: Electron.IpcRendererEvent, response: string) => {
      setProcesses(JSON.parse(response));
    }
  
    ipcRenderer.on('data-from-backend', listener);
    return () => { ipcRenderer.removeListener('data-from-backend', listener)}
  }, [])

  React.useEffect(() => {
    console.log(processes)
    listUpdater++;
  }, [processes])

  return (
    <Router>
      <div className={styles.wrapper}>
        <div className={styles.sidebar}>

          <h2>Task list</h2>
          <ul>
            {
              processes.map((task) => {
                return (
                  <Link key={task.Id} to={`/${task.Id}`}>
                    <li key={task.TaskStatus} style={{
                      background: taskBgColor(task.TaskStatus!)
                    }}>
                    <Box className={styles.task}>
                      <CircularProgress
                        variant='determinate'
                        value={task.Percentage}
                      />
                      <Typography style={{color: taskTxtColor(task.TaskStatus!)}} className={styles.progress} variant="caption" component="div">{`${Math.round(
                        task.Percentage || 0,
                        )}%`}</Typography>
                    </Box>
                    <span className={styles.title} style={{color: taskTxtColor(task.TaskStatus!)}}>{task.Name}</span>
                  </li>
                  </Link>
                )
              })
            }
          </ul>

          {/* add new proccess button */}
          <Link
            to='/'
            className={styles.linkToMain}
          >
            <AiOutlinePlus size={25} />
          </Link>

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
