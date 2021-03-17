import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import { dialog, BrowserWindow, ipcMain, ipcRenderer  } from 'electron';
import React, { useEffect, useState } from 'react'
import url from 'url';
import validUrl from 'valid-url';

type BruteFormProps = {

}

const selectWordlist = () => {
  ipcRenderer.send('open-file-dialog-for-dir')
}

const BruteForm: React.FC<BruteFormProps> = () => {
  const [procName, setProcName] = useState<string>('');
  const [uri, setUri] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [wordlist, setWordlist] = useState<string>('');

  React.useEffect(() => {
    const listener = (event: Electron.IpcRendererEvent, response: string) => {
      setWordlist(response);
    }
  
    ipcRenderer.on('selected-file', listener);
    return () => { ipcRenderer.removeListener('selected-file', listener)}
  }, []);

  useEffect(() => {
    console.log(wordlist)
  }, [wordlist])

  useEffect(() => {
    if(validUrl.isUri(uri)) {
      setProcName('Enum - ' + url.parse(uri).hostname as string)
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

    <Button   
      variant="contained" 
      color="primary"
      style={{ margin: 8, width:'80%'}}
      onClick={() => selectWordlist()}
      >
      Select Wordlist
    </Button> <br/>
    <p>Brute Force currently not supported.</p>
  </>
  )
}

export default BruteForm
