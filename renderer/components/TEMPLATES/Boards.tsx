import React from 'react';

import Grid from "@mui/material/Unstable_Grid2";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

import BoardCard from "../UI/organisms/BoardCard"
import WeatherCard from "../UI/organisms/WeatherCard";
import ConnectCard from "../UI/organisms/ConnectCard";
import VideoModal from "../UI/organisms/VideoModal";
import SettingModal from "../UI/organisms/SettingModal"
import { GridRenderCellParams } from "@mui/x-data-grid";
import Button from '@mui/material/Button';
import { TouchRippleActions } from '@mui/material/ButtonBase/TouchRipple';
import BoardModal from '../UI/organisms/BoardModal';
import BoardModal2 from "../UI/organisms/BoardModal2";
import BoardModal3 from "../UI/organisms/BoardModal3";

type BoardsType = {
  notice?: any,
  job?: any,
  today?: any,
  today2?: any,
  today3?: any,
  cookie?: any,
  weather?: any,
  schedule?: any,
}

export default function Boards({
  notice,
  job,
  today,
  today2,
  today3,
  cookie,
  weather,
  schedule,
}: BoardsType) {

  const RenderDate = (props) => {
    const { formattedValue } = props
    return (
      <strong>
        <div dangerouslySetInnerHTML={ {__html: formattedValue} }>
        </div>
      </strong>
    );
  };

  const RenderDate2 = (props) => {
    const { formattedValue } = props
    return (
      <Button variant="contained" href="#contained-buttons" onClick={() => {
        setBoardOpen(true);
        setHref(formattedValue);
      }}>
        VIEW
      </Button>
    );
  };

  const RenderDate3 = (props) => {
    const { formattedValue } = props
    return (
      <Button variant="contained" href="#contained-buttons" onClick={() => {
        setVodOpen(true);
        setVod(formattedValue);
      }}>
        VIEW
      </Button>
    );
  };

  const RenderDate4 = (props) => {
    const { formattedValue } = props
    return (
      <Button variant="contained" href="#contained-buttons" onClick={() => {
        setBoardOpen3(true);
        setHref3(formattedValue);
      }}>
        VIEW
      </Button>
    );
  };

  const columns = [
    {
      field: 'id',
      headerName: '??????',
      width: 50,
    },
    {
      field: '??????',
      headerName: '??????',
      width: 160,
    },
    {
      field: 'program',
      headerName: '???????????????',
      width: 250,
    },
    {
      field: '????????????',
      headerName: '????????????',
      width: 150,
    },
    {
      field: 'liveType',
      headerName: '(Live??????)',
      width: 100,
    },
    {
      field: '???????????????',
      headerName: '???????????????',
      width: 100,
      renderCell: RenderDate,
    },
  ];

  const columns2 = [
    {
      field: 'No',
      headerName: 'no',
      width: 50,
    },
    {
      field: '????????????',
      headerName: '????????????',
      width: 250,
    },
    {
      field: '??????',
      headerName: '??????',
      width: 140,
    },
    {
      field: '??????',
      headerName: '??????',
      width: 80,
    },
    {
      field: '????????????',
      headerName: '????????????',
      width: 130,
    },
    {
      field: '????????????',
      headerName: '????????????',
      width: 80,
    },
    {
      field: '????????????',
      headerName: '????????????',
      width: 100,
      renderCell: RenderDate2,
    },
  ];

  const columns3 = [
    {
      field: '??????',
      headerName: '??????',
      width: 50,
    },
    {
      field: '??????',
      headerName: '??????[PLAN]???',
      width: 350,
    },
    {
      field: 'video',
      headerName: 'video',
      renderCell: RenderDate3,
      width: 100,
    },
    {
      field: '????????????',
      headerName: '????????????',
    },
    {
      field: '?????????',
      headerName: '?????????',
      width: 150,
    },
    {
      field: '??????????????????',
      headerName: '??????????????????',
      renderCell: RenderDate4,
      width: 130,
    },
  ];

  const noticeColumns = [
    {
      field: 'id',
      headerName: '??????',
      width: 50,
    },
    {
      field: 'title',
      headerName: '??????',
      editable: true,
      width: 500,
    },
    {
      field: 'writer',
      headerName: '?????????',
      editable: true,
      width: 100,
    },
    {
      field: 'date',
      headerName: '?????????',
      editable: true,
      width: 100,
    },
    {
      field: 'num',
      headerName: '?????????',
      width: 70,
    },
  ];

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [settingOpen, setSettingOpen] = React.useState(false);
  const handleSettingOpen = () => setSettingOpen(true);
  const handleSettingClose = () => setSettingOpen(false);

  const [boardOpen, setBoardOpen] = React.useState(false);
  const handleBoardOpen = () => setBoardOpen(true);
  const handleBoardClose = () => setBoardOpen(false);

  const handleClick = () => setBoardOpen(true);
  const [href, setHref] = React.useState('');

  const [vod, setVod] = React.useState();
  const [vodOpen, setVodOpen] = React.useState(false);
  const handleVodOpen = () => setVodOpen(true);
  const handleVodClose = () => setVodOpen(false);

  const [boardOpen3, setBoardOpen3] = React.useState(false);
  const handleBoardOpen3 = () => setBoardOpen3(true);
  const handleBoardClose3 = () => setBoardOpen3(false);

  const [href3, setHref3] = React.useState('');

  console.log('today3', today3)

  return (
    <React.Fragment>
      <Grid container spacing={2} style={{ padding: '1rem', flexWrap: 'initial', backgroundColor: '#f5f5f7' }}>
        <Grid container xs={6} style={{ display: 'initial' }}>
          <Grid xs={12}>
            {/*<ConnectCard title={ today && today.program } date={ today && today.?????? } onClick={handleOpen} />*/}
            <BoardCard icon={"schedule"} title={'????????????'} rows={today} columns={columns} boxHeight={200} />
          </Grid>
          <Grid xs={12}>
            {/*<ConnectCard title={ today && today.program } date={ today && today.?????? } onClick={handleOpen} />*/}
            <BoardCard icon={"schedule"} title={'?????????[??????.???]??????'} rows={today2} columns={columns2} boxHeight={200} />
          </Grid>
          <Grid xs={12}>
            {/*<ConnectCard title={ today && today.program } date={ today && today.?????? } onClick={handleOpen} />*/}
            <BoardCard icon={"schedule"} title={'AI ??????(??????+??????) ??????'} rows={today3} columns={columns3} boxHeight={200} />
          </Grid>
          <Grid xs={12}>
            <BoardCard icon={"schedule"} title={'LIVE ????????????'} rows={schedule} />
          </Grid>
        </Grid>
        <Grid container xs={6} style={{ display: 'initial' }}>
          <Grid xs={12}>
            <BoardCard icon={"notice"} title={'????????????'} rows={notice} columns={noticeColumns} />
          </Grid>
          <Grid xs={12}>
            <BoardCard icon={"event"} title={'????????????/??????'} rows={job} columns={noticeColumns} />
          </Grid>
          <Grid xs={12}>
            <WeatherCard weather={weather} />
          </Grid>
        </Grid>
      </Grid>
      <VideoModal src={'/videos/sample.mp4'} onClickClose={handleClose} open={open} />
      <SettingModal onClickClose={handleSettingClose} open={settingOpen} cookie={cookie} />
      <BoardModal onClickClose={handleBoardClose} open={boardOpen} href={href} cookie={cookie} />
      <BoardModal2 onClickClose={handleVodClose} open={vodOpen} vod={vod} />
      <BoardModal3 onClickClose={handleBoardClose3} open={boardOpen3} href={href3} cookie={cookie} />
      <Fab sx={{position: 'fixed', bottom: 16, right: 16}} aria-label={'Add'} color={'primary'} onClick={handleSettingOpen}>
        <AddIcon />
      </Fab>
    </React.Fragment>
  );
};