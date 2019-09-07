import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
 
export default class TextInput extends PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    stateKey: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    update: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e) {
    const value = get(e, 'target.value')
    const { update, stateKey } = this.props
    update(stateKey, value)
  }

  render() {
    const {
      label,
      placeholder,
      stateKey,
      value,
    } = this.props
    return (
      <div>
        <label for="stateKey">{label}</label>
        <input
          onChange={this.handleChange}
          type="text"
          name={stateKey}
          id={stateKey}
          value={value}
          placeholder={placeholder}
        />
      </div>
    )
  }
}
