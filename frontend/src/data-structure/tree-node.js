import { Utils } from "../utils/utils";

class TreeNode {

  constructor({id, object, isLoaded = false, isPreload = false, isExpanded = false}) {
    if (!id) {
      throw new Error("The id parameter is required.");
    }
    if (!object) {
      throw new Error("The object parameter is required.");
    }
    this.id = id,
    this.object = object;
    this.loadUrl = this.id;
    this.isLoaded = isLoaded;
    this.isPreload = isPreload;
    this.isExpanded = isExpanded;
    this.children = [];
    this.parentNode = null;
  }

  clone() {
    let treeNode = new TreeNode({
      id: this.id,
      object: this.object,
      loadUrl: this.loadUrl,
      isLoaded: this.isLoaded,
      isPreload: this.isPreload,
      isExpanded: this.isExpanded,
      parentNode: this.parentNode,
    });
    treeNode.children = this.children.map(child => {
      let newChild = child.clone();
      return newChild;
    });

    return treeNode;
  }

  isLoaded() {
    return this.isLoaded;
  }

  setLoaded(isLoaded) {
    this.isLoaded = isLoaded;
  }

  isPreload() {
    return this.isPreload;
  }

  setPreLoad(isPreload) {
    this.isPreload = isPreload;
  }

  isExpanded() {
    return this.isExpanded;
  }

  setExpanded(isExpanded) {
    this.isExpanded = isExpanded;
  }

  getParentNode() {
    return this.parentNode;
  }

  setParentNode(parentNode) {
    this.parentNode = parentNode;
  }

  hasChildren() {
    return this.children.length;
  }

  sortTreeChildren(sortType) {
    Utils.sortDirents(sortType);
  }

  serializeToJson() {
    let children = [];
    if (this.hasChildren) {
      children = this.children.map(m => m.serializeToJson());
    }

    const treeNode = {
      id: this.id,
      object: this.object,
      loadUrl: this.loadUrl,
      isLoaded: this.isLoaded,
      isPreload: this.isPreload,
      isExpanded: this.isExpanded,
      parentNode: this.parentNode,
      children: children,
    }

    return treeNode;
  }

  static deserializefromJson(object) {
    let { id, object, loadUrl, isLoaded, isExpanded, parentNode, children = [] } = object;

    const treeNode = new TreeNode({
      id,
      parentId,
      object,
      loadUrl,
      isLoaded,
      isPreload,
      isExpanded,
      parentNode,
      children: children.map(item => TreeNode.deserializefromJson(item))
    });
    return treeNode;
  }
}

export default TreeNode;