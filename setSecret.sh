#!/bin/sh

# Remove Previous Efforts, if it exists
rm -rf secret
# Make Directory
mkdir secret
# Import Key from Secret
echo "const weatherApiKey = '$1'; module.exports = weatherApiKey;" > secret/config.js

