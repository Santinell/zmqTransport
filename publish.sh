#!/bin/sh
coffee -c index.coffee
npm publish
#mocha -R json | grep '"failures": \[\]' >/dev/null && npm publish || echo "Errors found"
