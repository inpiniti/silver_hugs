import React from 'react';
import Paper from "@mui/material/Paper";

import Text from '../molecules/Text'

import styles from './ConnectCard.module.css'

function ConnectCard({title, date, onClick}) {
  return (
    <React.Fragment>
      <img
        src={`/images/logo.png`}
        loading="lazy"
      />
      <Paper sx={{padding: '5rem'}} onClick={onClick} className={`${styles.hover}`}>
        <Text value={title} size={'h2'} style={{color: 'red', }} />
        <Text value={date} size={'h4'} />
      </Paper>
    </React.Fragment>
  );
};

export default ConnectCard;