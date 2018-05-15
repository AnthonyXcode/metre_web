import React, { Component } from 'react'
import { Images } from '../Themes'
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoBox
} from 'react-google-maps'

const AppMap = withScriptjs(
  withGoogleMap(props => (
    <GoogleMap
      defaultZoom={13}
      defaultCenter={{ lat: 22.396428, lng: 114.109497 }}
    >
      {props.allLocations.map(location => {
        const { longitude, latitude, locationName } = location
        return (
          <Marker
            key={locationName}
            position={{ lat: latitude, lng: longitude }}
            onClick={() => props.onMarkerClick(location)}
            defaultIcon={Images.circle_red}
          />
        )
      })}
    </GoogleMap>
  ))
)

export default AppMap
