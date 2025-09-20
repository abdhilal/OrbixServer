import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'session',
  initialState: {
    server: null,
    user: null,
    socket: null,
    includeLogs: false,
    logs: [],
    positions: {},
    history: {},
    trackingDeviceId: null, // للتوافق مع الكود القديم
    trackingDevices: [], // قائمة الأجهزة المتتبعة
    trackingPaths: {}, // مسارات التتبع لكل جهاز
  },
  reducers: {
    updateServer(state, action) {
      state.server = action.payload;
    },
    updateUser(state, action) {
      state.user = action.payload;
    },
    updateSocket(state, action) {
      state.socket = action.payload;
    },
    enableLogs(state, action) {
      state.includeLogs = action.payload;
      if (!action.payload) {
        state.logs = [];
      }
    },
    updateLogs(state, action) {
      state.logs.push(...action.payload);
    },
    updatePositions(state, action) {
      const liveRoutes = state.user.attributes.mapLiveRoutes || state.server.attributes.mapLiveRoutes || 'none';
      const liveRoutesLimit = state.user.attributes['web.liveRouteLength'] || state.server.attributes['web.liveRouteLength'] || 10;
      action.payload.forEach((position) => {
        state.positions[position.deviceId] = position;
        if (liveRoutes !== 'none') {
          const route = state.history[position.deviceId] || [];
          const last = route.at(-1);
          if (!last || (last[0] !== position.longitude && last[1] !== position.latitude)) {
            state.history[position.deviceId] = [...route.slice(1 - liveRoutesLimit), [position.longitude, position.latitude]];
          }
        } else {
          state.history = {};
        }
      });
    },
    updateTrackingDevice(state, action) {
      state.trackingDeviceId = action.payload;
    },
    addTrackingDevice(state, action) {
      const deviceId = action.payload;
      if (!state.trackingDevices.includes(deviceId)) {
        state.trackingDevices.push(deviceId);
        state.trackingPaths[deviceId] = {
          startTime: new Date().toISOString(),
          points: [],
        };
      }
    },
    removeTrackingDevice(state, action) {
      const deviceId = action.payload;
      state.trackingDevices = state.trackingDevices.filter(id => id !== deviceId);
      delete state.trackingPaths[deviceId];
    },
    updateTrackingPath(state, action) {
      const { deviceId, point } = action.payload;
      if (state.trackingPaths[deviceId]) {
        const lastPoint = state.trackingPaths[deviceId].points.at(-1);
        if (!lastPoint || lastPoint[0] !== point[0] || lastPoint[1] !== point[1]) {
          state.trackingPaths[deviceId].points.push(point);
        }
      }
    },
    clearAllTracking(state) {
      state.trackingDevices = [];
      state.trackingPaths = {};
      state.trackingDeviceId = null;
    },
  },
});

export { actions as sessionActions };
export { reducer as sessionReducer };
