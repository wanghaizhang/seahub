import Tree from './tree';

class TreeHelper {

  loadNode({node}) {
    return [];
  }
  
  loadNodeByPath({path}) {  // for search item

  }

  expandNode({tree, node}) {
    let treeCopy = tree.clone();
    node = treeCopy.getNode(node);
    if (!node.isLoaded()) {
      let children = this.loadNode(node);
      treeCopy.addNodeListToParent(children, node);
    }
    treeCopy.expandNode(node);

    return treeCopy;
  }

  collapseNode({tree, node}) {
    let treeCopy = tree.clone();
    treeCopy.collapseNode(node);
    return treeCopy;
  }

  refreshNode({tree, node}) { // force flush
    let treeCopy = tree.clone();
    node = tree.getNode(node);
    let children = this.loadNode(node);
    treeCopy.addNodeListToParent(children, node);

    return treeCopy;
  }

  findNodeByPath({tree, nodePath}) {
    let treeCopy = tree.clone();
    let node = treeCopy.getNodeByPath(nodePath);
    return node;
  }

  sortNodeChildren({tree, node, soryType}) {
    // todo
  }

  addNodeToParentByPath({tree, nodePath, destPath}) {
    // parentNode is exist
    let treeCopy = tree.clone();
    let parentNode = treeCopy.getNodeByPath(destPath);
    // todo
  }

  addNodeListToParentByPath({tree, nodePaths}) {

  }

  renameNodeByPath({tree, nodePath, newName}) {
    let treeCopy = tree.clone();
    let node = treeCopy.getNodeByPath(nodePath);
    treeCopy.renameNode(node, newName);
    return treeCopy;
  }

  updateNodeByPath({tree, nodePath, keys, newValues}) {
    let treeCopy = tree.clone();
    let node = treeCopy.getNodeByPath(nodePath);
    treeCopy.updateNode(node, keys, newValues);
    return treeCopy;
  }

  deleteNodeByPath({tree, nodePath}) {
    let treeCopy = tree.clone();
    let node = treeCopy.getNodeByPath(nodePath);
    treeCopy.deleteNode(node);
    return treeCopy;
  }

  deleteNodeListByPaths({tree, nodePaths}) {
    let treeCopy = tree.clone();
    nodePaths.forEach(nodePath => {
      let node = treeCopy.getNodeByPath(nodePath);
      treeCopy.deleteNode(node);
    });
    return treeCopy;
  }

  moveNodeByPath({tree, nodePath, destPath}) {
    let treeCopy = tree.clone();
    let node = treeCopy.getNodeByPath(nodePath);
    let destNode = treeCopy.getNodeByPath(destPath);
    if (destNode) {
      treeCopy.moveNode(node, destNode);  // same library
    } else {
      treeCopy.deleteNode(node);          // different library
    }
    // load data again
    return treeCopy;
  }

  moveNodeListByPaths({tree, nodePaths, destPath}) {
    let treeCopy = tree.clone();
    let destNode = treeCopy.getNodeByPath(destPath);
    nodePaths.forEach(nodePath => {       // same library
      if (destNode) {
        let node = treeCopy.getNodeByPath(nodePath);
        treeCopy.moveNode(node, destNode);
      } else {                            // different library
        treeCopy.delete(node);
      }
      // load data again
    });
    return treeCopy;
  }

  copyNodeByPath({tree, nodePath, destPath}) {
    let treeCopy = tree.clone();
    let node = treeCopy.getNodeByPath(nodePath);
    let destNode = treeCopy.getNodeByPath(destPath);
    if (destNode) {
      treeCopy.copyNode(node, destNode);
      // load data again
    }
  }
  
  copyNodeListByPaths({tree, nodePaths, destPath}) {
    let treeCopy = tree.clone();
    let destNode = treeCopy.getNodeByPath(destPath);
    nodePaths.forEach(nodePath => {
      let node = treeCopy.getNodeByPath(nodePath);
      if (destNode) {
        treeCopy.copyNode(node, destNode);
        // load data again
      }
    })
  }

}