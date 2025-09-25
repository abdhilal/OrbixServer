import {
  useState, useEffect, useRef, useCallback,
} from 'react';
import {
  IconButton, Paper, Slider, Toolbar, Typography, Tooltip,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import TuneIcon from '@mui/icons-material/Tune';
import DownloadIcon from '@mui/icons-material/Download';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MapView, { map } from '../map/core/MapView';
import MapRoutePath from '../map/MapRoutePath';
import MapRoutePoints from '../map/MapRoutePoints';
import MapPositions from '../map/MapPositions';
import { formatTime } from '../common/util/formatter';
import ReportFilter, { updateReportParams } from '../reports/components/ReportFilter';
import { useTranslation } from '../common/components/LocalizationProvider';
import { useCatch } from '../reactHelper';
import MapCamera from '../map/MapCamera';
import MapGeofence from '../map/MapGeofence';
import StatusCard from '../common/components/StatusCard';
import MapScale from '../map/MapScale';
import BackIcon from '../common/components/BackIcon';
import fetchOrThrow from '../common/util/fetchOrThrow';

const useStyles = makeStyles()((theme) => ({
  root: {
    height: '100%',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    zIndex: 3,
    left: 0,
    top: 0,
    margin: theme.spacing(1.5),
    width: theme.dimensions.drawerWidthDesktop,
    [theme.breakpoints.down('md')]: {
      width: '100%',
      margin: 0,
    },
  },
  title: {
    flexGrow: 1,
  },
  slider: {
    width: '100%',
    '& .MuiSlider-track': {
      backgroundColor: theme.palette.grey[400],
      border: 'none',
    },
    '& .MuiSlider-rail': {
      backgroundColor: theme.palette.primary.main,
      opacity: 1,
    },
    '& .MuiSlider-thumb': {
      backgroundColor: theme.palette.primary.main,
      border: `2px solid ${theme.palette.primary.main}`,
      '&:hover': {
        boxShadow: `0px 0px 0px 8px ${theme.palette.primary.main}33`,
      },
      '&.Mui-focusVisible': {
        boxShadow: `0px 0px 0px 8px ${theme.palette.primary.main}33`,
      },
    },
    '& .MuiSlider-mark': {
      backgroundColor: theme.palette.grey[300],
      height: 8,
      width: 2,
      '&.MuiSlider-markActive': {
        backgroundColor: theme.palette.grey[500],
      },
    },
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  controlsRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  cameraControlRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    paddingTop: theme.spacing(1),
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  playButton: {
    color: theme.palette.success.main,
    '&:hover': {
      backgroundColor: `${theme.palette.success.main}15`,
    },
    '&:disabled': {
      color: theme.palette.grey[400],
    },
  },
  cameraFollowButton: {
    color: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: `${theme.palette.secondary.main}15`,
    },
    '&.active': {
      backgroundColor: `${theme.palette.secondary.main}20`,
      color: theme.palette.secondary.dark,
    },
  },
  formControlLabel: {
    height: '100%',
    width: '100%',
    paddingRight: theme.spacing(1),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(1),
    },
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(1),
    },
  },
}));

const ReplayPage = () => {
  const t = useTranslation();
  const { classes } = useStyles();
  const navigate = useNavigate();
  const timerRef = useRef();

  const [searchParams, setSearchParams] = useSearchParams();

  const defaultDeviceId = useSelector((state) => state.devices.selectedId);

  const [positions, setPositions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selectedDeviceId, setSelectedDeviceId] = useState(defaultDeviceId);
  const [showCard, setShowCard] = useState(false);
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [followCamera, setFollowCamera] = useState(false);

  const loaded = Boolean(from && to && !loading && positions.length);

  const deviceName = useSelector((state) => {
    if (selectedDeviceId) {
      const device = state.devices.items[selectedDeviceId];
      if (device) {
        return device.name;
      }
    }
    return null;
  });

  useEffect(() => {
    if (!from && !to) {
      setPositions([]);
    }
  }, [from, to, setPositions]);

  useEffect(() => {
    if (playing && positions.length > 0) {
      timerRef.current = setInterval(() => {
        setIndex((index) => index + 1);
      }, 500);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [playing, positions]);

  useEffect(() => {
    if (index >= positions.length - 1) {
      clearInterval(timerRef.current);
      setPlaying(false);
    }
  }, [index, positions]);

  // تتبع الكاميرا أثناء التشغيل
  useEffect(() => {
    if (followCamera && positions[index] && (playing || showCard)) {
      const position = positions[index];
      if (map) {
        const currentCenter = map.getCenter();
        const targetLng = position.longitude;
        const targetLat = position.latitude;
        
        // حساب الإزاحة للأعلى قليلاً (حوالي 30% من ارتفاع الشاشة لتجنب كارد الحالة)
        const bounds = map.getBounds();
        const latOffset = (bounds.getNorth() - bounds.getSouth()) * 0;
        
        // تحريك الكاميرا فقط إذا كان الموقع الجديد مختلف بشكل ملحوظ
        const distance = Math.sqrt(
          Math.pow(currentCenter.lng - targetLng, 2) + 
          Math.pow(currentCenter.lat - targetLat, 2)
        );
        
        if (distance > 0.0001) { // تحريك الكاميرا فقط إذا كان هناك تغيير ملحوظ
          map.easeTo({
            center: [targetLng, targetLat + latOffset],
            duration: playing ? 400 : 800,
          });
        }
      }
    }
  }, [index, positions, followCamera, playing, showCard]);

  const onPointClick = useCallback((_, index) => {
    setIndex(index);
  }, [setIndex]);

  const onMarkerClick = useCallback((positionId) => {
    setShowCard(!!positionId);
    setFollowCamera(!!positionId); // تفعيل تتبع الكاميرا عند النقر على الماركر
    // تحريك الكاميرا عند النقر على الماركر
    if (positionId) {
      const position = positions.find(p => p.id === positionId);
      if (position && map) {
        // حساب الإزاحة للأعلى قليلاً لتجنب كارد الحالة
        const bounds = map.getBounds();
        const latOffset = (bounds.getNorth() - bounds.getSouth()) * 0.2;
        
        map.flyTo({
          center: [position.longitude, position.latitude + latOffset],
          zoom: 16,
          duration: 800,
        });
      }
    }
  }, [setShowCard, positions]);

  const onShow = useCatch(async ({ deviceIds, from, to }) => {
    const deviceId = deviceIds.find(() => true);
    setLoading(true);
    setSelectedDeviceId(deviceId);
    const query = new URLSearchParams({ deviceId, from, to });
    try {
      const response = await fetchOrThrow(`/api/positions?${query.toString()}`);
      setIndex(0);
      const positions = await response.json();
      setPositions(positions);
      if (!positions.length) {
        throw Error(t('sharedNoData'));
      }
    } finally {
      setLoading(false);
    }
  });

  const handleDownload = () => {
    const query = new URLSearchParams({ deviceId: selectedDeviceId, from, to });
    window.location.assign(`/api/positions/kml?${query.toString()}`);
  };

  return (
    <div className={classes.root}>
      <MapView>
        <MapGeofence />
        <MapRoutePath positions={positions} />
        <MapRoutePoints positions={positions} onClick={onPointClick} showSpeedControl />
        {index < positions.length && (
          <MapPositions positions={[positions[index]]} onMarkerClick={onMarkerClick} titleField="fixTime" />
        )}
      </MapView>
      <MapScale />
      <MapCamera positions={positions} />
      <div className={classes.sidebar}>
        <Paper elevation={3} square>
          <Toolbar>
            <IconButton edge="start" sx={{ mr: 2 }} onClick={() => navigate(-1)}>
              <BackIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>{t('reportReplay')}</Typography>
            {loaded && (
              <>
                <IconButton onClick={handleDownload}>
                  <DownloadIcon />
                </IconButton>
                <IconButton edge="end" onClick={() => updateReportParams(searchParams, setSearchParams, 'ignore', [])}>
                  <TuneIcon />
                </IconButton>
              </>
            )}
          </Toolbar>
        </Paper>
        <Paper className={classes.content} square>
          {loaded ? (
            <>
              <Typography variant="subtitle1" align="center">{deviceName}</Typography>
              <Slider
                className={classes.slider}
                max={positions.length - 1}
                step={null}
                marks={positions.map((_, index) => ({ value: index }))}
                value={index}
                onChange={(_, index) => setIndex(index)}
              />
              <div className={classes.controls}>
                <Typography variant="body2" color="textSecondary">
                  {`${index + 1}/${positions.length}`}
                </Typography>
                <Typography variant="body2" color="primary">
                  {formatTime(positions[index].fixTime, 'seconds')}
                </Typography>
              </div>
              <div className={classes.controlsRow}>
                <IconButton onClick={() => setIndex((index) => index - 1)} disabled={playing || index <= 0}>
                  <FastRewindIcon />
                </IconButton>
                <IconButton onClick={() => setPlaying(!playing)} disabled={index >= positions.length - 1}>
                  {playing ? <PauseIcon /> : <PlayArrowIcon /> }
                </IconButton>
                <IconButton onClick={() => setIndex((index) => index + 1)} disabled={playing || index >= positions.length - 1}>
                  <FastForwardIcon />
                </IconButton>
              </div>
              <div className={classes.cameraControlRow}>
                <Tooltip title={followCamera ? "إيقاف تتبع الكاميرا" : "تفعيل تتبع الكاميرا"}>
                  <IconButton 
                    className={`${classes.cameraFollowButton} ${followCamera ? 'active' : ''}`}
                    onClick={() => setFollowCamera(!followCamera)}
                  >
                    <CenterFocusStrongIcon />
                  </IconButton>
                </Tooltip>
                <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                  {followCamera ? "تتبع الكاميرا مفعل" : "تتبع الكاميرا معطل"}
                </Typography>
              </div>
            </>
          ) : (
            <ReportFilter onShow={onShow} deviceType="single" loading={loading} />
          )}
        </Paper>
      </div>
      {showCard && index < positions.length && (
        <StatusCard
          deviceId={selectedDeviceId}
          position={positions[index]}
          onClose={() => {
            setShowCard(false);
            setFollowCamera(false); // إيقاف تتبع الكاميرا عند إغلاق مربع الحالة
          }}
          disableActions
        />
      )}
    </div>
  );
};

export default ReplayPage;
