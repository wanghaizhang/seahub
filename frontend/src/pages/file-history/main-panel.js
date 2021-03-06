import React from 'react';
import PropTypes from 'prop-types';
import Prism from 'prismjs';
import Loading from '../../components/loading';
import DiffViewer from '@seafile/seafile-editor/dist/viewer/diff-viewer';
import '../../css/initial-style.css';

require('@seafile/seafile-editor/dist/editor/code-hight-package');

const contentClass = 'markdown-viewer-render-content';
const propTypes = {
  renderingContent: PropTypes.bool.isRequired,
  content: PropTypes.string,
  newMarkdownContent: PropTypes.string.isRequired,
  oldMarkdownContent: PropTypes.string.isRequired,
};

class MainPanel extends React.Component {

  componentDidMount() {
    Prism.highlightAll();
  }

  onSearchedClick = () => {
    //todos;
  }

  render() {
    return (
      <div className="main-panel">
        <div className="main-panel-center content-viewer">
          { 
            this.props.renderingContent ? 
              (<div className={contentClass + ' article'}><Loading /></div>) : 
              (<div className={contentClass + ' article'}>
                <DiffViewer 
                  newMarkdownContent={this.props.newMarkdownContent} 
                  oldMarkdownContent={this.props.oldMarkdownContent}
                />
              </div>)
          }
        </div>
      </div>
    );
  }
}

MainPanel.propTypes = propTypes;

export default MainPanel;
