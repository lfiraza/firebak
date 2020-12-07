#!/bin/bash

    HEADER=$(head -1 $1)
    if [ -n "$2" ]; then
        CHUNK=$2
    else 
        CHUNK=1000
    fi

    FILE=$(basename "$1" ".csv")
    DIR=$(dirname "$1")
    SPLIT_PATH="${DIR}/${FILE}Split"

    tail -n +2 $1 | split --additional-suffix=.csv -dl $CHUNK - $SPLIT_PATH
    for i in ${SPLIT_PATH}*; do
        sed -i -e "1i$HEADER" "$i"
    done

sed -i -e 's/<csv-firebak-br>/\n/g' "${DIR}/*.csv"