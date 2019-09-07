import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import map from 'lodash/map'

const Selection = styled.div`
  padding: 30px 10px;
  border-radius: 5px;
  border: 2px solid gray;
`

export const controlOptions = [
  '成功轉台',
  '老闆不給轉台',
  '沒試不清楚',
]

export default class ControlSelection extends PureComponent {
  static propTypes = {

  }

  buildOption = (option, i) => {
    return (
      <Selection key={i}>
        {option}
      </Selection>
    )
  }

  render() {
    return (
      <div>
        {map(controlOptions, this.buildOption)}
      </div>
    )
  }
}
