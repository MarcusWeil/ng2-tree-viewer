import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface TreeNode {
  name: string;
  folders?: TreeNode[];
  files?: { name: string, size?: string, lastModified?: string }[];
  expanded?: boolean;
  selected?: boolean;
  parent?: TreeNode;
  size?: string;
  lastModified?: string;
}

@Component({
  selector: 'app-tree-viewer',
  templateUrl: './tree-viewer.component.html',
  styleUrls: ['./tree-viewer.component.scss']
})
export class TreeViewerComponent implements OnInit {
  breadcrumbs: string[] = ['Root'];
  selectedNode: TreeNode | null = null;
  structure: TreeNode | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadTreeStructure();
  }

  loadTreeStructure() {
    this.http.get<TreeNode>('assets/old-tree-structure.json').subscribe(data => {
      this.structure = data;
      this.initializeParents(this.structure, null);
    });
  }

  initializeParents(node: TreeNode, parent: TreeNode | null) {
    node.parent = parent as TreeNode;
    if (node.folders) {
      node.folders.forEach(childNode => this.initializeParents(childNode, node));
    }
    if (node.files) {
      node.files.forEach(file => (file as any).parent = node);
    }
  }

  selectNode(node: TreeNode) {
    this.selectedNode = node;
    this.toggleExpand(node);
    this.updateBreadcrumbs(node);
    console.log('Node selected:', this.selectedNode);
  }

  toggleExpand(node: TreeNode) {
    node.expanded = !node.expanded;
  }

  updateBreadcrumbs(node: TreeNode) {
    const breadcrumbs = [];
    while (node) {
      breadcrumbs.unshift(node.name);
      node = node.parent!;
    }
    if (breadcrumbs.length > 0 && breadcrumbs[0] === '') {
      breadcrumbs.shift();
    }
    this.breadcrumbs = breadcrumbs;
  }

  isFile(node: any): boolean {
    // A node is considered a file if it has no folders and no files
    return !node.folders && !node.files;
  }

  isFolder(node: TreeNode): boolean {
    // A node is considered a folder if it does not have a size property
    return node.size === undefined;
  }
}
