#!/bin/sh

node dist/angular/server/server.mjs &
tail -f /dev/null
