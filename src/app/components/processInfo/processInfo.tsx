import React, { useEffect, useState } from 'react';
import { RxMessage } from '_/types/message';
import { useParams } from 'react-router-dom';
import styles from './processInfo.module.scss'
import { Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Header from './header';
import EnumResult from './enumResult';
import AddProcessBtn from './addProcessBtn';

type ProcessInfoProps = {
  data : RxMessage[],
}

const ProcessInfo: React.FC<ProcessInfoProps> = ({ data }) => {
  const procId = useParams<{ processId: string }>();

  const [currentProc, setCurrentProc] = useState<RxMessage>();

  useEffect(() => {
    setCurrentProc(data.find(x => x.Id.toString() === procId.processId))
  }, [procId])

  return ( !currentProc?.Id ? <h1>Error, Process id not found!</h1> :
    <>
    <Header currentProc={currentProc}/>
    <section className={styles.container}>
      <div className={styles['progress-left']}>
        <Box className={styles.progress}>
          <CircularProgress
            size='150px'
            variant='determinate'
            value={currentProc.Percentage}
          />
          <Typography className={styles['progress-typo']} variant="caption" component="div">{`${Math.round(
            currentProc.Percentage || 0,
            )}%`}</Typography>
        </Box>
      </div>
      <div className={styles.progress}></div>
    </section>

    <EnumResult currentProc={currentProc} />
    
    <AddProcessBtn />

    </>
  )
}

export default ProcessInfo
