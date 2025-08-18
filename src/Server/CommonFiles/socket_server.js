"use strict";
const connection = require('../CommonFiles/connection').dbConnection;

let ioSocket = {};
let socketService = {};
let activeUserSessions = {};
let socketConnection = [];
let ioSocketID = '';
socketService.socketConnection = (io) => {
    try {
        ioSocket = io;
        socketConnection.push(io);
    } catch (error) {
        console.log(error);
    }
}

socketService.singleUserLogin = (userId) => {

    if (activeUserSessions[userId]) {
        activeUserSessions[userId] = new Date();
        socketService.singleUserLogout(userId);
    } else {
        activeUserSessions[userId] = new Date();
    }
    // Store array of socket IDs
};

socketService.singleUserLogout = (userId) => {
    // Emit logout event to all sockets associated with the user
    if (typeof ioSocket !== 'undefined' && ioSocket && ioSocket !== null) {
        socketConnection.forEach((socket) => {
            socket.emit(`logout${userId}`);
        });

    }
};


//when user delete from the superadmin
socketService.deleteUserLogout = (userId) => {
    // Emit logout event to all sockets associated with the user
    if (typeof ioSocket !== 'undefined' && ioSocket && ioSocket !== null) {
        socketConnection.forEach((socket) => {
            socket.emit(`delLogout${userId}`);
        });

    }
};

// Function to check if a user is logged in
socketService.isUserLoggedIn = (userId) => {
    return activeUserSessions[userId];
};

socketService.dissconnect = (io) => {
    ioSocket = io;
    const index = socketConnection.indexOf(io);
    if (index > -1) {
        socketConnection.splice(index, 1);
    }
}


//this function is used for send jobstepsdata using socket
socketService.viewStepsMonitoring_old = (data) => {
    // console.log("Emitting data via socket...");
    socketConnection.forEach((socket) => {
        socket.emit(`viewSteps`, data);
    });
};


//this function is used for send jobstepsdata using socket
socketService.viewStepsMonitoring = (jobData) => {
    socketConnection.forEach((socket) => {
        socket.emit(`viewSteps`, jobData);
    });

}

socketService.fileData = (data) => {
    socketConnection.forEach((socket) => {
        socket.emit(`file`, data);
    });

}




module.exports = socketService;