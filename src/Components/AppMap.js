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
        const { longitude, latitude, locationName, metreArr } = location
        const availableMetres = metreArr.filter((metre) => {
          const { available } = metre
          return available
        })
        console.log(availableMetres, metreArr)
        let image = Images.circle_green
        if (availableMetres.length < metreArr.length / 3) {
          image = Images.circle_green
        } else if (availableMetres.length > metreArr.length / 3 && availableMetres.length < metreArr.length / 3 * 2) {
          image = Images.circle_blue
        } else {
          image = Images.circle_red
        }
        return (
          <Marker
            key={locationName}
            position={{ lat: latitude, lng: longitude }}
            onClick={() => props.onMarkerClick(location)}
            defaultIcon={image}
          />
        )
      })}
    </GoogleMap>
  ))
)

export default AppMap
