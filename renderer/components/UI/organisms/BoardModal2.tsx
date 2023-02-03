import React, {useEffect, useState} from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import styles from './BoardModal2.module.css'

function BoardModal2({ open, onClickClose, vod }) {
  return (
    <React.Fragment>
      <Modal
        open={open}
        onClose={onClickClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={`${styles.box}`}>
          <div dangerouslySetInnerHTML={ {__html: vod} }>
          </div>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default BoardModal2;
