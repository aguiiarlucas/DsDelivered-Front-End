import AsyncSelect from "react-select/async";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import React from "react";

import "leaflet/dist/leaflet.css";

import { fetchLocalMapBox } from "../api";
import { OrderLocationData } from "./types";

const position = {
  lat: -21.271294,
  lng:-48.3181788
}

type Place = {
  label?: string;
  value?: string;
  position: {
    lat: number;
    lng: number;
  };
};

type Props = {
  onChangeLocation: (location: OrderLocationData) => void;
};

function OrderLocation({ onChangeLocation }: Props) {

  const loadOptions = async (inputValue: string, callback: (places: Place[]) => void) => {
    const response = await fetchLocalMapBox(inputValue);

    const places = response.data.features.map((item: any) => {
        return ({
            label: item.place_name,
            value: item.place_name,
            position: {
                lat: item.center[1],
                lng: item.center[0]
            }
        });
    });

    callback(places);

    // return the Place[], assuming that it inherits from the
    // OptionsOrGroups<Place, GroupBase<Place>> type, of course
    return places;
};
  

  const handleChangeSelect = (place: Place) => {
    onChangeLocation({
      latitude: place.position.lat,
      longitude: place.position.lng,
      address: place.label!
    });
  };

  return (
    <div className="order-location-container">
      <div className="order-location-content">
        <h3 className="order-location-title">
          Selecione onde o pedido deve ser entregue:
        </h3>
        <div className="filter-container">
          <AsyncSelect
            placeholder="digite um endereço para entregar o pedido"
            className="filter"
           loadOptions={loadOptions}
            onChange={(value) => handleChangeSelect(value as Place)}
          />
        </div>
        <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={position}>
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </Marker>
  </MapContainer>

      </div>
    </div>
  );
}
export default OrderLocation;
