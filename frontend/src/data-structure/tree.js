class Tree {

  constructor() {
    this.root = null;
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

  }

  addNodeListToParent(node, parentNode) {

  }

  deleteNode(node) {

  }

  deleteNodeList(nodeList) {

  }

  renameNode(Node, newName) {

  }

  updateNode(Node, key, newValue) {

  }

  moveNode(node, destNode) {

  }

  copyNode(node, destNode) {

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

  }

  collapseNode(node) {

  }

  isNodeChild() {

  }

  serializeToJson() {

  }

  deserializefromJson(json) {

  }

}

export default Tree;