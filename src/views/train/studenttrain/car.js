// import { sysConfigInfo } from "@/api/exam/parameter/setting";

function GetDPoint(p1, p2, jd) {
  jd = jd - 90;
  if (jd >= 360) jd -= 360;
  jd = (jd * Math.PI) / 180;
  var sin = Math.sin(jd);
  var cos = Math.cos(jd);
  var X = p1.X * cos + p1.Y * sin;
  var Y = p1.Y * cos - p1.X * sin;
  X += p2.X;
  Y += p2.Y;
  return [X, Y];
}

function getTempJson(geoJson, arr, currentIndex) {
  const tempJson = JSON.parse(JSON.stringify(geoJson));
  for (var i = 0; i < tempJson.geometry.coordinates[0].length; i++) {
    var carx = geoJson.geometry.coordinates[0][i][1];
    var cary = geoJson.geometry.coordinates[0][i][0];

    var nowPoint = GetDPoint(
      { X: parseFloat(carx), Y: parseFloat(cary) },
      {
        X: parseFloat(arr[currentIndex][0]),
        Y: parseFloat(arr[currentIndex][1]),
      },
      parseFloat(arr[currentIndex][2])
    );

    tempJson.geometry.coordinates[0][i] = nowPoint;
  }

  return tempJson;
}

export class Car {
  constructor(attr) {
    this.linepoint = [];
    this.currentIndex = 0;
    this.carvector = null;
    Object.keys(attr).forEach((k) => {
      this[k] = attr[k];
    });
  }

  setLinePoint(linepoint) {
    // 判断当前车辆是否在运行状态
    this.linepoint = linepoint;
    this.currentIndex = 0;
    this.moveFeature();
    // if (this.currentIndex >= this.linepoint.length) {
    //   this.linepoint = linepoint;
    //   this.currentIndex = 0;
    //   this.moveFeature();
    // } else {
    //   this.linepoint = this.linepoint.concat(linepoint);
    // }
  }

  route() {
    return new ol.geom.LineString(this.linepoint);
  }

  routeCoords() {
    return this.route().getCoordinates();
  }

  styles() {
    return {
      route: new ol.style.Style({
        stroke: new ol.style.Stroke({
          width: 5,
          color: [255, 24, 24, 1],
        }),
      }),
      geoMarker: new ol.style.Style({
        image: new ol.style.Circle({
          radius: 2,
          snapToPixel: false,
          fill: new ol.style.Fill({ color: "black" }),
          stroke: new ol.style.Stroke({
            color: "red",
            width: 2,
          }),
        }),
      }),
    };
  }

  moveFeature() {
    // const vectorContext = this.context.vectorContext;
    // const currentPoint = new ol.geom.Point(
    //   this.routeCoords()[this.currentIndex]
    // );
    // const feature = new ol.Feature(currentPoint);
    const carsource = new ol.source.Vector({
      features: new ol.format.GeoJSON({
        featureProjection: "EPSG:3857",
      }).readFeatures(
        getTempJson(this.geoJson, this.linepoint, this.currentIndex)
      ),
    });

    if (this.carvector != null) {
      this.map.removeLayer(this.carvector);
    }

    this.carvector = new ol.layer.Vector({
      source: carsource,
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: "#1e9fff",
        }),
        text: new ol.style.Text({
          text: `考生姓名:${this.name}`,
          offsetY: 10,
          font: "16px sans-serif",
        }),
      }),
    });

    this.map.addLayer(this.carvector);
    // vectorContext.drawFeature(feature, this.styles().geoMarker);
    // this.map.render();

    if (++this.currentIndex >= this.routeCoords().length) return;
    requestAnimationFrame(this.moveFeature.bind(this));
  }
}

// export async function carSocket() {
//   return new WebSocket(
//     (await sysConfigInfo("CarWebSocketURL")).data.configValue
//   );
// }
