import Link from 'next/link';
import styled from 'styled-components';
import Box from './Box';

const MenuItem = styled(Box)`
  font-weight: 200;
  background: transparent;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  background: ${props => (props.bg ? props.bg : 'transparent')};
`;

const Container = styled(Box)`
  background-color: #101214;
`;

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLink: ''
    };
  }

  selectLink = selectedLink => {
    this.setState({ selectedLink });
  };

  render() {
    return (
      <Container minWidth={[150, 200]} height='100%' bg='blacks.11' fontFamily='sansSerif'>
        <Box px={2} p={2} width={['100px', '120px']}>
          <img
            src='https://s3-us-west-2.amazonaws.com/mani-me-app/manimelogo.png'
            style={{ width: '100%', height: 'auto' }}
          />
        </Box>

        <Box py={1}>
          <Link href={`/data/combinedOrders`}>
            <MenuItem
              py={1}
              px={3}
              color='whites.11'
              fontSize={0}
              onClick={() => this.selectLink('combinedorders')}
              bg={this.state.selectedLink == 'combinedorders' ? '#313131' : 'transparent'}>
              COMBINED ORDERS
            </MenuItem>
          </Link>
          <Link href={`/data/orders`}>
            <MenuItem
              py={1}
              px={3}
              color='whites.11'
              fontSize={0}
              onClick={() => this.selectLink('orders')}
              bg={this.state.selectedLink == 'orders' ? '#313131' : 'transparent'}>
              ORDERS
            </MenuItem>
          </Link>
          <Link href={`/data/groupOrders`}>
            <MenuItem
              py={1}
              px={3}
              color='whites.11'
              fontSize={0}
              onClick={() => this.selectLink('grouporders')}
              bg={this.state.selectedLink == 'grouporders' ? '#313131' : 'transparent'}>
              GROUP ORDERS
            </MenuItem>
          </Link>
          <Link href={`/data/users`}>
            <MenuItem
              py={1}
              px={3}
              color='whites.11'
              fontSize={0}
              onClick={() => this.selectLink('users')}
              bg={this.state.selectedLink == 'users' ? '#313131' : 'transparent'}>
              USERS
            </MenuItem>
          </Link>

          <Link href={`/data/orderReviews`}>
            <MenuItem
              py={1}
              px={3}
              color='whites.11'
              fontSize={0}
              onClick={() => this.selectLink('revieworders')}
              bg={this.state.selectedLink == 'revieworders' ? '#313131' : 'transparent'}>
              ORDER REVIEWS
            </MenuItem>
          </Link>
          <Link href={`/data/shippingAddresses`}>
            <MenuItem
              py={1}
              px={3}
              color='whites.11'
              fontSize={0}
              onClick={() => this.selectLink('shippingaddresses')}
              bg={this.state.selectedLink == 'shippingaddresses' ? '#313131' : 'transparent'}>
              SHIPPING ADDRESSES
            </MenuItem>
          </Link>
          <Link href={`/data/payments`}>
            <MenuItem
              py={1}
              px={3}
              color='whites.11'
              fontSize={0}
              onClick={() => this.selectLink('payments')}
              bg={this.state.selectedLink == 'payments' ? '#313131' : 'transparent'}>
              PAYMENTS
            </MenuItem>
          </Link>

          <Link href={`/data/designers`}>
            <MenuItem
              py={1}
              px={3}
              color='whites.11'
              fontSize={0}
              onClick={() => this.selectLink('designers')}
              bg={this.state.selectedLink == 'designers' ? '#313131' : 'transparent'}>
              DESIGNERS
            </MenuItem>
          </Link>
          <Link href={`/data/nailProducts`}>
            <MenuItem
              py={1}
              px={3}
              color='whites.11'
              fontSize={0}
              onClick={() => this.selectLink('nailproducts')}
              bg={this.state.selectedLink == 'nailproducts' ? '#313131' : 'transparent'}>
              NAIL PRODUCTS
            </MenuItem>
          </Link>
          <Link href={`/data/nailCategories`}>
            <MenuItem
              py={1}
              px={3}
              color='whites.11'
              fontSize={0}
              onClick={() => this.selectLink('categories')}
              bg={this.state.selectedLink == 'categories' ? '#313131' : 'transparent'}>
              NAIL CATEGORIES
            </MenuItem>
          </Link>
          <Link href={`/data/nailProductsToCategory`}>
            <MenuItem
              py={1}
              px={3}
              color='whites.11'
              fontSize={0}
              onClick={() => this.selectLink('nailproductstocategory')}
              bg={this.state.selectedLink == 'nailproductstocategory' ? '#313131' : 'transparent'}>
              NAIL PRODUCT CATEGORIES
            </MenuItem>
          </Link>
          <Link href={`/userAccess`}>
            <MenuItem
              py={1}
              px={3}
              color='whites.11'
              fontSize={0}
              onClick={() => this.selectLink('useraccess')}
              bg={this.state.selectedLink == 'useraccess' ? '#313131' : 'transparent'}>
              USER ACCESS
            </MenuItem>
          </Link>
        </Box>
      </Container>
    );
  }
}

export default Sidebar;
