import { Button, TextField } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import url from 'url';
import validUrl from 'valid-url';
import { messageAction, taskType, txMessage } from '_/types/message';
import { ipcRenderer } from 'electron';

type EnumFormProps = {
  
}

const newEnum = async (url: string, name: string) => {
  console.log('Executed')
  const task: txMessage = {
    messageAction: messageAction.Add,
    taskType: taskType.Enumeration,
    name: name,
    url: url,
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
          style={{ margin: 8}}
          onClick={() => newEnum(uri, procName)}
          >
          Enumerate
        </Button>
        </>
  )
}

export default EnumForm
