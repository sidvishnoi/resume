const path = require("path");
const fs = require("fs").promises;
const puppeteer = require("puppeteer");
const exec = require("util").promisify(require("child_process").exec);

async function main() {
  console.group(arguments.callee.name);

  const { hash } = await getLatestCommit();
  const buildDir = path.join(__dirname, "build");
  await fs.mkdir(buildDir);

  const files = [
    "resume.css",
    "index.html",
    "icons/pdf.svg",
    "icons/twitter.svg",
    "icons/github.svg",
    "icons/linkedin.svg",
    "icons/stackoverflow.svg",
  ];
  await copyFiles(files, __dirname, buildDir);

  await printPDF(buildDir);
  await updateServiceWorkerVersion(hash, buildDir);

  console.groupEnd();
}

main()
  .then(() => console.log("Success."))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

async function printPDF(destDir) {
  console.group(arguments.callee.name);
  const htmlFile = `file:${path.join(__dirname, "index.html")}`;
  const pdfFile = path.join(destDir, "sudhanshu-vishnoi-resume.pdf");
  console.log(`Converting ${htmlFile} to PDF`);
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(htmlFile, { waitUntil: "networkidle0" });
  page.emulateMedia("print");
  await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "1cm",
      bottom: "1cm",
      left: "1cm",
      right: "1cm",
    },
    path: pdfFile,
    preferCSSPageSize: true,
  });
  await browser.close();
  console.log(`Saved PDF at ${pdfFile}`);
  console.groupEnd();
}

async function getLatestCommit() {
  const result = await exec(`git log -1 --pretty="%H;%s"`);
  const stdout = result.stdout.trim();
  const [hash, message] = stdout.split(";", 2);
  return { hash, message };
}

async function updateServiceWorkerVersion(version, destDir) {
  console.group(arguments.callee.name);
  const src = path.join(__dirname, "sw.js");
  console.log(`Updating service worker version at: ${src}`);
  const dest = path.join(destDir, "sw.js");
  const input = await fs.readFile(src, "utf-8");
  const output = input.replace(/(const __version = ).*/, `$1"${version}"`);
  console.log(`Updated service worker version to ${version}`);
  await fs.writeFile(dest, output);
  console.log(`Saved updated service worker at ${dest}`);
  console.groupEnd();
}

async function copyFiles(files, srcDir, destDir) {
  console.group(arguments.callee.name);
  console.log(`Copying ${files.length} files from ${srcDir} to ${destDir}`);
  const promisesToCopyFiles = files.map(async name => {
    const src = path.join(srcDir, name);
    const dest = path.join(destDir, name);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    return fs.copyFile(src, dest);
  });
  await Promise.all(promisesToCopyFiles);
  console.groupEnd();
}
