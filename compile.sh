#!/bin/sh
coffee -c index.coffee
mocha -R spec
