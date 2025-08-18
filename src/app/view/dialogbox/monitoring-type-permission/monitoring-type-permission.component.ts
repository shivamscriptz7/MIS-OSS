import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from "src/app/services/common.service";

import { NgxUiLoaderService } from 'ngx-ui-loader';

import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';




interface TypeNode {
  display: any;
  value: any;
  children?: TypeNode[];
  isSelected: boolean;
}

@Component({
  selector: 'app-monitoring-type-permission',
  templateUrl: './monitoring-type-permission.component.html',
  styleUrls: ['./monitoring-type-permission.component.scss']
})
export class MonitoringTypePermissionComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MonitoringTypePermissionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, public service: CommonService,public ngxLoader: NgxUiLoaderService) { dialogRef.disableClose = true; }

  /**this method used for check  tree node childrens length */
  hasChild = (_: number, node: TypeNode) => !!node.children && node.children.length > 0;

  public permissionKeys: any;
  public module: any;
  public showModuleList: boolean = false;
  public selectRole: boolean = false;
  public userDetails: any;
  public treeControl = new NestedTreeControl<TypeNode>(node => node.children);
  public dataSource = new MatTreeNestedDataSource<TypeNode>();
  public dataSourceNew = new MatTreeNestedDataSource<TypeNode>();
  public childIsSelectedList = new Array();
  public selections = new Array();
  public typeCheckbox: boolean = false;
  public arrData = new Array();
  //public typePermissionForm: FormGroup;
  public selectedUser: any;
  public typeDataArr: any = [];
  public selectedUserListData: any = [];
  public typePermMsgFlag = 0;
  public createTypeDiv: boolean = false;
  public viewTypeDiv: boolean = true;
  public listingFlag = 0;
  public userTypeDropDown: boolean = false;
  public createTreeView: boolean = false;
  public typePermBtnForSubmit: boolean = true;
  public typePermResetBtnFlag: any;
  public filteredList: any;
  public navTotal: any;
  public navLimit: number = 5;
  public navPage: any = [];
  public navCurrent: number = 0;
  moduleList1: any = [];
  public currentPage: any;
  public filteredRoleList: any;
  public typePermResetBtn: boolean = true;

  public oldDataDivShow: boolean = false;

  ngOnInit(): void {
    this.dataSource.data = this.data.oldData;
    this.dataSourceNew.data = this.data.newData;
    this.oldDataDivShow = false;

  }

  pdfData: any = this.data?.changesData;
  @Output() sendData = new EventEmitter<any>();

  dialogClose() {
    this.dialogRef.close();
  }

  /**this method used for edit tyme parents and childs ke checkbox deakhne k liye true of false hai ya nai */
  statusChangAfterEdit(node: any) {
    if (node.isSelected) {
      this.selections.push(node);
      this.typeDataArr.push(node);
    }
    if (node.children && node.children.length > 0) {
      node.children.forEach((child: any) => {
        this.childIsSelectedList.push(child.isSelected);
        this.statusChangAfterEdit(child)
      });
      /** Check all childern is true then parent should be true */
      let count = 0; // to check foreach (child exits parents)
      let check: boolean = true;//Use if all child is true then check should be true
      node.children.forEach((child: any) => {
        check = check && child.isSelected;
        count = 1;
      })
      if (count == 1) {
        node.isSelected = check;
      }
    }
  }


  /** used for last childs selection not for parents */
  selectionToggleLastChilds(isChecked: boolean, node: any) {
    this.typePermResetBtn = false;
    if (isChecked == true) {
      this.typePermBtnForSubmit = false;
    } else if (isChecked == false) {
      this.typePermBtnForSubmit = false;
    }
    node.isSelected = isChecked;
    if (node.isSelected && !this.selections.includes(node)) {
      this.selections.push(node);
      this.typeDataArr.push(node);
    } else if (!node.isSelected && this.selections.includes(node)) {
      let deleteIndex = this.selections.indexOf(node);
      this.selections.splice(deleteIndex, 1);
      let deleteIndex1 = this.typeDataArr.indexOf(node);
      this.typeDataArr.splice(deleteIndex1, 1);
    }
  }

  /** used for parents selection not for last childs */

  selectionToggle(isChecked: any, node: any) {
    this.typePermResetBtn = false;
    /**used condition for back tracking as eg. last childs to grand parents */
    if (isChecked == true) {
      this.typePermBtnForSubmit = false;
    } else if (isChecked == false) {
      this.typePermBtnForSubmit = false;
    }

    if (node.children && node.children.length > 0) {
      node.children.forEach((child: any) => {

        this.selectionToggle(isChecked, child);
      });
    } else {
      /***Only used for Last child values which stored in typeDataArr varibale*/
      node.isSelected = isChecked;
      if (node.isSelected && !this.typeDataArr.includes(node)) {
        this.typeDataArr.push(node);
      }
      else if (!node.isSelected && this.typeDataArr.includes(node)) {
        let deleteIndex = this.typeDataArr.indexOf(node);
        this.typeDataArr.splice(deleteIndex, 1);
      }
    }

    /** for checkbox only  not for value and selection stored all objects parents and childs both*/
    node.isSelected = isChecked;
    if (node.isSelected && !this.selections.includes(node)) {
      this.selections.push(node);
    }
    else if (!node.isSelected && this.selections.includes(node)) {
      let deleteIndex = this.selections.indexOf(node);
      this.selections.splice(deleteIndex, 1);
    }
  }

  /**used for checked functionality */
  descendantsAllSelected(node: any) {
    let childIsSelectedList: any = [];
    if (node.children && node.children.length) {
      node.children.forEach((child: any) => {
        childIsSelectedList.push(child.isSelected);
      });
    }
    // scans to see if children are all true
    if (childIsSelectedList.length && childIsSelectedList.every((item: any) => {
      return item;
    })) {
      if (!this.selections.includes(node)) {
        this.selections.push(node);
      }
      return true;
    }

    /**used for recursion */
    if (node.children && node.children.length) {
      node.children.forEach((child: any) => {
        this.descendantsAllSelected(child);
      });
    }
  }

  addChildSelection(node: any) {
    if (node.children && node.children.length) {
      node.children.forEach((child: any) => {
        this.childIsSelectedList.push(child.isSelected);
        this.addChildSelection(child)
      });
    }
  }


  checkDescPartSelection(node: any) {
    this.childIsSelectedList = [];
    this.addChildSelection(node);
    // scans to see if children contain any false, but not all false
    if (this.childIsSelectedList.includes(false) && !this.childIsSelectedList.every(item => { return !item })) {
      return true;
    }
  }

  public logPdfDownLoad() {
    this.ngxLoader.start();
    this.service.generatePDFType(this.data.title);
    //this.ngxLoader.start();
  }

}
