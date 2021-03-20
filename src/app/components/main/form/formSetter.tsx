import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core'
import React from 'react'

type FormSetterProps = {
  selectedForm : number,
  formSetter: (value : number) => void,
}

const FormSetter: React.FC<FormSetterProps> = ({ selectedForm, formSetter }) => {
  return (
    <>
    <FormControl>
        <InputLabel id="taskType">Attack type</InputLabel>
        <Select
          value={selectedForm}
          style={{ margin: 8, width: 250 }}
          defaultValue={0}
          onChange={(e) => formSetter(e.target.value as number)}
          margin="dense"
        >
          <MenuItem value={0}>User Enumeration</MenuItem>
          <MenuItem value={1}>Brute force</MenuItem>
        </Select>
      </FormControl>
    </>
  )
}

export default FormSetter
