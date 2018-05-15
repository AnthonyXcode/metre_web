import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import firebase from './Helpers/FirebaseHelper'
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoBox
} from 'react-google-maps'
import * as R from 'ramda'
import {Images} from './Themes'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

const MyMapComponent = withScriptjs(
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
            defaultIcon={Images.circle}
          />
        )
      })}
    </GoogleMap>
  ))
)

class App extends Component {
  state = {
    allLocations: [],
    showingLocation: {}
  }

  componentDidMount() {
    this.firebaseRef = firebase.database().ref('/district/location')
    this.firebaseCallback = this.firebaseRef.on('value', snap => {
      let showingLocation = {}      
      let allLocations = []
      for (var locationName in snap.val()) {
        const location = snap.val()[locationName]
        let longitude = 0
        let latitude = 0
        let metreArr = []
        for (var key in location) {
          const metre = location[key]
          if (key === 'longitude') {
            longitude = metre
          }
          if (key === 'latitude') {
            latitude = metre
          }
          if (key === 'metreId') {
            for (var metreId in metre) {
              metreArr.push(metre[metreId])
            }
          }
        }
        const showingLocationName = R.pathOr('', ['locationName'], this.state.showingLocation)
        if (showingLocationName === locationName) {
          showingLocation = {locationName, longitude, latitude, metreArr}
        }
        allLocations.push({ locationName, longitude, latitude, metreArr })
      }
      this.setState({ allLocations, showingLocation })
    })
  }

  onMakerClick = location => {
    this.setState({ showingLocation: location })
  }

  onDetailClick = () => {
    console.log('click detail')
  }

  Status = showingLocation => {
    const locationName = R.pathOr('', ['locationName'], showingLocation)
    const metreArr = R.pathOr([], ['metreArr'], showingLocation)
    if (metreArr.length === 0) return <div/>
    const metreDetail = metreArr.map(metre => {
      const isAvailable = R.pathOr(true, ['available'], metre)
        ? 'available'
        : 'unavailable'
      const endTime = R.pathOr('', ['endTime'], metre)
      const number = R.pathOr('0', ['number'], metre)
      return (
        <div style={{ display: 'flex', width: 350 }}>
          <div style={{width: 60}}>{number}</div>
          <div style={{width: 60}}>{isAvailable}</div>
          <div style={{width: 230}}>{endTime}</div>
        </div>
      )
    })

    return (
      <div>
        <div>{locationName}</div>
        <div style={{ display: 'flex', width: 350 }}>
          <div style={{width: 60}}>number</div>
          <div style={{ width: 60 }}>status</div>
          <div style={{ width: 230 }}>endTime</div>
        </div>
        {metreDetail}
        <button onClick={this.onDetailClick}>Check Detail</button>
      </div>
    )
  }

  render() {
    const mapWidth = window.innerWidth * 0.7
    return (
      <div className="App">
        <div
          style={{
            height: window.innerHeight + 'px',
            width: mapWidth + 'px'
          }}
        >
          <MyMapComponent
            isMarkerShown
            onMarkerClick={this.onMakerClick}
            allLocations={this.state.allLocations}
            googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
            loadingElement={
              <div style={{ height: `100%`, width: mapWidth + 'px' }} />
            }
            containerElement={
              <div
                style={{
                  height: window.innerHeight + 'px',
                  width: mapWidth + 'px'
                }}
              />
            }
            mapElement={
              <div style={{ height: `100%`, width: mapWidth + 'px' }} />
            }
          />
        </div>
        {this.Status(this.state.showingLocation)}
      </div>
    )
  }
}

export default App
