import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import shallow from 'zustand/shallow'
import {
  Box,
  Button,
  IconButton,
  Zoom,
} from '@material-ui/core'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import CloseIcon from '@material-ui/icons/Close'

import Chart from '../Chart'
import useStore from './../store'
import { STATES } from './../../../../constants/map'
import LegendScale from './LegendScale'
import LegendControl from './LegendControl'
import LegendChartHeaders from './LegendChartHeaders'
import { SliderIcon } from './../../../assets/Icons'

// Styles for this component.
const useLegendStyles = makeStyles(theme => ({
  root: {
    zIndex: theme.extras.Legend.zIndex,
    backgroundColor: theme.palette.background.paper,
    position: 'fixed',
    maxHeight: '500px',
    transition:
      'width 300ms ease-in-out, max-height 300ms ease-in-out',
    width: '100vw', //620px
    // Adjust for different app bar height.
    top: '55px',
    right: '0px',
    justifyContent: 'center',
    alignItems: 'flex-start',
    fontFamily: 'Fira Sans',
    fontSize: '12px',
    cursor: 'default',
    overflow: 'hidden',
    [theme.breakpoints.up('sm')]: {
      boxShadow: theme.shadows[3],
      width: 284,
      position: 'absolute',
      right: theme.extras.Legend.cushionRight,
      top: 80,
      borderRadius: 5,
    },
  },
  /** styles when legendPanel.active is truthy */
  active: {
    '& $showButton': {
      transform: 'rotate(180deg)',
    },
    [theme.breakpoints.up('sm')]: {
      width: 668,
    },
  },
  hidden: {
    [theme.breakpoints.up('sm')]: {
      maxHeight: '0px',
    },
  },
  controlGuts: {
    transition: 'height 300ms ease-in-out',
    height: 0,
    overflow: 'hidden',
    [theme.breakpoints.up('sm')]: {
      height: '330px',
      // overflow: 'visible',
    },
  },
  controlActive: {
    height: theme.extras.Legend.heightMobile,
    overflow: 'hidden',
    // height: '250px',
    [theme.breakpoints.up('sm')]: {
      height: theme.extras.Legend.height,
      overflow: 'visible',
    },
  },
  controlInactive: {
    // overflow: 'hidden',
  },
  row: {
    width: '100%',
    '&:nth-child(n+2)': {
      paddingTop: '7px',
    },
  },
  col6: {
    width: '100%',
    display: 'block',
  },
  col3: {
    boxSizing: 'border-box',
    width: '50%',
    display: 'inline-block',
    padding: '0px 2px 0px 0px',
    '&:nth-child(2)': {
      padding: '0px 0px 0px 2px',
    },
  },
  col4: {
    boxSizing: 'border-box',
    width: '66%',
    display: 'inline-block',
    padding: '0px 2px 0px 0px',
    '&:nth-child(2)': {
      padding: '0px 0px 0px 2px',
    },
  },
  col2: {
    boxSizing: 'border-box',
    width: '33%',
    display: 'inline-block',
    padding: '0px 2px 0px 0px',
    '&:nth-child(2)': {
      padding: '0px 0px 0px 2px',
    },
  },
  labelText: {
    display: 'block',
    color: theme.extras.variables.colors.darkGray,
    paddingBottom: '6px',
    paddingRight: '12px', // Make space for close button.
    fontSize: '14px',
    fontWeight: 600,
  },
  showChart: {
    color: '#C9422C',
    fontSize: '14px',
    verticalAlign: 'middle',
    letterSpacing: '1.25px',
    fontWeight: '500',
    paddingLeft: '3px',
    '&.disabled': {
      color: '#616161',
    },
  },
  showControl: {
    textAlign: 'center',
    borderTop: '1px solid #EEE',
  },
  controlIcon: {
    transition: 'transform 300ms ease-in-out',
    transform: 'rotate(180deg)',
  },
  controlIconActive: {
    transform: 'rotate(0deg)',
  },
  controlButton: {
    textAlign: 'center',
  },
  controlBtnLabel: {
    color: theme.extras.variables.colors.ddkRed,
    fontSize: '14px',
    letterSpacing: '1.25px',
    verticalAlign: 'middle',
  },
  switchContainer: {
    float: 'right',
  },
  switchLabel: {
    fontSize: '14px',
    letterSpacing: '1.25px',
    color: theme.extras.variables.colors.lightGray,
  },
  controller: {
    boxSizing: 'border-box',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    background: theme.palette.background.paper,
    width: '100vw',
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '284px',
      float: 'right',
      padding: theme.spacing(2),
      borderRadius: 5,
    },
  },
  panel: {
    top: '0px',
    right: '284px',
    height: '100%', // '352px',
    width: '352px',
    padding: '16px 16px',
    zIndex: '-1',
    background:
      theme.extras.variables.colors.lightLightGray,
    position: 'absolute',
  },
  panelChart: {
    width: '100%',
    height: '270px',
  },
  panelName: {
    fontSize: '14px',
    fontWeight: 600,
    padding: '0px 0px 0px 36px',
    letterSpacing: '.1px',
    lineHeight: '24px',
    color: theme.extras.variables.colors.darkGray,
  },
  panelLabel: {
    padding: '0px 0px 12px 36px',
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '16px',
    color: theme.extras.variables.colors.lightGray,
    fontFamily: 'Fira Sans Condensed, Fira Sans',
  },
  panelSds: {
    color: '#616161',
    width: '311px',
    margin: '0px 0px 0px 36px',
    textAlign: 'center',
    fontSize: '12px',
    paddingBottom: '4px',
    display: 'flex',
  },
  sdsCell: {
    width: '20%',
  },
  embed: {
    top: '16px',
  },
  // Handling open and close of legend for desktop view.
  closeLegendButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: '8px',
  },
  showLegendButton: {
    boxShadow: theme.shadows[3],
    zIndex: 12,
    position: 'absolute',
    right: theme.extras.Legend.cushionRight,
    top: 80,
    textTransform: 'none',
    height: '40px',
    borderRadius: '20px',
    padding: '0 16px',
    backgroundColor: theme.extras.variables.colors.white,
    color: theme.extras.variables.colors.ddkRed,
    border: `1px solid ${theme.extras.variables.colors.ddkRed}`,
    fontFamily: 'Fira Sans',
    fontSize: '16px',
    fontWeight: 600,
    opacity: 1,
    transition: 'opacity 100ms ease-in-out 300ms',
    '& svg': {
      marginRight: '0.4rem',
    },
    '&:hover': {
      backgroundColor: theme.extras.variables.colors.white,
    },
  },
  showLegendButtonHidden: {
    opacity: 0,
  },
}))

const processData = (
  data,
  geo,
  year,
  centerState,
  centerMetro,
) => {
  var struct = []
  var selected = []
  switch (geo) {
    case 'n':
      selected = data.barcharts.data[`20${year}`].nation
      break
    case 's':
      if (centerState > 0) {
        selected =
          data.barcharts.data[`20${year}`].states[
            STATES[centerState].abbr
          ]
      }
      break
    case 'm':
      if (centerMetro > 0) {
        selected =
          data.barcharts.data[`20${year}`].metros[
            centerMetro
          ]
      }
  }
  selected.map(el => {
    struct.push({
      ai: el.ai,
      ap: el.ap,
      w: el.w,
      b: el.b,
      hi: el.hi,
    })
  })
  return struct
}

const Legend = ({ ...props }) => {
  const {
    activeYear,
    activeNorm,
    activePointLayers,
    activeMetric,
    legendPanel,
    legendControl,
    centerMetro,
    centerState,
    remoteJson,
    activeView,
    breakpoint,
    setStoreValues,
  } = useStore(
    state => ({
      activeYear: state.activeYear,
      activeNorm: state.activeNorm,
      activePointLayers: state.activePointLayers,
      activeMetric: state.activeMetric,
      legendPanel: state.legendPanel,
      legendControl: state.legendControl,
      centerMetro: state.centerMetro,
      centerState: state.centerState,
      remoteJson: state.remoteJson,
      activeView: state.activeView,
      breakpoint: state.breakpoint,
      setStoreValues: state.setStoreValues,
    }),
    shallow,
  )

  // State for legend visibility (for desktop)
  const [hidden, setHidden] = useState(false)

  const handleEvent = (val, e) => {
    var data = {}
    if (val === 'showControl') {
      const data = { active: !legendControl.active }
      return setStoreValues({ legendControl: data })
    }
    // console.log('hit')
    data[val] = e.target.value
    setStoreValues(data)
  }

  const handleHideLegend = () => {
    // console.log('handleHideLegend()')
    // If the barchart is open, hide that first, then hide legend.
    if (!!legendPanel.open) {
      setStoreValues({
        legendPanel: {
          active: legendPanel.active,
          open: false,
          glow: legendPanel.glow,
        },
      })
      setTimeout(() => {
        // Start the close animation.
        setHidden(true)
      }, 300)
    } else {
      // Start the close animation.
      setHidden(true)
    }

    // If the barchart is not open, just hide the legend.
  }

  const handleShowLegend = () => {
    setHidden(false)
  }

  useEffect(() => {
    const data = {
      active: true,
      open: legendPanel.open,
      glow: legendPanel.glow,
    }
    if (
      (activeNorm === 'm' &&
        centerMetro === 0 &&
        legendPanel.active) ||
      (activeNorm === 's' &&
        centerState === 0 &&
        legendPanel.active) ||
      activePointLayers.length < 1
    ) {
      data.active = false
      data.open = false
    }
    setStoreValues({ legendPanel: data })
  }, [
    centerMetro,
    centerState,
    activeNorm,
    activePointLayers,
  ])

  const classes = useLegendStyles()

  // console.log('legendControl, ', legendControl)

  return (
    <>
      {/* DESKTOP VIEW, legend hidden */}
      {breakpoint != 'xs' &&
        activeView === 'explorer' &&
        !!hidden && (
          <Zoom
            in={hidden}
            style={{
              transitionDelay: hidden ? '200ms' : '0ms',
            }}
          >
            <Button
              className={clsx(
                'legend-btn-show-legend',
                classes.showLegendButton,
                // !hidden ? classes.showLegendButtonHidden : '',
              )}
              onClick={handleShowLegend}
            >
              <SliderIcon />
              {i18n.translate(`LEGEND_SHOW_HIDDEN`)}
            </Button>
          </Zoom>
        )}
      {/* DESKTOP VIEW, legend shown */}
      {breakpoint != 'xs' && activeView === 'explorer' && (
        <Box
          className={clsx('map-legend', classes.root, {
            [classes.active]: legendPanel.open,
            [classes.hidden]: hidden,
          })}
        >
          <IconButton
            onClick={handleHideLegend}
            className={clsx(
              'legend-btn-close',
              classes.closeLegendButton,
            )}
          >
            <CloseIcon />
          </IconButton>
          <div className={classes.controller}>
            <LegendScale
              activeMetric={activeMetric}
              activeNorm={activeNorm}
              classes={{
                root: classes.row,
                label: classes.labelText,
              }}
            />
            <div
              className={clsx(
                classes.controlGuts,
                !!legendControl && !!legendControl.active
                  ? classes.controlActive
                  : classes.controlInactive,
              )}
            >
              <LegendControl parentClasses={classes} />
            </div>
          </div>
          <div className={classes.panel}>
            {!!remoteJson &&
              !!remoteJson.barcharts &&
              !!legendPanel.active && (
                <div className={classes.panelChart}>
                  <LegendChartHeaders
                    classes={{
                      title: classes.panelName,
                      subtitle: clsx(
                        classes.labelText,
                        classes.panelLabel,
                      ),
                      panel: classes.panelSds,
                      cell: classes.sdsCell,
                    }}
                    activeNorm={activeNorm}
                  />
                  <Chart
                    data={processData(
                      remoteJson,
                      activeNorm,
                      activeYear,
                      centerState,
                      centerMetro,
                    )}
                    activeBars={
                      activePointLayers.length > 0
                        ? activePointLayers
                        : []
                    }
                  />
                </div>
              )}
          </div>
        </Box>
      )}
      {/* MOBILE VIEW */}
      {breakpoint === 'xs' && activeView === 'explorer' && (
        <Box className={clsx('map-legend', classes.root)}>
          <div className={classes.controller}>
            <LegendScale
              activeMetric={activeMetric}
              activeNorm={activeNorm}
              classes={{
                root: classes.row,
                label: classes.labelText,
              }}
            />
            <div
              className={clsx(
                classes.controlGuts,
                !!legendControl && !!legendControl.active
                  ? classes.controlActive
                  : classes.controlInactive,
              )}
            >
              <LegendControl parentClasses={classes} />
            </div>
            <div className={clsx(classes.row)}>
              <div className={classes.controlButton}>
                <Button
                  onClick={e => {
                    handleEvent('showControl', e)
                  }}
                  classes={{
                    label: classes.controlBtnLabel,
                  }}
                >
                  <ExpandLessIcon
                    className={clsx(classes.controlIcon, {
                      [classes.controlIconActive]:
                        legendControl.active,
                    })}
                  />
                  <span>
                    {i18n.translate(
                      `LEGEND_CONTROL_${legendControl.active
                        .toString()
                        .toUpperCase()}`,
                    )}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </Box>
      )}
      {/* EMBED VIEW */}
      {activeView === 'embed' && (
        <Box
          className={clsx(
            'map-legend',
            classes.root,
            classes.embed,
          )}
        >
          <div className={classes.controller}>
            <LegendScale
              activeMetric={activeMetric}
              activeNorm={activeNorm}
              classes={{
                root: classes.row,
                label: classes.labelText,
              }}
            />
          </div>
        </Box>
      )}
    </>
  )
}

Legend.propTypes = {}

Legend.defaultProps = {}

export default Legend
