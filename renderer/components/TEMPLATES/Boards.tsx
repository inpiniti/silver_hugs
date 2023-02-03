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

  const columns = [
    {
      field: 'id',
      headerName: '번호',
      width: 50,
    },
    {
      field: '시간',
      headerName: '시간',
      width: 160,
    },
    {
      field: 'program',
      headerName: '프로그램명',
      width: 250,
    },
    {
      field: '활동내용',
      headerName: '활동내용',
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

  const columns2 = [
    {
      field: 'No',
      headerName: 'no',
      width: 50,
    },
    {
      field: '프로그램',
      headerName: '프로그램',
      width: 250,
    },
    {
      field: '담당',
      headerName: '담당',
      width: 140,
    },
    {
      field: '유형',
      headerName: '유형',
      width: 80,
    },
    {
      field: '미션제목',
      headerName: '미션제목',
      width: 130,
    },
    {
      field: '제출여부',
      headerName: '제출여부',
      width: 80,
    },
    {
      field: '미션평가',
      headerName: '미션평가',
      width: 100,
      renderCell: RenderDate2,
    },
  ];

  const columns3 = [
    {
      field: '번호',
      headerName: '번호',
      width: 50,
    },
    {
      field: '미션',
      headerName: '미션[PLAN]명',
      width: 350,
    },
    {
      field: 'video',
      headerName: 'video',
      renderCell: RenderDate3,
      width: 100,
    },
    {
      field: '미션기한',
      headerName: '미션기한',
    },
    {
      field: '작성자',
      headerName: '작성자',
      width: 150,
    },
    {
      field: '미션수행확인',
      headerName: '미션수행확인',
      renderCell: RenderDate2,
      width: 130,
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

  console.log('today3', today3)

  return (
    <React.Fragment>
      <Grid container spacing={2} style={{ padding: '1rem', flexWrap: 'initial', backgroundColor: '#f5f5f7' }}>
        <Grid container xs={6} style={{ display: 'initial' }}>
          <Grid xs={12}>
            {/*<ConnectCard title={ today && today.program } date={ today && today.시간 } onClick={handleOpen} />*/}
            <BoardCard icon={"schedule"} title={'오늘할일'} rows={today} columns={columns} boxHeight={200} />
          </Grid>
          <Grid xs={12}>
            {/*<ConnectCard title={ today && today.program } date={ today && today.시간 } onClick={handleOpen} />*/}
            <BoardCard icon={"schedule"} title={'경로당[조별.팀]미션'} rows={today2} columns={columns2} boxHeight={200} />
          </Grid>
          <Grid xs={12}>
            {/*<ConnectCard title={ today && today.program } date={ today && today.시간 } onClick={handleOpen} />*/}
            <BoardCard icon={"schedule"} title={'AI 개인(인지+운동) 미션'} rows={today3} columns={columns3} boxHeight={200} />
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
      <BoardModal onClickClose={handleBoardClose} open={boardOpen} href={href} cookie={cookie} />
      <BoardModal2 onClickClose={handleVodClose} open={vodOpen} vod={vod} />
      <Fab sx={{position: 'fixed', bottom: 16, right: 16}} aria-label={'Add'} color={'primary'} onClick={handleSettingOpen}>
        <AddIcon />
      </Fab>
    </React.Fragment>
  );
};