import create from 'zustand'
import i18n from '@pureartisan/simple-i18n'
import { FlyToInterpolator } from 'react-map-gl'
import WebMercatorViewport from 'viewport-mercator-project'
import * as ease from 'd3-ease'
import merge from 'deepmerge'

import { langSet } from './../../../constants/lang'

import {
  DEFAULT_VIEWPORT,
  DEFAULT_VIEW,
  DEFAULT_ACTIVE_SHAPE,
  DEFAULT_ACTIVE_YEAR,
  DEFAULT_LOAD_YEARS,
  DEFAULT_ACTIVE_POINTS,
  DEFAULT_METRIC,
  DEFAULT_NORM,
  DEFAULT_DATA_VERSION,
  OPTIONS_NORM,
} from './../../../constants/map'

const useStore = create((set, get) => ({
  // Set any store values by passing in an object of values to merge.
  setStoreValues: obj => {
    set({ ...obj })
  },
  // Store browser info.
  browser: null,
  // Is the browser supported?
  unsupportedBrowser: false,
  // Track loading of remote data files.
  allDataLoaded: false,
  // Percent loaded for remote data files.
  dataLoadedPercent: 0,
  // Error flag for loading failure.
  dataLoaderFailed: false,
  // JSON files loaded from remote.
  remoteJson: {},
  setRemoteJson: json =>
    set(state => ({
      remoteJson: { ...state.remoteJson, ...json },
    })),
  // Language packs handling.
  // Active language
  activeLang: `en_US`,
  // Counter for lang pack updates.
  langUpdates: 0,
  incrementLangUpdates: () => {
    set(state => ({
      langUpdates: state.langUpdates + 1,
    }))
  },
  // Languages store.
  langs: {
    en_US: langSet.en_US,
  },
  // Get a language.
  getLang: loc => {
    return get().langs[loc]
  },
  // Merge existing language strings with any new ones.
  setLang: obj => {
    // console.log('setLang')
    set({ langs: merge(get().langs, obj) })
  },
  // Routing.
  activeView: DEFAULT_VIEW,
  // ID of the tract that's been clicked.
  activeShape: DEFAULT_ACTIVE_SHAPE,
  activeYear: DEFAULT_ACTIVE_YEAR,
  // demographic dot density layers
  activePointLayers: DEFAULT_ACTIVE_POINTS,
  // Which years of tilesets to load.
  loadYears: DEFAULT_LOAD_YEARS,
  activeMetric: DEFAULT_METRIC,
  // Norming info
  optionsNorm: OPTIONS_NORM,
  activeNorm: DEFAULT_NORM,
  // Version of data to load, can be passed in from hash.
  dataVersion: DEFAULT_DATA_VERSION,
  // Flag to trigger download of data dependent upon hash.
  initialStateSetFromHash: false,
  // Map sources, stored so we don't have to construct it over and over.
  mapSources: false,
  // Stores the ID of the tract displayed in the slideout panel.
  slideoutTract: 0,
  // Stores the feature of the tract displayed in the slideout panel.
  slideoutFeature: null,
  // Map center tract, metro, and state tracking
  centerTract: 0,
  centerMetro: 0,
  centerState: 0,
  // Hovered tract.
  hoveredTract: 0,
  // Activate a tract after flyTo
  flyToTrack: false,
  // Is the user currently interacting with the map?
  mapInteractionState: false,
  // Array of previously hovered tracts.
  hoveredTractArr: [],
  pushHoveredTract: tract => {
    // const updatedTract = get()
    //   .hoveredTractArr.slice()
    //   .push(tract)
    set(state => ({
      hoveredTractArr: [...get().hoveredTractArr, tract],
    }))
  },
  // Hovered feature.
  hoveredFeature: null,
  // Mouse XY.
  mouseXY: [0, 0],
  // Mouse coords.
  coords: [0, 0],
  setCoords: coords => set({ coords }),
  // Map dimensions, [width, height]
  mapSize: [],
  // Window innerHeight
  windowInnerHeight: 0,
  // Tracks whether a control is hovered.
  controlHovered: false,
  // Settings pertaining to viewport state.
  viewport: { ...DEFAULT_VIEWPORT },
  resetViewport: { ...DEFAULT_VIEWPORT },
  setViewport: viewport =>
    set(state => ({
      viewport: { ...state.viewport, ...viewport },
    })),
  flyToBounds: null,
  flyToFeature: null,
  flyToLatLon: null,
  flyToReset: null,
  flyToState: null,
  slideoutPanel: {
    active: false,
    panel: 'tract', // 'tract' or 'share' or 'faq'
  },
  // Popover for share button in control panel
  showSharePopover: false,
  legendPanel: {
    active: false,
    open: false,
    glow: 0,
  },
  legendControl: {
    active: false,
  },
  // Counter for source reloads
  sourceReloaded: 0,
  incrementSourceReloaded: () => {
    set(state => ({
      sourceReloaded: state.sourceReloaded + 1,
    }))
  },
  // Notifications tracking
  notifications: {
    n: 0,
    s: 0,
    m: 0,
  },
  updateNotifications: norm => {
    // console.log('updateNotifications, ', norm)
    const nots = get().notifications
    nots[norm] = nots[norm] + 1
    console.log('nots, ', nots)
    set({ notifications: nots })
  },
  // Prompts to update norming when incremented.
  // Incremented when some auto-norming action has happened.
  doUpdateNorming: false,
  // Have strings from cms been loaded.
  cmsStringsLoaded: false,
  shareLinkModal: false,
  // Whether or not to display slideout menu.
  showMenu: false,
  toggleShowMenu: () => {
    set(state => ({ showMenu: !state.showMenu }))
  },
  shareHash: null,
  breakpoint: null,
  browserWidth: null,
  showIntroModal: false,
  showPanelModal: false,
  enableTour: true, // Set this true to show the launch tour button in intro modal.
  showMapModal: false,
  // Display tooltip, boolean
  displayPopup: true,
  // Position of tooltips in control panel, changes with breakpoint
  buttonTooltipPosition: 'auto',
  showMobileLegend: false,
  interactionsMobile: false,
  runTour: false,
  tourStepIndex: 0,
  // Set up for tour to run.
  setUpTour: () => {
    set(state => ({
      // Return view to map.
      activeView: 'explorer',
      // Reset metric.
      activeMetric: DEFAULT_METRIC,
      // Reset quintiles.
      activeQuintiles: [1, 1, 1, 1, 1],
      // Close the panel.
      slideoutPanel: {
        active: false,
        panel: '',
      },
      // Active tab in slideout panel.
      activeFilterTab: state.defaultFilterTab,
      // Close modal if displayed.
      showPanelModal: false,
      // Return tour to 0.
      tourStepIndex: 0,
      // Run the tour.
      runTour: true,
    }))
  },
  isTouchScreen: false,
  // Do not track events before map is loaded, as these
  // are state settings based on hash and not user interactions.
  doTrackEvents: false,
  // Counters for events that don't have clear state indicators.
  eventShareTwitter: 0,
  eventShareFacebook: 0,
  eventShareEmail: 0,
  eventShareLink: 0,
  eventShareEmbed: 0,
  eventMapReset: 0,
  eventMapCapture: 0,
  eventSchoolSearch: 0,
  eventSchoolPage: 0,
  eventLaunchTour: 0,
  eventCloseTour: 0,
  eventCloseTourStep: null,
  incrementLaunchTour: () => {
    set(state => ({
      eventLaunchTour: state.eventLaunchTour + 1,
    }))
  },
  incrementCloseTour: () => {
    set(state => ({
      eventCloseTour: state.eventCloseTour + 1,
      eventCloseTourStep: state.tourStepIndex,
    }))
  },
  // Not counters.
  eventError: 0,
}))
const api = useStore

export default useStore
