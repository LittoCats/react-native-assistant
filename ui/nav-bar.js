'use strict';

import React, { Component } from 'react';

import {
  Platform,
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback
} from 'react-native';
import _ from 'lodash'
import pstyles from '../private/styles'
import Color from '../color'

class BackItem extends Component {
  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
    color: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number])
  }
  constructor(props) {
    super(props);
  
    this.state = {
      isHighlighted: false
    };
  }

  render() {
    var color = this.state.isHighlighted ? Color.light(this.props.color) : this.props.color;
    return (
      <TouchableWithoutFeedback 
        onPressIn={e=> {
          this.setState({... this.state, isHighlighted: true});
        }}
        onPressOut={e=> {
          this.setState({... this.state, isHighlighted: false});
          this.props.navigator.pop();
        }}
      >
      <View style={[styles.default_back_item, {borderTopColor: color, borderLeftColor: color}]} />
      </TouchableWithoutFeedback>
    );
  }
}

class CalCentral extends Component {
  constructor(props) {
    super(props);
  
    this.state = {contentOffset: 0};
  }

  render() {
    var item = this.props.child;
    return (
      <View 
       style={styles.center_item}
       onLayout={e=>{
          var layout = e.nativeEvent.layout;
          if (this.state.layout === undefined || (Math.abs(this.state.layout.x - layout.x) > StyleSheet.hairlineWidth) || (Math.abs(this.state.layout.width - layout.width) > StyleSheet.hairlineWidth)) {
            calCentralOffset.call(this, {layout: layout});  
          }
        }}
      >
        <View 
          style={[styles.center_item_content, {marginLeft: this.state.contentOffset}]}
          onLayout={e=>{
            var layout = e.nativeEvent.layout;
            if (this.state.contentLayout === undefined || Math.abs(this.state.contentLayout.width - layout.width) > StyleSheet.hairlineWidth) {
              calCentralOffset.call(this, {contentLayout: layout});
            }
          }}
        >{this.props.child}</View>
      </View>
    );
  }
}

function calCentralOffset(info) {
  var state = {
    ... this.state,
    ... info
  }
  var parentLayout = this.props.parentLayout();
  if (!(parentLayout === undefined) && !(state.layout === undefined) && !(state.contentLayout === undefined)) {
    // 计算 offset
    var validOffset = state.layout.width - state.contentLayout.width;
    
    if (validOffset > 0) {
      var contentCenter = state.layout.x + state.contentLayout.x + state.contentLayout.width/2;
      state.contentOffset = parentLayout.width/2 - contentCenter;
      if (state.contentOffset < 0) {
        state.contentOffset = 0
      }else{
        state.contentOffset = Math.min(validOffset, state.contentOffset+1)
      }
    }
  }
  this.setState(state);
}

class NavBar extends Component {
  static propTypes = {
    ... View.propTypes,
    navigator: React.PropTypes.object,
    isRoot: React.PropTypes.bool, // 用于标识是否用于根视图，根视图中，ios 上需要移除 statusbar 占用的高度
    backItem: React.PropTypes.oneOfType([React.PropTypes.node, React.PropTypes.func, React.PropTypes.bool]),
    title: React.PropTypes.oneOfType([React.PropTypes.node, React.PropTypes.func, React.PropTypes.string]),
    rightItem: React.PropTypes.oneOfType([React.PropTypes.node, React.PropTypes.func]),
    tintColor: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number])
  }
  static defaultProps = {
    isRoot: true,
    tintColor: '#487EFB'
  }
  constructor(props) {
    super(props);
  
    this.state = {
      
    };
  }

  render() {
    var parentLayout = undefined;
    return (
      <View 
        style={[styles.root, this.props.style, styles.root_tail, pstyles.no_padding, pstyles.no_margin, this.props.isRoot && Platform.OS === 'ios' ? {height: 64, paddingTop: 20} : {height: 44}]} 
        onLayout={e=>{
          parentLayout = e.nativeEvent.layout;
          if (this.refs.central) calCentralOffset.call(this.refs.central);
        }}
      >
        <View style={styles.back_item}>
          {renderBackItem.call(this)}
        </View>
        <CalCentral ref='central' child={renderCentralItem.call(this)} parentLayout={e=> parentLayout}/>
        <View style={styles.right_item} children={renderRightItems.call(this)}>
        </View>
      </View>
    );
  }
}

function renderBackItem() {
  var backItem = this.props.backItem;
  if (backItem === undefined) backItem = !!this.props.navigator;
  
  if (_.isBoolean(backItem)) {
    return backItem ? <BackItem navigator={this.props.navigator} color={this.props.tintColor}/> : undefined;
  }
  if (_.isFunction(backItem)) return backItem();
  return backItem;
}

function renderCentralItem() {
  var central = this.props.title;
  if (_.isString(central)) {
    return <Text style={[styles.title, {color: this.props.tintColor}]} numberOfLines={1}>{this.props.title}</Text>
  }
  if (_.isFunction(central)) return central();
  return central;
}

function renderRightItems() {
  var rightItems = this.props.rightItem;
  if (_.isFunction(rightItems)) rightItems = rightItems();
  if (!_.isArray(rightItems)) rightItems = [rightItems];
  return rightItems;
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#FCFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#00000022'
  },
  root_tail: {
    flexDirection: 'row'
  },
  back_item: {
    flex: 0,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  default_back_item: {
    width: 13,
    height: 13,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    transform: [{
      rotateZ: '-45deg'
    }]
  },
  center_item: {
    flex: 1,
    justifyContent: 'center'
  },
  center_item_content: {
    alignSelf: 'flex-start'
  },
  right_item: {
    flex: 0,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginHorizontal: 8
  }
});


export default NavBar;