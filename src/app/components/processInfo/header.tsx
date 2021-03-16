import React from 'react';
import { RxMessage } from '_/types/message';
import styles from './header.module.scss';

type HeaderProps = {
  currentProc : RxMessage,
}

const Header: React.FC<HeaderProps> = ({ currentProc }) => {
  return (
    <div className={styles.header}>
      <h1>
        {currentProc.TaskType !== 1 || 2 ? 'User Enumeration\n' : 'Brute Force\n'}
      </h1>
      <h2>{currentProc.Url}</h2>
    </div>
  )
}

export default Header
