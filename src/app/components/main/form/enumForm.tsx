import { Button, InputLabel, makeStyles, TextField, withStyles } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import url from 'url';
import validUrl from 'valid-url';
import { MessageAction, TaskType, TxMessage } from '_/types/message';
import { ipcRenderer } from 'electron';
import styles from './enumForm.module.scss'; 

type EnumFormProps = {
  
}

const useStyles = makeStyles({
  root: {
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "green",
      color: 'red'
    },
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "red"
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "purple"
    },
    "& .MuiInputBase-root": {
      color: '#fff',
    }
  },
  input: {
    color: '#fff'
  }
});

const newEnum = async (url: string, name: string) => {
  console.log('Executed')
  const task: TxMessage = {
    MessageAction: MessageAction.Add,
    TaskType: TaskType.Enumeration,
    Name: name,
    Url: url,
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

const EnumForm: React.FC<EnumFormProps> = () => {
  const [procName, setProcName] = useState<string>('');
  const [uri, setUri] = useState<string>('');

  useEffect(() => {
    if(validUrl.isUri(uri)) {
      setProcName('Enum - ' + url.parse(uri).hostname as string)
    }

  }, [uri])

  const classes = useStyles();

  return (
    <>
    <div className={styles.form}>
      <TextField
        id="outlined-full-width"
        label="URL"
        // className={classes.root}
        className={ `${classes.root} ${styles.textField}` }
        inputProps={{color:'#fff'}}
        style={{ margin: 8, width:'80%' }}
        placeholder="Enter url"
        onChange={(e) => setUri(e.target.value as string)}
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
      />
    
      <TextField
        id="outlined-full-width"
        label="Process name"
        className={`${classes.root} ${styles.textField}`}
        style={{ margin: 8, width:'80%' }}
        placeholder="Enter process name"
        // helperText=""
        value={procName}
        onChange={(e) => setProcName(e.target.value)}
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
      /> <br/>

      <text style={{color:'#fff', margin: '30px'}}>
        This user enumeration process is a quick operation that checks if the "WP API JSON" contains user data. If user data is found, you will receive a list of collected data in response.
      </text>
      <Button 
        variant="contained" 
        color="primary"
        className={styles.button}
        style={{ margin: 8, width: 350}}
        onClick={() => newEnum(uri, procName)}
        >
        Enumerate
      </Button>
    </div>
    </>
  )
}

export default EnumForm
