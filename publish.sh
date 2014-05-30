#!/bin/sh
coffee -c -o index.coffee
mocha -R json | grep '"failures": \[\]' >/dev/null && npm publish || echo "Errors found"
