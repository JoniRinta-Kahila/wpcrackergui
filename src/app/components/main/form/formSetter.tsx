import React from 'react';
import { FormControl, InputLabel, makeStyles, MenuItem, Select } from '@material-ui/core'
import styles from './formSetter.module.scss';

type FormSetterProps = {
  selectedForm : number,
  formSetter: (value : number) => void,
}

const useStyles = makeStyles({
  select: {
    '&:before': {
      borderColor: 'white',
    },
    '&:after': {
        borderColor: 'white',
    },
    '&:not(.Mui-disabled):hover::before': {
        borderColor: 'white',
    },
  },
  label: {
    label: {
      color: "#fff",
      "&.Mui-focused": {
        color: "#fff",
      },
    }
  }
})

const FormSetter: React.FC<FormSetterProps> = ({ selectedForm, formSetter }) => {
  const classes = useStyles();
  return (
  <FormControl className={styles.container}>
      <InputLabel className={styles.label} id="taskType">Attack type</InputLabel>
      <Select
        value={selectedForm}
        className={styles.select}
        style={{ margin: 8, width: 250 }}
        defaultValue={0}
        onChange={(e) => formSetter(e.target.value as number)}
        margin="dense"
        color='primary'
      >
        <MenuItem className={styles.menuItem} value={0}>User Enumeration</MenuItem>
        <MenuItem value={1}>Brute force</MenuItem>
      </Select>
    </FormControl>
  )
}

export default FormSetter
