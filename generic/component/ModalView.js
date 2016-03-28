import React, {
  Component,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import * as Const from '../Const';

export default class ModalView extends Component {

  //IMPROVE: to be customizable with provided Component, e.g. CalendarPicker
  //static deviceHeight = Dimensions.get('window').height;
  static defaultProps = {
    content: {
      text: '请求处理中...',
    },
  };
  static propTypes = {
    content: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.string]),
    style: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array]),
    textStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array]),
    closeModal: React.PropTypes.func,
  };

  //---生命周期方法------
  componentDidMount() {
  }
  componentWillUnmount() {
  }

  //---Renderings------
  render() {
    return (
      <View style={styles.container}>
      {/*<Animated.View style={[styles.container, {transform: [{translateY: this.state.offset}]}]}>*/}
        <View style={[Const.STYLES.Gap, {flex: 5}]} />
        <View style={[styles.content, this.props.style]}>
          <View style={[Const.STYLES.Gap, {flex: 1}]} />
          <Text style={[styles.contentText, this.props.textStyle, {flex: 8}]}>
            {this.props.content instanceof Object ? this.props.content.text : this.props.content.toString()}
          </Text>
          <View style={[Const.STYLES.Gap, {flex: 1}]} />
        </View>
        <View style={[Const.STYLES.Gap, {flex: 5}]} />
      {/*</Animated.View>*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderColor: 'rgba(0, 0, 0, 0.8)',
    borderWidth: 1,
    borderRadius: 8,
  },
  contentText: {
    padding: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 1,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: {width: 5, height: 5},
  },
});
