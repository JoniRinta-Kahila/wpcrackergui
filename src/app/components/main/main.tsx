import React, { useEffect, useState } from 'react';
import { messageAction, taskStatus, taskType } from '_/types/message';
import styles from './main.module.scss';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import url from 'url';
import validUrl from 'valid-url';
import { Button } from '@material-ui/core';
import EnumForm from './enumForm';

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
      <FormControl>
        <InputLabel id="taskType">Attack type</InputLabel>
        <Select
            value={taskType}
            style={{ margin: 8 }}
            defaultValue={0}
            onChange={(e) => setTaskType(e.target.value as number)}
            margin="dense"
          >
            <MenuItem value={0}>User Enumeration</MenuItem>
            <MenuItem value={1}>Brute force</MenuItem>
          </Select>
      </FormControl> <br/>

      <EnumForm/>

    </div>
    </>
  )
}

export default Main
