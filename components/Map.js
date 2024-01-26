import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import Map, { Marker, Popup } from 'react-map-gl';

const MapComponent = ({ dataMarkers = null }) => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState(null);

  const mapRef = useRef(null);

  const onMapLoad = () => {
    const mapa = mapRef.current.getMap();

    if (!mapa) {
      return;
    }

    mapa.getCanvas().style.cursor = 'default';
    setMap(mapa);
  };

  useEffect(() => {
    if (markers) {
      markers.forEach((mark) => {
        mark.remove();
      });
    }

    if (dataMarkers) {
      let marks = [];

      dataMarkers.forEach((marker, index) => {
        let popUp = new mapboxgl.Popup({
          offset: {
            bottom: [0, -12],
          },
          closeButton: false,
        }).setHTML(marker.html);

        let point = new mapboxgl.Marker(marker.markerOptions)
          .setLngLat([marker.geocode.longitude, marker.geocode.latitude])
          .setPopup(popUp);

        const mark = point.getElement();
        mark.addEventListener('mouseenter', () => point.togglePopup());
        mark.addEventListener('mouseleave', () => point.togglePopup());

        point.addTo(map);
        marks.push(point);
      });

      setMarkers(marks);
    }
  }, [dataMarkers]);

  return (
    <Map
      initialViewState={{
        longitude: -68.82375,
        latitude: -32.9012,
        zoom: 10,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={process.env.MAPBOX_TOKEN}
      style={{ width: '100%', height: '50vh' }}
      ref={mapRef}
      onLoad={onMapLoad}
    ></Map>
  );
};

export default MapComponent;
