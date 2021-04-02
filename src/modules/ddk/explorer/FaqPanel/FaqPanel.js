import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import {
  Button,
  Collapse,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

// Styles for this component.
const styles = makeStyles(theme => ({
  root: {
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
    'font-family': 'Fira Sans',
    backgroundColor:
      theme.extras.variables.colors.lightLightGray,
  },
  container: {
    padding: '50px 16px 0px',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    boxSizing: 'border-box',
  },
  btn: {
    boxShadow: 'none',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: '0px',
    margin: '7px 0',
    '&.Mui-expanded': {
      margin: '7px 0',
    },
    '&:before': {
      display: 'none',
    },
    // '&:nth-child(2)': {
    //   margin: '7px 0px',
    // },
    // '&::before': {
    //   display: 'none',
    // },
    // '&.Mui-expanded': {
    //   margin: '7px 0px',
    // },
  },
  title: {
    fontSize: '16px',
    margin: '12px 0px',
    lineHeight: '24px',
    letterSpacing: '0.25px',
    fontWeight: 600,
    // '&.Mui-expanded': {
    //   margin: '12px 0px',
    // },
  },
  titleContainer: {
    minHeight: '48px',
    '&.Mui-expanded': {
      minHeight: '48px',
    },
  },
  caret: {
    width: '30px',
    height: '30px',
    color: theme.extras.variables.colors.ddkRed,
  },
  content: {
    fontSize: '14px',
    lineHeight: '21px',
    letterSpacing: '0.25px',
    borderTop: `1px solid ${theme.extras.variables.colors.lightLightGray}`,
    padding: '16px 16px',
    color: theme.extras.variables.colors.lightGray,
    '& svg': {
      width: '16px',
      height: '16px',
      marginBottom: '-2px',
    },
  },
  all: {
    float: 'right',
    color: theme.extras.variables.colors.ddkRed,
    fontSize: '14px',
  },
  allContainer: {
    position: 'relative',
    height: '35px',
    marginBottom: '6px',
  },
  faqContainer: {
    overflowY: 'auto',
    overflowX: 'hidden',
    width: '100%',
    flexGrow: '1',
    paddingBottom: '1.2rem',
  },
  h3: {
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: '20px',
    letterSpacing: '0.25px',
  },
}))

const FaqPanel = () => {
  const faq = i18n.translate('FAQ')
  const [expanded, setExpanded] = useState(() => {
    var data = []
    i18n
      .translate('FAQ', { returnObjects: true })
      .forEach(el => {
        data.push(false)
      })
    return data
  })

  const handleEvent = (val, e) => {
    if (typeof val === 'number') {
      var data = []
      expanded.forEach(el => {
        data.push(el)
      })
      data[val] = !data[val]
      setExpanded(data)
    }
    if (val === 'openAll') {
      var data = []
      expanded.forEach(el => {
        data.push(true)
      })
      setExpanded(data)
    }
    if (val === 'hideAll') {
      var data = []
      expanded.forEach(el => {
        data.push(false)
      })
      setExpanded(data)
    }
  }

  const classes = styles()

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <h3 className={clsx(classes.h3)}>
          {i18n.translate(`PANEL_FAQ_TITLE`)}
        </h3>
        <div className={classes.allContainer}>
          <Button
            onClick={e => {
              if (expanded.every(el => el === true)) {
                handleEvent('hideAll', e)
              } else {
                handleEvent('openAll', e)
              }
            }}
            className={classes.all}
          >
            {expanded.every(el => el === true)
              ? i18n.translate(`BTN_HIDE_ALL`)
              : i18n.translate(`BTN_SHOW_ALL`)}
          </Button>
        </div>
        <div className={classes.faqContainer}>
          {i18n
            .translate('FAQ', { returnObjects: true })
            .map((el, i) => {
              return (
                <Accordion
                  expanded={expanded[i]}
                  onChange={e => {
                    handleEvent(i, e)
                  }}
                  classes={{ root: classes.btn }}
                  square={true}
                  key={`faq-accordion-${i}`}
                >
                  <AccordionSummary
                    classes={{
                      root: classes.titleContainer,
                      content: classes.title,
                    }}
                    expandIcon={
                      <ExpandMoreIcon
                        className={classes.caret}
                      />
                    }
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <div>{el.title}</div>
                  </AccordionSummary>
                  <AccordionDetails
                    classes={{ root: classes.content }}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: el.content,
                      }}
                    ></div>
                  </AccordionDetails>
                </Accordion>
              )
            })}
        </div>
      </div>
    </div>
  )
}

export default FaqPanel
