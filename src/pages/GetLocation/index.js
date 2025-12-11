import React, { useCallback, useState } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 24.8607,  // default: Karachi — change if needed
  lng: 67.0011,
};

const Location = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Load Google Maps script
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyByghPCf_Dmn8SHo_52_80hU3sa585RoJA",
  });

  const onMarkerClick = () => {
    setSelectedPlace({
      name: "Current Location",
    });
  };

  const onInfoClose = () => {
    setSelectedPlace(null);
  };

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
      <Marker position={center} onClick={onMarkerClick} />

      {selectedPlace && (
        <InfoWindow position={center} onCloseClick={onInfoClose}>
          <div>
            <h4>{selectedPlace.name}</h4>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default Location;
