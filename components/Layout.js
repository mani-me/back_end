import Link from 'next/link';
import styled, { ThemeProvider } from 'styled-components';
import { theme } from '../utils/theme';
import Box from './Box';
import Sidebar from './Sidebar';
import { connect } from 'react-redux';
import { setDisplay, setKeyValue } from '../actions';
import { StandardButton, StandardInput, StandardLabel } from './StyledComponents';
import { API, Storage } from 'aws-amplify';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0;
  padding: 0;
  height: ${props => props.height}px;
  width: ${props => props.width}px;
`;

const Header = styled(Box)`
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.15);
  z-index: 100;
`;

// Refactor below. Portal?
const Modal = styled(Box)``;

const DropDownMenu = styled(Box)`
  position: absolute;
  z-index: 1000;
  background: #fff;
  border-radius: 3px;
  box-shadow: 0 10px 15px 0 rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  border: 1px solid #dddddd;
  padding: 5px 0px;
`;

const A = styled.a`
  display: flex;
  font-size: 13px;
  padding: 10px 15px;
  &:hover {
    background-color: #f3f3f3;
  }
`;

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      // Refactor below into layer component
      uploadImageName: '',
      errorMessage: '',
      tempFile: null,
      texture: 'test'
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  modalOnClick = e => {
    // if (this.modalRef.contains(e.target)) console.log('inside');
    // else this.props.setActiveElementDisplay();
  };
  menuOnClick = e => {
    // if (this.menuRef.contains(e.target)) console.log('inside');
    // else this.props.setActiveElementDisplay();
  };
  chooseImage = e => {
    const file = e.target.files[0];
    this.setState({ tempFile: file });
    // https://s3-us-west-2.amazonaws.com/mani-me-app/public/example.png
  };
  uploadImage = () => {
    if (this.state.uploadImageName == '') {
      this.setState({ errorMessage: 'Must enter an image name' });
      return;
    }
    if (!this.state.uploadImageName || this.state.uploadImageName == undefined) {
      this.setState({ errorMessage: 'Image Name State Undefined' });
      return;
    }
    this.setState({ errorMessage: '' });
    Storage.put(`${this.state.uploadImageName}.png`, this.state.tempFile, {
      contentType: 'image/png'
    })
      .then(result => {
        // this.props.setActiveElementDisplay();
        // this.props.setActiveElementKeyValue(
        //   'imagePath',
        //   `https://s3-us-west-2.amazonaws.com/mani-me-app/public/${this.state.uploadImageName}.png`
        // );
      })
      .catch(err => {
        this.setState({ errorMessage: 'Upload failed, check console.' });
        console.log(err);
      });
  };

  render() {
    const { before, ...props } = this.props;
    const width = this.state.width;

    // https://s3-us-west-2.amazonaws.com/mani-me-app/menu.svg

    return (
      <ThemeProvider theme={theme}>
        <Container id='layout' height={this.state.height} width={this.state.width}>
          {!before && <Sidebar />}
          <Box
            width={[width - 150, width - 200]}
            height='100%'
            bg='whites.7'
            display='flex'
            flexDirection='column'
            fontFamily='sansSerif'>
            <Header
              width={1}
              bg='whites.9'
              color='blacks.2'
              height={2}
              display='flex'
              flex='0 0 auto'
              alignItems='center'></Header>
            {props.children}
          </Box>

          {/* Replace this with portal

          {this.props.activeElement.type == 'menu' && (
            <Box position='absolute' width='100%' height='100%' onClick={this.menuOnClick}>
              <DropDownMenu
                ref={menuRef => (this.menuRef = menuRef)}
                style={{
                  width: '100px',
                  top: this.props.activeElement.bottom + 1,
                  left: this.props.activeElement.left
                }}>
                <A onClick={this.props.setActiveElementDisplay}>Option 1</A>
                <A onClick={this.props.setActiveElementDisplay}>Option 2</A>
                <A onClick={this.props.setActiveElementDisplay}>Option 3</A>
              </DropDownMenu>
            </Box>
          )}

          {this.props.activeElement.type == 'modal' && (
            <Box
              position='absolute'
              width='100%'
              height='100%'
              bg='rgba(0,0,0,0.4)'
              display='flex'
              justifyContent='center'
              alignItems='center'
              onClick={this.modalOnClick}>
              <Modal
                ref={modalRef => (this.modalRef = modalRef)}
                width={'500px'}
                bg='#fff'
                px={2}
                pt={3}
                pb={2}
                boxShadow='0 1px 3px 0 rgba(0,0,0,0.15)'
                borderRadius='3px'>
                <Box display='flex' p={2} fontFamily='sansSerif' fontSize={4}>
                  {this.props.activeElement.propertyName}: {this.props.activeElement.propertyValue}
                </Box>
                <Box p={2} display='flex' flexDirection='column'>
                  {Object.keys(this.props.activeElement.item).map(key => {
                    return (
                      <div>
                        {key} : {this.props.activeElement.item[key]}
                      </div>
                    );
                  })}
                </Box>
              </Modal>
            </Box>
          )}
          {this.props.activeElement.type == 'image' && (
            <Box
              position='absolute'
              width='100%'
              height='100%'
              bg='rgba(0,0,0,0.4)'
              display='flex'
              justifyContent='center'
              alignItems='center'
              onClick={this.modalOnClick}>
              <Modal
                ref={modalRef => (this.modalRef = modalRef)}
                width={'500px'}
                bg='#fff'
                px={2}
                pt={3}
                pb={2}
                boxShadow='0 1px 3px 0 rgba(0,0,0,0.15)'
                borderRadius='3px'>
                <Box display='flex' p={2} fontFamily='sansSerif' fontSize={4}>
                  {this.props.activeElement.propertyName}:
                </Box>

                <Box display='flex' px={2} fontFamily='sansSerif' fontSize={2}>
                  {this.props.activeElement.propertyValue}
                </Box>

                <Box p={2} display='flex' flexDirection='column'>
                  <Box display='flex' flexDirection='column' justifyContent='center' mt={3} mx={5}>
                    <StandardLabel>
                      File Name: (Careful, will overwrite if file name already exists)
                    </StandardLabel>
                    <StandardInput
                      width='100%'
                      mb={2}
                      value={this.state.uploadImageName}
                      onChange={ev =>
                        this.setState({ uploadImageName: ev.target.value })
                      }></StandardInput>
                    <input type='file' accept='image/png' onChange={e => this.chooseImage(e)} />
                    <StandardButton mt={2} onClick={this.uploadImage}>
                      Upload
                    </StandardButton>
                    <StandardLabel fontSize={2} color='#bb0000' mt={2}>
                      {this.state.errorMessage}
                    </StandardLabel>
                  </Box>
                </Box>
              </Modal>
            </Box>
          )} */}
        </Container>
      </ThemeProvider>
    );
  }
}

// const mapStateToProps = state => ({
//   activeElement: activeElement(state.activeElement, { type: 'DEFAULT' })
// });

// const mapDispatchToProps = dispatch => ({
//   setActiveElementDisplay: () => dispatch(setDisplay()),
//   setActiveElementKeyValue: (key, value) => dispatch(setKeyValue(key, value))
// });

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(Layout);

export default Layout;
