import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable({ providedIn: 'root' })
export class CommonHelperService {
    totalRecords: number = 50;
    is_mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    constructor(private router: Router) { }


    /* Client side configuration for data static table */
    public settingDataTableNew(
        columnDefs: any = [],
        orders: any = [],
        paging = false,
        info = false,
        scrollX: any = false,
        scrollY: any = false,
        fixedColumns: any = false,
        scrollCollapse: any = false
    ) {

        // for mobile settings
        if (this.is_mobile) {
            scrollCollapse = true;
            scrollX = true;
        }

        return {
            paging: paging,
            pagingType: 'simple_numbers',
            pageLength: 10,
            processing: false,  //processing show on table if processing is true
            scrollY: scrollY,
            scrollCollapse: scrollCollapse,
            scrollX: scrollX,
            fixedColumns: fixedColumns,

            lengthMenu: [
                [10, 50, 100, 1000, 2000, 5000, 10000, -1],
                [10, 50, 100, 1000, 2000, 5000, 10000, 'All'],
            ],
            empty: 'No data available in table',
            searching: true,
            info: info,
            columnDefs: columnDefs,
            order: orders,
            language: {
                searchPlaceholder: 'Search',
                searchPanes: {
                    emptyPanes: 'There are no panes to display. :/',
                },
                lengthMenu: '_MENU_',
                //After Search No Data Available
                zeroRecords: '<div class="noavailable_listngall"><img src="../../assets/images/no-available.svg"><h4>No Result Found</h4></div>',
                info: 'Showing _START_ to _END_ of _TOTAL_ entries',
                infoEmpty: '',
                infoFiltered: '(filtered from _MAX_ total entries)',
                search: '',
                paginate: {
                    first: 'First',
                    next: 'Next <i class="fa-solid fa-angle-right"></i>',
                    previous: '<i class="fa-solid fa-angle-left"></i> Previous',
                    last: 'Last',
                },
            },
        };
    }

    /* Server side configuration for data table */
    public settingDataTableServer(
        columnDefs: any = [],
        orders: any = [],
        fixedColumns: any = true,
        lengthMenu: number[] = [10, 50, 100, 1000, 2000, 5000, 10000]
    ) {

        return {
            pagingType: 'simple_numbers',
            serverSide: true,
            processing: false,
            columnDefs: columnDefs,
            order: orders,
            lengthMenu: [
                lengthMenu,
                lengthMenu,
            ],
            searching: true,
            scrollY: '52vh',
            scrollX: true,
            scrollCollapse: true,
            searchDelay: 500,
            //paging:false,
            fixedColumns: fixedColumns,
            language: {
                searchPlaceholder: 'Search',
                lengthMenu: '_MENU_',
                //zeroRecords: '<div class="nodata-absolute"><h4>No Data Available</h4></div>',
                zeroRecords: '<div class="noavailable_listngall"><img src="../../assets/images/no-available.svg"> <p>No Data Available In Table</p></div>',
                //zeroRecords: '<img src="../../assets/images/no-available.svg">',
                info: 'Showing _START_ to _END_ of _TOTAL_ entries',
                infoEmpty: '',
                infoFiltered: '(filtered from _MAX_ total entries)',
                search: '',
                paginate: {
                    first: 'First',
                    next: 'Next',
                    previous: 'Previous',
                    last: 'Last',
                },
            },
        };
    }

    /* Method to add the parameters in the URL for DataTable */
    public dataTableParams(
        params: any,
        dataTablesParameters: any,
        pageOffset: number = 1,
        pageLimit: any,
        pageRecordsTotal: number = 0,
        search: string = '',
        ordering: string = '',
        filter: any = {},
        otherParams: any
    ) {

        pageLimit = dataTablesParameters.length;
        pageRecordsTotal = this.totalRecords;


        if (dataTablesParameters.start <= 1) {
            pageOffset = dataTablesParameters.start + 1;
        } else {
            pageOffset = (dataTablesParameters.start + pageLimit) / pageLimit;
        }

        if (dataTablesParameters.order.length > 0) {
            let column = dataTablesParameters.order[0];
            let columns = dataTablesParameters.columns;

            if (columns[column.column].data) {
                params.append(
                    'ordering',
                    column.dir === 'asc'
                        ? '-' + columns[column.column].data
                        : '' + columns[column.column].data
                );
            }
        } else {
            if (ordering) {
                params.append('ordering', ordering);


            } else {
            }
        }

        if (dataTablesParameters.search.value) {
            params.append('search', dataTablesParameters.search.value);
        }

        const isEmptyObj = Object.keys(filter).length;
        if (isEmptyObj > 0) {
            const filterArray = Object.keys(filter);
            filterArray.forEach(item => {
                params.append(item, filter[item] ? filter[item] : '');
            });
        }
        if (otherParams) {

            for (const [key, value] of Object.entries(otherParams)) {
                if (value) {
                    params.append(key, value);
                }

            }
        }

        if (pageLimit != '-1') {
            params.append('page', pageOffset);
            params.append('size', pageLimit);
        }

    }

    /* method to generate the base64 from image */
    public toDataURL(
        url: string,
        callback: {
            (dataUrl: any): void;
            (dataUrl: any): void;
            (arg0: string | ArrayBuffer): void;
        }
    ) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }



}
