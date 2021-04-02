import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import { Tooltip, Button } from '@material-ui/core'
import shallow from 'zustand/shallow'

import useStore from './../../store'
import { FLY_TO_ZOOM } from './../../../../../constants/map'

const FlyToMyLocationBtn = ({ children, ...props }) => {
  const { flyToLatLon, setStoreValues } = useStore(
    state => ({
      flyToLatLon: state.flyToLatLon,
      setStoreValues: state.setStoreValues,
    }),
    shallow,
  )

  const [position, setPosition] = useState(null)

  const handleClick = () => {
    // console.log('handleClick')
    setStoreValues({
      controlHovered: true,
      flyToTract: true,
    })
    flyToLatLon(
      position.coords.latitude,
      position.coords.longitude,
      FLY_TO_ZOOM,
    )
  }

  useEffect(() => {
    // Store the user's location when the app loads, to save time.
    if (
      'geolocation' in navigator &&
      navigator.permissions &&
      navigator.permissions.query({ name: 'geolocation' })
    ) {
      // console.log('loaded. setting position.')
      navigator.geolocation.getCurrentPosition(
        position => {
          setPosition(position)
        },
        error => {
          setPosition(false)
        },
      )
    }
  }, [])

  if (!!position) {
    return (
      <Tooltip
        title={i18n.translate(`MAP_FLY_TO_MY`)}
        placement={props.placement}
        arrow
      >
        <Button
          aria-label={i18n.translate(`MAP_FLY_TO_MY`)}
          onClick={handleClick}
          className={clsx(
            'map-fly-to-btn',
            props.className,
          )}
        >
          {children}
        </Button>
      </Tooltip>
    )
  } else {
    return ''
  }
}

FlyToMyLocationBtn.propTypes = {}

export default FlyToMyLocationBtn
