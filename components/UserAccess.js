import React, { Component } from 'react';
import styled from 'styled-components';
import { Container, Draggable } from 'react-smooth-dnd';
import {
  queryAdminDynamoDB,
  listAdminDynamoDB,
  addAttributeAdminDynamoDB,
  deleteAttributeAdminDynamoDB,
  updateUserColumn
} from '../utils/lambdaFunctions';
import { API, Storage } from 'aws-amplify';

import { connect } from 'react-redux';
import userData from '../reducers/userData';
import { DEFAULT } from '../actions';

const DndContainer = styled.div`
  display: flex;
  height: 100%;
`;
const DndColumn = styled.div`
  width: 270px;
  margin: 10px;
  padding: 10px;
  border: 1px solid #eee;
  height: 100%;
  overflow-y: auto;
  .smooth-dnd-container {
  }
`;
const Item = styled.div`
  background-color: ${(props) => {
    return props.selected ? '#d1d1d1' : 'transparent';
  }};
  padding: 10px;
  margin: 2px;
  border-radius: 2px;
  box-shadow: 0 0 2px #00000080;
  cursor: pointer;
`;

export class UserAccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAdmin: '',
      users: [],
      adminList: [],
      adminIdList: [],
      userList: [],
      userObjectList: [],
      accessList: []
    };
  }

  componentDidMount() {
    this.getUsers();
    this.testLambdaFunctions();
  }

  getUsers = () => {
    // store in state all client id
    let userInit = {
      headers: { 'Content-Type': 'application/json' }
    };
    API.get('LambdaRDSClient', '/users/cms/read', userInit)
      .then(response => {
        if (response && response.rows) {
          const users = response.rows.map(item => {
            return {
              userId: item.userid,
              email: item.email
            };
          });
          this.setState({ users });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  testLambdaFunctions = async () => {
    let result;
    // store admin users
    result = await listAdminDynamoDB();
    const adminList = result.map(item => {
      return item.username;
    });
    const adminIdList = result.map(item => {
      return item.userId;
    });
    this.setState({ adminList: result });
  };

  selectAdmin = async selectedAdmin => {
    let result = await queryAdminDynamoDB(selectedAdmin);
    // const resultKeys = Object.values(result);
    const { userId, username, ...accessObject } = result;
    const accessValues = Object.values(accessObject);
    let accessList = [];
    // console.log(accessList);

    // split into two tables -> userlist and accessList
    const userObjectList = this.state.users.filter(user => {
      if (accessValues.includes(user.userId)) {
        accessList.push(user);
        return false;
      }
      else return true;
    });


    // console.log(userObjectList);
    // FIXME:  this sets it to userId instead of email
    // const userList = userObjectList.map(user => {
    //   return user.userId;
    // });

    this.setState({ accessList, userList: userObjectList, selectedAdmin });
  };

  adminAccessAddClient = async clientId => {
    const response = await addAttributeAdminDynamoDB(this.state.selectedAdmin, clientId);
    console.log(response);
    return response;
  };

  adminAccessRemoveClient = async clientId => {
    const response = await deleteAttributeAdminDynamoDB(this.state.selectedAdmin, clientId);
    console.log(response);
    return response;
  };

  applyDrag = (arr, dragResult, container) => {
    const { removedIndex, addedIndex, payload } = dragResult;
    if (removedIndex === null && addedIndex === null) return arr;

    const result = [...arr];
    let itemToAdd = payload;

    if (removedIndex !== null) {
      itemToAdd = result.splice(removedIndex, 1)[0];
      if (container == 'accessList')
        this.adminAccessRemoveClient(itemToAdd.userId);
    }

    if (addedIndex !== null) {
      result.splice(addedIndex, 0, itemToAdd);
      if (container == 'accessList')
        this.adminAccessAddClient(itemToAdd.userId);
    }

    return result;
  };

  render() {
    const { adminList, userList, accessList } = this.state;

    const user = this.props.userData ? this.props.userData.identityId : '';
    // this is the admin account, photogrammetry

    return (
      <React.Fragment>
        {user == 'us-west-2:b1ee9228-ca88-40b3-a242-6fadb2fe9a9e' ? (
          <DndContainer>
            <DndColumn>
              <h3>Admin</h3>
              {adminList.map((item, i) => (
                <Item key={item.userId} selected={item.userId == this.state.selectedAdmin} onClick={() => this.selectAdmin(item.userId)}>
                  {item.username}
                </Item>
              ))}
            </DndColumn>
            <DndColumn>
              <h3>User List</h3>
              <Container
                groupName='1'
                getChildPayload={i => userList[i]}
                onDrop={e => this.setState({ userList: this.applyDrag(userList, e, 'userList') })}>
                {userList.map(item => (
                  <Draggable key={item.userId}>
                    <Item>{item.email}</Item>
                  </Draggable>
                ))}
              </Container>
            </DndColumn>
            <DndColumn>
              <h3>Access List</h3>
              <Container
                groupName='1'
                getChildPayload={i => accessList[i]}
                onDrop={e => this.setState({ accessList: this.applyDrag(accessList, e, 'accessList') })}>
                {accessList.map(item => (
                  <Draggable key={item.userId}>
                    <Item>{item.email}</Item>
                  </Draggable>
                ))}
              </Container>
            </DndColumn>
          </DndContainer>
        ) : (
          <div></div>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  userData: userData(state.userData, { type: 'DEFAULT' })
});

export default connect(
  mapStateToProps,
  null
)(UserAccess);
