import React, { PureComponent, Fragment } from "react";

import Box from "./Box";
import {
  StandardButton,
  StandardInput,
  StandardLabel
} from "./StyledComponents";
import { RDSLambda } from '../utils/lambdaFunctions';

export default class NailProductCategoryModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      nailProductId: "",
      categoryId: "",
      error: null,
      success: null
    };
  }

  createProductCategoryRelationship = async () => {
    const { nailProductId, categoryId } = this.state;
    this.setState({
      error: null,
      success: null
    })
    //I would suggest we validate the user inputs here - right now I'll skip it since we need an array with the string options to check from
    //maybe if it's an easy change in the API to use a number instead of string => check <= 2 number <= 30  /  === 1 || === 0
    try {
      let result = await RDSLambda('post', '/nailproductstocategory/create', {
        nailproductid: nailProductId, // 2-30
        categoryid: categoryId // 0, 1
      });
      console.log(result);
      this.setState({
        error: null,
        success: "Success"
      })
      //NOT CLOSING THE MODAL FROM UX PERSPECTIVE - if we want to close it after success uncomment line below
      //this.props.onClose()
    } catch(err) {
      this.setState({
        error: "Something went wrong. Please, try a different combination",
        success: null
      })
      console.log('err', err); 
    }
  };

  onOverlayClick = e => {
    if (this.modal.contains(e.target)) return;
    else this.props.onClose();
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
            <StandardLabel>Nail Product Id (2-30)</StandardLabel>
            <StandardInput
              mb={3}
              value={this.state.nailProductId}
              onChange={ev => {
                this.setState({
                  nailProductId: ev.target.value
                });
              }}
            />
            <StandardLabel>Category Id (0-1)</StandardLabel>
            <StandardInput
              mb={3}
              value={this.state.categoryId}
              onChange={ev => {
                this.setState({
                  categoryId: ev.target.value
                });
              }}
            />

            {this.state.error && <StandardLabel color={'red'}>{this.state.error}</StandardLabel>}
            {this.state.success && <StandardLabel color={'green'}>{this.state.success}</StandardLabel>}
            <StandardButton mb={3} onClick={this.createProductCategoryRelationship}>
              Add Nail Product to Category 
            </StandardButton>
          </Box>
        </Box>
      </Box>
    );
  }
}
