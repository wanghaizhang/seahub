import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Item from './item';

const propTypes = {
  items: PropTypes.array.isRequired,
  onRenameRepo: PropTypes.func.isRequired,
  onDeleteRepo: PropTypes.func.isRequired,
  onTransfer: PropTypes.func.isRequired,
  showDeleteItemPopup: PropTypes.func.isRequired,
  onHistorySetting: PropTypes.func.isRequired,
  onRepoDetails: PropTypes.func.isRequired,
};

class TableBody extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isItemFreezed: false,
    };
  }

  onItemFreezedToggle = () => {
    this.setState({isItemFreezed: !this.state.isItemFreezed});
  }

  render() {
    let listItems = this.props.items.map((item, index) => {
      return (
        <Item 
          key={index} 
          data={item} 
          isItemFreezed={this.state.isItemFreezed}
          onItemFreezedToggle={this.onItemFreezedToggle}
          onRenameRepo={this.props.onRenameRepo}
          onDeleteRepo={this.props.onDeleteRepo}
          onTransfer={this.props.onTransfer}
          showDeleteItemPopup={this.props.showDeleteItemPopup}
          onHistorySetting={this.props.onHistorySetting}
          onRepoDetails={this.props.onRepoDetails}
        />
      );
    });

    return (
      <tbody>{listItems}</tbody>
    );
  }
}

TableBody.propTypes = propTypes;

export default TableBody;