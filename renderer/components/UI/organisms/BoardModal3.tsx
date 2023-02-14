import React, {useEffect, useState} from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FilledInput from '@mui/material/FilledInput';

import styles from './BoardModal.module.css'
import userDataStorage from "../../../store/userDataStorage";
import {ipcRenderer} from "electron";
import Typography from "@mui/material/Typography";
import Link from "../../Link";
import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import {Button} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";

type BoardModalType = {
  제목: string,
  강사: string,
  제출기한: string,
  제출파일: string,

  user_id: string,
  gubun: string,
  idx: string,

  st_content: string,
  st_file1: string,
}

function BoardModal3({ open, onClickClose, href, cookie }) {
  console.log('BoardModal3', href );

  const [board, setBoard] = useState<BoardModalType>({
    제목: '',
    강사: '',
    제출기한: '',
    제출파일: '',
    user_id: '',
    gubun: '',
    idx: '',
    st_content: '',
    st_file1: '',
  });
  const [attachment, setAttachment] = useState(null);
  const [st_content, setSt_content] = useState(board?.st_content || '');

  const [open2, setOpen2] = React.useState(false);
  const handleClickOpen = () => setOpen2(true);
  const handleClose = () => setOpen2(false);

  const [msg, setMsg] = React.useState('');

  // 초기화
  useEffect(() => {
    // get 저장소
    ipcRenderer.send('boardModal3', {
      href: href,
      cookie: cookie,
    });
  }, [open])

  useEffect(() => {
    ipcRenderer.on('boardModal3', (event, board: BoardModalType) => {
      setBoard(old => {
        return board;
      });
      console.log('useEffect() > board', board)
      setSt_content(old => board.st_content)
    })

    ipcRenderer.on('mission_proc', (event, args) => {
      const msg = args.split('alert(\'')[1].split('\');')[0];
      setMsg(msg);
      handleClickOpen();
    })
  }, [])

  const handleChange = (event) => {
    const files = Array.from(event.target.files);
    const [file] = files;
    setAttachment(file);
  };

  const handleChangeContent = (event) => {
    const content = event.target.value;
    setSt_content(content);
  }

  const handleSubmit = () => {
    console.log('board', board);

    ipcRenderer.send('mission_proc', {
      st_content: st_content,
      st_file1: attachment != null ? [attachment].map(f => f.path) : '',
      cookie: cookie,
      user_id: board.user_id,
      gubun: board.gubun,
      idx: board.idx,
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
          <Typography variant="h6" gutterBottom>
            미션 제출
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="제목"
                fullWidth
                value={board.제목}
                size="small"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                label="강사"
                fullWidth
                size="small"
                value={board.강사}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                label="제출기한"
                fullWidth
                size="small"
                value={board.제출기한}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="st_content"
                label="제출내용"
                onChange={handleChangeContent}
                multiline
                rows={8}
                fullWidth
                value={st_content}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
              >
                파일 선택
                <input
                  type="file"
                  name="st_file1"
                  onChange={handleChange}
                  hidden
                />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                label="제출파일"
                fullWidth
                value={ attachment?.name || board?.st_file1 || "" }
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleSubmit}
              >
                글쓰기
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      <Dialog
        open={open2}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          글쓰기
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

export default BoardModal3;
