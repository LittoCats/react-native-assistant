'use strict';


import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';

import _ from 'lodash'

class TabItem extends Component {
  static propTypes = {
    ... View.propTypes,
    title: React.PropTypes.element.isRequired,
    selectedTitle: React.PropTypes.element,
    icon: React.PropTypes.element.isRequired,
    selectedIcon: React.PropTypes.element,
    onSelected: React.PropTypes.func,
    onDeselected: React.PropTypes.func,
  }
  constructor(props) {
    super(props);
  
    this.state = {isSelected: false};
  }
  render() {
    return (
      <TouchableWithoutFeedback style={[this.props.style, styles.no_padding]} onPress={e=>this.props.onSelected()}>
      <View style={[this.props.style, styles.no_margin]}>
        <View style={styles.item_icon}>{this.state.isSelected && this.props.selectedIcon ? this.props.selectedIcon : this.props.icon}</View>
        <View style={styles.item_title}>{this.state.isSelected && this.props.selectedTitle ? this.props.selectedTitle : this.props.title}</View>
      </View>
      </TouchableWithoutFeedback>
    );
  }
}

class TabBar extends Component {
  static propTypes = {
    ... View.propsTypes,
    defaultSelectedItemIndex: React.PropTypes.number
  };
  static defaultProps = {
    defaultSelectedItemIndex: 0
  }
  static TabItem = TabItem;

  constructor(props) {
    super(props);

    this.state = {
      currentSelectedItemIndex: this.props.defaultSelectedItemIndex,
      itemsMaxCount: 0,
      itemWidth: 0,
      itemHeight: 0
    };
  }
  componentDidMount() {
    setTimeout(e=>{this.selecteItemAtIndex(this.state.currentSelectedItemIndex)}, 100)
  }
  render() {
    return (
      <View style={[styles.root, this.props.style, styles.root_tail, styles.no_padding]}>
        <ScrollView 
          horizontal
          pagingEnabled
          scrollEnabled={this.props.children.length > this.state.itemsMaxCount}
          onLayout={e=>{
            var layout = e.nativeEvent.layout;
            if (StyleSheet.hairlineWidth >= Math.abs(this.state.itemsMaxWidth - layout.width) ) return;
            var itemHeight = layout.height;
            var itemsMaxCount = Math.min(Math.floor(layout.width/itemHeight), Math.min(this.props.children.length, 5));
            var itemWidth = layout.width/itemsMaxCount;
            this.setState({
              ... this.state,
              itemsMaxCount,
              itemWidth,
              itemHeight
            });
          }}
        >{
          _.each([... this.props.children], (child, index, children)=>{
            children[index] = <TabItem 
              {... child.props}
              style={[child.props.style, styles.item, styles.no_padding, {width: this.state.itemWidth, height: this.state.itemHeight}]}
              key={index}
              ref={`TabItem${index}`}
              onSelected={e=>{
                if (index === this.state.currentSelectedItemIndex) return;
                this.selecteItemAtIndex(index);
                if (child.props.onSelected) child.props.onSelected();
              }}
            />
          })
        }</ScrollView>
      </View>
    );
  }

  // 
  selecteItemAtIndex(index) {
    if (index != this.state.currentSelectedItemIndex) {
      // deselected current item
      var item = this.refs[`TabItem${this.state.currentSelectedItemIndex}`];
      if (item) { 
        item.setState({... item.state, isSelected: false});
        if (item.props.onDeselected) item.props.onDeselected();
      }
    }
    this.state.currentSelectedItemIndex = index;
    var item = this.refs[`TabItem${this.state.currentSelectedItemIndex}`];
    if (item) {
      item.setState({... item.state, isSelected: true});
    }
  }
}



const styles = StyleSheet.create({
  no_padding: {
    padding: 0,
    paddingVertical: 0,
    paddingHorizontal: 0
  },
  no_margin: {
    margin: 0,
    marginVertical: 0,
    marginHorizontal: 0
  },
  root: {
    backgroundColor: '#F6F6F6',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#00000022'
  },
  root_tail: {
    height: 49
  },
  item: {
    alignItems: 'center'
  },
  item_icon: {
    flex: 1,
  },
  item_title: {

  }
});


export default TabBar;