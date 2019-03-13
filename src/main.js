import 'style-loader!css-loader!./main.css'
import {
  stateKeys,
} from './constants'
import React from 'react'
import ReactDOM from 'react-dom'
// components
import ControlSelection from './control-selection'
import TextInput from './text-input'
import TvSelection from './tv-selection'
// lodash
import filter from 'lodash/filter'
import get from 'lodash/get'
import Map from './map'
import map from 'lodash/forEach'

const apiPath = 'https://script.google.com/macros/s/AKfycbyRNetklymtRmBjkXngDzgaKX8RAMqiudFiVnh4u_DNLX0wITE/exec'
const buildRecordUrl = (query) => `${apiPath}${buildSearchString}`
const buildSearchString = (query) => {
  const searches = filter(map(query, (value, key) => value ? `${key}=${value}` : ''), Boolean)
  return searches.length > 0 ? `?${searches.join('&')}` : ''
}

const GettingPositionNotify = () => (
  <div>抓取 GPS 定位中…</div>
)

export default class Main extends React.PureComponent {
  static propTypes = {

  }
  constructor(props) {
    super(props)
    this.state = {
      isGettingPosition: true,
      supportGeolocation: false,
      [stateKeys.userLat]: null,
      [stateKeys.userLng]: null,
      [stateKeys.location]: '',
      [stateKeys.city]: '',
      [stateKeys.tv]: '',
      [stateKeys.control]: '',
      [stateKeys.comment]: '',
      [stateKeys.reporter]: '',
    }
  }
  componentDidMount() {
    /* Get user position */
    if ('geolocation' in navigator) {
      /* geolocation is available */
      navigator.geolocation.getCurrentPosition((position) => this.setState({
        supportGeolocation: true,
        isGettingPosition: false,
        [stateKeys.userLat]: get(position, 'coords.latitude', null),
        [stateKeys.userLng]: get(position, 'coords.longitude', null),
      }), (error) => {
        this.setState({
          isGettingPosition: false,
          supportGeolocation: false,
        })
        console.error(error)
      }, { timeout: 10000, enableHighAccuracy: true })
    } else {
      /* geolocation IS NOT available */
      this.setState({
        supportGeolocation: false,
        isGettingPosition: false,
      })
    }
  }

  update = (key, value) => {
    if (this.state[key] !== value) {
      this.setState({
        [key]: value
      })
    }
  }

  render() {
    const { isGettingPosition } = this.state
    return (
      <div>
        <TvSelection
          stateKey={stateKeys.tv}
          update={this.update}
        />
        <ControlSelection
          stateKey={stateKeys.control}
          update={this.update}
        />
        <TextInput
          label="餐廳場所名稱"
          placeholder="有間餐廳"
          stateKey={stateKeys.location}
          update={this.update}
          value={this.state[stateKeys.location]}
        />
        {isGettingPosition ? <GettingPositionNotify /> : (this.state[stateKeys.userLat] && this.state[stateKeys.userLng]) ? (
            <Map
              initLat={this.state[stateKeys.userLat]}
              initLng={this.state[stateKeys.userLng]}
            />
          ) : (
            <TextInput
              label="所在縣市"
              placeholder="Ex: 台中市"
              stateKey={stateKeys.city}
              update={this.update}
              value={this.state[stateKeys.city]}
            />
          )}
      </div>
    )
  }
}

ReactDOM.render(<Main />, document.getElementById('root'))
