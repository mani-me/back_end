import Link from 'next/link';
import styled, { ThemeProvider } from 'styled-components';
import { theme } from '../utils/theme';
import Box from './Box';
import { space } from 'styled-system';
import { Auth } from 'aws-amplify';
import { connect } from 'react-redux';
import { setIsAuth } from '../actions';
import userData from '../reducers/userData';

const Label = styled.label`
  ${space}
  font-family: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, "avenir next", avenir, "Segoe UI", Arial, sans-serif';
  color: #808590;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 5px;
`;

const Input = styled.input`
  ${space}
  font-family: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, "avenir next", avenir, "Segoe UI", Arial, sans-serif';
  background-color: #fff;
  border: 1px solid #d1d1d1;
  border-radius: 3px;
  box-sizing: border-box;
  color: #152025;
  height: 40px;
  margin: 0 0 20px 0;
  padding: 5px 10px;
  font-size: 13px;
  width: 100%;
  &:focus {
    outline: none;
  }
`;

const Button = styled.button`
  ${space}
  font-family: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, "avenir next", avenir, "Segoe UI", Arial, sans-serif';
  display: flex;
  justify-content: center;
  border-radius: 3px;
  border-width: 0px;
  box-sizing: border-box;
  cursor: pointer;
  background-color: #414141;
  color: #fff;
  font-size: 13px;
  line-height: 1;
  padding: 10px 15px;
  min-width: 50px;
  &:hover {
    outline: none;
  }
  &:focus {
    outline: none;
  }
`;

const Container = styled(Box)`
  background-image: linear-gradient(to right top, #191915, #2a2a21, #3d3c2d, #514f39, #676246);
  background-image: linear-gradient(to right top, #0d0d0d, #1d191b, #2e2222, #3c2e25, #413d2a);
  height: ${props => props.height}px;
  width: ${props => props.width}px;
`;

class AuthComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { width: 0, height: 0, email: '', password: '' };
  }

  updateAuth = (key, value) => {
    this.setState({
      [key]: value
    });
  };

  signIn = ev => {
    ev.preventDefault();
    Auth.signIn(this.state.email, this.state.password)
    .then(user => {
      this.props.setIsAuth(true);
      Auth.currentCredentials().then(credentials => {
        this.props.dispatchSetIdentityId(credentials.identityId);
      });
    })
    .catch(err => console.log(err.stack));
  };

  render() {
    const { before, isAuth, ...props } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <Container
          display='flex'
          flexDirection='column'
          justifyContent='center'
          alignItems='center'
          width='100%'
          height='100%'>
          <Box
            width={'500px'}
            display='flex'
            flexDirection='column'
            alignItems='center'
            mb={3}
            pb={2}>
            <img
              src='https://s3-us-west-2.amazonaws.com/mani-me-app/manimelogo.png'
              style={{ width: '35%', height: 'auto' }}
            />
          </Box>
          <Box
            width={'500px'}
            bg='#fff'
            boxShadow='0 1px 3px 0 rgba(0,0,0,0.15)'
            borderRadius='3px'>
            <Box display='flex' justifyContent='center' pt={4} fontFamily='sansSerif' fontSize={5}>
              Log In
            </Box>
            <Box mx={4} mb={3} p={4} display='flex' flexDirection='column'>
              <form>
                <Label>Email Address</Label>
                <Input
                  value={this.state.email}
                  onChange={ev => this.updateAuth('email', ev.target.value)}></Input>
                <Label>Password</Label>
                <Input
                  type='password'
                  value={this.state.password}
                  onChange={ev => this.updateAuth('password', ev.target.value)}></Input>
                <Box
                  display='flex'
                  width='100%'
                  flexDirection='row'
                  justifyContent='flex-end'
                  mt={3}>
                  <Button type='submit' onClick={this.signIn}>
                    Log in
                  </Button>
                </Box>
              </form>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  userData: userData(state.userData, { type: 'DEFAULT' })
});

const mapDispatchToProps = dispatch => ({
  setIsAuth: isAuth => dispatch(setIsAuth(isAuth)),
  dispatchSetIdentityId: identityId => dispatch({ type: 'SET_IDENTITY_ID', identityId })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthComponent);
