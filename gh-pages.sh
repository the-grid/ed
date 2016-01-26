if [ "$TRAVIS_TAG" = "" ]
then
   echo "Not a tag, not publishing"
   exit 0
else
   echo "==> Building and publishing demo tag $TRAVIS_TAG <=="
fi

#!/bin/bash
set -e # exit with nonzero exit code if anything fails

# run our compile script, discussed above
npm run builddemo

# move demo stuff around
mkdir dist/webpack
mv dist/demo.js dist/webpack/demo.js
mv dist/demo.map dist/webpack/demo.map

# go to the build directory and create a *new* Git repo
cd dist
git init

# inside this git repo we'll pretend to be a new user
git config user.name "Travis CI"
git config user.email "f.bot@forresto.com"

# The first and only commit to this new Git repo contains all the
# files present with the commit message "Deploy to GitHub Pages".
git add .
git commit -m "demo $TRAVIS_TAG to gh-pages"

# Force push from the current repo's master branch to the remote
# repo's gh-pages branch. (All previous history on the gh-pages branch
# will be lost, since we are overwriting it.) We redirect any output to
# /dev/null to hide any sensitive credential data that might otherwise be exposed.
git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1