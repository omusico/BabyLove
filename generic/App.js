import React, {
  AppRegistry,
  BackAndroid,
  Component,
  Navigator,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import * as Const from './Const';
import * as Util from './Util';
import ModalView from './component/ModalView';
import ActivityListView from './view/ActivityListView';
//import Test from './test/Test';

const DEMO_DATE = '2016-01-15'; //default = b-day of my son :)
const DEMO_BABY_ID = 100;

const NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {return null;},
  RightButton(route, navigator, index, navState) {return null;},
  Title(route, navigator, index, navState) {
    return (
      <Text style={[styles.navBarText, styles.navBarTitleText]}>
        {route.title}
      </Text>
    );
  },
};

class BabyLove extends Component {

  constructor(props) {
    super(props);   //ES6，先有父类实例、再构建子类this
    this.INITIAL_ROUTE = {
      //name: 'Test', component: Test
      name: 'ActivityListView',
      component: ActivityListView,
      params: {
        date: Const.DEMO ? Util.string2date(DEMO_DATE) : new Date(),
        baby_id: Const.DEMO ? DEMO_BABY_ID : DEMO_BABY_ID, /*TODO: User Management*/
      },
    };
    this.state = {
      modalShow: false,
      modalContent: null,
    };
  }

  //---生命周期方法------
  componentWillMount() {
    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }
  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }

  //---自定义方法------
  onBackAndroid = () => {
    const nav = this.refs.navigator;
    const routers = nav.getCurrentRoutes();
    if (this.state.modalShow) { //modal window is showing
      //IMPROVE: fire cancel event of ModalView
      this.closeModal();
      return true;
    }
    if (routers.length > 1) {
      nav.pop();
      return true;
    }
    return false;
  };

  openModal = (content) => {
    this.setState({
      modalShow: true,
      modalContent: content,
    });
  };
  closeModal = () => {
    this.setState({modalShow: false});
  };

  configureScene = route => {
    if (route.configure) {
      return route.configure; //node_modules\react-native\Libraries\CustomComponents\Navigator\NavigatorSceneConfigs.js
    }
    return Navigator.SceneConfigs.FadeAndroid; //FloatFromBottomAndroid
  };

  renderScene = (route, navigator) => {
    Util.trace('index.js Navigator renderScene()');
    //IMPROVE: use react-router, <PageContainer>
    const NavComponent = route.component;
    return (
      <NavComponent {...route.params} navigator={navigator}
        openModal={this.openModal} closeModal={this.closeModal} />
    );
  };

  //---Renderings------
  render() {
    return (
      <View style={styles.container}>
        <Navigator
          ref="navigator"
          initialRoute={this.INITIAL_ROUTE}
          configureScene={this.configureScene}
          renderScene={this.renderScene}
          /*
          navigationBar={
            <Navigator.NavigationBar
              routeMapper={NavigationBarRouteMapper}
              style={styles.navBar} />
          }*/
        />
        {this.state.modalShow ?
          <ModalView closeModal={this.closeModal} content={this.state.modalContent} /> : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

AppRegistry.registerComponent('BabyLove', () => BabyLove);
