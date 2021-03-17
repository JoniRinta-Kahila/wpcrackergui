import React, { useState } from 'react';
import styles from './main.module.scss';
import EnumForm from './form/enumForm';
import FormSetter from './form/formSetter';
import TextField from '@material-ui/core/TextField';
import BruteForm from './form/bruteForm';

type MainProps = {
  
}

const Main: React.FC<MainProps> = () => {
  const [taskType, setTaskType] = useState<number>(0);

  return (
    <>
    <div className={styles.header}>
      <h1>Create new process</h1>
    </div>

    <div className={styles.form}>
      <FormSetter selectedForm={taskType} formSetter={setTaskType} />
      {
        taskType === 0 ?
        <EnumForm /> :
        <BruteForm />
      }
    </div>
    </>
  )
}

export default Main
