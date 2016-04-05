#!/bin/bash
set -e

# Download
#  it will download the content of the `dist` directory into your current folder.
svn export --force https://github.com/KitaeAgency/guichet/trunk/dist/ ./

# Install
npm install