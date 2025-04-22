export interface NodeData {
  id: string;
  name: string;
  parentId: string;
  [key: string]: any;
}

export interface TreeNode {
  children?: TreeNode[]; // 可选属性，仅非叶子节点有
  isLeaf?: boolean; // 可选属性，仅叶子节点有
  label: string;
  origin: NodeData;
  value: string;
}

export function buildTree(data: NodeData[]): TreeNode[] {
  const map = new Map<string, TreeNode>();
  const tree: TreeNode[] = [];

  // 首先将所有节点存入 map，方便后续查找
  data.forEach((item) => {
    const newNode: TreeNode = {
      isLeaf: true, // 默认所有节点都是叶子节点
      label: item.name,
      origin: item,
      value: item.id,
    };
    map.set(item.id, newNode);
  });

  // 构建树结构
  data.forEach((item) => {
    const node = map.get(item.id);
    const parentNode = map.get(item.parentId);

    if (parentNode) {
      if (!parentNode.children) {
        parentNode.children = [];
        delete parentNode.isLeaf; // 如果有子节点，则删除 isLeaf 属性
      }
      parentNode.children.push(node!);
    } else {
      // 如果没有父节点，则认为是顶层节点
      tree.push(node!);
    }
  });

  // 对子节点按照 id 字段的 ASCII 编码排序
  const sortChildren = (node: TreeNode) => {
    if (node.children) {
      node.children.sort((a, b) => a.value.localeCompare(b.value));
      node.children.forEach(sortChildren); // 递归排序子节点的子节点
    }
  };

  tree.forEach(sortChildren); // 从顶层节点开始排序

  return tree;
}

export function getDescendants(tree: TreeNode[], id: string): NodeData[] {
  const result: NodeData[] = [];

  // 递归查找目标节点并收集其子孙节点
  const findAndCollectDescendants = (
    node: TreeNode,
    targetId: string,
  ): boolean => {
    if (node.value === targetId) {
      // 找到目标节点，开始收集其子孙节点
      collectDescendants(node);
      return true;
    }

    if (node.children) {
      for (const child of node.children) {
        if (findAndCollectDescendants(child, targetId)) {
          return true;
        }
      }
    }

    return false;
  };

  // 递归收集子孙节点
  const collectDescendants = (node: TreeNode) => {
    if (node.children) {
      for (const child of node.children) {
        result.push(child.origin);
        collectDescendants(child);
      }
    }
  };

  // 从树的顶层开始查找目标节点
  for (const node of tree) {
    if (findAndCollectDescendants(node, id)) {
      break;
    }
  }

  return result;
}
