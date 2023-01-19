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

const RenderDate = (props) => {
  const { formattedValue } = props
  console.log('formattedValue', formattedValue)
  return (
    <strong>
      <div dangerouslySetInnerHTML={ {__html: formattedValue} }>
      </div>
    </strong>
  );
};

const columns = [
  {
    field: 'id',
    headerName: '번호',
    width: 50,
  },
  {
    field: '시간',
    headerName: '시간',
    editable: true,
    width: 160,
  },
  {
    field: 'program',
    headerName: '프로그램명',
    editable: true,
    width: 250,
  },
  {
    field: '활동내용',
    headerName: '활동내용',
    editable: true,
    width: 150,
  },
  {
    field: 'liveType',
    headerName: '(Live타입)',
    width: 100,
  },
  {
    field: '강의실입장',
    headerName: '강의실입장',
    width: 100,
    renderCell: RenderDate,
  },
];

const noticeColumns = [
  {
    field: 'id',
    headerName: '번호',
    width: 50,
  },
  {
    field: 'title',
    headerName: '제목',
    editable: true,
    width: 500,
  },
  {
    field: 'writer',
    headerName: '작성자',
    editable: true,
    width: 100,
  },
  {
    field: 'date',
    headerName: '작성일',
    editable: true,
    width: 100,
  },
  {
    field: 'num',
    headerName: '조회수',
    width: 70,
  },
];

export default function Boards({
  notice,
  job,
  today,
  cookie,
  weather,
  schedule,
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [settingOpen, setSettingOpen] = React.useState(false);
  const handleSettingOpen = () => setSettingOpen(true);
  const handleSettingClose = () => setSettingOpen(false);

  return (
    <React.Fragment>
      <Grid container spacing={2} style={{ padding: '1rem', flexWrap: 'initial', backgroundColor: '#f5f5f7' }}>
        <Grid container xs={6} style={{ display: 'initial' }}>
          <Grid xs={12}>
            {/*<ConnectCard title={ today && today.program } date={ today && today.시간 } onClick={handleOpen} />*/}
            <BoardCard icon={"schedule"} title={'오늘할일'} rows={today} columns={columns} />
          </Grid>
          <Grid xs={12}>
            <BoardCard icon={"schedule"} title={'LIVE 일정보기'} rows={schedule} />
          </Grid>
        </Grid>
        <Grid container xs={6} style={{ display: 'initial' }}>
          <Grid xs={12}>
            <BoardCard icon={"notice"} title={'공지사항'} rows={notice} columns={noticeColumns} />
          </Grid>
          <Grid xs={12}>
            <BoardCard icon={"event"} title={'구인구직/행사'} rows={job} columns={noticeColumns} />
          </Grid>
          <Grid xs={12}>
            <WeatherCard weather={weather} />
          </Grid>
        </Grid>
      </Grid>
      <VideoModal src={'/videos/sample.mp4'} onClickClose={handleClose} open={open} />
      <SettingModal onClickClose={handleSettingClose} open={settingOpen} cookie={cookie} />
      <Fab sx={{position: 'fixed', bottom: 16, right: 16}} aria-label={'Add'} color={'primary'} onClick={handleSettingOpen}>
        <AddIcon />
      </Fab>
    </React.Fragment>
  );
};