import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { map } from './core/MapView';
import { sessionActions } from '../store';

const MapLiveTracking = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const trackingDeviceId = useSelector((state) => state.session.trackingDeviceId);
  const trackingDevices = useSelector((state) => state.session.trackingDevices || []);
  const trackingPaths = useSelector((state) => state.session.trackingPaths || {});
  const positions = useSelector((state) => state.session.positions || {});
  const trackingPathRef = useRef([]);
  const trackingStartTime = useRef(null);

  // دالة لتحديد لون مختلف لكل جهاز
  const getDeviceColor = (deviceId) => {
    const colors = [
      '#3A86FF', // أزرق Orbix الرسمي
      '#34D399', // أخضر نجاح
      '#FF5722', // أحمر برتقالي
      '#FF9800', // برتقالي
      '#9C27B0', // بنفسجي
      '#00BCD4', // سماوي
      '#795548', // بني
      '#607D8B', // رمادي مزرق
      '#E91E63', // وردي
      '#3F51B5', // نيلي
      '#009688', // أخضر مزرق
      '#FFC107', // أصفر
      '#673AB7', // بنفسجي غامق
      '#FF6F00', // برتقالي غامق
      '#8BC34A', // أخضر فاتح
      '#00E676', // أخضر نيون
    ];
    
    // استخدام hash للحصول على توزيع أفضل للألوان
    let hash = 0;
    for (let i = 0; i < deviceId.toString().length; i++) {
      const char = deviceId.toString().charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // تحويل إلى 32bit integer
    }
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  useEffect(() => {
    if (!map) return;

    const mapStyle = map.getStyle();
    if (!mapStyle) return; // التحقق من وجود النمط قبل الوصول إليه

    // إزالة جميع المسارات القديمة
    const existingLayers = mapStyle.layers.filter(layer => 
      layer.id.startsWith('tracking-route-')
    );
    existingLayers.forEach(layer => {
      if (map.getLayer(layer.id)) {
        map.removeLayer(layer.id);
      }
    });

    const existingSources = Object.keys(mapStyle.sources).filter(source => 
      source.startsWith('tracking-route-')
    );
    existingSources.forEach(source => {
      if (map.getSource(source)) {
        map.removeSource(source);
      }
    });

    // إنشاء مسارات للأجهزة المتتبعة
    trackingDevices.forEach((deviceId, index) => {
      const devicePath = trackingPaths[deviceId];
      const currentPosition = positions[deviceId];
      
      if (devicePath && devicePath.points.length >= 2) {
        const routeData = {
          type: 'Feature',
          properties: { deviceId },
          geometry: {
            type: 'LineString',
            coordinates: devicePath.points,
          },
        };

        const sourceId = `tracking-route-${deviceId}`;
        const layerId = `tracking-route-line-${deviceId}`;

        // إضافة مصدر البيانات
        map.addSource(sourceId, {
          type: 'geojson',
          data: routeData,
        });

        // إضافة طبقة الخط
        map.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': getDeviceColor(deviceId),
            'line-width': 4,
            'line-opacity': 0.8,
          },
        });
      }
    });

    // دعم التتبع القديم للتوافق
    if (trackingDeviceId && !trackingDevices.includes(trackingDeviceId)) {
      if (!trackingStartTime.current) {
        trackingStartTime.current = new Date();
        trackingPathRef.current = [];
        
        const currentPosition = positions[trackingDeviceId];
        if (currentPosition) {
          trackingPathRef.current.push([currentPosition.longitude, currentPosition.latitude]);
        }
      }

      const currentPosition = positions[trackingDeviceId];
      
      if (currentPosition && new Date(currentPosition.fixTime) >= trackingStartTime.current) {
        const newPoint = [currentPosition.longitude, currentPosition.latitude];
        
        const lastPoint = trackingPathRef.current[trackingPathRef.current.length - 1];
        if (!lastPoint || lastPoint[0] !== newPoint[0] || lastPoint[1] !== newPoint[1]) {
          trackingPathRef.current.push(newPoint);
        }

        if (trackingPathRef.current.length >= 2) {
          const routeData = {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: trackingPathRef.current,
            },
          };

          const sourceId = 'tracking-route-legacy';
          const layerId = 'tracking-route-line-legacy';

          if (map.getSource(sourceId)) {
            map.getSource(sourceId).setData(routeData);
          } else {
            map.addSource(sourceId, {
              type: 'geojson',
              data: routeData,
            });

            map.addLayer({
              id: layerId,
              type: 'line',
              source: sourceId,
              layout: {
                'line-join': 'round',
                'line-cap': 'round',
              },
              paint: {
                'line-color': '#3A86FF',
                'line-width': 4,
                'line-opacity': 0.8,
              },
            });
          }
        }
      }
    }

    // تنظيف عند إلغاء التتبع
    return () => {
      const mapStyle = map.getStyle();
      if (!mapStyle) return; // التحقق من وجود النمط قبل الوصول إليه
      
      const layersToRemove = mapStyle.layers.filter(layer => 
        layer.id.startsWith('tracking-route-')
      );
      layersToRemove.forEach(layer => {
        if (map.getLayer(layer.id)) {
          map.removeLayer(layer.id);
        }
      });

      const sourcesToRemove = Object.keys(mapStyle.sources).filter(source => 
        source.startsWith('tracking-route-')
      );
      sourcesToRemove.forEach(source => {
        if (map.getSource(source)) {
          map.removeSource(source);
        }
      });
    };
  }, [trackingDeviceId, trackingDevices, trackingPaths, positions]);

   // useEffect منفصل لتحديث مسارات التتبع عند تحديث المواقع
   useEffect(() => {
     trackingDevices.forEach(deviceId => {
       const currentPosition = positions[deviceId];
       const devicePath = trackingPaths[deviceId];
       
       if (currentPosition && devicePath) {
         const startTime = new Date(devicePath.startTime);
         const positionTime = new Date(currentPosition.fixTime);
         
         if (positionTime >= startTime) {
           const newPoint = [currentPosition.longitude, currentPosition.latitude];
           dispatch(sessionActions.updateTrackingPath({
             deviceId,
             point: newPoint
           }));
         }
       }
     });
   }, [positions, trackingDevices, trackingPaths, dispatch]);

   return null; // هذا المكون لا يعرض أي UI مرئي
};

export default MapLiveTracking;