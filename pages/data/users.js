import styled, { ThemeProvider } from 'styled-components';
import { theme } from '../../utils/theme';
import Box from '../../components/Box';
import { StandardButton, StandardInput } from '../../components/StyledComponents';
import UserAccess from '../../components/UserAccess';
import { API, Storage } from 'aws-amplify';
import uuid from 'uuid';
import { CSVLink, CSVDownload } from 'react-csv';
import { ListComponent } from '../../components/InfiniteLoader';
import Portal from '../../components/Portal';
import { queryAdminDynamoDB, listAdminDynamoDB, addAttributeAdminDynamoDB, deleteAttributeAdminDynamoDB, updateUserColumn, RDSLambda } from '../../utils/lambdaFunctions';
import { BoardBody, BoardBodyOptions, BoardBodyContainer, BoardBodyContentDescriptions, BoardBodyContents } from '../../components/styled/BoardBody';
import { ArrowUpward, ArrowDownward } from '@material-ui/icons';

import { connect } from 'react-redux';
import userData from '../../reducers/userData';
import { DEFAULT } from '../../actions';

const OPEN_PHOTOGRAMMETRY = 'OPEN_PHOTOGRAMMETRY';
const USERS_COLUMN_DESCRIPTION = ['', 'User ID', 'First Name', 'Last Name', 'Email', '# Pics', 'Fit Status', 'Total Orders', 'Fitted (Deprecated)', 'Date Created', 'Date Last Login', 'Description', 'Subscription', 'Design Pref 1', 'Design Pref 2', 'Design Pref 3'];
const USERS_COLUMN_PROPERTIES = ['userid', 'userid', 'firstname', 'lastname', 'email', 'numpics', 'fitstatus','totalorders', 'fitted', 'datecreated', 'datelastlogin', 'description', 'subscription', 'designpref', 'designpref2', 'designpref3'];
const USERS_COLUMN_PROPERTIES_TYPE = [OPEN_PHOTOGRAMMETRY, 'modal', 'text', 'text', 'text', 'text', 'text', 'text', 'menu', 'time', 'time', 'text', 'text', 'display', 'display', 'display'];

let pathName = '/users/cms/read';
const tableName = 'users';
const endpoint = 'LambdaRDSClient';

class BoardJsx extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      numColumns: 0,
      endpoint: '',
      searchValue: '',
      showRemoved: false,
      sortAscending: false
    };
  }

  componentDidMount() {
    this._mounted = true;
    const identityId = this.props.userData ? this.props.userData.identityId : null;
    if (identityId) this.getData(endpoint, tableName);
  }

  componentDidUpdate(prevProps) {
    const prevIdentityId = prevProps.userData ? prevProps.userData.identityId : null;
    const identityId = this.props.userData ? this.props.userData.identityId : null;
    if (prevIdentityId != identityId) {
      this.getData(endpoint, tableName);
    }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  getData = async (endpoint, tableName) => {
    this.setState({
      endpoint,
      tableName,
      data: []
    });

    let userInit = {
      headers: { 'Content-Type': 'application/json' }
    }
    const user = this.props.userData ? this.props.userData.identityId : '';
    // this is the admin account, photogrammetry
    if (user == 'us-west-2:b1ee9228-ca88-40b3-a242-6fadb2fe9a9e' || user == 'us-west-2:95a2f104-1308-42e3-bb65-033c4f9a6de4') {
      API.get(endpoint, pathName, userInit).then(response => {
        if(response && response.rows && this._mounted) {
          this.setState({ data: response.rows });
          // console.log(response.rows)
        }
      }).catch((err) => {
        // console.log(err.stack);
      });
    } else {
      if (tableName != 'users') return;
      // get the array of ids that this user can see from rds. dynamodb might be good
      // one user id -> many user ids

      var dynamoDBObject = {};
      await API.get('LambdaServer', `/access/${user}`).then(response => {
        dynamoDBObject = response[0];
      }).catch((err) => {
        console.log(err);
      });

      for (const key in dynamoDBObject) {
        const value = dynamoDBObject[key];
        if (key == user) continue;
        pathName = `/${tableName}/read/${value}`;

        API.get(endpoint, pathName, userInit).then(response => {
          if(response && response.rows && this._mounted) {
            this.setState({ data: [...this.state.data, ...response.rows] });
          }
        }).catch((err) => {
          console.log(err);
        });
      }
    }
  }

  // createRow = () => {
  //   if (tableName == 'nailproducts') {
  //     let userData = {
  //       nailproductid: uuid.v1(),
  //     }
  //     let userInit = {
  //         body: userData,
  //         headers: { 'Content-Type': 'application/json' }
  //     }
  //     API.post(endpoint, '/nailproducts/create', userInit).then(response => {
  //         console.log(response);
  //     }).catch(error => {
  //         console.log(error.stack);
  //     });
  //   }
  // }

  // updateField = (id, propertyName, propertyValue) => {
  //   // LAMBDA
  //   if (tableName == 'nailproducts') {
  //     let userData = {
  //       nailproductid: id,
  //       columnname: propertyName,
  //       columnvalue: propertyValue
  //     }
  //     let userInit = {
  //         body: userData,
  //         headers: { 'Content-Type': 'application/json' }
  //     }
  //     API.post(endpoint, '/nailproducts/update/column', userInit).then(response => {
  //         console.log(response);
  //     }).catch(error => {
  //         console.log(error.stack);
  //     });
  //   }
  // }

  updateSearchBar = (searchValue) => {
    this.setState({ searchValue });
  }

  sortData = item => {
    const sortDirection = this.state.sortDirection;
    let sortNumber = 1;
    if (sortDirection) sortNumber = -1;

    const newData = [ ...this.state.data ];
    newData.sort((a, b) => {
      if ( a[item] < b[item]){
        return -1 * sortNumber;
      }
      if ( a[item] > b[item] ){
        return 1 * sortNumber;
      }
      return 0;

    });
    this.setState({ data: newData, sortDirection: !sortDirection });
  }



  toggleVisible = (tableId, uuid, columnName, columnValue) => {
    if (tableId == 'users') {
      updateUserColumn(uuid, columnName, columnValue);
      // // change state
      // let newData = [ ...this.state.data ];
      // const index = newData.findIndex(item => {
      //   return item.userid == 'us-west-2:c6b83d25-a47b-476b-8aa9-0f63f83d2f9e';
      // });
      // let visible = newData[index]['visible'];
      // newData[index] = { ...newData[index], visible: !visible };
      // this.setState({ data: newData });
    }
  }

  renderVirtualized = (tableProps, table, tablePropsType, tableId) => {
    if (!this.state.data || !Array.isArray(this.state.data) || this.state.data.length <= 0) return;

    return ListComponent({
      list: this.state.data,
      tableProps,
      table,
      tablePropsType,
      user: this.props.userData.identityId,
      tableId,
      showRemoved: this.state.showRemoved,
      toggleVisible: this.toggleVisible
    });
  }

  render() {
    const table = USERS_COLUMN_DESCRIPTION;
    const tableProps = USERS_COLUMN_PROPERTIES;
    const tablePropsType = USERS_COLUMN_PROPERTIES_TYPE;

    const data = this.state.data;
    const numAttr = table.length;
    const date = new Date();

    console.log(data);

    return (
      <BoardBody table={table}>
        {/* This should be a component that takes child elements in the form of buttons/input/text */}
        <BoardBodyOptions table={table}>
          <StandardButton ml={3} onClick={() => this.getData(endpoint, tableName)}>Refresh</StandardButton>
          {tableName === 'nailproducts' && <Portal buttonText={"New"} type={"AddNailProductModal"} />}
          {/* <StandardButton ml={3} onClick={this.createRow} disabled={tableName == 'nailproducts' ? false : true}>New</StandardButton> */}
          <StandardButton ml={3} onClick={() => this.setState({ showRemoved: !this.state.showRemoved })}>Toggle Removed</StandardButton>
          <StandardButton ml={3} disabled>Save</StandardButton>
          <CSVLink data={data} filename={`${tableName}-${date.toString()}.csv`}>
            <StandardButton ml={3} style={{ textDecoration: 'none' }}>Save CSV</StandardButton>
          </CSVLink>
          {tableName === 'nailproductstocategory' && <Portal buttonText={"Open Nail Product Category Modal"} type={"NailProductCategoryModal"} />}
          <StandardInput ml={3} value={this.state.searchValue} onChange={(ev) => this.updateSearchBar(ev.target.value.toLowerCase())}></StandardInput>
        </BoardBodyOptions>

        <BoardBodyContainer table={table}>
          <BoardBodyContentDescriptions table={table} ml='100px'>
            { table.map((item, i) => (
              <Box display='inline-flex' flexDirection='row'>
                {i != 0 &&
                  <ArrowUpward fontSize='small'/>
                }
                <div key={i} type='display' style={{ width: '180px', marginLeft: '10px', display: 'inline-block' }} onClick={() => this.sortData(tableProps[i])}>{item}</div>
              </Box>
            )) }
          </BoardBodyContentDescriptions>
          <BoardBodyContents table={table}>
            {
              this.renderVirtualized(tableProps, table, tablePropsType, tableName)
            }
          </BoardBodyContents>
        </BoardBodyContainer>


      </BoardBody>
    );
  }
};

const mapStateToProps = state => ({
  userData: userData(state.userData, { type: 'DEFAULT' })
})

export default connect(
  mapStateToProps,
  null,
)(BoardJsx);
