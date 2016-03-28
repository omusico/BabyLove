import React, {
  Alert,
  Component,
  Picker,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';


export default class Test extends Component {

  static defaultProps = {
    testdata: {
      text: 'default',
    },
  };
  static propTypes = {
    testdata: React.PropTypes.object,
  };

  constructor(props) {
    super(props);   //ES6，先有父类实例、再构建子类this
    this.state = {
      testdata: props.testdata,
      pickerData: null,
    };
  }

  //---生命周期方法------
  componentDidMount() {
  }
  componentWillUnmount() {
  }

  //---自定义方法------
  onPickerValueChanged = (value) => {
    this.setState({pickerData: value});
  };

  handleTest = () => {
    Alert.alert('', 'handelTest');
    this.props.testdata.text = 'Changed!';
  };

  //---Renderings------
  render() {
    const testdata = this.state.testdata;
    const pickerData = this.state.pickerData;
    return (
      <View style={styles.container}>
        <Text style={styles.labelText}>{testdata.text}</Text>
        <Picker style={styles.excretaAmountPicker}
          selectedValue={pickerData}
          onValueChange={this.onPickerValueChanged}>
          <Picker.Item key="AAA" value="AAA" label="AAA" />
          <Picker.Item key="BBB" value="BBB" label="BBB" />
          <Picker.Item key="CCC" value="CCC" label="CCC" />
        </Picker>
        <TouchableOpacity
          style={styles.button}
          onPress={this.handleTest}>
          <Text style={styles.buttonText}>TEST</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  button: {
    height: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#48BBEC',
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: '#FCFCFC',
    alignSelf: 'center',
  },
});
