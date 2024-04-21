"use client";

import {
  useJsApiLoader,
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
} from "@react-google-maps/api";

const center = { lat: 1.9403, lng: 29.8739 };

function Map() {
  const mapApiKey: string = process.env.NEXT_PUBLIC_MAP_API
    ? process.env.NEXT_PUBLIC_MAP_API
    : "";

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: mapApiKey,
  });

  if (isLoaded) {
    return (
      <div className="h-full">
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{
            width: "100%",
            height: "80vh",
          }}
          mapContainerClassName="rounded-2xl"
        >
          <Marker
            position={center}
            icon={{ url: "/marker.png" }}
          ></Marker>
        </GoogleMap>
      </div>
    );
  }
}

export default Map;
