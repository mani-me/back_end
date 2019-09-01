import React, { PureComponent, Fragment } from "react";
import ReactDOM from "react-dom";

import Box from "./Box";
import {
  StandardButton,
  StandardInput,
  StandardLabel
} from "./StyledComponents";

import NailProductCategoryModal from "./NailProductCategoryModal";
import AddNailProductModal from "./AddNailProductModal";

const SpecificModals = {
  NailProductCategoryModal: NailProductCategoryModal,
  AddNailProductModal: AddNailProductModal
};

export default class Portal extends PureComponent {
  state = {
    showPortal: false
  };
  openModal = () => {
    this.setState({
      showPortal: true
    });
  };
  closeModal = () => {
    this.setState({
      showPortal: false
    });
  };
  render() {
    const { buttonText, type } = this.props;
    const CurrentModal = SpecificModals[type];
    return (
      <Fragment>
        <StandardButton ml={3} onClick={this.openModal}>
          {buttonText}
        </StandardButton>
        {this.state.showPortal &&
          ReactDOM.createPortal(
            <CurrentModal
              onClose={this.closeModal}
              openModal={this.openModal}
              {...this.state}
            />,
            document.getElementById("layout")
          )}
      </Fragment>
    );
  }
}
