import React from 'react';
import Typography from '@mui/material/Typography';
import Paper from "@mui/material/Paper";

function Text({label, value}) {
  return (
    <React.Fragment>
      <Paper variant="outlined" style={{ padding: '1rem', backgroundColor: '#ebf7ff' }}>
        <Typography variant={'h6'} style={{ textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden' }}>
          {label}
        </Typography>
        <Typography variant={'h6'} style={{color: '#34a0ff', fontWeight: 'bold', textAlign: 'center'}}>
          {value}
        </Typography>
      </Paper>
    </React.Fragment>
  );
};

export default Text;
