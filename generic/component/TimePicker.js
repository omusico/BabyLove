import React, {
  Component,
  Picker,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default class TimePicker extends Component {

  static defaultProps = {
    minuteInterval: 1,
    loop: false,
    style: null,
    textStyle: null,
  };
  static propTypes = {
    selectedHour: React.PropTypes.number.isRequired,
    selectedMinute: React.PropTypes.number.isRequired,
    onValueChange: React.PropTypes.func.isRequired,
    minuteInterval: React.PropTypes.number,
    loop: React.PropTypes.bool,
    style: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array]),
    textStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array]),
  };

  constructor(props) {
    super(props);

    for (let j = 0; j < 24 * (props.loop ? 20 : 1); j++) {
      this._hours.push(j);
    }
    for (let j = 0; j < 60 * (props.loop ? 20 : 1); j += this._getInterval(props.minuteInterval)) {
      this._minutes.push(j);
    }

    this.state = {
      selectedHour: this._getHourIndex(props.selectedHour),
      selectedMinute: this._getMinuteIndex(props.selectedMinute, props.minuteInterval),
    };
  }

  _hours = [];
  _minutes = [];

  _getInterval = (interval) => { //<--此函数何意??
    /*
    for (const i of [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30]) {
      if (i === interval) {
        return interval;
      }
    }
    return 1;*/
    const INTERVALS = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30];
    return INTERVALS.indexOf(interval) === -1 ? 1 : interval;
  };

  _getHourIndex = (h) =>
    (this.props.loop ? (this._hours.length / 2) : 0) + h;

  _getMinuteIndex = (m, interval) =>
    (this.props.loop ? (this._minutes.length / 2 * this._getInterval(interval)) : 0)
    //  + (m % this._getInterval(interval) === 0 ? m : 0);
      + this.nearestIntVal(m, this._getInterval(interval)); //IMPROVE:整除

  _getHourValue = (h) => h % 24;

  _getMinuteValue = (m) => m % 60;

  _onValueChangeCallback = () => {
    this.props.onValueChange(this._getHourValue(this.state.selectedHour),
      this._getMinuteValue(this.state.selectedMinute));
  };

  _setHour = (hour) => {
    this.setState({selectedHour: hour});
    this._onValueChangeCallback();
  };

  _setMinute = (minute) => {
    this.setState({selectedMinute: minute});
    this._onValueChangeCallback();
  };

  nearestIntVal(origin, base) {
    return origin % base === 0 ? origin : (Math.floor(origin / base) * base);
  }

  render() {
    const hours = this._hours.map(hour =>
      <Picker.Item key={hour} value={hour} label={this._getHourValue(hour).toString()} />);

    const minutes = this._minutes.map(minute =>
      <Picker.Item key={minute} value={minute} label={this._getMinuteValue(minute).toString()} />);

    return (
      <View style={[styles.container, this.props.style]}>
        <Picker style={[styles.picker, this.props.textStyle]}
          selectedValue={this.state.selectedHour}
          onValueChange={this._setHour}>
          {hours}
        </Picker>
        <Text style={this.props.textStyle}>:</Text>
        <Picker style={[styles.picker, this.props.textStyle]}
          selectedValue={this.state.selectedMinute}
          onValueChange={this._setMinute}>
          {minutes}
        </Picker>
      </View>
    );
  }
}

const TEXTWIDTH = 50;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    /*justifyContent: 'center',*/
    alignItems: 'center',
    width: TEXTWIDTH * 2 + 10,
    height: TEXTWIDTH,
  },
  picker: {
    width: TEXTWIDTH,
  },
});
