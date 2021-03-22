import React from 'react';
import { RxMessage } from '_/types/message';
import styles from './enumResult.module.scss';

type EnumResultProps = {
  currentProc : RxMessage,
}

const BruteResult: React.FC<EnumResultProps> = ({ currentProc }) => {
  return (
    <section className={styles.section}>
    {
      currentProc.TaskResult?.BruteForce ?
      <>
        <h1>BRUTE FORCE RESULT:</h1>      
        <p>Username: {currentProc.TaskResult.BruteForce.Username}</p>
        <p>Password: {currentProc.TaskResult.BruteForce.Password}</p>
      </>
      : <p>Empty result</p>
    } 
  </section>
  )
}

export default BruteResult;
