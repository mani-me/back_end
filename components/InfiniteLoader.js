import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { InfiniteLoader, List } from 'react-virtualized';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import uuid from 'uuid';

import Rotate from './Rotate';
import { getSignedUriArray } from '../utils/queryString';
import { createUpdateSSOrder } from '../utils/shipStation';
import { updateUserColumn, updateOrderColumn, getGroupOrders } from '../utils/lambdaFunctions';

const ML_ROW_ITEM = 2;
const ROW_ITEM_WIDTH = 200;
const space = [0, 4, 8, 16, 32, 64, 128, 256, 512];

class Workbench extends React.Component {
  state = {
    showPortal: false,
    signedUriArray: [],
    latestKeys: [],
    email: '',
    measure: ''
  };
  openWorkbench = async () => {
    let leftFingers, leftThumb, rightFingers, rightThumb, side;
    const measure = this.props.content['userid'];
    const email = this.props.content['email'];
    const versionSide = this.props.content['versionSide'];
    const userObject = this.props.content;

    const { latestKeys, signedUriArray } = await getSignedUriArray(this.props.user, userObject); // user is adminIdentityId, measure is clientIdentityId
    console.log(signedUriArray);

    this.setState({ showPortal: true, signedUriArray, latestKeys, measure, email });
  };
  render() {
    return (
      <React.Fragment>
        <button style={this.props.itemStyle} onClick={this.openWorkbench}>
          Open Photogrammetry Workbench
        </button>
        {this.state.showPortal &&
          ReactDOM.createPortal(
            <Rotate
              onClick={() => this.setState({ showPortal: false })}
              openWorkbench={this.openWorkbench}
              {...this.state}
            />,
            document.getElementById('layout')
          )}
      </React.Fragment>
    );
  }
}

class SelectFitStatus extends React.PureComponent {
  state = {
    value: this.props.value,
    isAdmin: this.props.user == 'us-west-2:b1ee9228-ca88-40b3-a242-6fadb2fe9a9e' || this.props.user == 'us-west-2:95a2f104-1308-42e3-bb65-033c4f9a6de4'
  };
  onChange = ev => {
    if (!this.state.isAdmin) {
      const value = ev.target.value;
      if (value == 'fittingValidated') return;
    }
    if (this.state.value != 'fittingValidated' && ev.target.value == 'fittingValidated')
      this.checkGroupOrdersForSS();
    this.setState({ value: ev.target.value });
    updateUserColumn(this.props.userId, this.props.columnName, ev.target.value);
  };

  checkGroupOrdersForSS = async () => {
    // find grouporders with id not shipped.
    let userGroupOrders = await getGroupOrders(this.props.userId);
    // console.log(userGroupOrders.rows);
    userGroupOrders.rows.map(groupOrder => {
      // console.log(groupOrder.grouporderstatus);
      if (groupOrder.grouporderstatus != 'shipped') {
        this.createUpdateSSWrapper(groupOrder);
      }
    })
  }

  createUpdateSSWrapper = groupOrder => {
    // then in createUpdateSS... get data from this.props.userData and the passed grouporder and associated shipping address
    // from grouporder delimit address string
    const userData = this.props.userData;

    const date = new Date();
    const isoString = date.toISOString();
    const firstName = userData && userData.firstname ? userData.firstname : '';
    const lastName = userData && userData.lastname ? userData.lastname : '';
    const name = `${firstName} ${lastName}`;

    const addressArray = groupOrder.shippingaddress.split('|');
    const addressObject = {
      name,
      street1: addressArray[1],
      street2: addressArray[2],
      city: addressArray[3],
      state: addressArray[4],
      postalCode: addressArray[6],
      country: addressArray[5]
    };

    createUpdateSSOrder({
      orderNumber: groupOrder.grouporderid,
      orderKey: groupOrder.grouporderid,
      orderDate: isoString,
      orderStatus: 'awaiting_shipment',
      customerUsername: userData.userid,
      customerEmail: userData.email,
      billTo: {
        name,
      },
      shipTo: addressObject
    });
  }

  render() {
    // const locked = this.state.isAdmin ? { backgroundColor: '#ff0000' } : { backgroundColor: '#ff0000' };
    return (
      <select style={this.props.selectStyle} onChange={this.onChange} value={this.state.value}>
        <option value=''></option>
        <option value='pictureInvalid'>Pictures Invalid</option>
        <option value='toBeFitted'>To be Fitted</option>
        <option value='fittedByDesigner'>Fitted by Designer</option>
        <option value='fittingValidated'>Fitting Validated</option>
      </select>
    );
  }
}

class SelectOrderStatus extends React.PureComponent {
  state = {
    value: this.props.value
  };
  onChange = ev => {
    if (this.props.user != 'us-west-2:b1ee9228-ca88-40b3-a242-6fadb2fe9a9e') return;
    this.setState({ value: ev.target.value });
    updateOrderColumn(this.props.orderId, this.props.columnName, ev.target.value);
  };
  render() {
    return (
      <select style={this.props.selectStyle} onChange={this.onChange} value={this.state.value}>
        <option value=''></option>
        <option value='toBeValidated'>To be Validated</option>
        <option value='toBePrinted'>To be Printed</option>
        <option value='toBeShipped'>To be Shipped</option>
        <option value='shipped'>Shipped</option>
      </select>
    );
  }
}

export const ListComponent = function({
  list,
  tableProps,
  table,
  tablePropsType,
  user,
  tableId,
  showRemoved,
  toggleVisible
}) {
  class RowRenderer extends React.Component {
    constructor(props) {
      super(props);
      let visible = true;
      if (tableId == 'users') visible = props.content['visible'];
      this.state = {
        visible
      };
    }

    clickToggleVisible = () => {
      this.setState({ visible: !this.state.visible });
      toggleVisible(
        tableId,
        this.props.content['userid'],
        'visible',
        !this.props.content['visible']
      );
    };

    render() {
      const index = this.props.index;
      const key = this.props.key;
      const style = this.props.style;
      const content = this.props.content;
      // if visible is false don't display
      if (content['visible'] == false && !showRemoved) return <div />;
      if (!this.state.visible && !showRemoved) return <div />;

      const itemStyle = {
        padding: '0px',
        display: 'inline-block',
        width: '200px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        boxSizing: 'border-box',
        marginLeft: '8px',
        textAlign: 'left',
        backgroundColor: !this.state.visible ? '#ff0000' : 'transparent'
      };

      const selectStyle = {
        display: 'inline-block',
        width: '200px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        boxSizing: 'border-box',
        marginLeft: '8px',
        backgroundColor: 'rgba(255,0,0,0.3)',
        marginTop: '1px',
        marginBottom: '1px',
        textAlign: 'left',
      };

      const toggleText = !this.state.visible ? 'ADD' : 'REMOVE';
      return (
        <div key={key} style={style}>
          <React.Fragment>
            <div
              style={{
                width: 35,
                fontSize: 12,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              {list.length - index}
            </div>
            {tableId == 'users' && (user == 'us-west-2:b1ee9228-ca88-40b3-a242-6fadb2fe9a9e' || user == 'us-west-2:95a2f104-1308-42e3-bb65-033c4f9a6de4') && <button onClick={this.clickToggleVisible}>{toggleText}</button>}
            {tableProps.map((prop, i) => {
              if (table[i] == '') {
                return <Workbench itemStyle={itemStyle} index={index} user={user} content={content}/>;
              } else if (tableProps[i] == 'fitstatus') {
                const userId = content['userid'];
                const value = content[prop] ? content[prop] : '';
                const columnName = tableProps[i];
                return (
                  <SelectFitStatus
                    selectStyle={selectStyle}
                    user={user}
                    userId={userId}
                    value={value}
                    columnName={columnName}
                    userData={content}
                  />
                );
              } else if (tableProps[i] == 'orderstatus') {
                const orderId = content['orderid'];
                const value = content[prop] ? content[prop] : '';
                const columnName = tableProps[i];

                return (
                  <SelectOrderStatus
                    selectStyle={selectStyle}
                    user={user}
                    orderId={orderId}
                    value={value}
                    columnName={columnName}
                  />
                );
              } else if (tablePropsType[i] == 'preview') {
                return (
                  <div style={{ width: '200px', overflow: 'hidden' }}>
                    { content['picuri1'] ?
                      <a target="_blank" href={content['picuri1']}>Open image link</a>
                      :
                      <div />
                    }
                    {/* <img src={content['picuri1']} style={{ minWidth: '50%', minHeight: '50%', maxWidth: '200px', maxHeight: '60px' }} /> */}
                  </div>
                );
              } else {
                return (
                  <CopyToClipboard text={content[prop]} onCopy={() => {}}>
                    <div style={itemStyle}>{content[prop]}</div>
                  </CopyToClipboard>
                );
              }
            })}
          </React.Fragment>
        </div>
      );
    }
  }

  const numColumns = tableProps.length;
  const style = {
    height: '60px',
    width: '100%',
    display: 'flex',
    flexDirection: 'row-reverse',
    flexShrink: 0
  };

  return list.map((content, index) => {
    return <RowRenderer index={index} key={uuid.v1()} style={style} content={content} />;
    // return rowRenderer({ index, key: uuid.v1(), style, content: item });
  });
};
