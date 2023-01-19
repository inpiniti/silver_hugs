import React from 'react';
import Paper from "@mui/material/Paper";

import Text from '../molecules/Text'
import CardText from '../molecules/CardText'

import Tabs from "@mui/material/Tabs";
import { DataGrid } from '@mui/x-data-grid';
import Grid from "@mui/material/Unstable_Grid2";

const icons = {
  Clouds: 'cloud',
  Clear: 'sunny',
  Atmosphere: 'cloud',
  Snow: 'snow',
  Rain: 'rain',
  Drizzle: 'rain',
  Thunderstorm: 'storm',
}

const texts = {
  Clouds: '구름',
  Clear: '맑음',
  Atmosphere: '구름',
  Snow: '눈',
  Rain: '비',
  Drizzle: '이슬비',
  Thunderstorm: '폭풍우',
}

function WeatherCard({
  weather,
}) {
  return (
    <React.Fragment>
      <Paper style={{padding: '1rem'}}>
        <WeatherCard.Text icon={'sunny'} value={'지역의 날씨'} />
        <div style={{textAlign: 'center'}}>
          <WeatherCard.Text icon={weather.main && icons[weather.main]} value={`${weather.temp ?? '0'}˚`} size={'h1'} />
        </div>
        <div style={{textAlign: 'center'}}>
          <WeatherCard.Text value={`최소 ${weather.temp_min ?? '0'}˚ 최대 ${weather.temp_max ?? '0'}˚`} style={{ 'padding-right': '1rem', display: 'inline', }} />
          <WeatherCard.Text label={'/'} style={{ 'padding-right': '1rem', display: 'inline', }} />
          <WeatherCard.Text value={weather.main ?? ''} style={{ display: 'inline', }} />
        </div>
        <div style={{textAlign: 'center'}}>
          <WeatherCard.Text label={'체감'} value={`${weather.feels_like ?? ''}˚`} style={{ 'padding-right': '1rem', display: 'inline', }} />
          <WeatherCard.Text label={'습도'} value={`${weather.humidity ?? '0'}%`} style={{ 'padding-right': '1rem', display: 'inline', }} />
          <WeatherCard.Text label={'바람'} value={`${weather.wind ?? '0'}m/s`} style={{ display: 'inline', }} />
        </div>
      </Paper>
    </React.Fragment>
  );
};

WeatherCard.Text = Text;
WeatherCard.Tabs = Tabs;
WeatherCard.Table = DataGrid;

export default WeatherCard;
