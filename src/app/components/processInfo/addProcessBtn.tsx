import React from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import styles from './addProcessBtn.module.scss'

type AddProcessBtnProps = {

}

const AddProcessBtn: React.FC<AddProcessBtnProps> = () => {
  return (
    <Link to='/' className={styles.container}>
      <button>
        <AiOutlinePlus />
      </button>
    </Link>
  )
}

export default AddProcessBtn
