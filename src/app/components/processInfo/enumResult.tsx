import React from 'react';
import Collapsible from 'react-collapsible';
import { RxMessage } from '_/types/message';
import styles from './enumResult.module.scss';

type EnumResultProps = {
  currentProc : RxMessage,
}

const EnumResult: React.FC<EnumResultProps> = ({ currentProc }) => {
  return (
    <section className={styles.section}>
    {
      currentProc.TaskResult?.UserEnumeration ?
      <>
      <span><h3>Result </h3> Click usernames to expand for more information</span><br/>
      {
        currentProc.TaskResult.UserEnumeration.map(user => {
          return(
            <Collapsible key={user.Id} tabIndex={0} trigger={user.Slug ?? user.Id} className={styles.collapsible}>
              <p>ID:............. {user.Id}</p>
              <p>NAME:........... {user.Name}</p>
              <p>DESCRIPTION:.... {user.Description}</p>
              <p>LINK:........... {user.Link}</p>
              <p>URL:............ {user.Url}</p>
              <p>SLUG:........... {user.Slug}</p>
              <p>-----------------</p>
              <br/>
            </Collapsible>
            // ToDo
            // make button for save innerHTML from this element to file.
          )
        })
      }
      </>
      : <p>Empty result</p>
    } 
  </section>
  )
}

export default EnumResult
