import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import {
  IconButton, Tooltip, Avatar, ListItemAvatar, ListItemText, ListItemButton,
  Typography, Chip, Box,
} from '@mui/material';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import Battery60Icon from '@mui/icons-material/Battery60';
import BatteryCharging60Icon from '@mui/icons-material/BatteryCharging60';
import Battery20Icon from '@mui/icons-material/Battery20';
import BatteryCharging20Icon from '@mui/icons-material/BatteryCharging20';
import ErrorIcon from '@mui/icons-material/Error';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { devicesActions } from '../store';
import {
  formatAlarm, formatBoolean, formatPercentage, formatStatus, getStatusColor,
} from '../common/util/formatter';
import { useTranslation } from '../common/components/LocalizationProvider';
import { mapIconKey, mapIcons } from '../map/core/preloadImages';
import { useAdministrator } from '../common/util/permissions';
import EngineIcon from '../resources/images/data/engine.svg?react';
import { useAttributePreference } from '../common/util/preferences';

dayjs.extend(relativeTime);

const useStyles = makeStyles()((theme) => ({
  deviceCard: {
    backgroundColor: '#454B5B',
    borderRadius: '8px',
    margin: '4px 8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#4F566B',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    },
  },
  locationIcon: {
    backgroundColor: '#3A86FF',
    color: '#FFFFFF',
    width: 40,
    height: 40,
  },
  icon: {
    width: '25px',
    height: '25px',
    filter: 'brightness(0) invert(1)',
  },
  batteryText: {
    fontSize: '0.75rem',
    fontWeight: 'normal',
    lineHeight: '0.875rem',
  },
  success: {
    color: '#34D399',
  },
  warning: {
    color: '#F59E0B',
  },
  error: {
    color: theme.palette.error.main,
  },
  neutral: {
    color: '#A9B4C2',
  },
  selected: {
    backgroundColor: '#3A86FF',
    border: '2px solid #3A86FF',
    '&:hover': {
      backgroundColor: '#2563EB',
    },
  },
  deviceName: {
    fontWeight: 600,
    fontSize: '0.85rem',
    color: '#FFFFFF',
  },
  deviceStatus: {
    fontSize: '0.75rem',
    color: '#A9B4C2',
  },
  statusBadge: {
    fontSize: '0.75rem',
    height: '20px',
    borderRadius: '10px',
    fontWeight: 500,
  },
  onlineBadge: {
    backgroundColor: '#34D399',
    color: '#FFFFFF',
  },
  offlineBadge: {
    backgroundColor: '#F59E0B',
    color: '#FFFFFF',
  },
  unknownBadge: {
    backgroundColor: '#A9B4C2',
    color: '#FFFFFF',
  },
  deviceInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '4px',
  },
}));

const DeviceRow = ({ devices, index, style }) => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const t = useTranslation();

  const admin = useAdministrator();
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);

  const item = devices[index];
  const position = useSelector((state) => state.session.positions[item.id]);

  const devicePrimary = useAttributePreference('devicePrimary', 'name');
  const deviceSecondary = useAttributePreference('deviceSecondary', '');

  const [online, setOnline] = useState(item.status === 'online');

  useEffect(() => {
    if (!position) return;

    const updateStatus = () => {
      const now = Date.now();
      const last = position.lastUpdateTimestamp || 0;

      if (now - last > 30_000) { // 30 ثانية
        setOnline(false);
      } else {
        setOnline(true);
      }
    };

    updateStatus(); // تحقق فورًا عند التغيير

    const interval = setInterval(updateStatus, 1000); // تحقق كل ثانية
    return () => clearInterval(interval);
  }, [position]);

  const getStatusBadge = () => {
    let status, badgeClass;
    if (online || !item.lastUpdate) {
      status = formatStatus('online', t);
      badgeClass = classes.onlineBadge;
    } else {
      status = dayjs(item.lastUpdate).fromNow();
      badgeClass = classes.offlineBadge;
    }
    
    return (
      <Chip
        label={status}
        size="small"
        className={`${classes.statusBadge} ${badgeClass}`}
      />
    );
  };

  const secondaryText = () => {
    return (
      <Box className={classes.deviceInfo}>
        {deviceSecondary && item[deviceSecondary] && (
          <Typography variant="caption" color="#A9B4C2">
            {item[deviceSecondary]}
          </Typography>
        )}
        {getStatusBadge()}
      </Box>
    );
  };

  return (
    <div style={style}>
      <ListItemButton
        key={item.id}
        onClick={() => dispatch(devicesActions.selectId(item.id))}
        disabled={!admin && item.disabled}
        selected={selectedDeviceId === item.id}
        className={`${classes.deviceCard} ${selectedDeviceId === item.id ? classes.selected : ''}`}
      >
        <ListItemAvatar>
          <Avatar className={classes.locationIcon}>
            <LocationOnIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={item[devicePrimary]}
          secondary={secondaryText()}
          slots={{
            primary: Typography,
            secondary: Typography,
          }}
          slotProps={{
            primary: { noWrap: true, className: classes.deviceName },
            secondary: { noWrap: true, className: classes.deviceStatus },
          }}
        />
        {position && (
          <>
            {position.attributes.hasOwnProperty('alarm') && (
              <Tooltip title={`${t('eventAlarm')}: ${formatAlarm(position.attributes.alarm, t)}`}>
                <IconButton size="small">
                  <ErrorIcon fontSize="small" className={classes.error} />
                </IconButton>
              </Tooltip>
            )}
           
            {position.attributes.hasOwnProperty('batteryLevel') && (
              <Tooltip title={`${t('positionBatteryLevel')}: ${formatPercentage(position.attributes.batteryLevel)}`}>
                <IconButton size="small">
                  {(position.attributes.batteryLevel > 70 && (
                    position.attributes.charge
                      ? (<BatteryChargingFullIcon fontSize="small" className={classes.success} />)
                      : (<BatteryFullIcon fontSize="small" className={classes.success} />)
                  )) || (position.attributes.batteryLevel > 30 && (
                    position.attributes.charge
                      ? (<BatteryCharging60Icon fontSize="small" className={classes.warning} />)
                      : (<Battery60Icon fontSize="small" className={classes.warning} />)
                  )) || (
                    position.attributes.charge
                      ? (<BatteryCharging20Icon fontSize="small" className={classes.error} />)
                      : (<Battery20Icon fontSize="small" className={classes.error} />)
                  )}
                </IconButton>
              </Tooltip>
            )}
          </>
        )}
      </ListItemButton>
    </div>
  );
};

export default DeviceRow;
