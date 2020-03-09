import { Component } from '@angular/core';

import * as L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import 'leaflet-routing-machine';
import 'leaflet-control-geocoder';
import 'leaflet.icon.glyph';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  map: L.Map;

  layersControl = {
    baseLayers: {
      'Open Street Map': L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
      'Open Cycle Map': L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    },
    overlays: {
      'Big Circle': L.circle([ 46.95, -122 ], { radius: 5000 }),
      'Big Square': L.polygon([[ 46.8, -121.55 ], [ 46.9, -121.55 ], [ 46.9, -121.7 ], [ 46.8, -121.7 ]])
    }
  };

  options = {
    layers: [
      this.layersControl.baseLayers['Open Street Map']
    ],
    zoom: 5,
    center: L.latLng(46.879966, -121.726909)
  };

  onMapReady(map: L.Map) {
/*     map.pm.addControls({
      position: 'topleft'
    }); */

    const waypoints = [
      L.latLng(48.8588, 2.3469),
      L.latLng(52.3546, 4.9039)
    ];

    L.Routing.control({
      router: L.Routing.osrmv1({
        serviceUrl: 'https://routing.openstreetmap.de/routed-foot/route/v1',
        profile: 'walking',
        useHints: false
      }),
      plan: L.Routing.plan(waypoints, {
        createMarker(i, wp) {
          return L.marker(wp.latLng, {
            draggable: true,
            icon: (L.icon as any).glyph({ glyph: String.fromCharCode(65 + i) })
          });
        },
        geocoder: (L.Control as any).Geocoder.nominatim(),
        routeWhileDragging: true
      }),
      waypoints,
      routeWhileDragging: true,
      routeDragTimeout: 250,
      showAlternatives: true,
      altLineOptions: {
        styles: [
          {color: 'black', opacity: 0.15, weight: 9},
          {color: 'white', opacity: 0.8, weight: 6},
          {color: 'blue', opacity: 0.5, weight: 2}
        ]
      }
    })
    .addTo(map);

    this.map = map;
  }
}
