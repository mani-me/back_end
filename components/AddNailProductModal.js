import React, { PureComponent, Fragment } from "react";
import styled from 'styled-components';
import { API, Storage } from "aws-amplify";
import uuid from "uuid";

import Box from "./Box";
import {
  StandardButton,
  StandardInput,
  StandardLabel
} from "./StyledComponents";

// Copied directly from layout js
const Modal = styled(Box)``;

export default class AddNailProductModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: "LambdaRDSCompany",
      nailproductid: "",
      name: "",
      price: "",
      description: "",
      error: null,
      success: null,
      // Copied directly from layout js
      showImageModal: false,
      uploadImageName: '',
      errorMessage: '',
      tempFile: null,
    };
  }

  componentDidMount() {
    this.setState(
      {
        nailproductid: uuid.v1()
      },
      this.createNailProduct()
    );
  }

  createNailProduct = () => {
    const { endpoint, nailproductid } = this.state;

    let userData = {
      nailproductid: nailproductid
    };
    let userInit = {
      body: userData,
      headers: { "Content-Type": "application/json" }
    };

    API.post(endpoint, "/nailproducts/create", userInit)
      .then(response => {
        console.log(response);
        this.setState({
          error: null,
          success: "Successfully Created New Product"
        });
      })
      .catch(error => {
        console.log(error.stack);
        this.setState({
          error: "Could not CREATE product. Please, try again",
          success: null
        });
        console.log("err", error);
      });
  };

  updateNailProduct = (propertyName, propertyValue) => {
    // LAMBDA
    const { endpoint, nailproductid } = this.state;

    let userData = {
      nailproductid: nailproductid,
      columnname: propertyName,
      columnvalue: propertyValue
    };
    let userInit = {
      body: userData,
      headers: { "Content-Type": "application/json" }
    };
    API.post(endpoint, "/nailproducts/update/column", userInit)
      .then(response => {
        console.log(response);
        this.setState({
          error: null,
          success: `Successfully UPDATED Product ${propertyName}`
        });
      })
      .catch(error => {
        console.log(error.stack);
        this.setState({
          error: "Could not UPDATE product",
          success: null
        });
      });
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

  onOverlayClick = e => {
    if (this.modal.contains(e.target)) return;
    else this.props.onClose();
  };

  onImageModalOverlayClick = e => {
    if (this.modalRef.contains(e.target)) return;
    else this.setState({ showImageModal: false });
  };

  render() {
    return (
      <Box
        position="absolute"
        width="100%"
        height="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        bg="rgba(0,0,0,0.7)"
        onClick={this.onOverlayClick}
      >
        <Box
          ref={ref => (this.modal = ref)}
          width={500}
          bg="#ffffff"
          display="flex"
          flexDirection="column"
          flexWrap="wrap"
          zIndex={100}
        >
          <Box
            width="100%"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            mb={2}
            mt={2}
          >
            <StandardLabel>Name</StandardLabel>
            <StandardInput
              mb={1}
              value={this.state.name}
              onChange={ev => {
                this.setState({
                  name: ev.target.value
                });
              }}
            />
            <StandardButton
              mb={3}
              onClick={() => {
                this.updateNailProduct("name", this.state.name);
              }}
            >
              Update product name
            </StandardButton>

            <StandardLabel>Price</StandardLabel>
            <StandardInput
              mb={1}
              value={this.state.price}
              onChange={ev => {
                this.setState({
                  price: ev.target.value
                });
              }}
            />
            <StandardButton
              mb={3}
              onClick={() => {
                this.updateNailProduct("price", this.state.price);
              }}
            >
              Update product price
            </StandardButton>

            <StandardLabel>Description</StandardLabel>
            <StandardInput
              mb={1}
              value={this.state.description}
              onChange={ev => {
                this.setState({
                  description: ev.target.value
                });
              }}
            />
            <StandardButton
              mb={3}
              onClick={() => {
                this.updateNailProduct("description", this.state.description);
              }}
            >
              Update product description
            </StandardButton>

            
            <StandardButton
              mb={3}
              onClick={() => {
                this.setState({
                  showImageModal: true
                })
              }}
            >
              Upload Image
            </StandardButton>
            
            {/* Copied directly from layout js */}
            {this.state.showImageModal && (
              <Box
                position="absolute"
                width="100%"
                height="100%"
                bg="rgba(0,0,0,0.4)"
                display="flex"
                justifyContent="center"
                alignItems="center"
                onClick={this.onImageModalOverlayClick}
              >
                <Modal
                  ref={modalRef => (this.modalRef = modalRef)}
                  width={"500px"}
                  bg="#fff"
                  px={2}
                  pt={3}
                  pb={2}
                  boxShadow="0 1px 3px 0 rgba(0,0,0,0.15)"
                  borderRadius="3px"
                >
                  <Box display="flex" p={2} fontFamily="sansSerif" fontSize={4}>
                    Placeholder property name:
                  </Box>

                  <Box
                    display="flex"
                    px={2}
                    fontFamily="sansSerif"
                    fontSize={2}
                  >
                    Placeholder properrty value
                  </Box>

                  <Box p={2} display="flex" flexDirection="column">
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      mt={3}
                      mx={5}
                    >
                      <StandardLabel>
                        File Name: (Careful, will overwrite if file name already
                        exists)
                      </StandardLabel>
                      <StandardInput
                        width="100%"
                        mb={2}
                        value={this.state.uploadImageName}
                        onChange={ev =>
                          this.setState({ uploadImageName: ev.target.value })
                        }
                      ></StandardInput>
                      <input
                        type="file"
                        accept="image/png"
                        onChange={e => this.chooseImage(e)}
                      />
                      <StandardButton mt={2} onClick={this.uploadImage}>
                        Upload
                      </StandardButton>
                      <StandardLabel fontSize={2} color="#bb0000" mt={2}>
                        {this.state.errorMessage}
                      </StandardLabel>
                    </Box>
                  </Box>
                </Modal>
              </Box>
            )}

            {this.state.error && (
              <StandardLabel color={"red"}>{this.state.error}</StandardLabel>
            )}
            {this.state.success && (
              <StandardLabel color={"green"}>
                {this.state.success}
              </StandardLabel>
            )}
          </Box>
        </Box>
      </Box>
    );
  }
}
