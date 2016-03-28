
//const coldColorA = '';
const coolColorA = '#505977';
const coolColorA_brighter = '#50A9C9';
//const warmColorA = '';
//const warmColorA_brighter = '';
const warmColorB_brighter = '#F4F4F4';
//const hotColorA = '';
const darkColor = '#CCCCCC';
const darkestColor = '#0A0A0A';

export const Theme = Object.freeze({
  mainBkgColor: coolColorA,
  itemBkgColor: coolColorA_brighter,
  itemCellBkgColor: warmColorB_brighter,
  labelTextColor: warmColorB_brighter,
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
  buttonBkgColor: coolColorA_brighter,
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

