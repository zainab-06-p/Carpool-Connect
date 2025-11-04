import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { createStore } from "redux";
import { useState } from "react";
import L from "leaflet";
import mainMapReducer from "./reducers/mainMapRootReducer"
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import LeafletGeocoder from "../testing-javascripts/LeafletGeocoder.jsx";
import Navbar from "../javascripts/Navbar.jsx";
import StartARide from "../testing-javascripts/StartARidePage.jsx";


import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import '../stylesheets/UserDashboard.css';
import { Provider } from "react-redux";

function MainMap() {
    const position = [20.5, 78.9];
    
    return (
      
        <div className="App">
        <StartARide />
        <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{width:"44.5vw",height:"72vh",marginLeft:"52.5vw",marginTop:"-79vh"}}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://api.maptiler.com/maps/openstreetmap/{z}/{x}/{y}@2x.jpg?key=OnXJPBh7IkMHefqgKgQS"
          />
          <LeafletGeocoder />
        </MapContainer>
      </div>
         

     
    );
  }
  
  let DefaultIcon = L.icon({
    iconUrl: "public/images/blueIcon.png",
    iconSize: [50, 50],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
  });
  L.Marker.prototype.options.icon = DefaultIcon;
  
  export default MainMap;