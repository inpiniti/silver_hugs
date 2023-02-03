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
  구분: string,
  이름: string,
  첨부파일: string,
  과제: string,
  VOD: string,
  강사: string,
  제출기한: string,
  과제내용: string,
  cpc_cid: string,
  cpc_no: string,
  idx: string,
  homework_idx: string,
  content: string,
  file: string,
}

function BoardModal({ open, onClickClose, href, cookie }) {
  const [board, setBoard] = useState<BoardModalType>({
    구분: '',
    이름: '',
    첨부파일: '',
    과제: '',
    VOD: '',
    강사: '',
    제출기한: '',
    과제내용: '',
    cpc_cid: '',
    cpc_no: '',
    idx: '',
    homework_idx: '',
    content: '',
    file: '',
  });
  const [attachment, setAttachment] = useState(null);
  const [content, setContent] = useState(board?.content || '');

  const [open2, setOpen2] = React.useState(false);
  const handleClickOpen = () => setOpen2(true);
  const handleClose = () => setOpen2(false);

  const [msg, setMsg] = React.useState('');

  // 초기화
  useEffect(() => {
    // get 저장소
    ipcRenderer.send('boardModal', {
      href: href,
      cookie: cookie,
    });
  }, [open])

  useEffect(() => {
    ipcRenderer.on('boardModal', (event, board: BoardModalType) => {
      setBoard(old => {
        return board;
      });
      setContent(old => board.content)
    })

    ipcRenderer.on('homework_proc', (event, args) => {
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
    setContent(content);
  }

  const handleSubmit = () => {
    ipcRenderer.send('homework_proc', {
      content: content,
      file1: attachment != null ? [attachment].map(f => f.path) : '',
      cookie: cookie,
      cpc_cid: board.cpc_cid,
      cpc_no: board.cpc_no,
      idx: board.idx,
      homework_idx: board.homework_idx,
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
            과제 제출
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="구분"
                fullWidth
                value={board.구분}
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
                label="이름"
                fullWidth
                size="small"
                value={board.이름}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                label="첨부파일"
                fullWidth
                size="small"
                value={board.첨부파일}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                label="과제"
                fullWidth
                size="small"
                value={board.과제}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                label="VOD"
                fullWidth
                size="small"
                value={board.VOD}
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
            <Grid item xs={12}>
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
                InputProps={{
                  readOnly: true,
                }}
                label="과제내용"
                fullWidth
                value={board.과제내용}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="content"
                label="제출내용"
                onChange={handleChangeContent}
                multiline
                rows={8}
                fullWidth
                value={content}
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
                  name="file1"
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
                value={ attachment?.name || board?.file || "" }
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

export default BoardModal;
