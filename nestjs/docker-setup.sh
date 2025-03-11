#!/bin/sh

node dist/main.js &
tail -f /dev/null
