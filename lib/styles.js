import { StyleSheet, Dimensions, StatusBar } from 'react-native'

export const hairlineWidth = StyleSheet.hairlineWidth

export default StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.4,
    backgroundColor: '#000'
  }
})

export const sheetStyle = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row'
  },
  bd: {
    flex: 1,
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
    paddingBottom: 10
  },
  title: {
    height: 48,
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: '#f8f8f8'
  },
  message: {
    height: 48,
    paddingBottom: 10,
    paddingHorizontal: 16,
    justifyContent: 'center'
  },
  titleText: {
    color: '#8f8f8f',
    fontSize: 16
  }
})

export const btnStyle = StyleSheet.create({
  wrapper: {
    // backgroundColor: '#fff'
  },
  flex: {
    height: 58,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row'
  },
  title: {
    fontSize: 16
  },
  icon: {
    fontFamily: 'qm-icon',
    fontSize: 20
  },
  iconContainer: {
    width: 22,
    alignItems: 'center',
    marginRight: 16
  }
})
