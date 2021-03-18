import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import { ipcRenderer  } from 'electron';
import React, { useEffect, useState } from 'react'
import url from 'url';
import validUrl from 'valid-url';
import styles from './bruteForm.module.scss';
import { bruteForceOtions } from '../../../../../options.json' 
import { MessageAction, TaskType, TxMessage } from '_/types/message';

type BruteFormProps = {

}

const selectWordlist = () => {
  ipcRenderer.send('open-file-dialog-for-dir')
}

const newEnum = async (url: string, name: string, username: string, wordlist: string) => {
  console.log('Executed')
  const task: TxMessage = {
    MessageAction: MessageAction.Add,
    TaskType: TaskType.Enumeration,
    Name: name,
    Url: url,
    Username: username,
    WordList: wordlist,
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

const BruteForm: React.FC<BruteFormProps> = () => {
  // const options = getOptions();
  const [procName, setProcName] = useState<string>('');
  const [uri, setUri] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [wordlist, setWordlist] = useState<string>('');

  const [threadC, setThreadC] = useState<number>(bruteForceOtions.MaxThreads);
  const [batchC, setBatchC] = useState<number>(bruteForceOtions.BatchCount);
  const [retryC, setRetryC] = useState<number>(bruteForceOtions.RetryCount);


  React.useEffect(() => {
    const listener = (event: Electron.IpcRendererEvent, response: string) => {
      setWordlist(response);
    }
  
    ipcRenderer.on('selected-file', listener);
    return () => { ipcRenderer.removeListener('selected-file', listener)}
  }, []);

  useEffect(() => {
    if(validUrl.isUri(uri)) {
      setProcName('Brute - ' + url.parse(uri).hostname as string)
    }

  }, [uri])
  
  return (
    <>
    <p>Brute Force currently not supported.</p>

    <TextField
      id="outlined-full-width"
      label="URL"
      style={{ margin: 8, width:'80%' }}
      placeholder="Enter url"
      onChange={(e) => setUri(e.target.value as string)}
      // helperText=""
      // fullWidth
      margin="normal"
      InputLabelProps={{
        shrink: true,
      }}
      variant="outlined"
    /> <br/>

    <TextField
      id="outlined-full-width"
      label="Username"
      style={{ margin: 8, width:'80%' }}
      placeholder="Enter Username"
      // helperText=""
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      margin="normal"
      InputLabelProps={{
        shrink: true,
      }}
      variant="outlined"
    /> <br/>

    <TextField
      id="outlined-full-width"
      label="Process name"
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
    {
      wordlist ? <p>{wordlist}</p> : null
    }
    <Button   
      variant="contained" 
      color="primary"
      style={{ margin: 8, width:'80%'}}
      onClick={() => selectWordlist()}
      >
      Select Password Wordlist
    </Button> <br/>
    <p style={{margin: 8}}>Brute Force currently not supported.</p> <br/>

    <div className={styles.advanced}>
      <div className={styles.header}>
        <p className={styles.content}>Advanced Options</p>
      </div>
      <div className={styles.options}>
        <TextField
          id="standard-number"
          label="Max-Thread"
          type="number"
          margin='dense'
          defaultValue={threadC}
          onChange={(e) => setThreadC(e.target.value as any as number)}
          style={{paddingRight:'5px'}}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <p>{threadC}</p>
        <TextField
          id="standard-number"
          label="Batch-Count"
          type="number"
          margin='dense'
          defaultValue={batchC}
          onChange={(e) => setBatchC(e.target.value as any as number)}
          style={{paddingRight:'5px'}}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          id="standard-number"
          label="Max Retry-Count"
          type="number"
          margin='dense'
          defaultValue={retryC}
          onChange={(e) => setRetryC(e.target.value as any as number)}
          style={{paddingRight:'5px'}}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
    </div>
  </>
  )
}

export default BruteForm
