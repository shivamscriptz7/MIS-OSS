"use strict";

function dateFormat(date){

    try {
        let objectDate = new Date(date);
        let day = objectDate.getDate();
        console.log(day); // 2
        let month = objectDate.getMonth();
        console.log(month + 1); // 8
        let year = objectDate.getFullYear();
        console.log(year); // 2022

     let dateFormat = day + "-" + month + "-" + year;
     console.log(dateFormat); // 23-7-2022
        
    } catch (error) {
        
    }

}