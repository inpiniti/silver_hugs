import React from 'react';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';
import Boards from '../components/TEMPLATES/Boards'
import Head from "next/head";
import {useEffect, useState} from "react";
import userDataStorage from "../store/userDataStorage";
import { ipcRenderer } from "electron";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


function Home() {
  const [userData, setUserData] = useState({
    id: '',
    pw: '',
    cookie: Date.now(),
  });

  const [board, setBoard] = useState([])

  const [today, setToday] = useState([{
    시간: '', program: '', 활동내용: '', liveType: '', id: 0, 강의실입장: ''
  }])

  const [weather, setWeather] = useState({})

  const [open, setOpen] = React.useState(false);

  const [msg, setMsg] = React.useState('');

  const [notice, setNotice] = React.useState('');

  const [job, setJob] = React.useState('');

  // 초기화
  useEffect(() => {
    var networkInterfaces = require( 'os' ).networkInterfaces( );
    console.log('networkInterfaces', networkInterfaces)

    setTimeout(() => {
      // get 저장소
      userDataStorage
        .get()
        .then((newData) => {
          setUserData(old => {
            return {
              ...old,
              id: newData.id,
              pw: newData.pw,
            }
          })
          login(newData.id, newData.pw)
        })
        .catch(e => {
          setMsg('아이디 패스워드를 입력해 주세요.')
          handleClickOpen()
        });
    }, 3000);

    ipcRenderer.on('login', (event, args) => {
      const msg = args.split('alert(\'')[1].split('\');')[0];
      setMsg(msg)
      handleClickOpen()
      setBoard([])
      setToday([{
        시간: '', program: '', 활동내용: '', liveType: '', id: 0, 강의실입장: ''
      }])
      if(msg=='로그인 되었습니다.') {
        board()
        today()
        weather()
        notice()
        job()
      }
    })

    ipcRenderer.on('board', (event, boards) => {
      setBoard(boards)
    })

    ipcRenderer.on('today', (event, today) => {
      setToday(today)
    })

    ipcRenderer.on('notice', (event, notice) => {
      setNotice(notice)
    })

    ipcRenderer.on('job', (event, job) => {
      setJob(job)
    })

    ipcRenderer.on('weather', (event, weather) => {
      setWeather({
        ...weather.main,
        wind: weather.wind.speed,
        main: weather.weather[0].main,
      })
    })

    const login = (id = null, pw = null) => {
      ipcRenderer.send('login', {
        id: id == null ? userData.id : id,
        pw: pw == null ? userData.pw : pw,
        cookie: userData.cookie,
      })
    }

    const board = () => {
      ipcRenderer.send('board', {
        cookie: userData.cookie,
      })
    }

    const today = () => {
      ipcRenderer.send('today', {
        cookie: userData.cookie,
      })
    }

    const weather = () => {
      ipcRenderer.send('weather')
    }

    const notice = () => {
      ipcRenderer.send('notice')
    }

    const job = () => {
      ipcRenderer.send('job')
    }
  }, [])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //if (error) return <div>Failed to load users</div>
  //if (!data) return <div>Loading...</div>

  return (
    <React.Fragment>
      <Head>
        <title>실버허그</title>
      </Head>
      <Boards
        schedule={board}
        notice={notice}
        job={job}
        today={today}
        cookie={userData.cookie}
        weather={weather}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {msg == '아이디 패스워드를 입력해 주세요.' ? '로그인 실패' : '로그인'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {msg}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>확인</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default Home;
