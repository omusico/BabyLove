
const coldColorA = '#7EA6E9';
const coolColorA = '#6F8A6E';
const coolColorA_brighter = '#BDBE95';
const warmColorA = '#EE8966';
const warmColorA_brighter = '#ECCA80';
const warmColorB_brighter = '#F9FAD4';
const hotColorA = '#91C85A';
const darkColor = '#CCCCCC';
const darkestColor = coolColorA;

export const Theme = Object.freeze({
  mainBkgColor: coolColorA,
  itemBkgColor: coolColorA_brighter,
  itemCellBkgColor: warmColorB_brighter,
  labelTextColor: coolColorA_brighter,
  labelTextColor$disabled: darkColor,
  contentTextColor: darkestColor,
  labelTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: this.labelTextColor,
  },
  itemCellText: {
    fontSize: 20,
    color: this.contentTextColor,
  },
  buttonBkgColor: hotColorA,
  buttonTextColor: warmColorB_brighter,
  buttonText: {
    fontSize: 20,
    color: this.buttonTextColor,
  },
  //Theme specific resources
  IMAGES: {
    ic_add: require('./images/ic_add.png'),
  },
});

