#!/bin/sh

setup_git() {
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "SweetieBot-Github"
  [[ -e package-lock.json ]] && rm package-lock.json
}

commit() {
  git checkout master
  git add .
  git commit --message "Travis build: $TRAVIS_BUILD_NUMBER"
}

upload_files() {
  git push --quiet https://${GH_TOKEN}@github.com/imurx/sweetiebot-klasa.git > /dev/null 2>&1
}

setup_git
commit
upload_files

exit
