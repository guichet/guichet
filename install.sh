#!/bin/bash
set -e

# Colors & Text
GREEN='\033[32m'
GRAY='\033[30m'
NC='\033[0m' # No Color
CHECK="${GREEN}✔${NC}"

# Arguments
REACT=false
WORDPRESS=false
NOMAKEDIRS=false
SVN=false

function usage()
{
    echo "Usage"
    echo "-----"
    echo "-h --help"
    echo "--nomakedirs=$NOMAKEDIRS"
    echo "--svn=$SVN"
    echo "--react=$REACT"
    echo "--wordpress=$WORDPRESS"
    echo ""
}

while [ "$1" != "" ]; do
    PARAM=`echo $1 | awk -F= '{print $1}'`
    VALUE=`echo $1 | awk -F= '{print $2}'`
    case $PARAM in
        -h | --help)
            usage
            exit
            ;;
        --react)
            REACT=true
            ;;
        --wordpress|--wp)
            WORDPRESS=true
            ;;
        --nomakedirs)
            NOMAKEDIRS=true
            ;;
        --svn)
            SVN=true
            ;;
        *)
            echo "ERROR: unknown parameter \"$PARAM\""
            usage
            exit 1
            ;;
    esac
    shift
done

# Download
#  it will download the content of the `dist` directory into your current folder.
echo -e "\n${GRAY}┌-───────────────────────┐"
echo -e "│${NC} 📥  Downloading Guichet ${GRAY}│"
echo -e "└────────────────────────┘${NC}"
svn export --force -q https://github.com/KitaeAgency/guichet/trunk/dist/ ./
echo -e "  ${CHECK}  Guichet downloaded"


# Install
echo -e "\n${GRAY}┌────────────────────────────┐"
echo -e "│${NC} 📝  Installing dependencies ${GRAY}│"
echo -e "└────────────────────────────┘${NC}"
npm install --silent
echo -e "  ${CHECK}  Dependencies installed"

# Directory structure
if [[ $NOMAKEDIRS = false ]]; then
    echo -e "\n${GRAY}┌─────────────────────────┐"
    echo -e "│${NC} 📁  Creating directories ${GRAY}│"
    echo -e "└─────────────────────────┘${NC}"
    mkdir -p ./img/ ./img/src/ ./js/ ./js/internals/ ./js/vendor/ ./sass/ ./sass/vendor/ ./css/
    echo -e "  ${CHECK}  Directory structure created"
fi

# SVN
if [[ $SVN = true ]]; then
    echo -e "\n${GRAY}┌───────────────────────┐"
    echo -e "│${NC} 🕙  Set SVN Properties ${GRAY}│"
    echo -e "└───────────────────────┘${NC}"
    svn propset svn:ignore "node_modules" .
    echo -e "  ${CHECK}  SVN ignore set"
    svn add ./*
    echo -e "  ${CHECK}  SVN add done"
fi