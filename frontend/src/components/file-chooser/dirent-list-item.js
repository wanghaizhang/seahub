import React from 'react';
import PropTypes from 'prop-types';
import { seafileAPI } from '../../utils/seafile-api';
import Dirent from '../../models/dirent';
import { Utils } from '../../utils/utils';

const propTypes = {
  isShowFile: PropTypes.bool,
  filePath: PropTypes.string,
  selectedPath: PropTypes.string,
  dirent: PropTypes.object.isRequired,
  repo: PropTypes.object.isRequired,
  onDirentItemClick: PropTypes.func.isRequired,
};

class DirentListItem extends React.Component {

  constructor(props) {
    super(props);

    let filePath = this.props.filePath ?  this.props.filePath +  '/' + this.props.dirent.name : '/' + this.props.dirent.name;
    
    this.state = {
      isShowChildren: false,
      hasRequest: false,
      hasChildren: true,
      filePath: filePath,
      direntList: [],
    };
  }

  onItemClick = (e) => {
    e.stopPropagation();  // need prevent event popup
    if (this.props.selectedPath !== this.state.filePath) {
      this.props.onDirentItemClick(this.state.filePath, this.props.dirent);
    } else {
      if (this.props.dirent.type === 'dir') {
        this.onToggleClick(e);
      }
    }
  }
  
  onToggleClick = (e) => {
    e.stopPropagation();  // need prevent event popup
    if (!this.state.hasRequest) {
      seafileAPI.listDir(this.props.repo.repo_id, this.state.filePath).then(res => {
        let direntList = [];
        res.data.forEach(item => {
          if (this.props.isShowFile === true) { // show dir and file
            let dirent = new Dirent(item);
            direntList.push(dirent);
          } else { // just show dir
            if (item.type === 'dir') {
              let dirent = new Dirent(item);
              direntList.push(dirent);
            }
          }
        });
        direntList = Utils.sortDirents(direntList, 'name', 'asc');
        this.setState({
          hasRequest: true,
          direntList: direntList,
        });
        if (res.data.length === 0 || direntList.length === 0) {
          this.setState({hasChildren: false});
        }
      });
    }
    
    this.setState({isShowChildren: !this.state.isShowChildren});
  }

  renderChildren = () => {
    return (
      <ul className="list-view-content">
        {this.state.direntList.map((dirent, index) => {
          return (
            <DirentListItem 
              key={index} 
              dirent={dirent}
              repo={this.props.repo}
              filePath={this.state.filePath}
              onItemClick={this.onItemClick}
              selectedPath={this.props.selectedPath}
              onDirentItemClick={this.props.onDirentItemClick}
              isShowFile={this.props.isShowFile}
            />
          );
        })}
      </ul>
    );
  }

  render() {
    return (
      <li className="file-chooser-item">
        {
          this.state.hasChildren && this.props.dirent.type !== 'file' &&
          <span className={`item-toggle fa ${this.state.isShowChildren ? 'fa-caret-down' : 'fa-caret-right'}`} onClick={this.onToggleClick}></span>
        }
        <span className={`item-info ${this.state.filePath === this.props.selectedPath ? 'item-active' : ''}`} onClick={this.onItemClick}>
          <span className={`icon far ${this.props.dirent.type === 'dir' ? 'fa-folder' : 'fa-file'}`}></span>
          <span className="name user-select-none ellipsis">{this.props.dirent && this.props.dirent.name}</span>
        </span>
        {this.state.isShowChildren && this.renderChildren()}
      </li>
    );
  }
}

DirentListItem.propTypes = propTypes;

export default DirentListItem;
