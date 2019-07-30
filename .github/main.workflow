workflow "Deploy to GitHub Pages" {
  resolves = ["Deploy to gh-pages"]
  on = "push"
}

action "If branch is master" {
  uses = "actions/bin/filter@0dbb077f64d0ec1068a644d25c71b1db66148a24"
  args = "branch master"
}

action "Deploy to gh-pages" {
  needs = ["If branch is master"]
  uses = "JamesIves/github-pages-deploy-action@1.1.3"
  secrets = ["ACCESS_TOKEN"]
  env = {
    BRANCH = "gh-pages"
    FOLDER = "build"
    BUILD_SCRIPT = "npm install && npm run build"
  }
}
