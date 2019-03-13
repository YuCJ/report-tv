import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

export default class TextInput extends PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired,
    placeholer: PropTypes.string.isRequired,
    stateKey: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    update: PropTypes.func.isRequired,
  }

  render() {
    const {
      label,
      placeholer,
      stateKey,
      update,
      value,
    } = this.props
    return (
      <div>
        <label for="stateKey">{label}</label>
        <input type="text" name={stateKey} id={stateKey} value={value} placeholer={placeholer} />
      </div>
    )
  }
}
