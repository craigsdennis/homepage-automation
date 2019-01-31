#!/usr/bin/env sh

# abort on errors
set -e

cd public

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:craigsdennis/homepage-automation.git master:gh-pages

cd -