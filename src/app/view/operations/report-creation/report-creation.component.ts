import { Component, Inject, Injectable, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormGroupName, FormControl } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject, elementAt, ignoreElements } from "rxjs";
import { Regex } from 'src/app/shared/regex';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as CryptoJS from 'crypto-js';
import { data } from 'jquery';
import { MatTree } from '@angular/material/tree';
// dropdown 
export class ParentDropdown {
  children?: ParentDropdown[];
  display: string = '';
  parent_Id: any;
  type_Id: any;
}

/** Flat to-do item node with expandable and level information */
// child is in object - object & children dropdown 
export class ExpandDrpoDown {
  display: string = '';
  children?: any;
  level: any;
  parent_Id: any;
  type_Id: any;
  expandable: boolean = false;
}
@Injectable({ providedIn: "root" })
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<ParentDropdown[]>([]);
  treeData: any = [];
  get data(): ParentDropdown[] {
    return this.dataChange.value;
  }
}

@Component({
  selector: 'app-report-creation',
  templateUrl: './report-creation.component.html',
  styleUrls: ['./report-creation.component.scss'],
  providers: [ChecklistDatabase]
})
export class ReportCreationComponent implements OnInit {

  public typeId: any;
  public parentId: any;
  public typeName: any;
  public buttonName = 'Submit';
  public title = 'Create Report';
  public queryLabel = 'Query';
  public typeNameInput: boolean = false;
  public reportCreationForm: FormGroup;

  public userId: any;
  public userDetails: any;
  public userIdParm: any;
  // use for table data form 
  public tableDataArray: any = [];

  // radio button 
  public FILTER_TYPE: any = '';
  public tableData: any = [];
  // public hideShowDataTable: any = false;

  // use for update form
  public formatData: any;
  public updateTableData: any;

  // use for radio button in form here 0 for no and 1 for yes
  public radioItems: any = Array<string>;
  public radioBtnDisable: boolean = false;
  public addBtnDisable: boolean = false;
  public hideShowCheckbox: boolean = false;
  public selectedObject: any;

  public tableJsonData: any;
  public selectedRadioBtn: string = '1';

  // use for placeholderText when we change query dropdown 
  public placeholderText = 'Enter your Query here';

  // it is use for validation to prevent CIRCLE/BA in input field.
  public inputValueCheckWord: any;
  public preventKeywords = ['circle', 'ba']
  public validationInput: boolean = false;
  public disableAddBtn: any;
  public matchFilterVar: any = [];
  public preventKeywordsQuery = ['drop', 'truncate', 'delete', 'parellel']
  public validInputQueryField: boolean = false;
  public inputValues: any;
  public matchDataArray: any;
  public misMatchVarArray: any = [];
  public matchVariableArray: any = [];
  public checkInputLength: any;
  childNodeMap = new Map<ExpandDrpoDown, ParentDropdown>();

  @ViewChild(MatTree) tree!: MatTree<any>;// use this function collapse all nodes of mat tree dropdown 
  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<ParentDropdown, ExpandDrpoDown>();
  /** A selected parent node to be inserted */
  selectedParent: ExpandDrpoDown | null = null;
  /** The new item's name */
  treeControl: FlatTreeControl<ExpandDrpoDown>;
  treeFlattener: MatTreeFlattener<ParentDropdown, ExpandDrpoDown>;
  dataSource: MatTreeFlatDataSource<ParentDropdown, ExpandDrpoDown>;
  /** The selection for checklist */
  checklistSelection = new SelectionModel<ExpandDrpoDown>(true /* multiple */);
  // dropdown 
  queryBased: any = {
    query: [{ "id": 1, "name": "scheduler" }, { "id": 2, "name": "Immediate execution" }],
    procedure: [{ 'id': 1, "name": 'scheduler' }]
  };

  constructor(public fb: FormBuilder,
    public service: CommonService,
    public dialogRef: MatDialogRef<ReportCreationComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    // use for radio button 
    this.radioBtnDisable = true;
    this.radioItems = ['Yes', 'No'];
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<ExpandDrpoDown>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    this.reportCreationForm = this.fb.group({
      TYPE_ID: ['', []],
      REPO_NAME: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(Regex.spaceValidations)]],
      REPO_HEADER: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(Regex.spaceValidations)]],
      QUERY: ['', [Validators.required, Validators.pattern(/^select\s.*/i)]],
      PARENT_TYPE_ID: [, []],
      REPOID: [, []],
      TYPE_NAME: ['', []],
      PROCESS_TYPE: ['', [Validators.required]],
      EXECUTION_TYPE: ['', [Validators.required]],
      // filter type is a radio button
      FILTER_TYPE: ['0'], //For no = 0 for yes = 1
      REPORT_CIRCLE: [''],
      REPORT_BA: [''],
      FILTER_FIELDS: [],
      OUTPUT: ['', []]
    })
  }

  // we use this form for showing data in data table filterType is a form name 
  filterTypeForm: any = this.fb.group({
    type: ['', [Validators.required]],
    input: ['', [Validators.required, Validators.pattern(/^((?!( circle | ba | ba|ba | circle|circle )).)+$/)]],
    remarks: ['filter variable need to bind in select query with prefix #']

  })

  ngOnInit(): void {
    this.userDetails = localStorage.getItem('userData');
    let decryptUserData = CryptoJS.AES.decrypt(this.userDetails, 'Rw7]HwL5cXH$zkh').toString(CryptoJS.enc.Utf8);
    this.userDetails = JSON.parse(decryptUserData);

    this.fetchTypeNameData();
    this.updateReportForm();
    if (this.reportCreationForm.get('REPOID')?.value == null) {
      this.typeName = "Select type";
    }
  }


  // use form add data in table which is used in form
  onAddTableData() {
    // it is used for check duplicates in tableDataArray
    let checkDuplicte = 0;
    this.tableDataArray.forEach((item: any) => {
      if (item.toLowerCase() === this.filterTypeForm.get('input').value.toLowerCase()) {
        checkDuplicte = 1;
      }
    })
    if (this.tableData.length < 5) {
      if (!checkDuplicte) {
        this.tableDataArray.push(this.filterTypeForm.get('input').value); //this array used for match value in query field
        this.tableDataArray = Array.from(new Set(this.tableDataArray.map((item: any) => item.toLowerCase())));
        // this  array used to store table data in this array 
        this.tableData.push(this.filterTypeForm.getRawValue());
      } else {
        this.service.sweetAlertMsg('error', 'Filter variable is already exists.');
      }
      this.filterTypeForm.patchValue({ 'type': '', 'input': '' });
      this.tableJsonData = JSON.stringify(this.tableData);
      this.reportCreationForm.markAsDirty()
    }
    else {
      this.service.sweetAlertMsg('error', 'Limit Exceded,You can add maximum 5 variables')
      this.addBtnDisable = false;
      this.disableAddBtn = true;
    }
    this.inputFunctionValidation();
  }

  // it is use for delete data from table
  deleteTableData(i: number, value: any) {
    // it is used to delete a row from table 
    this.tableData.splice(i, 1);
    this.tableJsonData = JSON.stringify(this.tableData);
    //  it is used to delete a row from table 
    this.tableDataArray.splice(this.tableDataArray.indexOf(value.input), 1)
    // this.hideShowDataTable = this.tableData.length == 0 ? false : true;
    this.addBtnDisable = this.tableData.length > 5 ? false : true;
    this.inputFunctionValidation();
  }

  // it is use for radio button where yes = 1  and no = 0 
  radioButton(item: any) {
    this.tableData = [];
    this.tableDataArray = [];
    this.inputValues = [];
    this.reportCreationForm.patchValue({ 'QUERY': '', 'REPORT_CIRCLE': '', 'REPORT_BA': '' })
    this.selectedRadioBtn = item.value;
    this.hideShowCheckbox = item.source.value == 1 ? true : false;
    this.addBtnDisable = item.source.value == 1 ? true : false;
    this.matchVariableArray = []; //it is used for hide validation message at yes or no 
    this.misMatchVarArray = []; //it is used for hide validation message at yes or no

  }

  // it is use for get data in dependent dropdown on the basis of  query/ procedure drop down 
  getFilterQueryBased(item: any) {
    // it's used for query procedure validation
    this.queryProcedureValidation();
    this.selectedRadioBtn = item.target.value;
    this.reportCreationForm.get('OUTPUT')?.setValue('');
    this.placeholderText = 'Enter Query here.'
    if (item.target.value != '1') { // In --PROCESS_TYPE-- query = 1 and procedure = 2 
      this.hideShowCheckbox = false;
      this.queryLabel = 'Procedure name';
      //In --EXECUTION_TYPE-- scheduler = 1 and Immediate Execution = 2 
      this.reportCreationForm.patchValue({ 'EXECUTION_TYPE': '1', 'REPORT_CIRCLE': '', 'REPORT_BA': '', 'FILTER_TYPE': '', 'QUERY': '' });
      this.tableData = [];
      this.tableDataArray = [];
      // this.hideShowDataTable = this.tableData.length == 0 ? false : true;
      this.selectedObject = this.queryBased.procedure;
      this.placeholderText = 'Enter procedure name.'
    }
    else {
      this.queryLabel = 'Query';
      this.selectedObject = this.queryBased.query;
      this.reportCreationForm.get('QUERY')?.setValue('');
    }
  }

  // selected dropdown scheduler/Immediate execution value 
  selectedDrpdwnValue(item: any) {
    this.updateTableData = '';
    this.tableJsonData = '';
    // it is used for delete and save Filter_Fields data
    if (this.reportCreationForm.get('EXECUTION_TYPE')?.value == 2 && this.data.details.CHECK_STATUS != null) {
      this.service.sweetAlertMsgWarning('error', 'The report is already scheduled. The execution type must be set to Scheduler');
      this.reportCreationForm.get('EXECUTION_TYPE')?.setValue('1'); //YES=1 AND NO=0
    }
    else {

      this.selectedRadioBtn = item.target.value;
      this.tableDataArray = [];
      this.tableData = [];
      // this.hideShowDataTable = this.tableData.length == 0 ? false : true;
      this.reportCreationForm.patchValue({ 'REPORT_CIRCLE': '', 'REPORT_BA': '', 'QUERY': '' });
      if (item.target.value == '2') { //here Immediate execution = 2 and scheduler = 1
        this.radioBtnDisable = false;
        this.hideShowCheckbox = false;
        this.reportCreationForm.get('FILTER_TYPE')?.setValue('0'); //YES=1 AND NO=0
      }
      else {
        this.hideShowCheckbox = false;
        this.radioBtnDisable = true;
        this.filterTypeForm.value.FILTER_FIELDS = '';
        this.reportCreationForm.get('FILTER_TYPE')?.setValue('0');
        this.tableData = [];
        this.tableDataArray = [];
        // this.hideShowDataTable = this.tableData.length == 0 ? false : true;
      }
    }


  }

  // use this function collapse all nodes of mat tree dropdown 
  collapseMatTree() {
    // Use the treeControl to collapse all nodes
    this.tree.treeControl.collapseAll();
  }

  // using form controls
  get reportFormcontrol() {
    return this.reportCreationForm.controls;
  }

  public typeRequired: boolean = true;
  //sumbit report creation form  
  userReportFormSubmit() {

    if (this.typeId != this.data.details?.TYPE_ID && this.data.details?.REPOID != null) {
      this.service.sweetAlertMsg('warning', 'Please select valid type');
    }
    else if (this.typeId != '' && this.parentId != '') {
      if (this.reportCreationForm.valid) {
        if (this.matchVariableArray?.length == 0 && this.misMatchVarArray.length == 0) {
          const data = this.reportCreationForm.value;
          let obj = {
            REPOID: data.REPOID,
            TYPE_ID: this.typeId || data.TYPE_ID,
            REPO_NAME: data.REPO_NAME,
            REPO_HEADER: data.REPO_HEADER,
            QUERY: data.QUERY.replaceAll('\n', ' ') && data.QUERY.replaceAll(/\s+/g, ' '),
            PARENT_TYPE_ID: this.parentId || data.PARENT_TYPE_ID,
            PROCESS_TYPE: data.PROCESS_TYPE,
            EXECUTION_TYPE: data.EXECUTION_TYPE,
            FILTER_TYPE: data.FILTER_TYPE,
            REPORT_CIRCLE: data.REPORT_CIRCLE,
            REPORT_BA: data.REPORT_BA,
            FILTER_FIELDS: this.selectedRadioBtn == '1' && 'scheduler' && '2' ? this.tableJsonData ? this.tableJsonData : this.updateTableData : '',
            OUTPUT: data.OUTPUT,
            //prevData: this.data.details
          }

          let stringData = JSON.stringify(obj)
          let encryptData = CryptoJS.AES.encrypt(stringData, this.service.secretKeyEncrypt_Decrypt).toString();
          //console.log(encryptData, "encryptDataencryptData")

          this.service.postAPIMethod(`/addUpdateReport`, { obj: encryptData }).subscribe(
            (response: any) => {
              if (response?.result[0]?.ERR == 'X') {
                this.service.sweetAlertMsgWarning('error', response.result[0]?.MSG);
              }
              else {
                this.service.sweetAlertMsg('success', response.result[0]?.MSG);
                this.dialogRef.close(true);
                this.formatData = []
              }
            }
          )
        }
        else {
          this.service.sweetAlertMsgWarning('error', "The form is invalid or has extra variables with '#'. Please remove them.")

        }

      }
      else {
        this.service.sweetAlertMsgWarning('error', "The form is invalid or has extra variables with '#'. Please remove them.")
      }

    }
    else {
      this.service.sweetAlertMsg('warning', 'Please select type');
    }
  }

  // Update Report form
  updateReportForm() {
    if (this.data.details != "") {
      this.typeId = this.data.details.TYPE_ID;
      this.tableData = [];
      this.tableDataArray = [];
      this.buttonName = "Update"
      this.title = "Update Report"
      this.typeNameInput = true;
      this.radioBtnDisable = false;
      // use for hide show radio button 
      this.formatData = JSON.parse(this.data.details.REPORT_FORMAT);
      this.updateTableData = this.data.details.REPORT_FORMAT;
      // this.hideShowDataTable = true;
      this.tableData = this.formatData ? this.formatData : [];
      // use for push input data from tableData to tableDataArray 
      this.tableData.forEach((item: any) => {
        this.tableDataArray.push(item.input)
      });
      this.hideShowCheckbox = this.data.details.FILTER_TYPE == 1 ? true : false;
      // this is use for hide show data table at the time of update form 
      // this.hideShowDataTable = this.tableData.length == 0 ? false : true;
      // this is used for hide show add button at the time of update form 
      this.addBtnDisable = this.tableData.length > 5 ? true : false && true;
      if (this.data.details.PROCESS_TYPE == '1') {
        this.selectedObject = this.queryBased.query;
      }
      else {
        this.selectedObject = this.queryBased.procedure;
      }
      this.reportCreationForm.patchValue({
        TYPE_ID: this.data.details.TYPE_ID,
        TYPE_NAME: this.data.details.TYPE_NAME,
        REPO_NAME: this.data.details.REPO_NAME,
        REPO_HEADER: this.data.details.REPO_HEADER,
        QUERY: this.data.details.QUERY,
        REPOID: this.data.details.REPOID,
        PARENT_TYPE_ID: this.data.details.PARENT_TYPE_ID,
        PROCESS_TYPE: this.data.details.PROCESS_TYPE,
        EXECUTION_TYPE: this.data.details.EXECUTION_TYPE,
        FILTER_TYPE: this.data.details.FILTER_TYPE,
        REPORT_CIRCLE: this.data.details.REPORT_CIRCLE == 1 ? true : false, //here we use true = 1 and false = 0
        REPORT_BA: this.data.details.REPORT_BA == 1 ? true : false, //here we use true = 1 and false = 0
        FILTER_FIELDS: this.data.details.PROCESS_TYPE === '2' ? [] : this.formatData,
        OUTPUT: this.data.details.OUTPUT
      });

      // it is used to dynamic query input field title and placeholder 
      this.data.details.PROCESS_TYPE == '2' ? this.queryLabel = 'Procedure' : this.queryLabel = 'Query';
      this.data.details.PROCESS_TYPE == '2' ? this.placeholderText = 'Enter Procedure here.' : this.placeholderText = 'Enter Query here.';

      this.data.details.REPORT_BA == 1 ? this.tableDataArray.push('ba') : ''
      this.data.details.REPORT_CIRCLE == 1 ? this.tableDataArray.push('circle') : ''

      // it is used for check values exist or not if not then we map values from matchvalues to inputValues
      const matchValues = this.data.details.QUERY.match(/#[#a-zA-Z0-9_]+/g) || [];
      this.inputValues = matchValues.map((value: any) => value.split('#')[1]);

      this.checkInputLength = this.inputValues.length; // to check length # in query field and compare at submit time 

      this.misMatchVarArray = [];
      this.matchVariableArray = [];
      // it's used for query procedure validation
      this.queryProcedureValidation();
    }
  }

  public queryInputExtraWords: boolean = false
  // reset report Creation form 
  resetReportForm() {
    this.typeRequired = true;
    this.queryInputExtraWords = true;
    this.matchVariableArray.length = 0; //it is used for hide validation message at reset 
    this.misMatchVarArray.length = 0; //it is used for hide validation message at reset
    if (this.reportCreationForm.get('REPOID')?.value == null) {
      this.reportCreationForm.reset();
      this.typeName = "Select type";
      this.reportCreationForm.patchValue({ PROCESS_TYPE: '', EXECUTION_TYPE: '', FILTER_TYPE: '' })
      this.tableData = [];
      this.tableDataArray = [];
      this.typeId = '';
      this.parentId = '';
      // this.hideShowDataTable = true;
    }
    else {
      this.updateReportForm();
    }
    this.reportCreationForm.markAsUntouched();
    this.reportCreationForm.markAsPristine();
  }

  // fetch data for tree dropdown from this api  
  fetchTypeNameData() {
    this.userId = this.userDetails.USER_ID;
    this.service.getAPIMethod(`/fetchTypeNameData?userId=${this.userId}`).subscribe((res => {


      this.dataSource.data = res.result;
    }));
  }

  getLevel = (node: ExpandDrpoDown) => node.level;
  isExpandable = (node: ExpandDrpoDown) => node.expandable;
  getChildren = (node: ParentDropdown): ParentDropdown[] | undefined => node.children;
  hasChild = (_: number, _nodeData: ExpandDrpoDown) => _nodeData.expandable;
  hasNoContent = (_: number, _nodeData: ExpandDrpoDown) => _nodeData.display === "";

  //  Transformer to convert nested node to flat node. Record the nodes in maps for later use.
  transformer = (node: ParentDropdown, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const childdropDownNode =
      existingNode && existingNode.display === node.display
        ? existingNode
        : new ExpandDrpoDown();
    childdropDownNode.display = node.display;
    childdropDownNode.level = level;
    childdropDownNode.parent_Id = node.parent_Id;
    childdropDownNode.expandable = !!node.children;
    childdropDownNode.children = node.children;
    childdropDownNode.type_Id = node.type_Id;
    this.childNodeMap.set(childdropDownNode, node);
    this.nestedNodeMap.set(node, childdropDownNode);
    return childdropDownNode;
  };

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  selectDropDownValue(node: ExpandDrpoDown): void {
    this.parentId = node.parent_Id;
    this.typeId = node.type_Id;
    this.typeName = node.display;
    this.checklistSelection.toggle(node);
    this.typeRequired = false;
    this.reportCreationForm.get('TYPE_NAME')?.clearValidators();
  }

  // to show name on top when we select dropdown val It is used for placeholder
  getSelectedReportType() {
    return this.typeName;
  }

  // use for select value of circle and BA
  checkBoxData(event: any, type: any) {
    if (event.target.checked) {
      if (type == 'ba') {// if user checked ba
        this.reportCreationForm.get('REPORT_CIRCLE')?.patchValue('1');
        this.tableDataArray.find((ele: any) => ele == 'ba') ? this.tableDataArray : this.tableDataArray.find((ele: any) => ele == 'circle') ? this.tableDataArray.push('ba') : this.tableDataArray.push(...['ba', 'circle']);
      } else {
        this.tableDataArray.find((ele: any) => ele == 'circle') ? this.tableDataArray : this.tableDataArray.push('circle');
      }
    } else {
      if (type == 'ba') {// if user unchecked ba
        this.reportCreationForm.controls['REPORT_CIRCLE'].patchValue('1');
        this.tableDataArray.splice(this.tableDataArray.indexOf('ba'), 1);
      } else {
        this.tableDataArray.splice(this.tableDataArray.indexOf('circle'), 1);
      }
    }
    this.inputFunctionValidation();
  }

  // it is use for validation to prevent CIRCLE/BA in input field.
  inputValidation(item: any) {
    this.inputValueCheckWord = item.target.value.toLowerCase();
    // Check if any keyword is present in  inputValueCheckWord
    const keywordFound = this.preventKeywords.some(keyword => this.inputValueCheckWord.includes(keyword));
    if (keywordFound) {
      // Handle the case where a keyword is found in this.inputValueCheckWord
      this.disableAddBtn = true;
      this.validationInput = true;
    } else {
      // Handle the case where no keyword is found in this.inputValueCheckWord
      this.disableAddBtn = false;
      this.validationInput = false;
    }
  }


  // user for query validation 
  inputQueryFunction(item: any) {
    this.queryProcedureValidation();
    this.queryInputExtraWords = false;
    const itemValue = item.target.value;
    // we push all the values which starts from # for check extra filter variables
    this.matchFilterVar = [];
    let splitValues = itemValue.split(' ');
    // filter out any empty part 
    splitValues = splitValues.filter((item: any) => item.trim() !== '');
    splitValues.forEach((item: any) => {
      if (item.startsWith("#")) {
        this.matchFilterVar.push(item);
      }
    });

    // use for store input values in query textarea. 
    const matchValues = itemValue.match(/#[#a-zA-Z0-9_]+/g) || [];
    this.inputValues = matchValues.map((value: any) => value.split('#')[1]);

    // this.inputValues = this.matchFilterVar.map((value: any) => value.split('#')[1]);
    this.inputValues = Array.from(new Set(this.inputValues.map((item: any) => item.toLowerCase()))); // remove duplicacy from inputValues array
    this.inputFunctionValidation();

    if (this.reportCreationForm.get('PROCESS_TYPE')?.value != '1') {
      const keywordFound = this.preventKeywordsQuery.some(keyword => itemValue.includes(keyword));
      if (keywordFound) {
        // it is used for hide error message below TextArea
        this.validInputQueryField = true;
      } else {
        // Handle the case where no keyword is found in this.inputValueCheckWord
        this.validInputQueryField = false;
      }
    }
    this.checkInputLength = itemValue.replace(/[^#]/gi, "").length;
  }

  // it is used for match validation and with query field
  inputFunctionValidation() {
    this.matchVariableArray = [];
    this.misMatchVarArray = [];
    let inputText: any = []; //use to store input text 
    let tableData = [...this.tableDataArray]; // this array is used for store filter variable for match 
    this.inputValues?.forEach((inputValue: any) => {
      this.tableDataArray?.forEach((tableValue: any) => {
        if (inputValue?.toLowerCase() === tableValue?.toLowerCase()) {
          inputText.push(inputValue);
          const index = tableData.indexOf(tableValue);
          if (index >= 0) {
            tableData.splice(index, 1);
          }
        }
      });
    });

    this.matchDataArray = Array.from(new Set(inputText));
    this.matchVariableArray = tableData.map((item: any) => `#${item}`); // in this.matchVariableArray we shows filter variable need to add 

    // this line is used for show unmatched value without #
    this.inputValues == null || this.inputValues == undefined ? this.inputValues = [] : this.inputValues;
    this.misMatchVarArray = this.inputValues.filter((item: any) => !this.matchDataArray.includes(item)); // in this.misMatchVarArray we shows filter variable need to remove
    this.misMatchVarArray = this.misMatchVarArray.map((item: any) => `#${item}`);


  }

  // use for query procedure validation based on PROCESS_TYPE dropdown 
  queryProcedureValidation() {
    if (this.reportCreationForm.get('PROCESS_TYPE')?.value == '1') {
      this.reportFormcontrol['QUERY'].clearValidators();
      this.reportCreationForm.get("QUERY")?.updateValueAndValidity();
      this.reportFormcontrol['QUERY'].setValidators([Validators.required, Validators.pattern(/^\s*select\s.*/i)]);
      this.reportCreationForm.get("QUERY")?.updateValueAndValidity();
    }
    else {
      this.reportFormcontrol['QUERY'].clearValidators();
      this.reportCreationForm.get("QUERY")?.updateValueAndValidity();
      this.reportFormcontrol['QUERY'].setValidators([Validators.required, Validators.pattern(/^\S*$/)]);
      this.reportCreationForm.get("QUERY")?.updateValueAndValidity();
    }
  }

  /** function start
    * handle double space and numeric chacracter
    * */
  handle_Num_Val_Double_Space(evt: any) {
    if (evt.charCode == 32) {
      const value = evt.target.value;
      const lastCharIndex = value.length - 1;
      if (value.charAt(lastCharIndex) === ' ') {
        evt.preventDefault();
      }
    }
  }
}
