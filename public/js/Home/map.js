
// ============================== MAP INITIALIZATION ===============================
// googleSet Layer
// const googleSet = L.tileLayer('http://{s}.google.com/vt/lyrs,h=s&x={x}&y={y}&z={z}',{
const googleSet = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
  "minZoom": 7,
  "maxZoom": 20,
  "subdomains":['mt0', 'mt1', 'mt2', 'mt3']
});

const map = L.map('map', {
  center: [ 10.303193, 9.832808 ],
  zoom: 17,
  minZoom: 2,
  maxZoom: 19,
  zoomSnap: 0.25,
  zoomControl: false,
  attributionControl: false,
  user: '',
  toFly: false,
  onRemoteFitBounds: true,
  isIndicators: false,
  layers: [googleSet]
});

// ======== Indicator Icon and Mobile touch marker for moving around under illustration 
var indicatorIcon = (iconName) => {
  let icon = iconName === "icon1" ? "home" :
             iconName === "icon2" ? "school" : 
             iconName === "icon3" ? "office" : 
             iconName === "icon4" ? "bank" : 
             iconName === "icon5" ? "market" : false;

  return L.AwesomeMarkers.icon({
  prefix: 'fa',
  icon: icon,
  markerColor: 'blue',
  iconColor: 'white',
});
}

// Touch Icon
const DIcon = () => {
  let icon = activeBtn === "icon0" ? "/img/Ico.png" :
             activeBtn === "icon1" ? "/img/Hm.png" :
             activeBtn === "icon2" ? "/img/Office.webp" : 
             activeBtn === "icon3" ? "/img/Office.webp" : 
             activeBtn === "icon4" ? "/img/Bank.png" : 
             activeBtn === "icon5" ? "/img/Office.webp" : 
             "/img/placeholder.png";

  return L.icon({
    iconUrl: icon,
    shadowUrl: 'marker-shadow.png',
    iconSize: [35, 45],
    iconAnchor: [20, 20],
    popupAnchor: [0, -55]
  });
}
const mobilePointerIcon = L.divIcon({
  className: "my-icon",
  iconSize: [40, 60],
  iconAnchor: [13, 13]
});

// ===================== Pulse Icon =================================
var createMarker = L.Icon.extend({
  options: {
  shadowUrl: '',
  iconSize: [40, 54],
  shadowSize: [50, 64],
  iconAnchor: [25, 64],
  shadowAnchor: [0, 64],
  popupAnchor: [-7, -47] //[-3, -64] 
  }
  });
//  var clusterMK = new createMarker({iconUrl: '/img/Hm.png'}); 
var clusterMarker = new L.MarkerClusterGroup({ showCoverageOnHover: false });
const iconSize = isMobile ? 7 : 9;

new function() {
  L.Icon.Pulse = L.DivIcon.extend({
      options: {
          className: '',
          iconSize:[iconSize, iconSize]
      },

      initialize: function (options) {
          L.setOptions(this,options);
          // initialize icon
          L.DivIcon.prototype.initialize.call(this, options);
      
      }
  });

  L.icon.pulse = function (options) {
      return new L.Icon.Pulse(options);
  };

  L.Marker.Pulse = L.Marker.extend({
      initialize: function (latlng, options) {
          options.icon = L.icon.pulse(options);
          L.Marker.prototype.initialize.call(this, latlng, options);
      }
  });

  L.marker.pulse = function (latlng, options) {
      return new L.Marker.Pulse(latlng, options);
  };

};

var localUserIcon = L.icon.pulse({ className: 'leaflet-user-pulsing-icon' });
var guestIcon = L.icon.pulse({ className: 'leaflet-guest-pulsing-icon' });
var activeUserIcon = L.icon.pulse({ className: 'leaflet-activeGuest-pulsing-icon' });
var remotePsBorderIcon = L.icon.pulse({ className: 'leaflet-ps-pulsing-borders-icon' });
var remotePsMidIcon = L.icon.pulse({ className: 'leaflet-ps-pulsing-mid-icon' });
// L.marker(map.options.center, {icon: remotePsMidIcon}).addTo(map)

const measures = {
  startMeasurement: function(x, y) {
    const point1 = x?x:globalV.localCoords, point2 = y?y:globalV.remoteCoords;
    if (point2) {
      this.doMeasure(point1, point2);
      checkBoundryIcon(Measurement);
      activeBtn = 'Measurement';
      readOut('My Boundry', 'Measurement');
    } else {
      setTimeout(e => open_toast('Add point to measure', 0), 1000);
      dropDownIconPressCounter_4 = 1;
    }
  },
  
  doMeasure: function(x, y) {
    let statement, dist;
    dist = this.findDistance(x, y);
    this.wayPoints = L.Routing.control({
      waypoints: [
        L.latLng(x),
        L.latLng(y),
      ]
    });
    this.wayPoints.addTo(map);
    map.fitBounds([x, y], {
      animate: true, duration: 4,
      easeLinearity: 0.5,
      padding: [ 100, 150 ],
      maxZoom: map.getZoom()
    });

    statement = "Distance of"
    this.label(statement, this._units(dist));
    globalV.onMeasure = true;
  },
  
  label: function(statement, units) {
    const text = `${statement} ${units}`;
    board(text);
  },

  findDistance: function(x, y) {
    if (x && y) {
      return Math.round(L.latLng(x).distanceTo(L.latLng(y)));
    } else {
      return Math.round(L.latLng(map.options.center).distanceTo(L.latLng(y)));
    }
  },

  _units: function (m) {
    let d, km = 1000;
    m > 0 && m < 1 ? d = 'less than 1m' :
    m >= 1 && m <= 499 ? d = m + 'm' :
    m >= 500 && m <= 999 || m === km ? d = (m / km) + 'km' : 
    m > km && m <= 1999 ? d = `1km and ${m - km}m` : 
    m >= (km * 2) ? d = Math.floor(m / km) + `km and ${(m / km).toString().split('.')[1]}m` : d = (m / km) + 'km';
    return d;
  }
}

map.on('dragstart', e => {
  map.options.onRemoteFitBounds = false;
});

map.on('dragend', e => {
  map.options.onRemoteFitBounds = true;
});

map.on('layeradd', layer => {
  if (layer.layer.options.name === 'localUser') {
    return;
  }
});

map.on('layerremove', layer => {
  // log(layer.layer.options, x)
})

map.on('popupopen', pop => {
  let img = document.querySelector('.receiverSideSenderImg'),
  name = document.querySelector('.receiverSideSenderName').innerHTML.split('\n'),
  i0 = document.getElementById('i0').innerHTML,
  i1 = document.getElementById('i1').innerHTML,
  a = document.getElementById("moreInfor");
  // log(name.split('\n'))
  
  hide_buddiesPanel();
  img.onclick = cl => popupMoreInfor(img.src, name);
  a.onclick = cl => popupMoreInfor(img.src, name);
})

function log(...x) {
  console.log(x);
}

function popupMoreInfor(imgSrc, c) {
  map.closePopup();
  displayBuddyPanel('no');
  createPopUpContentInfor(imgSrc, c);
}

const div = document.createElement('div');
var img = document.createElement('img');
var p = document.createElement('p');
function createPopUpContentInfor(imgSrc, c) {
  img.width = 100, img.height = 100, img.style.backgroundColor = '#eee',
  img.style.borderRadius = '50%', img.style.padding = '3px', img.src = imgSrc, 
  p.innerHTML = c, p.style.margin = 'auto 10px';
  div.style.margin = '15px auto', div.style.justifyContent = 'center' ;
  div.appendChild(img), div.appendChild(p);

  buddiesPanel.appendChild(div);
}
