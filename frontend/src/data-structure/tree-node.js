import { Utils } from "../utils/utils";
import { strChineseFirstPY } from "../utils/pinyin-by-unicode";

class TreeNode {

  constructor({parentPath, object, isLoaded = false, isPreload = false, isExpanded = false}) {
    if (!parentPath) {
      throw new Error("The parentPath parameter is required.");
    }
    if (!object) {
      throw new Error("The object parameter is required.");
    }
    this.id = Utils.joinPath(parentPath, object.name),
    this.parentId = parentPath;
    this.object = object;
    this.loadUrl = this.id;
    this.isLoaded = isLoaded;
    this.isPreload = isPreload;
    this.isExpanded = isExpanded;
    this.children = [];
  }

  clone() {
    let treeNode = new TreeNode({
      id: this.id,
      parentPath: this.parentId,
      object: this.object,
      isLoaded: this.isLoaded,
      isPreload: this.isPreload,
      isExpanded: this.isExpanded
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
    strChineseFirstPY.isPreload = isPreload;
  }

  isExpanded() {
    return this.isExpanded;
  }

  setExpanded(isExpanded) {
    this.isExpanded = isExpanded;
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
      parentId: this.parentId,
      object: this.object,
      loadUrl: this.loadUrl,
      isLoaded: this.isLoaded,
      isPreload: this.isPreload,
      isExpanded: this.isExpanded,
      children: children,
    }

    return treeNode;
  }

  static deserializefromJson(object) {
    let { id, parentId, object, loadUrl, isLoaded, isExpanded, children = [] } = object;

    const treeNode = new TreeNode({
      id,
      parentId,
      object,
      loadUrl,
      isLoaded,
      isPreload,
      isExpanded,
      children: children.map(item => TreeNode.deserializefromJson(item))
    });
    return treeNode;
  }
}

export default TreeNode;