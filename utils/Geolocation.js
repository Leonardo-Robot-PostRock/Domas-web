import * as turf from '@turf/turf';

function toRadians(grados) {
  return (grados * Math.PI) / 180;
}

// Funcion para calcular la distancia entre el cliente y el técnico
export function calculateDistance(lat1, lon1) {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat2 = position.coords.latitude;
          const lon2 = position.coords.longitude;
          const earthRadius = 6371000; // Radio de la Tierra en metros
          const dLat = toRadians(lat2 - lat1);
          const dLon = toRadians(lon2 - lon1);
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distancia = parseInt(earthRadius * c);
          resolve(distancia);
        },
        () => {
          reject('No se pudo obtener la ubicación del dispositivo');
        }
      );
    } else {
      reject('Geolocalización no soportada');
    }
  });
}

// Funcion para obtener la ubicacion actual del usuario
export function getCurrentGeolocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position.coords);
        },
        () => {
          reject('No se pudo obtener la ubicación del dispositivo');
        }
      );
    } else {
      reject('Geolocalización no soportada');
    }
  });
}

export function calculateCluster(geojsonFeatures, coordinates) {
  let c = coordinates.split(',');

  let point = turf.point([c[1], c[0]]);

  // * Primer intento: punto dentro de poligono
  let cluster = geojsonFeatures.filter((c) => turf.booleanPointInPolygon(point, c.feature));
  //console.log(cluster);

  if (cluster.length > 0) return cluster[0].feature.properties.cluster;

  // * Segundo intento: punto mas cercano a poligono
  let distances = geojsonFeatures.map((c) => {
    return {
      cluster: c.feature.properties.cluster,
      distance: turf.pointToLineDistance(point, turf.polygonToLineString(c.feature))
    };
  });
  let min_distance = Math.min(...distances.map((d) => d.distance));
  let closest_cluster = distances.find((d) => d.distance === min_distance);
  //console.log(closest_cluster);

  return closest_cluster.cluster;
}

export function convertirCoordenadas(coordenadas) {
  // formatos reconocidos:
  // -dd.mmmmmm,-dd.mmmmmm
  // ggºmm'ss.s"Y ggºmm'ss.s"X
  // https://www.google.com/maps/place/32%C2%B053'18.4%22S+68%C2%B050'24.7%22W/@-32.8815827,-68.8407754,16z/data=!4m5!3m4!1s0x0:0x0!8m2!3d-32.88843!4d-68.840196
  // https://maps.google.com/maps?q=-32.888430,-68.840196&ll=-32.888430,-68.840196&z=16
  // https://www.google.com/maps?t=m&ll=-32.888446,-68.840264&q=Ubicaci%C3%B3n+de+Joaquin+Castellano
  // https://maps.apple.com/?ll=-32.888446,-68.840264&q=Ubicaci%C3%B3n%20de%20Joaquin%20Castellano&t=m
  // https://www.google.com/maps/search/Ubicaci%C3%B3n+de+Joaquin+Castellano/@-32.8870923,-68.8400736,19z

  coordenadas = coordenadas.trim();
  var m;

  m = coordenadas.match(new RegExp('!3d(-?[0-9]+\\.[0-9]+)!4d(-?[0-9]+\\.[0-9]+)'));
  if (m) {
    return [m[1] * 1, m[2] * 1].join(',');
  }
  m = coordenadas.match(new RegExp('q=(-?[0-9]+\\.[0-9]+)(?:,|%2C)(-?[0-9]+\\.[0-9]+)'));
  if (m) {
    return [m[1] * 1, m[2] * 1].join(',');
  }
  m = coordenadas.match(new RegExp('q=Location(-?[0-9]+\\.[0-9]+),(-?[0-9]+\\.[0-9]+)'));
  if (m) {
    return [m[1] * 1, m[2] * 1].join(',');
  }
  m = coordenadas.match(new RegExp('ll=(-?[0-9]+\\.[0-9]+)(?:,|%2C)(-?[0-9]+\\.[0-9]+)'));
  if (m) {
    return [m[1] * 1, m[2] * 1].join(',');
  }
  m = coordenadas.match(new RegExp('@(-?[0-9]+\\.[0-9]+),(-?[0-9]+\\.[0-9]+)'));
  if (m) {
    return [m[1] * 1, m[2] * 1].join(',');
  }
  m = coordenadas.match(new RegExp('^(-?[0-9]+\\.[0-9]+)[,\\s]\\s*(-?[0-9]+\\.[0-9]+)(,[0-9\\.]+)?$'));
  if (m) {
    return [m[1] * 1, m[2] * 1].join(',');
  }
  m = coordenadas.match(
    new RegExp('^([0-9]+)[°º]([0-9]+)\'([0-9\\.]+)"([NSns])[, ]+([0-9]+)[°º]([0-9]+)\'([0-9\\.]+)"([EWOewo])$')
  );
  if (m) {
    return [
      (m[1] * 1 + m[2] / 60 + m[3] / 3600) * ('Nn'.indexOf(m[4]) >= 0 ? 1 : -1),
      (m[5] * 1 + m[6] / 60 + m[7] / 3600) * ('Ee'.indexOf(m[8]) >= 0 ? 1 : -1)
    ].join(',');
  }
  return false;
}
