import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Text from '../molecules/Text'

import styles from './VideoModal.module.css'

function VideoModal({ open, onClickClose, src }) {

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1200,
    bgcolor: '#fff',
    boxShadow: 24,
    p: 4,
  };

  return (
    <React.Fragment>
      <Modal
        open={open}
        onClose={onClickClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className={`${styles.box}`}>
          <Text icon={"video"} value={'동영상'} />
          <video style={{width: '-webkit-fill-available'}} controls>
            <source src={src} type="video/mp4"/>
          </video>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default VideoModal;
