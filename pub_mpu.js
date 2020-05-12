/*
        Name: pub_mpu.js
        Created by: Daniel Castle
        Class: CpE4020 Device Networks
        Professor: Dr. Billy Kihei
        
        Description:
              This script acts as a very simple publisher for the publisher-subscriber
              architecture in our mini-project. It uses the Johnny-Five Robotics 
              library for JavaScript to create a simple, abstracted interface to our
              I2C based IMU (referenced as a 'Gyro'), the MPU6050, which then fetches
              its pitch, yaw, and roll in degrees.
              
              These angle measurements are then arranged and converted into the JSON
              format, which is sent over a simple TCP socket to our broker.
        
        References:
              Johnny-Five API documentation can be found here: 
                        http://johnny-five.io/api/
              [NOTE: check the documentation for Gyro/Accelerometer/IMU for MPU6050 info]
              
              Johnny-Five on Beaglebone Tutorial: 
                        https://morphocode.com/starting-with-johnny-five-on-the-beaglebone/
              [This tutorial helped me a little bit with setting up the BBB for Johnny-Five]
              
              TCP Socket programming tutorial can be found here:
                        https://www.hacksparrow.com/nodejs/tcp-socket-programming-in-node-js.html
              [This was given to us at the start of the semester, and has proven invaluable for our labs]
        

*/


/* require statements */
var net = require('net');
var five = require("johnny-five");
var BeagleBone = require('beaglebone-io');


/* networking variables */
var HOST = '192.168.7.1'; // local IP of my desktop from BBB USB ethernet connection 
var PORT = 12345;
var client = new net.Socket(); // create and instantiate the TCP Socket client

/* Johnny-Five Board variable [set to BeagleBone] */
var board = new five.Board({io: new BeagleBone()});





// 'ready' event handler -> executes after board/BBB HW init is completed
board.on('ready', function() { 
  
  /* Johnny-Five Gyro variable [set to MPU6050] */
  var gyro = new five.Gyro({controller:"MPU6050"});
  
  // 'change' event handler -> executes whenever gyro values change/exceed API threshold value
  gyro.on('change', function(){ 

    // fetch angles for pitch, yaw, and roll and store these in angleSet object
    var angleSet = {pitch_angle: (this.pitch.angle % 360), roll_angle: (this.roll.angle % 360), yaw_angle: (this.yaw.angle % 360)};
    
    // connect TCP client to send data to desktop TCP server
    client.connect(PORT, HOST, function() {
      
      console.log('Connection to desktop TCP server has succeeded.');
      // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
      
      // display the yaw/pitch/roll data to be sent as JSON
      console.log(JSON.stringify(angleSet));
      
      // send/write the JSON data to desktop TCP server
      client.write(JSON.stringify(angleSet));
      
    });
  })
});




// 'data' event handler -> accepts data from TCP server and displays it
client.on('data', function(message) {
  console.log('From desktop TCP server: ' + message);
  // close the TCP client socket
  client.destroy();
});




// 'close' event handler -> logs message to console when TCP socket is closed
client.on('close', function() {
  console.log('TCP connection has been closed.');
});
