/*
 * Project Name: BSNL_CONS_MIS.
 * Date: 13/04/2023
 * Author:Kajal Gulyani
 * Contact: Echelon Edge MIS Development Team.
 * Copyright: Echelon Edge Pvt. Ltd.
 */
const express = require('express');
const router = express.Router();
const userCtrl = require('./../controller/userController');
const permCtrl = require('./../controller/permissionController')
const reportCtrl = require('./../controller/reportController');
const operationCtrl = require('./../controller/operationController');
const monitoringCtrl = require('../controller/monitoringController');

/**
 * Rahul Code
 */


const auth = require("../CommonFiles/authService");
const dashboardCtrl = require('../controller/dashboardController');
// const { route } = require('../../../server');
router.post('/login', userCtrl.signIn);
router.get("/fetchLoginFlag", userCtrl.fetchLoginFlag);
router.post("/update_loginFlag", userCtrl.update_loginFlag);
router.post('/forgot-passowrd', userCtrl.forgotPassword);
router.post('/resetUserPassword', auth.verifyAuthToken, userCtrl.resetUserPassword);
router.post('/user/resetPswd', userCtrl.resetUserPswd);
router.post('/updateUserProfile', auth.verifyAuthToken, userCtrl.updateUserProfile);
router.post('/updateUserProfilePic', auth.verifyAuthToken, userCtrl.updateUserProfilePic);
router.get('/getUserProfileDetails', auth.verifyAuthToken, userCtrl.getUserProfileDetails);
router.get('/getZoneList', auth.verifyAuthToken, userCtrl.getZoneList);
router.get('/getCircleList', auth.verifyAuthToken, userCtrl.getCircleList);
router.get('/getSSAList', auth.verifyAuthToken, userCtrl.getSSAList);
// router.get('/getCityList', userCtrl.getCityList);
router.get('/getRoleList', auth.verifyAuthToken, userCtrl.getRoleList);
router.post('/addUpdateUserBackup', auth.verifyAuthToken, userCtrl.addUpdateUserBackup);
router.post('/addUpdateRole', auth.verifyAuthToken, userCtrl.addUpdateRole);
router.post('/activeDeleteRole', auth.verifyAuthToken, userCtrl.activeDeleteRole);
router.get('/getUserList', auth.verifyAuthToken, userCtrl.getUserList);
router.post('/activeDeleteUser', auth.verifyAuthToken, userCtrl.activeDeleteUser);
router.get("/refreshToken", auth.verifyAuthToken, userCtrl.refreshToken);
router.get("/getTypeList", auth.verifyAuthToken, userCtrl.getTypeList);
router.get('/getRoleForDropdown', auth.verifyAuthToken, userCtrl.getRoleForDropdown);
router.post('/addUpdateReport', auth.verifyAuthToken, userCtrl.addUpdateReport);
router.post('/addUpdateUser', auth.verifyAuthToken, userCtrl.addUpdateUser);
// change password
router.post('/changePassword', auth.verifyAuthToken, userCtrl.changePassword);

// get dashboard data
router.get('/getDashboardChartData', auth.verifyAuthToken, dashboardCtrl.getDashboardChartData);
router.get('/getDashboardCount', auth.verifyAuthToken, dashboardCtrl.getDashboardCount);
// reports routing
router.get('/getRepoTypeNameList', auth.verifyAuthToken, reportCtrl.getRepoTypeNameList);
router.get('/fetchTypeNameData', auth.verifyAuthToken, reportCtrl.fetchTypeNameData);
router.get('/getReportListing', auth.verifyAuthToken, reportCtrl.getReportListing);
router.post('/activeDeleteReport', auth.verifyAuthToken, reportCtrl.activeDeleteReport);
router.get('/fetchReportList', auth.verifyAuthToken, reportCtrl.fetchReportList);
router.get('/fetchRepoData', reportCtrl.fetchRepoData);
router.get('/fetchReportListData', auth.verifyAuthToken, reportCtrl.fetchReportListData);
router.get('/REP12PLANWISEREVENUE', auth.verifyAuthToken, reportCtrl.REP12PLANWISEREVENUE);
router.get('/SLR_REP41PAYMENTSSUMMARY', auth.verifyAuthToken, reportCtrl.SLR_REP41PAYMENTSSUMMARY);
router.get('/SLR_REPOAL1BILLSCANCELLED', auth.verifyAuthToken, reportCtrl.SLR_REPOAL1BILLSCANCELLED);
router.get('/SLR_REPAL2BILLSWRITEOFFV1', auth.verifyAuthToken, reportCtrl.SLR_REPAL2BILLSWRITEOFFV1);
router.get('/SLR_SECAREPLEDGRREVPOSTFX', auth.verifyAuthToken, reportCtrl.SLR_SECAREPLEDGRREVPOSTFX);
router.get('/SLR_SECBREPDISCORECOCLSEFX', auth.verifyAuthToken, reportCtrl.SLR_SECBREPDISCORECOCLSEFX);
router.get('/SLR_SECCDISCOUNTS', auth.verifyAuthToken, reportCtrl.SLR_SECCDISCOUNTS);
router.get('/SLR_REPOSECDREPAGINGDETAILS', auth.verifyAuthToken, reportCtrl.SLR_REPOSECDREPAGINGDETAILS);
router.get('/SLR_SECEREPORTUNADJCREDITS', auth.verifyAuthToken, reportCtrl.SLR_SECEREPORTUNADJCREDITS);
router.get('/SLR_SECGSUMRYUNALOCTDPAYMTS', auth.verifyAuthToken, reportCtrl.SLR_SECGSUMRYUNALOCTDPAYMTS);
router.get('/SLR_SECHREPDETALSSURCHARGE', auth.verifyAuthToken, reportCtrl.SLR_SECHREPDETALSSURCHARGE);
router.get('/SLR_SECISERVICETAX', auth.verifyAuthToken, reportCtrl.SLR_SECISERVICETAX);
router.get('/SLR_SECIGST', auth.verifyAuthToken, reportCtrl.SLR_SECIGST);
router.get('/SLR_SECIREPDETAILTAXOLD', auth.verifyAuthToken, reportCtrl.SLR_SECIREPDETAILTAXOLD);
router.get('/SLR_SECJREPREVSUBLEDACCT', auth.verifyAuthToken, reportCtrl.SLR_SECJREPREVSUBLEDACCT);
router.get('/SLR_EXCESSPAYMENTRECEIVED', auth.verifyAuthToken, reportCtrl.SLR_EXCESSPAYMENTRECEIVED);
router.get('/54CACCOUNTWISELISTOFOUTSTANDING', auth.verifyAuthToken, reportCtrl.SLR54CACCOUNTWISELISTOFOUTSTANDING);
router.get('/getFilterCircleData', auth.verifyAuthToken, reportCtrl.getFilterCircleData);
router.get('/getFilterBaData', auth.verifyAuthToken, reportCtrl.getFilterBaData);
// router.get('/PB54_C_RepoData', reportCtrl.PB54_C_RepoData);
router.get('/executeBillingQuery', auth.verifyAuthToken, reportCtrl.executeBillingQuery);
router.get('/getSelectedRepoLink', auth.verifyAuthToken, reportCtrl.getSelectedRepoLink);
router.get('/getAssignReportCount', auth.verifyAuthToken, reportCtrl.getAssignReportCount);

// permission routings
router.get('/getRepoData', auth.verifyAuthToken, permCtrl.getRepoData);
router.get('/getRoleTypeMenu', auth.verifyAuthToken, permCtrl.getRoleTypeMenu);
router.get('/getTypeRepoData', auth.verifyAuthToken, permCtrl.getTypeRepoData);
router.get('/getViewReportListing', auth.verifyAuthToken, permCtrl.getViewReportListing);
router.get('/fetchTypePermUserListingData', auth.verifyAuthToken, permCtrl.fetchTypePermUserListingData);
router.get('/getModuleList', auth.verifyAuthToken, permCtrl.getModuleList);
router.get('/getModuleListBasedOnReport', auth.verifyAuthToken, permCtrl.getModuleListBasedOnReport);
router.get('/fetchActiveUsers', auth.verifyAuthToken, permCtrl.fetchActiveUsers);
router.post('/addUpdateRolePermissions', auth.verifyAuthToken, permCtrl.addUpdateRolePermissions);
router.get('/getAllRolePermissions', auth.verifyAuthToken, permCtrl.getAllRolePermissions);
router.get('/getPermissionsByRoleId', auth.verifyAuthToken, permCtrl.getPermissionsByRoleId);
router.get('/getUnassignedRole', auth.verifyAuthToken, permCtrl.getUnassignedRole);
router.post('/deleteRolePerm', auth.verifyAuthToken, permCtrl.deleteRolePerm);
router.post('/deleteTypePermission', auth.verifyAuthToken, permCtrl.deleteTypePermission);
router.get('/getMenupermissions', auth.verifyAuthToken, permCtrl.getMenupermissions);
router.post('/addUpdateTypePermissions', auth.verifyAuthToken, permCtrl.addUpdateTypePermissions);

//operations Controller
router.get('/getReportListSchedule', auth.verifyAuthToken, operationCtrl.getReportListSchedule);
router.post('/addUpdateSchedule', auth.verifyAuthToken, operationCtrl.addUpdateSchedule);
router.get('/getScheduleListing', auth.verifyAuthToken, operationCtrl.getScheduleListing);
// router.post('/addUpdateSchedule', auth.verifyAuthToken, operationCtrl.addUpdateSchedule);
router.post('/activeScheduler', auth.verifyAuthToken, operationCtrl.activeScheduler);
router.get('/getScheduledReportList', auth.verifyAuthToken, operationCtrl.getScheduledReportList);
router.post('/DeleteScheduler', auth.verifyAuthToken, operationCtrl.deleteSchdeuler);
router.post('/exceuteScheduleManually', auth.verifyAuthToken, operationCtrl.exceuteScheduleManually);
// use for email config in scheduler
router.post('/addUpdateEmailConfig', auth.verifyAuthToken, operationCtrl.addUpdateEmailConfig);
router.get('/getEmailConfigListDetails', auth.verifyAuthToken, operationCtrl.getEmailConfigListDetails);
router.post('/deleteEmailConfig', auth.verifyAuthToken, operationCtrl.deleteEmailConfig);
router.get('/getAllUserEmailList', auth.verifyAuthToken, operationCtrl.getAllUserEmailList);

router.post('/SLR_PostApi_Method', auth.verifyAuthToken, reportCtrl.fetchREP_PLAN_WISE_REVENUE);
router.post('/SLR_PostApi_MethodExcel', auth.verifyAuthToken, reportCtrl.fetch_SLR_EXCEL_EXPORT);
router.get('/UNLINK_SLR_REPORT', auth.verifyAuthToken, reportCtrl.UNLINK_SLR_REPORT);

// for using monitoring controller
router.get('/getLogDetails', auth.verifyAuthToken, monitoringCtrl.getLogDetails);
router.get('/getLogModuleList', auth.verifyAuthToken, monitoringCtrl.getLogModuleList);
router.get('/getLogsFilteredData', auth.verifyAuthToken, monitoringCtrl.getLogsFilteredData);
router.get('/getScheduleLogDetails', auth.verifyAuthToken, monitoringCtrl.getScheduleLogDetails);
router.get('/getLogFilterDetails', auth.verifyAuthToken, monitoringCtrl.getLogFilterDetails);
router.get('/getUserLogList', auth.verifyAuthToken, monitoringCtrl.getUserLogList);
router.get('/getTypePermissionDataLog', auth.verifyAuthToken, monitoringCtrl.getTypePermissionDataLog);
router.get('/getFilePathOfMonitoring', auth.verifyAuthToken, monitoringCtrl.getFilePathOfMonitoring);
//router.get('/getTypePermissionDataLog', auth.verifyAuthToken, permCtrl.getTypePermissionDataLog);
router.post('/addUpdateMonitoring', auth.verifyAuthToken, monitoringCtrl.addUpdateMonitoring);
router.get('/getMonitoringListing', auth.verifyAuthToken, monitoringCtrl.getMonitoringListing);
router.get('/getJobList', auth.verifyAuthToken, monitoringCtrl.getJobList);
router.post('/deleteMonitoring', auth.verifyAuthToken, monitoringCtrl.deleteMonitoring);
router.post('/singleExecute', auth.verifyAuthToken, monitoringCtrl.singleExecute);


module.exports = router;