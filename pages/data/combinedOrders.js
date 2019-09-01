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

import { connect } from 'react-redux';
import userData from '../../reducers/userData';
import { DEFAULT } from '../../actions';

const COMBINED_ORDERS_COLUMN_DESCRIPTION = ['_Email', 'Nail Description', 'Shipping Address', 'User ID', 'Order ID', 'Group Order ID', 'Nail Product ID', 'Nail Length', 'Nail Shape', 'Order Status', 'Date Created'];
const COMBINED_ORDERS_COLUMN_PROPERTIES = ['email', 'description', 'shippingaddress', 'userid', 'orderid', 'grouporderid', 'nailproductid', 'naillength', 'nailshape', 'orderstatus', 'datecreated'];
const COMBINED_ORDERS_COLUMN_PROPERTIES_TYPE = ['text', 'text', 'text', 'modal', 'modal', 'modal', 'modal', 'text', 'text', 'menu', 'time'];

const pathName = '/orders/cms/read/combined';
const tableName = 'combinedorders';
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
    this.getData(endpoint, tableName);
  }

  componentDidUpdate(prevProps) {
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

    this.setState({
      data: [
        {
          comments: "",
          datecreated: "2019-09-01T05:46:27.748Z",
          deliverydate: "2019-09-01T05:46:27.511Z",
          description: "",
          discount: 0,
          email: "olsonm23@gmail.com",
          grouporderid: "af3f9e02-3532-4eac-bbe4-6f08c07591ce",
          listedprice: 0,
          naillength: "NOT SET",
          nailproductid: "3984102391917",
          nailshape: "NOT SET",
          orderid: "c66d864a-917e-4d0c-8aa2-6be186feec34",
          orderstatus: "",
          shippingaddress: "Home|4507 SW Barton st||Bentonville|AR||72713",
          userid: "us-west-2:cd7ea239-bf49-4ea7-a53e-4a9be71f84d7",
        }
      ]
    });
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
    const table = COMBINED_ORDERS_COLUMN_DESCRIPTION;
    const tableProps = COMBINED_ORDERS_COLUMN_PROPERTIES;
    const tablePropsType = COMBINED_ORDERS_COLUMN_PROPERTIES_TYPE;

    const data = this.state.data;
    const numAttr = table.length;
    const date = new Date();

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
          <BoardBodyContentDescriptions table={table}>
            { table.map((item, i) => <div key={i} type='display' style={{ width: '200px', marginLeft: '10px', display: 'inline-block' }} onClick={() => this.sortData(tableProps[i])}>{item}</div>) }
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
