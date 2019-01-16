import Tree from './tree';

class TreeHelper {

  loadedNode({node}) {
    return [];
  }
  
  loadedNodeByPath({path}) {  // for search item

  }

  expandNode({tree, node}) {
    let treeCopy = tree.clone();
    node = treeCopy.getNode(node);
    if (!node.isLoaded()) {
      let children = this.loadedNode(node);
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
    
  }

  findNodeByPath({tree, nodePath}) {

  }

  sortNodeChildren({tree, node, soryType}) {

  }

  addNodeToParentByPath({tree, nodePath}) {

  }

  addNodeListToParentByPath({tree, nodePaths}) {

  }

  renameNodeByPath({tree, nodePath, newName}) {

  }

  updateNodeByPath({tree, nodePath, key, newValue}) {

  }

  deleteNodeByPath({tree, nodePath}) {

  }

  deleteNodeListByPaths({tree, nodePaths}) {

  }

  moveNodeByPath({tree, nodePath, destPath}) {

  }

  moveNodeListByPaths({tree, nodePaths, destPath}) {

  }

  copyNodeByPath({tree, nodePath, destPath}) {

  }

  copyNodeListByPaths({tree, nodePaths, destPath}) {

  }

}