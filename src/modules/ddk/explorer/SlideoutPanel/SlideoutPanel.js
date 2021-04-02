import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import {
  Backdrop,
  Fade,
  Hidden,
  IconButton,
  Modal,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

import useStore from './../store'
import TractPanel from './../TractPanel'
import FaqPanel from './../FaqPanel'

// Styles for this component.
const useStyles = makeStyles(theme => ({
  root: {
    zIndex: theme.extras.slideoutPanel.zIndex,
    backgroundColor: theme.palette.background.paper,
    position: 'absolute',
    top: 0,
    left: '-' + theme.extras.slideoutPanel.width,
    transition: 'left 200ms linear',
    width: theme.extras.slideoutPanel.width,
    // Adjust for different app bar height.
    height: `calc(100vh - ${theme.mixins.toolbar['@media (min-width:0px) and (orientation: landscape)'].minHeight}px)`,
    top: `${theme.mixins.toolbar['@media (min-width:0px) and (orientation: landscape)'].minHeight}px`,
    [theme.breakpoints.up('sm')]: {
      height: `calc(100vh - ${theme.mixins.toolbar['@media (min-width:600px)'].minHeight}px)`,
      top: `${theme.mixins.toolbar['@media (min-width:600px)'].minHeight}px`,
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
    boxShadow: theme.shadows[3],
  },
  active: {
    left: `${theme.extras.controlPanel.width}px`,
  },
  modal: {
    // inset: '10vh 10vw !important',
    top: '10vh !important',
    left: '10vw !important',
    height: '80vh',
    width: '80vw',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
    boxShadow: theme.shadows[3],
    outline: 0,
  },
  modalContent: {
    //border: '1px solid #000',
    outline: 0,
    backgroundColor: theme.palette.background.paper,
    height: '100%',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  button: {
    padding: '1rem',
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 3000,
  },
}))

const SlideoutPanel = ({ ...props }) => {
  // console.log('SlideoutPanel()')
  // Generic store value setter.
  const setStoreValues = useStore(
    state => state.setStoreValues,
  )
  const slideoutPanel = useStore(
    state => state.slideoutPanel,
  )

  const handleClose = () => {
    setStoreValues({
      slideoutPanel: { ...slideoutPanel, active: false },
    })
  }

  const classes = useStyles()

  return (
    <>
      <div
        className={clsx('panel-slideout', classes.root, {
          [classes.active]: slideoutPanel.active,
        })}
      >
        <IconButton
          onClick={handleClose}
          className={clsx(classes.button)}
        >
          <CloseIcon />
        </IconButton>
        {slideoutPanel.panel === 'tract' && <TractPanel />}
        {slideoutPanel.panel === 'faq' && <FaqPanel />}
      </div>

      <Modal
        className={clsx(classes.modal)}
        open={slideoutPanel.active}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={slideoutPanel.active}>
          <div className={classes.modalContent}>
            <IconButton
              onClick={handleClose}
              className={clsx(classes.button)}
            >
              <CloseIcon />
            </IconButton>
            {slideoutPanel.panel === 'tract' && (
              <TractPanel />
            )}
            {slideoutPanel.panel === 'faq' && <FaqPanel />}
          </div>
        </Fade>
      </Modal>
    </>
  )
}

SlideoutPanel.propTypes = {}

SlideoutPanel.defaultProps = {}

export default SlideoutPanel
