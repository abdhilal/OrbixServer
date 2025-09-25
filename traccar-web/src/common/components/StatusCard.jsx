import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Rnd } from 'react-rnd';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  CardMedia,
  IconButton,
  Menu,
  MenuItem,
  CardHeader,
  Tooltip,
  Button,
  Link,
  TableRow,
  TableCell,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import CloseIcon from '@mui/icons-material/Close';
import ReplayIcon from '@mui/icons-material/Replay';
import PublishIcon from '@mui/icons-material/Publish';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PendingIcon from '@mui/icons-material/Pending';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';

import { useTranslation } from './LocalizationProvider';
import RemoveDialog from './RemoveDialog';
import PositionValue from './PositionValue';
import { useDeviceReadonly, useRestriction } from '../util/permissions';
import usePositionAttributes from '../attributes/usePositionAttributes';
import { devicesActions, sessionActions } from '../../store';
import { useCatch, useCatchCallback } from '../../reactHelper';
import { useAttributePreference } from '../util/preferences';
import fetchOrThrow from '../util/fetchOrThrow';

const useStyles = makeStyles()((theme, { desktopPadding }) => ({
  card: {
    pointerEvents: 'auto',
    width: '100%',
    minWidth: 450,
    maxWidth: 500,
    height: 140,
    borderRadius: '12px',
    backgroundColor: '#383D4C',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  media: {
    height: 60,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    borderRadius: '12px 12px 0 0',
  },
  mediaButton: {
    color: theme.palette.primary.contrastText,
    mixBlendMode: 'difference',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(0.5, 1.5),
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    minHeight: '40px',
    maxHeight: '40px',
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    gap: theme.spacing(0.1),
  },
  deviceNameText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontSize: '0.9rem',
    lineHeight: 1.1,
  },
  totalDistanceText: {
    color: '#A9B4C2',
    fontSize: '0.7rem',
    lineHeight: 1,
  },
  totalDistanceInline: {
    color: '#A9B4C2',
    fontSize: '0.8rem',
    fontWeight: 400,
  },
  content: {
    padding: theme.spacing(0.8, 1.5),
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
  },
  mainContainer: {
    display: 'flex',
    gap: theme.spacing(1),
    height: '100%',
    alignItems: 'stretch',
    minHeight: 0,
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: 'auto auto',
    gap: theme.spacing(0.5),
    flex: 1,
    alignContent: 'start',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.2),
    padding: theme.spacing(0.4, 0.6),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '4px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    minHeight: 0,
  },
  infoLabel: {
    fontSize: '0.6rem',
    color: '#A9B4C2',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
    lineHeight: 1,
  },
  infoValue: {
    fontSize: '0.75rem',
    color: '#FFFFFF',
    fontWeight: 400,
    wordBreak: 'break-word',
    lineHeight: 1.1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  addressItem: {
    gridColumn: '1 / -1',
  },
  addressValue: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
    
    
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.3),
    minWidth: '36px',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: theme.spacing(0.2),
  },
  actionButton: {
    width: '28px',
    height: '28px',
    padding: theme.spacing(0.3),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#A9B4C2',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: '#FFFFFF',
      transform: 'scale(1.05)',
    },
    '&:disabled': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      color: 'rgba(169, 180, 194, 0.5)',
    },
  },
  primaryButton: {
    color: '#3A86FF',
    backgroundColor: 'rgba(58, 134, 255, 0.2)',
    '&:hover': {
      backgroundColor: 'rgba(58, 134, 255, 0.3)',
      color: '#FFFFFF',
    },
  },
  activeTrackingButton: {
    color: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    '&:hover': {
      backgroundColor: 'rgba(16, 185, 129, 0.3)',
      color: '#FFFFFF',
    },
  },
  dangerButton: {
    '&:hover': {
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      color: '#EF4444',
    },
  },
  closeButton: {
    color: '#FFFFFF',
    width: '28px',
    height: '28px',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  root: {
    pointerEvents: 'none',
    position: 'fixed',
    zIndex: 5,
    left: '50%',
    [theme.breakpoints.up('md')]: {
      left: `calc(50% + ${desktopPadding} / 2)`,
      bottom: theme.spacing(3),
    },
    [theme.breakpoints.down('md')]: {
      left: '50%',
      bottom: `calc(${theme.spacing(3)} + ${theme.dimensions.bottomBarHeight}px)`,
    },
    transform: 'translateX(-50%)',
  },
  cell: {
    borderBottom: 'none',
  },
}));

const StatusRow = ({ name, content }) => {
  const { classes } = useStyles({ desktopPadding: 0 });

  return (
    <TableRow>
      <TableCell className={classes.cell}>
        <Typography variant="body2">{name}</Typography>
      </TableCell>
      <TableCell className={classes.cell}>
        <Typography variant="body2" color="textSecondary">{content}</Typography>
      </TableCell>
    </TableRow>
  );
};

const StatusCard = ({ deviceId, position, onClose, disableActions, desktopPadding = 0 }) => {
  const { classes } = useStyles({ desktopPadding });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const t = useTranslation();

  const readonly = useRestriction('readonly');
  const deviceReadonly = useDeviceReadonly();

  const shareDisabled = useSelector((state) => state.session.server.attributes.disableShare);
  const user = useSelector((state) => state.session.user);
  const device = useSelector((state) => state.devices.items[deviceId]);
  const trackingDeviceId = useSelector((state) => state.session.trackingDeviceId);
  const trackingDevices = useSelector((state) => state.session.trackingDevices || []);

  const deviceImage = device?.attributes?.deviceImage;

  const positionAttributes = usePositionAttributes(t);
  const positionItems = useAttributePreference('positionItems', 'fixTime,address,speed,totalDistance');

  const navigationAppLink = useAttributePreference('navigationAppLink');
  const navigationAppTitle = useAttributePreference('navigationAppTitle');

  const [anchorEl, setAnchorEl] = useState(null);
  const [removing, setRemoving] = useState(false);
  
  const isTracking = trackingDeviceId === deviceId || trackingDevices.includes(deviceId);

  const handleRemove = useCatch(async (removed) => {
    if (removed) {
      const response = await fetchOrThrow('/api/devices');
      dispatch(devicesActions.refresh(await response.json()));
    }
    setRemoving(false);
  });

  const handleGeofence = useCatchCallback(async () => {
    const newItem = {
      name: t('sharedGeofence'),
      area: `CIRCLE (${position.latitude} ${position.longitude}, 50)`,
    };
    const response = await fetchOrThrow('/api/geofences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    });
    const item = await response.json();
    await fetchOrThrow('/api/permissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId: position.deviceId, geofenceId: item.id }),
    });
    navigate(`/settings/geofence/${item.id}`);
  }, [navigate, position]);

  const handleTracking = useCallback(() => {
    if (trackingDevices.includes(deviceId)) {
      dispatch(sessionActions.removeTrackingDevice(deviceId));
    } else {
      dispatch(sessionActions.addTrackingDevice(deviceId));
      
      if (position) {
        dispatch(sessionActions.updateTrackingPath({
          deviceId,
          point: [position.longitude, position.latitude]
        }));
      }
    }
    
    if (trackingDeviceId === deviceId) {
      dispatch(sessionActions.updateTrackingDevice(null));
    } else if (!trackingDevices.includes(deviceId)) {
      dispatch(sessionActions.updateTrackingDevice(deviceId));
    }
  }, [dispatch, deviceId, trackingDevices, trackingDeviceId, position]);

  return (
    <>
      <div className={classes.root}>
        {device && (
          <Rnd
            default={{ x: 0, y: 0, width: 'auto', height: 'auto' }}
            enableResizing={false}
            dragHandleClassName="draggable-header"
            style={{ position: 'relative' }}
          >
            <Card elevation={3} className={classes.card}>
              {deviceImage ? (
                <CardMedia
                  className={`${classes.media} draggable-header`}
                  image={`/api/media/${device.uniqueId}/${deviceImage}`}
                >
                  <IconButton
                    size="small"
                    onClick={onClose}
                    onTouchStart={onClose}
                  >
                    <CloseIcon fontSize="small" className={classes.mediaButton} />
                  </IconButton>
                </CardMedia>
              ) : (
                <div className={`${classes.header} draggable-header`}>
                  <div className={classes.headerContent}>
                    <Typography variant="h6" className={classes.deviceNameText}>
                      اسم الجهاز: {device.name}
                      {position?.attributes?.totalDistance && (
                        <span className={classes.totalDistanceInline}>
                          {' - '}المسافة الاجمالية: <PositionValue position={position} attribute="totalDistance" />
                        </span>
                      )}
                    </Typography>
                  </div>
                  <IconButton
                    size="small"
                    onClick={onClose}
                    onTouchStart={onClose}
                    className={classes.closeButton}
                  >
                    
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </div>
              )}
              
              {position && (
                 <CardContent className={classes.content}>
                   <div className={classes.mainContainer}>
                     {/* شبكة المعلومات */}
                     <div className={classes.contentGrid}>
                       <div className={classes.infoItem}>
                         <Typography variant="body2" className={classes.infoLabel}>
                           الوقت
                         </Typography>
                         <Typography variant="body2" className={classes.infoValue}>
                           <PositionValue position={position} property="fixTime" />
                         </Typography>
                       </div>
                       
                       <div className={classes.infoItem}>
                         <Typography variant="body2" className={classes.infoLabel}>
                           السرعة
                         </Typography>
                         <Typography variant="body2" className={classes.infoValue}>
                           <PositionValue position={position} property="speed" />
                         </Typography>
                       </div>
                       
                       <div className={`${classes.infoItem} ${classes.addressItem}`}>
                         <Button
                           variant="contained"
                           color="primary"
                           size="small"
                           component={RouterLink}
                           to={`/position/${position.id}`}
                           fullWidth
                           style={{ 
                             fontSize: '0.75rem',
                             padding: '4px 8px',
                             minHeight: '28px'
                           }}
                         >
                           {t('sharedShowDetails')}
                         </Button>
                       </div>
                     </div>

                     {/* الأزرار العمودية */}
                     <div className={classes.buttonsContainer}>
                       <Tooltip title={t('sharedExtra')}>
                         <IconButton
                           className={classes.actionButton}
                           onClick={(e) => setAnchorEl(e.currentTarget)}
                           disabled={!position}
                         >
                           <PendingIcon fontSize="small" />
                         </IconButton>
                       </Tooltip>
                       
                   
                       
                       <Tooltip title={t('reportReplay')}>
                         <IconButton
                           className={`${classes.actionButton} ${classes.primaryButton}`}
                           onClick={() => navigate(`/replay?deviceId=${deviceId}`)}
                           disabled={disableActions || !position}
                         >
                           <ReplayIcon fontSize="small" />
                         </IconButton>
                       </Tooltip>
                     </div>
                   </div>
                 </CardContent>
               )}
            </Card>
          </Rnd>
        )}
      </div>
      
      {position && (
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          {!readonly && <MenuItem onClick={handleGeofence}>{t('sharedCreateGeofence')}</MenuItem>}
          <MenuItem component="a" target="_blank" href={`https://www.google.com/maps/search/?api=1&query=${position.latitude}%2C${position.longitude}`}>{t('linkGoogleMaps')}</MenuItem>
          <MenuItem component="a" target="_blank" href={`http://maps.apple.com/?ll=${position.latitude},${position.longitude}`}>{t('linkAppleMaps')}</MenuItem>
          <MenuItem component="a" target="_blank" href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${position.latitude}%2C${position.longitude}&heading=${position.course}`}>{t('linkStreetView')}</MenuItem>
          {navigationAppTitle && <MenuItem component="a" target="_blank" href={navigationAppLink.replace('{latitude}', position.latitude).replace('{longitude}', position.longitude)}>{navigationAppTitle}</MenuItem>}
          {!shareDisabled && !user.temporary && (
            <MenuItem onClick={() => navigate(`/settings/device/${deviceId}/share`)}><Typography color="secondary">{t('deviceShare')}</Typography></MenuItem>
          )}
        </Menu>
      )}
      
      <RemoveDialog
        open={removing}
        endpoint="devices"
        itemId={deviceId}
        onResult={(removed) => handleRemove(removed)}
      />
    </>
  );
};

export default StatusCard;
