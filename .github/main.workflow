workflow "Deploy to GitHub Pages" {
  resolves = ["Deploy to gh-pages"]
  on = "push"
}

action "Deploy to gh-pages" {
  uses = "JamesIves/github-pages-deploy-action@1.1.3"
  secrets = ["ACCESS_TOKEN"]
  env = {
    BRANCH = "gh-pages"
    FOLDER = "build"
    BUILD_SCRIPT = "npm install && npm run deploy"
  }
}
