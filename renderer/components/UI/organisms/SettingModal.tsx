import React, {useEffect, useState} from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import Text from '../molecules/Text'

import styles from './SettingModal.module.css'
import userDataStorage from "../../../store/userDataStorage";
import {ipcRenderer} from "electron";

function SettingModal({ open, onClickClose, cookie }) {
  const [userData, setUserData] = useState({
    id: '',
    pw: '',
  });

  // 초기화
  useEffect(() => {
    // get 저장소
    userDataStorage
      .get()
      .then((newData) => {
        let old = {...userData}
        old.id = newData.id
        old.pw = newData.pw
        setUserData(old)
      })
  }, [])

  const handleLoginSave = () => {
    userDataStorage.set(userData).then(() => {
      login()
    }).catch(console.error);
  }

  const handleId = (event) => {
    setUserData(old => {
      return {
        ...userData,
        id: event.target.value
      }
    })
  }

  const handlePw = (event) => {
    setUserData(old => {
      return {
        ...userData,
        pw: event.target.value
      }
    })
  }

  const login = () => {
    ipcRenderer.send('login', {
      id: userData.id,
      pw: userData.pw,
      cookie: cookie,
    })
  }

  return (
    <React.Fragment>
      <Modal
        open={open}
        onClose={onClickClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={`${styles.box}`}>
          <Text icon={'account'} value={'계정정보'} />
          <div>
            <TextField fullWidth sx={{ marginY: 1 }} id="outlined-basic" label="아이디" variant="filled"
                       defaultValue={userData.id}
                       onChange={handleId}
                       autoFocus />
            <TextField fullWidth sx={{ marginY: 1 }} id="outlined-basic" label="비밀번호" variant="filled"
                       defaultValue={userData.pw}
                       onChange={handlePw}/>
            <Button sx={{ marginTop: 1 }} variant="contained" fullWidth onClick={handleLoginSave}>저장</Button>
          </div>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default SettingModal;
