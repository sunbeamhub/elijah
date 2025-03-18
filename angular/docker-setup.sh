#!/bin/sh

node dist/${IMAGE_TAG}/server/server.mjs &
tail -f /dev/null
