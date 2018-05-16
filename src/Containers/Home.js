import React, { Component } from 'react'
import logo from '../logo.svg'
import '../App.css'
import firebase from '../Helpers/FirebaseHelper'
import * as R from 'ramda'
import { Link } from 'react-router-dom'
import AppMap from '../Components/AppMap'
import {Images} from '../Themes'

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
        let metreArr = this.getMetreArr()
        for (var key in location) {
          const metre = location[key]
          if (key === 'longitude') {
            longitude = metre
          }
          if (key === 'latitude') {
            latitude = metre
          }
        }
        const showingLocationName = R.pathOr(
          '',
          ['locationName'],
          this.state.showingLocation
        )
        if (showingLocationName === locationName) {
          showingLocation = { locationName, longitude, latitude, metreArr }
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

  getMetreArr = () => {
    let numberOfMetre = 0
    while(numberOfMetre < 10) {
      numberOfMetre = Math.round(Math.random() * 20)
    }
    const metres = R.range(1, numberOfMetre + 1)
    const metreArr = metres.map((metre) => {
      const available = Math.random() * 10 > 5 ? true : false
      const endTime = available ? '/' : Math.round(Math.random() * 120) + ' mins later'
      const number = metre
      return {available, endTime, number}
    })
    return metreArr
  }

  Status = showingLocation => {
    const locationName = R.pathOr('', ['locationName'], showingLocation)
    if (!locationName) return <div/>
    const metreArr = R.pathOr([], ['metreArr'], showingLocation)
    const metreDetail = metreArr.map(metre => {
      const isAvailable = R.pathOr(true, ['available'], metre) ? <img style={{height: 15, width: 15}} src={Images.circle_green}/> : <img style={{height: 15, width: 15}} src={Images.circle_red}/>
      const endTime = R.pathOr('', ['endTime'], metre)
      const number = R.pathOr('0', ['number'], metre)
      return (
        <div style={{ display: 'flex', width: 350 }} key={locationName + number}>
          <div style={{ width: 60 }}>{number}</div>
          <div style={{ width: 60 }}>{isAvailable}</div>
          <div style={{ width: 230 }}>{endTime}</div>
        </div>
      )
    })

    return (
      <div>
        <div>{locationName}</div>
        <div style={{ display: 'flex', width: 350 }}>
          <div style={{ width: 60 }}>No.</div>
          <div style={{ width: 60 }}>status</div>
          <div style={{ width: 230 }}>endTime</div>
        </div>
        {metreDetail}
        <a target="_blank" href="https://datastudio.google.com/open/1ithM7T8n28OmkFNakZr1rGKRn5vS95Fw">Detail</a>        
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
            <AppMap
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
