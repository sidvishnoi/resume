const path = require("path");
const fs = require("fs").promises;
const puppeteer = require("puppeteer");

async function main() {
  console.group(arguments.callee.name);

  const buildDir = path.join(__dirname, "build");
  try {
    await fs.mkdir(buildDir);
  } catch {}

  const files = [
    "resume.css",
    "index.html",
    "analytics.js",
    "icons/pdf.svg",
    "icons/twitter.svg",
    "icons/github.svg",
    "icons/linkedin.svg",
    "icons/stackoverflow.svg",
  ];
  await copyFiles(files, __dirname, buildDir);

  await printPDF(buildDir);

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
