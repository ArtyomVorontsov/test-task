#!/bin/sh

npx tsc setup.ts && 
node setup.js &&
rm setup.js &&
rm types.js

