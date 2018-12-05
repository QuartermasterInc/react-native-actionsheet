import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableHighlight,
  Animated,
  ScrollView
} from 'react-native'
import styles, { btnStyle, sheetStyle, hairlineWidth } from './styles'

const TITLE_H = 48
const MESSAGE_H = 48
const BOTTOM_MARGIN = 10
const BUTTON_H = 58 + hairlineWidth
const WARN_COLOR = '#ff3b30'
const MAX_HEIGHT = Dimensions.get('window').height * 0.7

class ActionSheet extends Component {
  constructor (props) {
    super(props)
    this.scrollEnabled = false
    this.translateY = this._calculateHeight(props)
    this.state = {
      visible: false,
      sheetAnim: new Animated.Value(this.translateY)
    }
    this._cancel = this._cancel.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    this.translateY = this._calculateHeight(nextProps)
  }

  show () {
    this.setState({ visible: true })
    this._showSheet()
  }

  hide (index) {
    this._hideSheet(() => {
      this.setState({ visible: false })
      this.props.onPress(index)
    })
  }

  _cancel () {
    // const { cancelButtonIndex } = this.props
    // 保持和 ActionSheetIOS 一致，
    // 未设置 cancelButtonIndex 时，点击背景不隐藏 ActionSheet
    // if (cancelButtonIndex > -1) {
    // this.hide(cancelButtonIndex)
    this.hide()
    // }
  }

  _showSheet () {
    Animated.timing(this.state.sheetAnim, {
      toValue: 0,
      duration: 250
    }).start()
  }

  _hideSheet (callback) {
    Animated.timing(this.state.sheetAnim, {
      toValue: this.translateY,
      duration: 150
    }).start(callback || function () {})
  }

  _calculateHeight (props) {
    let count = props.options.length
    let height
    if (this.props.cancelButtonIndex) {
      height = BUTTON_H * (count - 1)
    } else {
      height = BUTTON_H * count
    }
    if (props.title) height += TITLE_H
    if (props.message) height += MESSAGE_H
    height += BOTTOM_MARGIN
    if (height > MAX_HEIGHT) {
      this.scrollEnabled = true
      return MAX_HEIGHT
    } else {
      this.scrollEnabled = false
      return height
    }
  }

  _renderTitle () {
    const title = this.props.title

    if (!title) {
      return null
    }

    if (React.isValidElement(title)) {
      return <View style={sheetStyle.title}>{title}</View>
    }

    return (
      <View style={sheetStyle.title}>
        <Text style={sheetStyle.titleText}>{title}</Text>
      </View>
    )
  }

  _renderMessage () {
    const message = this.props.message

    if (!message) {
      return null
    }

    if (React.isValidElement(message)) {
      return <View style={sheetStyle.message}>{message}</View>
    }

    return (
      <View style={sheetStyle.message}>
        <Text style={sheetStyle.titleText}>{message}</Text>
      </View>
    )
  }

  _renderCancelButton () {
    // let { options, cancelButtonIndex, tintColor } = this.props
    // if (cancelButtonIndex > -1 && options[cancelButtonIndex]) {
    //   return (
    //     <TouchableHighlight
    //       activeOpacity={1}
    //       underlayColor="#f4f4f4"
    //       style={[btnStyle.wrapper, { marginTop: 6 }]}
    //       onPress={this._cancel}
    //     >
    //       <Text
    //         style={[btnStyle.title, { fontWeight: '700', color: tintColor }]}
    //       >
    //         {options[cancelButtonIndex]}
    //       </Text>
    //     </TouchableHighlight>
    //   )
    // } else {
    return null
    // }
  }

  _createButton (option, fontColor, iconColor, index, style) {
    let titleNode = (
      <Text style={[btnStyle.title, { color: fontColor }]}>{option.text}</Text>
    )
    let iconNode = null
    if (option.icon) {
      iconNode = (
        <View style={btnStyle.iconContainer}>
          <Text style={[btnStyle.icon, { color: iconColor, fontFamily: this.props.iconFont }]}>
            {option.icon}
          </Text>
        </View>
      )
    }
    return (
      <TouchableHighlight
        key={index}
        activeOpacity={1}
        underlayColor="#f4f4f4"
        style={[btnStyle.wrapper, style || {}]}
        onPress={this.hide.bind(this, index)}
      >
        <View style={[btnStyle.flex, style || {}]}>
          {iconNode}
          {titleNode}
        </View>
      </TouchableHighlight>
    )
  }

  _renderOptions () {
    let {
      options,
      tintColor,
      iconColor,
      cancelButtonIndex,
      destructiveButtonIndex
    } = this.props
    return options.map((option, index) => {
      let fontColor = destructiveButtonIndex === index ? WARN_COLOR : tintColor
      let iconColorFinal = destructiveButtonIndex === index ? WARN_COLOR : iconColor
      return index === cancelButtonIndex
        ? null
        : this._createButton(option, fontColor, iconColorFinal, index)
    })
  }

  render () {
    const { visible, sheetAnim } = this.state
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="none"
        onRequestClose={this._cancel}
      >
        <View style={sheetStyle.wrapper}>
          <Text style={styles.overlay} onPress={this._cancel} />
          <Animated.View
            style={[
              sheetStyle.bd,
              {
                height: this.translateY,
                transform: [{ translateY: sheetAnim }]
              }
            ]}
          >
            {this._renderTitle()}
            {this._renderMessage()}
            <ScrollView
              scrollEnabled={this.scrollEnabled}
              contentContainerStyle={sheetStyle.options}
            >
              {this._renderOptions()}
            </ScrollView>
            {this._renderCancelButton()}
          </Animated.View>
        </View>
      </Modal>
    )
  }
}

ActionSheet.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      icon: PropTypes.string
    })
  ).isRequired,
  tintColor: PropTypes.string,
  cancelButtonIndex: PropTypes.number,
  destructiveButtonIndex: PropTypes.number,
  onPress: PropTypes.func
  iconFont: PropTypes.string.isRequired,
}

ActionSheet.defaultProps = {
  tintColor: '#888',
  iconColor: '#636363',
  onPress: () => {}
}

export default ActionSheet
