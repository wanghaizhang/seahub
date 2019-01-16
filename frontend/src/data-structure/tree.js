class Tree {

  constructor() {
    this.root = null;
  }

  clone() {

  }

  setRoot(node) {
    this.root = node;
  }

  getNode(node) {
    let findNode = null;
    function callback(currentNode) {
      if (currentNode.id === node.id) {
        findNode = currentNode;
        return true;
      }
      return false;
    }
    this.traverseDF(callback);
    return findNode;
  }

  getNodeParent(node) {
    let node = this.getNode(node);
    return node.parentNode;
  }

  getNodeChildren(node) {
    let node = this.getNode();
    return node.children;
  }

  getNodeChildrenObject(node) {
    let node = this.getNode();
    let objects = node.children.map(item => {
      let object = item.object;
      return object;
    });
    return objects;
  }

  addNodeToParent(node, parentNode) {
    parentNode = this.getNode(parentNode);
    parentNode.addChild(node);
  }

  addNodeListToParent(nodeList, parentNode) {
    parentNode = this.getNode(parentNode);
    nodeList.forEach(node => {
      parentNode.addCihld(node);
    });
  }

  deleteNode(node) {
    let parentNode = this.getNode(node.parentNode);
    parentNode.deleteChild(node);
  }

  deleteNodeList(nodeList) {
    nodeList.forEach(node => {
      this.deleteNode(node);
    });
  }

  renameNode(node, newName) {
    node = this.getNode(node);
    node.rename(newName);
  }

  updateNode(node, key, newValue) {
    node = this.getNode(node);
    node.updateObjectParam(key, newValue);
  }

  moveNode(node, destNode) {
    // add
    destNode = this.getNode(destNode);
    destNode.addChild(node);

    // delete
    let parentNode = this.getNode(node.parentNode);
    parentNode.deleteChild(node);
  }

  copyNode(node, destNode) {
    // add
    destNode = this.getNode(destNode);
    destNode.addChild(node);
  }

  traverseDF() {
    let stack = [];
    let found = false;
    stack.unshift(this.root);
    let currentNode = stack.shift();
    while (!found && currentNode) {
      found = callback(currentNode) == true ? true : false;
      if (!found) {
        stack.unshift(...currentNode.children);
        currentNode = stack.shift();
      }
    }
  }

  traverseBF() {
    let queue = [];
    let found = false;
    queue.push(this.root);
    let currentNode = queue.shift();
    while (!found && currentNode) {
      found = callback(currentNode) === true ? true : false;
      if (!found) {
        queue.push(...currentNode.children);
        currentNode = queue.shift();
      }
    }
  }

  expandNode(node) {
    node = this.getNode(node);
    node.setExpanded(true);
  }
  
  collapseNode(node) {
    node = this.getNode(node);
    node.setExpanded(false);
  }

  isNodeChild(node, parentNode) {
    parentNode = this.getNode(parentNode);
    node = this.getNode(node);
  }

  serializeToJson() {

  }

  deserializefromJson(json) {

  }

}

export default Tree;