import React, { useEffect, useState } from 'react';
import { MessageAction, RxMessage, TaskStatus, TaskType, TxMessage } from '_/types/message';
import { Link, useParams } from 'react-router-dom';
import styles from './processInfo.module.scss'
import { Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Header from './header';
import EnumResult from './enumResult';
import { ipcRenderer } from 'electron';
import BruteResult from './bruteResult';

type ProcessInfoProps = {
  data : RxMessage[],
}

const sendTaskCancellation = async (id: number) => {
  console.log('Cancel Executed');
  const task: TxMessage = {
    MessageAction: MessageAction.Stop,
    TaskType: TaskType.Null,
    Id: id,
    Name: '',
    Url: '',
    Username: '',
    WordList: '',
    Options: {
      BruteForceOptions: {
        BatchCount: 0,
        MaxThreads: 0,
        RetryCount: 0,
      },
    },
  };
  ipcRenderer.send('ping', JSON.stringify(task));
};

const sendTaskRemoval = async (id: number) => {
  console.log('Remove Executed');
  const task: TxMessage = {
    MessageAction: MessageAction.Remove,
    TaskType: TaskType.Null,
    Id: id,
    Name: '',
    Url: '',
    Username: '',
    WordList: '',
    Options: {
      BruteForceOptions: {
        BatchCount: 0,
        MaxThreads: 0,
        RetryCount: 0,
      },
    },
  };
  ipcRenderer.send('ping', JSON.stringify(task));
};

const ProcessInfo: React.FC<ProcessInfoProps> = ({ data }) => {
  const procId = useParams<{ processId: string }>();

  const [currentProc, setCurrentProc] = useState<RxMessage>();

  useEffect(() => {
    setCurrentProc(data.find(x => x.Id.toString() === procId.processId))
  }, [procId])

  return ( !currentProc?.Id ? <h1>Error, Process id not found!</h1> :
    <section className={styles.container}>
      <Header currentProc={currentProc}/>
      <div className={styles.progStatus}>

        {/* progressbar */}
        {
          currentProc.TaskStatus !== TaskStatus.Ready
          ? <div className={styles.progLeft}>
              <Box className={styles.progBox}>
                <CircularProgress
                  size='150px'
                  variant='determinate'
                  value={currentProc.Percentage}
                />
                <Typography className={styles.progVal}>
                  {`${Math.round(currentProc.Percentage || 0,)}%`}
                </Typography>
              </Box>
            </div>
          : null
        }

        {/* progress info */}
        <div className={styles.progRight}>
          <div className={styles.rightContent}>
            <h1>Status:
              {
                currentProc.TaskStatus == TaskStatus.Starting ? ' Starting' : 
                currentProc.TaskStatus == TaskStatus.Running ? ' Running' :
                currentProc.TaskStatus == TaskStatus.Ready ? ' Ready' : 
                currentProc.TaskStatus == TaskStatus.Stopped ? ' Stopped' :
                null
              }
            </h1>
            {/* If TaskType is BruteForce, Show username */}
            {
              currentProc.TaskType === TaskType.BruteForce
              ? <p>Username: {currentProc.Username}</p>
              : null
            }
            <p>Start Time: {`${new Date(currentProc.TimeStart).getHours()}:${new Date(currentProc.TimeStart).getMinutes()}`}</p>
            <p>Progress: {currentProc.Percentage}%</p>
            <p>Time left: {
                currentProc.TaskStatus === TaskStatus.Ready
                  ? "0"
                  : currentProc.TimeRemaining
              }
            </p>

            {/* Display completion time */}
            {
              currentProc.TaskStatus === TaskStatus.Stopped || currentProc.TaskStatus === TaskStatus.Ready
              ? <p>Completion time: {`${new Date(currentProc.CompletionTime).getHours()}:${new Date(currentProc.CompletionTime).getMinutes()}`}</p>
              : null
            }

            {/* Display exception */}
            {
              currentProc.Exception ?
              <p>Exception: {currentProc.Exception}</p>
              : null
            }

            {/* Button: remove task and navigate to main */}
            {
              currentProc.TaskStatus === TaskStatus.Stopped ||  currentProc.TaskStatus === TaskStatus.Ready
              ? <Link to='/'><button
                  style={{marginTop:'5px'}}
                  onClick={() => sendTaskRemoval(currentProc.Id)}
                >Remove task</button></Link>
              : null
            }
          </div>
        </div>
      </div>

      {/* Resolve the results to be presented or show cancel button */}
      {
        currentProc.TaskStatus === TaskStatus.Ready ?
        (currentProc.TaskType === TaskType.BruteForce ?
        <BruteResult currentProc={currentProc} /> :
        <EnumResult currentProc = {currentProc} />)
        : <button
            onClick={() => sendTaskCancellation(currentProc.Id)}
          >cancel task</button>
      }
    </section>
  )
}

export default ProcessInfo
