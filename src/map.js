import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

export default class Map extends PureComponent {
  static propTypes = {
    initLat: PropTypes.number.isRequired,
    initLng: PropTypes.number.isRequired,
    update: PropTypes.func.isRequired,
  }

  render() {
    const { initLat, initLng } = this.props
    return (
      <div>
        {`lat: ${initLat}, lng: ${initLng}`}
      </div>
    )
  }
}
