import React, {
  Component,
  StyleSheet,
  View,
} from 'react-native';

import CalendarPicker from 'react-native-calendar-picker';

export default class CalendarView extends Component {

  static defaultProps = {
    onDateChange: {},
  };
  static propTypes = {
    navigator: React.PropTypes.object,
    selectedDate: React.PropTypes.instanceOf(Date).isRequired,
    onDateChange: React.PropTypes.func,
  };

  static _this = null; //IMPROVE: 诡异问题导致_onDateChange()中使用this无效
                       //(不runtime error、但调试器中this.state却又是undefined)
  constructor(props) {
    super(props);   //ES6，先有父类实例、再构建子类this
    CalendarView._this = this;
    this.state = {
      prevYear: props.selectedDate.getYear(),
      prevMonth: props.selectedDate.getMonth() + 1, //1-based, whereas getMonth() is 0-based
    };
  }

  _onDateChange = (date: Date) => {
    const { navigator, onDateChange } = CalendarView._this.props;
    //[patch] flip through months/years will activate onDateChange()
    if (CalendarView._this.state.prevYear !== date.getYear()
        || CalendarView._this.state.prevMonth !== date.getMonth() + 1) {
      CalendarView._this.setState({
        prevYear: date.getYear(),
        prevMonth: date.getMonth() + 1,
      });
      return;
    }

    if (onDateChange) {
      onDateChange(date);
    }
    if (navigator) {
      navigator.pop();
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <CalendarPicker
          selectedDate={this.props.selectedDate}
          onDateChange={this._onDateChange} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
});
