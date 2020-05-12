# Publisher Script for CpE4020 Mini-Project

This JavaScript source file provides the functionality for our publisher in our mini-project for CpE4020: Device Networks. It uses the Johhny-Five robotics library for Node.JS in order to capture rotation data from our IMU sensor (the MPU-6050), which is then sent over a TCP connection to our desktop/laptop based broker as a JSON formatted string. This script was designed to run on the BeagleBone Black SBC, utilizing its GPIO for sensor data over I2C.
