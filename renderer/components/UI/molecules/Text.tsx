import React from 'react';
import Typography from '@mui/material/Typography';

import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CampaignIcon from '@mui/icons-material/Campaign';
import CelebrationIcon from '@mui/icons-material/Celebration';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import UmbrellaIcon from '@mui/icons-material/Umbrella';
import AirIcon from '@mui/icons-material/Air';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import StormIcon from '@mui/icons-material/Storm';
import MovieIcon from '@mui/icons-material/Movie';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Icon } from '../../../type/Icon'

type LabelType = {
  label?: string,
  value?: string,
  icon?: Icon,
  size?: Size,
  style?: object,
}

type Size = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

function Text({label, icon, size = 'h6', value, style}: LabelType) {
  return (
    <React.Fragment>
      <div style={style}>
        {label &&
          <Typography variant={`${size}`} style={{color: '#999', display: 'inline', verticalAlign: 'sub'}}>
            {label}
          </Typography>
        }
        <Typography variant={`${size}`} style={{display: 'inline', verticalAlign: 'sub'}}>
          {icon === 'current' && <EventAvailableIcon fontSize="inherit"/>}
          {icon === 'schedule' && <CalendarMonthIcon fontSize="inherit" />}
          {icon === 'notice' && <CampaignIcon fontSize="inherit" />}
          {icon === 'event' && <CelebrationIcon fontSize="inherit" />}
          {icon === 'offer' && <ThunderstormIcon fontSize="inherit" />}
          {icon === 'weather' || icon === 'sunny' && <WbSunnyIcon fontSize="inherit" />}
          {icon === 'cloud' && <CloudIcon fontSize="inherit" />}
          {icon === 'rain' && <UmbrellaIcon fontSize="inherit" />}
          {icon === 'air' && <AirIcon fontSize="inherit" />}
          {icon === 'snow' && <AcUnitIcon fontSize="inherit" />}
          {icon === 'storm' && <StormIcon fontSize="inherit" />}
          {icon === 'video' && <MovieIcon fontSize="inherit" />}
          {icon === 'account' && <AccountCircleIcon fontSize="inherit" />}
          {value}
        </Typography>
      </div>
    </React.Fragment>
  );
};

export default Text;
