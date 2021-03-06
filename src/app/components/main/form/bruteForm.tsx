import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import { ipcRenderer  } from 'electron';
import React, { useEffect, useState } from 'react'
import url from 'url';
import validUrl from 'valid-url';
import styles from './bruteForm.module.scss';
import { bruteForceOtions } from '../../../../../options.json' 
import { MessageAction, TaskType, TxMessage } from '_/types/message';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

type BruteFormProps = {

}

const selectWordlist = () => {
  ipcRenderer.send('open-file-dialog-for-dir')
}

const newBrute = async (url: string, name: string, username: string, wordlist: string, bc: number, mt: number, rc: number) => {
  console.log('Executed')
  const task: TxMessage = {
    MessageAction: MessageAction.Add,
    TaskType: TaskType.BruteForce,
    Name: name,
    Url: url,
    Username: username,
    WordList: wordlist,
    Options: {
      BruteForceOptions: {
        BatchCount: bc,
        MaxThreads: mt,
        RetryCount: rc,
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

  const [advancedVisibility, setAdvancedVisibility] = useState(false);


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

    <div className={styles.advanced}>
      <div className={styles.header} onClick={() => setAdvancedVisibility(!advancedVisibility)}>
        <p className={styles.content}>
          Advanced Options
          <span className={styles['content-icon']}>
            {
              advancedVisibility ?
              <ArrowDropDownIcon /> :
              <ArrowDropUpIcon /> 
            }
          </span>
        </p>
      </div>
      <div className={advancedVisibility ? styles['options-visible'] : styles['options-hidden']}>
        <TextField
          id="standard-number"
          label="Max-Thread"
          type="number"
          margin='dense'
          defaultValue={threadC}
          onChange={(e) => setThreadC(e.target.value as any as number)}
          style={{paddingRight:'5px', width: 100}}
          InputLabelProps={{
            shrink: true,
          }}
        />
        
        <TextField
          id="standard-number"
          label="Batch-Count"
          type="number"
          margin='dense'
          defaultValue={batchC}
          onChange={(e) => setBatchC(e.target.value as any as number)}
          style={{paddingRight:'5px', width: 100}}
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
          style={{paddingRight:'5px', width: 100}}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
    </div>
    <Button 
      variant="contained" 
      color="primary"
      style={{ margin: 8}}
      onClick={() => newBrute(uri, procName, username, wordlist, batchC, threadC, retryC)}
      >
      Brute Force
    </Button>
  </>
  )
}

export default BruteForm
