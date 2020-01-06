/*
 * @Description:
 * @Author: 胡阳阳
 * @Date: 2019-10-28 19:58:23
 * @LastEditTime: 2019-12-05 08:05:56
 * @LastEditors: 胡阳阳
 */
// import React from 'react';
// import ReactDOM from 'react-dom';
// import './search.css';
// import commonFunc from '../common/common';

const React = require("react")


require("./search.css")
// commonFunc();
class Search extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   Text: null,
    // };
  }
  render() {
    return (
      // <div>
      //   {
      //           this.state.Text ? <Text /> : null
      //       }
      //   <div onClick={this.loadComponent.bind(this)}>search2</div>
      // </div>
      <div>search2</div>
    );
  }
}

// ReactDOM.render(
//   <Search />,
//   document.getElementById('root'),
// );

module.exports = <Search/>;