import React, { useEffect, useState } from 'react';
import { MessageAction, RxMessage, TaskStatus, TaskType, TxMessage } from '_/types/message';
import { useParams } from 'react-router-dom';
import styles from './processInfo.module.scss'
import { Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Header from './header';
import EnumResult from './enumResult';
import AddProcessBtn from './addProcessBtn';
import { ipcRenderer } from 'electron';
import BruteResult from './bruteResult';

type ProcessInfoProps = {
  data : RxMessage[],
}

const sendTaskCancellation = async (id: number) => {
  console.log('Cancel Executed')
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
      }
    }
  }
  ipcRenderer.send('ping', JSON.stringify(task));
}

const ProcessInfo: React.FC<ProcessInfoProps> = ({ data }) => {
  const procId = useParams<{ processId: string }>();

  const [currentProc, setCurrentProc] = useState<RxMessage>();

  useEffect(() => {
    setCurrentProc(data.find(x => x.Id.toString() === procId.processId))
  }, [procId])

  return ( !currentProc?.Id ? <h1>Error, Process id not found!</h1> :
    <>
    <section className={styles.container}>
      <Header currentProc={currentProc}/>
      <div className={styles.progStatus}>
        <div className={styles.progLeft}>
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
            <p>Start Time:</p>
            <p>Progress: {currentProc.Percentage}%</p>
            <p>Estimated completion time: </p>
            <p>Time left: </p>
            {
              currentProc.Exception ?
              <p>Exception: {currentProc.Exception}</p>
              : null
            }
            {
              currentProc.TaskStatus !== TaskStatus.Ready ?
              <button onClick={() => sendTaskCancellation(currentProc.Id)}>
                cancel task
              </button>
              : null
            }
          </div>
        </div>
      </div>
      {
        currentProc.TaskStatus === TaskStatus.Ready ?
        (currentProc.TaskType === TaskType.BruteForce ?
        <BruteResult currentProc={currentProc} /> :
        <EnumResult currentProc = {currentProc} />)
        : null
      }
    </section>
    {/* <EnumResult currentProc={currentProc} /> */}
    <AddProcessBtn />

    </>
  )
}

export default ProcessInfo
