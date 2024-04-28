"use client";

import { AddressObject, Location } from "@/types/map";
import {
  useJsApiLoader,
  GoogleMap,
  InfoWindow,
  Marker,
  DirectionsRenderer,
  Autocomplete,
  Libraries,
} from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import ToastDefault from "../Tools/Toast";

const center = { lat: -1.9403, lng: 29.8739 };

const libraries: Libraries = ["places"];

function Map() {
  const mapApiKey: string = process.env.NEXT_PUBLIC_MAP_API
    ? process.env.NEXT_PUBLIC_MAP_API
    : "";

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: mapApiKey,
    libraries: libraries,
  });

  const directionsRendererRef = useRef(null);
  const [userLocation, setUserLocation] = useState<Location>();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        // Success callback
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        // Error callback
        (error) => {
          console.error("Error getting user's location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const [directions, setDirections] = useState(null);
  const [startLocation, setStartLocation] = useState<any>("");
  const [destination, setDestination] = useState<any>("");
  const [userInfo, setUserInfo] = useState<{ name: string } | null>(null);

  const handleMarkerClick = () => {
    const dummyUserInfo = {
      name: "User's location!",
    };
    setUserInfo(dummyUserInfo);
  };

  useEffect(() => {
    if (destination) {
      <ToastDefault />;
    }
  }, [destination]);

  const handleStartLocationSelect = (addressObject: AddressObject) => {
    if (addressObject) {
      const address: string = addressObject.formatted_address;
      setStartLocation(address);
    }
  };

  const handleDestinationSelect = (addressObject: AddressObject) => {
    if (addressObject) {
      const address: string = addressObject.formatted_address;
      setDestination(address);
    }
  };

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    if (startLocation && destination) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: startLocation,
          destination: destination,
          travelMode: google.maps.TravelMode["WALKING"],
        },
        (result: any, status: any) => {
          if (status === "OK") {
            setDirections(result);
          } else {
            console.error(`Error fetching directions: ${status}`);
          }
        }
      );
    }
  };

  if (!isLoaded) return null;

  return (
    <div>
      <section className={`bg-gray-900 w-full`}>
        <div className="py-8 px-4 text-center lg:py-16 z-10 relative">
          <h1 className="mb-4 text-4xl font-extrabold text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            Trace your way!
          </h1>
          <p className="mb-8 text-lg text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-200">
            Type in your start location and your destination, we will help you
            track your journey! You will see on the map below!
          </p>
          <form className="w-full max-w-md mx-auto">
            <div className="relative flex flex-col gap-4">
              <Autocomplete
                onLoad={(autocomplete) => {
                  setStartLocation(autocomplete);
                }}
                onPlaceChanged={() => {
                  const addressObject: AddressObject = startLocation.getPlace();
                  handleStartLocationSelect(addressObject);
                }}
              >
                <input
                  type="text"
                  className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Start Location"
                  required
                />
              </Autocomplete>
              <Autocomplete
                onLoad={(autocomplete) => {
                  setDestination(autocomplete);
                }}
                onPlaceChanged={() => {
                  const addressObject: AddressObject = destination.getPlace();
                  console.log(addressObject);
                  handleDestinationSelect(addressObject);
                }}
              >
                <input
                  type="text"
                  className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Destination"
                  required
                />
              </Autocomplete>
              <button
                type="submit"
                className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={handleFormSubmit}
              >
                Track
              </button>
            </div>
          </form>
        </div>
      </section>
      <div className="h-screen w-[80%] mx-auto m-4">
        <div className="h-full">
          <GoogleMap
            center={center}
            zoom={8}
            mapContainerStyle={{
              width: "100%",
              height: "80vh",
            }}
            mapContainerClassName="rounded-2xl"
          >
            {directions && <DirectionsRenderer directions={directions} />}
            {userLocation && (
              <Marker position={userLocation} onClick={handleMarkerClick} />
            )}
            {userInfo && (
              <InfoWindow
                position={{
                  lat: userLocation && userLocation.lat + 0.01,
                  lng: userLocation && userLocation.lng,
                }}
                onCloseClick={() => setUserInfo(null)}
              >
                <div>
                  <h3>{userInfo.name}</h3>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
      </div>
    </div>
  );
}

export default Map;
