import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

//Native components
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions, Marker, GoogleMapsAnimation } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';

//Mocks
import * as TreeMapping from '../../models/tree.mapping';

const MARKER_SIZE = 30;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private trees: TreeMapping.TreeMap[];
  public map: GoogleMap;

  constructor(public navCtrl: NavController, private geolocation: Geolocation, private googleMaps: GoogleMaps, public platform: Platform) {
    //Data
    
    this.trees = TreeMapping.TreeMappingMock;
    console.log(this.trees.length);
    console.log(this.trees);

    platform.ready().then(() => {
      this.loadMap();
    });
  }
 
  loadMap(){
    // create a new map by passing HTMLElement
    let element: HTMLElement = document.getElementById('map');

    this.map = GoogleMaps.create(element);

    //GeoLocation
    this.geolocation.getCurrentPosition().then((resp) => {
      let userPosition: LatLng = new LatLng(resp.coords.latitude, resp.coords.longitude);

      let position: CameraPosition<LatLng> = {
        target: userPosition,
        zoom: 18,
        tilt: 30
      };

      //Marker
      let markerOptions: MarkerOptions={
        position: userPosition,
        title: 'Votre position actuelle',
        animation: GoogleMapsAnimation.BOUNCE,
      }
  
      this.map.addMarker(markerOptions)
      .then((marker: Marker) => {
        marker.showInfoWindow();
      });

      this.map.moveCamera(position);
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    // listen to MAP_READY event
    // You must wait for this event to fire before adding something to the map or modifying it in anyway
    this.map.one(GoogleMapsEvent.MAP_READY).then(
      () => {
        console.log('Map is ready!');
        // Now you can add elements to the map like the marker

        for(var tree of this.trees){
          this.addMarkerOnLap(tree);
        }
      }
    );
  }

  private addMarkerOnLap(tree: TreeMapping.TreeMap){
    //create LatLng object
    let markerPosition: LatLng = new LatLng(tree.lat, tree.lng); 
    
    let markerIcon = {
      'url': tree.globalImage,
      'size': {
        width:Math.round(MARKER_SIZE),
        heigth:Math.round(MARKER_SIZE)
      }
    }

    let markerOptions: MarkerOptions={
      position: markerPosition,
      title: tree.name,
      snippet: 'Touch for more infos',
      animation: GoogleMapsAnimation.DROP,
      infoClick:() => {
        console.log('Famille -->' + tree.famille);
        console.log('Scientific name -->' + tree.scientificName);
        console.log('Size -->' + tree.size);
      },
      icon: markerIcon
    }

    this.map.addMarker(markerOptions)
    .then((marker: Marker) => {
      marker.showInfoWindow();
    });
  }
}
