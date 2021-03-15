import React, { useEffect, useState } from 'react';
import { rxMessage, taskType } from '_/types/message';
import { useParams } from 'react-router-dom';
import styles from './processInfo.module.scss'
import { Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";

type ProcessInfoProps = {
  data : rxMessage[],
}

const ProcessInfo: React.FC<ProcessInfoProps> = ({ data }) => {
  const procId = useParams<{ processId: string }>();
  console.log(`id = ${procId.processId}`)

  const [currentProc, setCurrentProc] = useState<rxMessage>();

  useEffect(() => {
    setCurrentProc(data.find(x => x.Id.toString() === procId.processId))
  }, [procId])

  return ( !currentProc?.Id ? <h1>Error, Process id not found!</h1> :
    <>
    <div className={styles.header}>
      <h1>
        {currentProc.TaskType !== 1 || 2 ? 'User Enumeration\n' : 'Brute Force\n'}
      </h1>
      <h2>{currentProc.Url}</h2>
    </div>
    <section className={styles.container}>
      <div className={styles['progress-left']}>
        <Box className={styles.progress}>
          <CircularProgress
            // className={styles.muiCircular}
            size='150px'
            variant='determinate' 
            // color={task.Status === taskStatus.Stopped ? 'primary' : 'secondary'} 
            value={currentProc.Percentage}
          />
          <Typography className={styles['progress-typo']} variant="caption" component="div">{`${Math.round(
            currentProc.Percentage || 0,
            )}%`}</Typography>
        </Box>
      </div>
      <div className={styles.progress}></div>
    </section>
    </>
  )
}

export default ProcessInfo
