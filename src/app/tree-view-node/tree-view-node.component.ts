import { Component, Input, Output, EventEmitter } from '@angular/core';

interface TreeNode {
  name: string;
  folders?: TreeNode[];
  files?: { name: string }[];
  expanded?: boolean;
  parent?: TreeNode;
}

@Component({
  selector: 'app-tree-view-node',
  templateUrl: './tree-view-node.component.html',
  styleUrls: ['./tree-view-node.component.scss']
})
export class TreeViewNodeComponent {
  @Input() node!: TreeNode;
  @Output() nodeSelected = new EventEmitter<TreeNode>();
  @Input() depth: number = 0;
  @Input() selectedNode: TreeNode | null = null;

  onNodeClick(node: TreeNode) {
    this.nodeSelected.emit(node);
  }

  isFolder(node: TreeNode): boolean {
    return node.folders !== undefined;
  }
}
