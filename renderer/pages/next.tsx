import React from 'react';
import Head from 'next/head';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing(4),
    },
  })
);

function Next() {
  const classes = useStyles({});

  return (
    <React.Fragment>
      <Head>
        <title>Next - Nextron (with-typescript-material-ui)</title>
      </Head>
      <div className={classes.root}>
      </div>
    </React.Fragment>
  );
};

export default Next;
