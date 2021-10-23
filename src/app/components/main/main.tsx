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
    <div className={styles.container}>
      <h1>Create new process</h1>
      <div className={styles.form}>
        <div className={styles.formSetter}>
          <FormSetter selectedForm={taskType} formSetter={setTaskType} />
        </div>
        {
          taskType === 0
            ? <EnumForm />
            : <BruteForm />
        }
      </div>
    </div>
  )
}

export default Main
