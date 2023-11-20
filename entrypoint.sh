#!/bin/bash
/usr/bin/Xvfb -ac :99 -screen 0 1280x1024x24 &
export DISPLAY=:99
npm install
npm run test