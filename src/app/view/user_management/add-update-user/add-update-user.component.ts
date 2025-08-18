import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable, map, startWith } from 'rxjs';
import { StatusChangeDialogBoxComponent } from '../../dialogbox/status-change-dialog-box/status-change-dialog-box.component';
import { Regex } from 'src/app/shared/regex';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-add-update-user',
  templateUrl: './add-update-user.component.html',
  styleUrls: ['./add-update-user.component.scss']
})

export class AddUpdateUserComponent implements OnInit {
  public typeData: any = [];
  public roleData: any = [];
  public zonelength: any;
  public typelength: any;
  public zoneDropDownList: any = [];
  public circleDropDownList: any = [];
  public circleBoolean = true;
  public selectedZone: any = [];
  public zoneCheck: boolean = false;
  public allZoneCheck: boolean = false;
  public allSelected = false;
  public allCircleCheck: boolean = false;
  public circleCheck: boolean = false;
  public filteredZones: any;
  public filteredTypes: any
  public filteredCircle: any;
  public filteredSSA: any;
  public allTypeCheck: boolean = false;
  public typeCheck: boolean = false;
  public userName: boolean = false;
  public ssaDropDownList: any = [];
  public ssaBoolean = true;
  public selectedCircle: any = [];
  public ssaCheck: boolean = false;
  public allssaCheck: boolean = false;
  public circleElement: any = [];
  public selectedElementSSA: any = [];
  public searchTextType = new FormControl();
  public searchTextSSA = new FormControl();
  public searchTextCircle = new FormControl();
  public filteredList_type = new Observable<any[]>;
  public filteredList_ssa = new Observable<any[]>;
  public filteredList_circle = new Observable<any[]>;
  public selectedValue: any = {
    'circle': [],
    'ssa': []
  };

  passwordValidatorRegex: any = {
    lowerCase: /(?=.*[a-z])/,
    upperCase: /(?=.*[A-Z])/,
    minimunSeven: /(?=.{8,15})/,
    oneNumber: /(?=.*[0-9])/,
    specialCharacter: /(?=.*[$@$#!%*?&^*])/
  };
  // declared form user_management form
  userAddUpdateForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router,
    public service: CommonService, public dialogRef: MatDialogRef<AddUpdateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, public ngxLoader: NgxUiLoaderService) {


    this.userAddUpdateForm = this.fb.group({
      user_id: ['',],

      first_name: ["", [Validators.required, Validators.pattern(Regex.userSpaceValidations)]],
      last_name: ['', [Validators.pattern('[a-zA-Z ]*')]],
      user_name: ['', [Validators.required, Validators.pattern('^[a-z0-9_-]{1,50}$')]],
      user_contact: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      //user_email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      //user_email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(echelonedge.com)$/)]],
      // user_email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@echelonedge\.com$/i)]],
      user_email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z]+[a-zA-Z0-9._-]+@(echelonedge.com)$/i)]],
      user_role: ['', [Validators.required,]],
      circle: [[], [Validators.required]],
      zone: [[], [Validators.required]],
      type: [[], [Validators.required]],
      ssa: [[], [Validators.required]],

    })

  }
  ngOnInit(): void {
    this.getZoneList();
    this.getTypelist();
    this.getRoleList();
    this.EditUpdateUser();
  }


  /*
    use for closed UserdialogBox
  */


  public closeUserDialogRef() {
    this.dialogRef.close(false);
  }



  /** function start
   * handle double space and numeric chacracter
   * */
  isWhiteSpace(char: any) {
    return (/\s/).test(char);
  }
  doubleSpace(evt: any) {
    let willCreateWSS = false;
    if (this.isWhiteSpace(evt.key)) {
      let elmInput = evt.currentTarget;
      let content = elmInput.value;
      let posStart = elmInput.selectionStart;
      let posEnd = elmInput.selectionEnd;
      willCreateWSS = (
        this.isWhiteSpace(content[posStart - 1] || '')
        || this.isWhiteSpace(content[posEnd] || '')
      );
    }
    return willCreateWSS;
  }

  handle_Num_Val_Double_Space(evt: any) {
    evt = (evt || window.event);
    let charCode = (evt.which || evt.keyCode);
    return ((
      (charCode > 32)
      && (charCode < 65 || charCode > 90)
      && (charCode < 97 || charCode > 122)
    ) || this.doubleSpace(evt)) ? false : true;

  }

  /** 
 * function end
 * */


  /* 
    call getzone api to get zone data
  */
  getZoneList() {
    this.service.getAPIMethod('/getZoneList').subscribe((res => {
      this.zoneDropDownList = res.result;
      this.filteredZones = this.zoneDropDownList.slice();
      this.zonelength = this.zoneDropDownList.length;
    }));

  }


  //  display zone name in Html
  displayZoneName(value: any) {
    let name = '';
    this.zoneDropDownList.forEach((element: any) => {
      if (element.ZONE_ID === value) {
        name = element.ZONE_NAME;
      }
    });
    return name;
  }

  //  display typeName name in Html
  displayTypeName(value: any) {
    let name = '';
    this.typeData.forEach((element: any) => {
      if (element.TYPE_ID === value) {
        name = element.TYPE_NAME;
      }
    });
    return name;
  }


  // display circleName in Html
  displayCircleName(value: any) {
    let name = '';
    this.circleDropDownList.forEach((element: any) => {
      if (element.CIRCLE_ID === value) {
        name = element.CIRCLE_NAME;
      }
    });
    return name;
  }


  /* 
    call getType api to get type filed data
  */
  getTypelist() {
    this.service.getAPIMethod('/getTypeList').subscribe((res => {
      this.typeData = res.result;
      this.filteredTypes = this.typeData.slice();
      this.typelength = this.typeData.length;

    }));
  }


  /**
   * get role data 
   */
  getRoleList() {
    this.service.getAPIMethod('/getRoleForDropdown').subscribe((res => {
      this.roleData = res.result;
    }));
  }

  // on selection of  type
  onSelectType(typeId: any) {
    this.typeCheck = false;
    this.allTypeCheck = false;
    if (typeId[0] == '-1') {
      this.typeCheck = true;
      this.userAddUpdateForm.controls['type'].patchValue(['-1']);
    } else if (typeId[0] != '-1' && typeId.length == this.typelength) {
      this.userAddUpdateForm.controls['type'].patchValue(['-1']);
      this.typeCheck = true;
    }
    else if (typeId[0] != '-1' && typeId.length > 0) {
      this.allTypeCheck = true
    }
    else {
      this.typeCheck = false;
      this.allTypeCheck = false;
    }
  }

  public duplicateCircle: any = [];
  public duplicateSSA: any = [];
  // onselection function zone 
  public zoneArr: any = [];
  public dataCircleVal: any = [];
  onItemSelectZone(zoneId: any, flag: any) {


    this.allZoneCheck = false;
    this.zoneCheck = false;
    zoneId = zoneId ? zoneId : [];
    this.zoneArr = [...zoneId];
    if (zoneId[0] == "-1") { //if Zone set to all
      this.zoneCheck = true;
      this.userAddUpdateForm.controls['zone'].patchValue(['-1']);
      this.zoneDropDownList.forEach((ele: any) => {
        this.zoneArr.push(ele.ZONE_ID);
      })

    }
    else if (zoneId[0] != '-1' && zoneId.length == this.zonelength) {
      this.userAddUpdateForm.controls['zone'].patchValue(['-1']);
      this.zoneCheck = true;
    }
    else if (zoneId[0] != '-1' && zoneId.length > 0) {
      this.allZoneCheck = true
    } else {
      this.zoneCheck = false;
      this.allZoneCheck = false;
    }

    this.selectedZone = this.zoneArr;
    this.ngxLoader.start();
    this.service.getAPIMethod(`/getCircleList?zone_id=${this.zoneArr}`).subscribe((res => {
      this.circleDropDownList = [];


      this.circleDropDownList = res.result.ERR != 'X' ? res.result : [];
      // this.circleDropDownList = res.result ? res.result : [];
      this.duplicateCircle = [...this.circleDropDownList]
      //onChnage zone onItemSelectCircle called
      let circleArray = this.duplicateCircle?.map((e: any) => {
        return +e.CIRCLE_ID
      })


      let valData: any = [];
      //flag used for edit case
      if (flag == 'edit') {
        this.onItemSelectCircle(((this.data?.details.CIRCLE_ID == 'All') ? ['-1'] : this.stringToArray(this.data?.details.CIRCLE_ID)), "edit");
        this.data.details.CIRCLE_ID == 'All' ? this.userAddUpdateForm.controls["circle"].patchValue(["-1"]) : this.userAddUpdateForm.controls["circle"].patchValue(this.stringToArray(this.data.details.CIRCLE_ID));
        this.data.details.CIRCLE_ID == 'All' ? this.circleCheck = true : this.allCircleCheck = true;
      } else {

        //this.allCircleCheck = false;
        this.circleElement == undefined ? this.circleElement = [] : this.circleElement = this.circleElement;
        valData = circleArray.filter((item: any) => this.circleElement.includes(item));

        zoneId[0] == '-1' ? valData = ['-1'] : valData;
        this.userAddUpdateForm.controls['circle']?.value == '-1' && zoneId[0] != '-1' ? this.userAddUpdateForm.controls['circle']?.patchValue('') : valData;
        setTimeout(() => {
          zoneId[0] == '-1' ? this.userAddUpdateForm.controls['circle'].patchValue(['-1']) : this.userAddUpdateForm.controls['circle'].patchValue(valData);
        }, 100);

        this.onItemSelectCircle(valData, "")

      }

      //used for search circle
      this.filteredCircle = this.circleDropDownList.slice();
      this.ngxLoader.stop();
      //this.zoneArr?.length > this.zonelength ? this.allCircleCheck = true : this.allCircleCheck = false;
      if (flag != "edit") {
        if (zoneId[0] == '-1') {
          this.circleBoolean = true;
        }

      } else {
        this.data.details.CIRCLE_ID == 'All' ? this.userAddUpdateForm.controls["circle"].patchValue(["-1"]) : this.userAddUpdateForm.controls["circle"].patchValue(this.stringToArray(this.data.details.CIRCLE_ID));
        this.data.details.CIRCLE_ID == 'All' ? this.circleCheck = true : this.allCircleCheck = true;
      }

      //if zone dropdown checkbox is not checked
      if (zoneId?.length == 0) {
        this.userAddUpdateForm.controls["circle"].patchValue('');
      }

    }));

  }


  //method used for get circle
  public onItemSelectCircle(ele: any, flag: any) {
    this.circleElement = [...ele];
    let circleArr: any = [...ele];
    this.circleCheck = false;
    this.allCircleCheck = false;
    if (ele[0] == '-1') {
      this.circleDropDownList.forEach((ele: any) => {
        circleArr.push(ele.CIRCLE_ID);
      })
      this.allCircleCheck = false;
      this.circleCheck = true;
    }
    else if (ele[0] != '-1' && ele.length > 0) {

      this.allCircleCheck = true
    } else {
      this.circleCheck = false;
      this.allCircleCheck = false;
    }
    // use set for select circle according to zone 
    let selZone = new Set();
    for (let i = 0; i < ele?.length && ele[0] != '-1'; i++) {
      selZone.add(this.duplicateCircle.find(({ CIRCLE_ID }: any) => CIRCLE_ID === ele[i]).ZONE_ID);
    }
    let lenght = this.zonelength <= this.selectedZone?.length ? this.zonelength : this.selectedZone?.length;
    //if circle is not selected according to zone then system shows error
    lenght != selZone.size && ele[0] != '-1' ? this.circleBoolean = false : this.circleBoolean = true;
    // fetch ssa according circle and zone
    // ele[0] == '-1' ? circleArr : circleArr = this.userAddUpdateForm.controls['circle'].value;
    this.selectedCircle = circleArr;
    this.ngxLoader.start();
    this.service.getAPIMethod(`/getSSAList?circle_id=${circleArr}&&zone_id=${this.zoneArr}`).subscribe((res => {
      this.allssaCheck = true;
      this.ssaDropDownList = res.result ? res.result : [];
      //used for search circle
      this.duplicateSSA = [...this.ssaDropDownList]
      let ssaArray = this.ssaDropDownList.map((e: any) => {
        return +e.SSA_CODE
      })

      // condition used for edit case
      let ssaValData: any = [];
      if (flag == 'edit') {
        this.onItemSelectSsa(((this.data?.details.SSA_ID == 'All') ? ['-1'] : this.stringToArray(this.data?.details.SSA_ID)));
      } else {
        this.selectedElementSSA == undefined ? this.selectedElementSSA = [] : this.selectedElementSSA = this.selectedElementSSA;
        ssaValData = ssaArray.filter((item: any) => this.selectedElementSSA.includes(item));
        ele[0] == '-1' ? ssaValData = ['-1'] : ssaValData;
        setTimeout(() => {
          ele[0] == '-1' ? this.userAddUpdateForm.controls['ssa'].patchValue(['-1']) : this.userAddUpdateForm.controls['ssa'].patchValue(ssaValData);
        }, 100);
        this.userAddUpdateForm.controls['ssa']?.value == '-1' ? this.userAddUpdateForm.controls['ssa']?.patchValue('') : ssaValData;

        this.onItemSelectSsa(ssaValData)
      }

      this.ngxLoader.stop();
      // circleArr.length > ele.length ? this.allssaCheck = true : this.allssaCheck = false;
      if (flag != "edit") {
        //this.userAddUpdateForm.controls["ssa"].patchValue(["-1"]);

      } else {

        this.data.details.SSA_ID == 'All' ? this.userAddUpdateForm.controls["ssa"].patchValue(["-1"]) : this.userAddUpdateForm.controls["ssa"].patchValue(this.stringToArray(this.data.details.SSA_ID));
        this.data.details.SSA_ID == 'All' ? this.ssaCheck = true : this.allssaCheck = true;
      }

      // if circle dropdown checkbox is not checked
      if (ele?.length == 0) {
        this.userAddUpdateForm.controls["ssa"].patchValue('');
      }

    }));


  }



  // using form controls
  get addUserFormcontrol() {
    return this.userAddUpdateForm.controls;
  }





  // submit User_management form
  userFormSubmit() {
    try {
      if (this.userAddUpdateForm.valid) {

        const data = { ...this.userAddUpdateForm.value, };
        // data=data.USER_ROLE.toString();

        let typePrevData = this.stringToArray(this.data.details.TYPE_ID);
        if (this.userAddUpdateForm.value.zone[0] != -1) {
          data.zone = `${data.zone}`;
        } else {
          data.zone = '-1';
        }

        if (this.userAddUpdateForm.value.circle[0] != -1) {
          data.circle = `${data.circle}`;
        } else {
          data.circle = '-1';
        }

        if (this.userAddUpdateForm.value.ssa[0] != -1) {
          data.ssa = `${data.ssa}`;
        } else {
          data.ssa = '-1';
        }


        let object = {
          data: data,
          //prevData: this.data.details
        }

        if (data.user_id != "" && data.user_id != null) {  // this condition used when update case

          typePrevData[0] != '-1' ? data.prevType = `${typePrevData}` : data.prevType = '-1';

          if (JSON.stringify(this.userAddUpdateForm.value.type) != JSON.stringify(typePrevData)) { // this condition used for when user chnage type option
            const dialogRef = this.dialog.open(StatusChangeDialogBoxComponent,
              {
                data: {
                  heading: 'Confirmation',
                  title: "Are you sure you want to change the type of permission? If you click OK, the user type permissions will be removed.",
                  buttonName: 'ok'
                },
                width: '400px',
                height: 'auto'
              }
            );
            dialogRef.afterClosed().subscribe((closeResult: any) => {
              if (closeResult) {  // this condition used for click ok on confirmation box 
                this.userAddUpdateForm.value.type[0] != -1 ? data.type = `${data.type}` : data.type = '-1';

                let stringData = JSON.stringify(object.data)
                let encryptData = CryptoJS.AES.encrypt(stringData, this.service.secretKeyEncrypt_Decrypt).toString();
                this.service.postAPIMethod(`/addUpdateUser`, { data: encryptData }).subscribe(
                  (response: any) => {
                    if (response?.result[0]?.ERR == 'X' || response.statusCode == 400) {
                      this.service.sweetAlertMsg('error', response.result[0].MSG);
                    } else {
                      this.service.sweetAlertMsg('success', response.result[0].MSG);
                      this.dialogRef.close(true);
                    }
                  }
                )

              } else { // this condition used for click cancel on confirmation box
                this.userAddUpdateForm.value.type[0] != -1 ? data.type = `${typePrevData}` : data.type = '-1';
                this.dialogRef.close(true);
              }
            });
          } else {
            this.userAddUpdateForm.value.type[0] != -1 ? data.type = `${data.type}` : data.type = '-1';
            let stringData = JSON.stringify(object.data)

            let encryptData = CryptoJS.AES.encrypt(stringData, this.service.secretKeyEncrypt_Decrypt).toString();

            this.service.postAPIMethod(`/addUpdateUser`, { data: encryptData }).subscribe(
              (response: any) => {
                if (response?.result[0]?.ERR == 'X' || response.statusCode == 400) {
                  this.service.sweetAlertMsg('error', response.result[0].MSG);
                } else {
                  this.service.sweetAlertMsg('success', response.result[0].MSG);
                  this.dialogRef.close(true);
                }
              }
            )
          }
        } else { // this condition used for creation case

          if (this.userAddUpdateForm.value.type[0] != -1) {
            data.type = `${data.type}`;
          } else {
            data.type = '-1';
          }

          let stringData = JSON.stringify(object.data)

          let encryptData = CryptoJS.AES.encrypt(stringData, this.service.secretKeyEncrypt_Decrypt).toString();
          this.service.postAPIMethod(`/addUpdateUser`, { data: encryptData }).subscribe(
            (response: any) => {
              if (response?.result[0]?.ERR == 'X' || response.statusCode == 400) {
                this.service.sweetAlertMsg('error', response.result[0].MSG);
              } else {
                this.service.sweetAlertMsg('success', response.result[0].MSG);
                this.dialogRef.close(true);
              }
            }
          )

        }

      }

    } catch (e) {
      this.service.sweetAlertMsg('error', e);
    }
  }

  //string to array conversion use for type/circle/zone/ssa
  stringToArray(item: any) {
    if (!item) {
      return '';
    }
    if (item === "All") {
      return ['-1'];
    }
    let itemData = item.split(',').map((item: any) => {
      return JSON.parse(item);
    })
    return itemData;
  }


  EditUpdateUser() {
    if (this.data.details.USER_ID) {
      setTimeout(() => {                           // <<<---using ()=> syntax
        this.onItemSelectZone(((this.data.details.ZONE_ID == 'All') ? ['-1'] : this.stringToArray(this.data.details.ZONE_ID)), "edit");
      }, 1000);

      this.userName = true;
    }




    if (this.data.details != "") {
      this.userAddUpdateForm.patchValue({
        user_id: this.data.details.USER_ID.toString(),
        user_name: this.data.details.USER_NAME,
        first_name: this.data.details.FIRST_NAME,
        last_name: this.data.details.LAST_NAME,
        user_contact: this.data.details.USER_CONTACT,
        user_email: this.data.details.USER_EMAIL,
        user_role: +this.data.details.USER_ROLE,
        type: this.stringToArray(this.data.details.TYPE_ID),
        zone: this.stringToArray(this.data.details.ZONE_ID),
        ssa: this.stringToArray(this.data.details.SSA_ID)
      })
      this.onSelectType(this.stringToArray(this.data.details.TYPE_ID))

    }
    setTimeout(() => {                           // <<<---using ()=> syntax
      // 
    }, 1000);
  }
  onReset() {
    this.userAddUpdateForm.markAsPristine();
    if (this.data.details) {
      this.EditUpdateUser();
    } else {
      this.userAddUpdateForm.reset();
      this.circleDropDownList = [];
      this.selectedZone = [];
      this.onItemSelectZone([], "")
      this.allTypeCheck = false;
      this.typeCheck = false;
      this.allZoneCheck = false;
      this.allCircleCheck = true;
      this.userAddUpdateForm.controls['user_role'].patchValue('');
      this.userAddUpdateForm.controls['type'].patchValue([]);
      this.userAddUpdateForm.controls['zone'].patchValue([]);
      if (this.userAddUpdateForm.controls['zone'].value.length == 0) {
        this.userAddUpdateForm.controls['circle'].patchValue([]);
      } else if (this.userAddUpdateForm.controls['circle'].value.length == 0) {
        this.userAddUpdateForm.controls['ssa'].patchValue([]);
        this.ssaDropDownList = [];
      }
    }

  }

  public onItemSelectSsa(ele: any) {

    this.selectedElementSSA = [...ele];
    this.ssaCheck = false;
    this.allssaCheck = false;

    if (ele[0] == '-1') {
      this.ssaCheck = true;
    }

    else if (ele[0] != '-1' && ele?.length > 0) {
      this.allssaCheck = true

    } else {
      this.ssaCheck = false;
      this.allssaCheck = false;
    }
    // use set for select circle according to zone 
    let selZone = new Set();
    for (let i = 0; i < ele?.length && ele[0] != '-1'; i++) {
      selZone.add(this.duplicateSSA.find(({ SSA_CODE }: any) => SSA_CODE === ele[i]).MKT_CODE);
    }

    let lenght = this.duplicateCircle?.length <= this.selectedCircle?.length ? this.duplicateCircle?.length : this.selectedCircle?.length;
    //if circle is not selected according to zone then system shows error
    //lenght != selZone.size && ele[0] != '-1' ? this.circleBoolean = false : this.circleBoolean = true;
    //if circle is not selected according to zone then system shows error
    lenght != selZone.size && ele[0] != '-1' ? this.ssaBoolean = false : this.ssaBoolean = true;
  }


  //  display ssa name in Html
  displaySsaName(value: any) {
    let name = '';
    this.ssaDropDownList.forEach((element: any) => {
      if (element.SSA_CODE === value) {
        name = element.SC_DESC;
      }
    });

    return name;
  }


  // use for prevent numeric value in input field.
  preventNumericInput(event: KeyboardEvent): void {
    // Check if the pressed key is a number
    const isNumber = /[0-9]/.test(event.key);

    // If the pressed key is a number, prevent the default behavior
    if (isNumber) {
      event.preventDefault();
    }
  }


  setSelectedValues(type: string = '') {
    if (this.userAddUpdateForm.controls[type].value && this.userAddUpdateForm.controls[type].value.length > 0) {
      this.userAddUpdateForm.controls[type].value.forEach((e: any) => {
        if (this.selectedValue[type].indexOf(e) == -1) {
          this.selectedValue[type].push(e);
        }
      })
    }

  }

  selectionChange(event: any, type: string = '') {
    if (event.isUserInput && event.source.selected == false) {
      let index = this.selectedValue[type].indexOf(event.source.value);
      this.selectedValue[type].splice(index, 1);
    }
  }



  public serachCir: any = '';
  public serachSSA: any = '';
  openChangeCircle(e: any) {
    this.serachCir = '';
    if (e) {
      this.selectedValue['circle'] = [...this.userAddUpdateForm.controls['circle'].value];
    } else {
      this.userAddUpdateForm.controls['circle'].patchValue([...this.selectedValue['circle']])
      this.selectedValue['circle'] = []
      this.circleDropDownList = [...this.duplicateCircle];
    }

  }



  selectionChangeCircle(event: any, type: string = '') {
    if (event.isUserInput) {
      if (event.source.selected == false) {
        let index = this.selectedValue[type].indexOf(event.source.value);
        this.selectedValue['circle'].splice(index, 1);
      } else {
        let index = this.selectedValue[type].indexOf(event.source.value);
        if (index == -1) {

          this.selectedValue['circle'].push(event.source.value);
        }
      }
      this.userAddUpdateForm.controls['circle'].markAsDirty();
      this.userAddUpdateForm.controls['circle'].patchValue([...this.selectedValue['circle']]);
      this.onItemSelectCircle(this.selectedValue['circle'], '')
    }
  }

  searchFun(e: any) {
    this.circleDropDownList = [...this.duplicateCircle];
    if (e.target.value) {
      this.circleDropDownList = this.circleDropDownList.filter((element: any) => {
        return element.CIRCLE_NAME.toUpperCase().includes(e.target.value.toUpperCase());
      })
    } else {
      this.circleDropDownList = [...this.duplicateCircle];
    }

  }


  openChangeSSA(e: any) {

    this.serachSSA = '';
    if (e) {
      this.selectedValue['ssa'] = [...this.userAddUpdateForm.controls['ssa'].value];
    } else {
      this.userAddUpdateForm.controls['ssa'].patchValue([...this.selectedValue['ssa']])
      this.selectedValue['ssa'] = []
      this.ssaDropDownList = [...this.duplicateSSA];
    }

  }

  searchFunSSA(e: any) {
    this.ssaDropDownList = [...this.duplicateSSA];
    if (e.target.value) {
      this.ssaDropDownList = this.ssaDropDownList.filter((element: any) => {
        return element.SC_DESC.toUpperCase().includes(e.target.value.toUpperCase());
      })

    } else {
      this.ssaDropDownList = [...this.duplicateSSA];
    }
  }


  selectionChangeSSA(event: any, type: string = '') {
    if (event.isUserInput) {
      if (event.source.selected == false) {
        let index = this.selectedValue[type].indexOf(event.source.value);
        this.selectedValue['ssa'].splice(index, 1);
      } else {
        let index = this.selectedValue[type].indexOf(event.source.value);
        if (index == -1) {
          this.selectedValue['ssa'].push(event.source.value);
        }
      }
      this.userAddUpdateForm.controls['ssa'].markAsDirty();
      this.userAddUpdateForm.controls['ssa'].patchValue([...this.selectedValue['ssa']])
      this.onItemSelectSsa(this.selectedValue['ssa']);
    }

  }



}
