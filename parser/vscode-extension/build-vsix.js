/**
 * Build script to create a .vsix package manually.
 * Usage: bun run build-vsix.js
 *
 * This creates the VSIX without needing npm/node (only bun).
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = __dirname;
const VSIX_NAME = 'sdox-tool-0.1.0.vsix';
const STAGE_DIR = path.join(ROOT, '.vsix-staging');
const EXTENSION_DIR = path.join(STAGE_DIR, 'extension');

// Clean
if (fs.existsSync(STAGE_DIR)) fs.rmSync(STAGE_DIR, { recursive: true });
fs.mkdirSync(EXTENSION_DIR, { recursive: true });

// Files to include
const includeFiles = [
    'package.json',
    'README.md',
    'CHANGELOG.md',
    'language-configuration.json',
];

const includeDirs = [
    'out',
    'syntaxes',
    'icons',
    'src/preview',  // for CSS
];

// Copy files
for (const f of includeFiles) {
    const src = path.join(ROOT, f);
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, path.join(EXTENSION_DIR, f));
    }
}

// Copy directories
function copyDirRecursive(src, dest) {
    if (!fs.existsSync(src)) return;
    fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        if (fs.statSync(srcPath).isDirectory()) {
            copyDirRecursive(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

for (const d of includeDirs) {
    copyDirRecursive(path.join(ROOT, d), path.join(EXTENSION_DIR, d));
}

// Create [Content_Types].xml
const contentTypes = `<?xml version="1.0" encoding="utf-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension=".json" ContentType="application/json"/>
  <Default Extension=".js" ContentType="application/javascript"/>
  <Default Extension=".js.map" ContentType="application/json"/>
  <Default Extension=".css" ContentType="text/css"/>
  <Default Extension=".md" ContentType="text/markdown"/>
  <Default Extension=".svg" ContentType="image/svg+xml"/>
  <Default Extension=".png" ContentType="image/png"/>
  <Default Extension=".html" ContentType="text/html"/>
  <Default Extension=".vsixmanifest" ContentType="text/xml"/>
</Types>`;
fs.writeFileSync(path.join(STAGE_DIR, '[Content_Types].xml'), contentTypes);

// Read package.json for manifest
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf-8'));

// Create extension.vsixmanifest
const manifest = `<?xml version="1.0" encoding="utf-8"?>
<PackageManifest Version="2.0.0" xmlns="http://schemas.microsoft.com/developer/vsx-schema/2011" xmlns:d="http://schemas.microsoft.com/developer/vsx-schema-design/2011">
  <Metadata>
    <Identity Language="en-US" Id="${pkg.name}" Version="${pkg.version}" Publisher="${pkg.publisher}"/>
    <DisplayName>${pkg.displayName}</DisplayName>
    <Description xml:space="preserve">${pkg.description}</Description>
    <Tags>${(pkg.keywords || []).join(',')}</Tags>
    <Categories>${(pkg.categories || []).join(',')}</Categories>
    <GalleryFlags>Public</GalleryFlags>
    <Properties>
      <Property Id="Microsoft.VisualStudio.Code.Engine" Value="${pkg.engines.vscode}"/>
      <Property Id="Microsoft.VisualStudio.Code.ExtensionDependencies" Value=""/>
      <Property Id="Microsoft.VisualStudio.Code.ExtensionPack" Value=""/>
      <Property Id="Microsoft.VisualStudio.Code.ExtensionKind" Value="ui,workspace"/>
      <Property Id="Microsoft.VisualStudio.Code.LocalizedLanguages" Value=""/>
      <Property Id="Microsoft.VisualStudio.Services.GitHubFlavoredMarkdown" Value="true"/>
    </Properties>
    <License>extension/LICENSE</License>
    <Icon>extension/icons/sdox-logo.png</Icon>
  </Metadata>
  <Installation>
    <InstallationTarget Id="Microsoft.VisualStudio.Code"/>
  </Installation>
  <Dependencies/>
  <Assets>
    <Asset Type="Microsoft.VisualStudio.Code.Manifest" Path="extension/package.json" Addressable="true"/>
    <Asset Type="Microsoft.VisualStudio.Services.Content.Details" Path="extension/README.md" Addressable="true"/>
    <Asset Type="Microsoft.VisualStudio.Services.Content.Changelog" Path="extension/CHANGELOG.md" Addressable="true"/>
    <Asset Type="Microsoft.VisualStudio.Services.Icons.Default" Path="extension/icons/sdox-logo.png" Addressable="true"/>
    <Asset Type="Microsoft.VisualStudio.Services.Icons.Small" Path="extension/icons/sdox-logo.png" Addressable="true"/>
  </Assets>
</PackageManifest>`;
fs.writeFileSync(path.join(STAGE_DIR, 'extension.vsixmanifest'), manifest);

// Create LICENSE
fs.writeFileSync(path.join(EXTENSION_DIR, 'LICENSE'), 'MIT License\n\nCopyright (c) 2026 firzaelbuho\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n');

// Create ZIP using PowerShell
const vsixPath = path.join(ROOT, VSIX_NAME);
if (fs.existsSync(vsixPath)) fs.rmSync(vsixPath);

console.log('Creating VSIX package...');
const zipPath = vsixPath.replace('.vsix', '.zip');
execSync(`powershell -Command "Compress-Archive -Path '${STAGE_DIR}\\*' -DestinationPath '${zipPath}' -Force"`, { stdio: 'inherit' });
fs.renameSync(zipPath, vsixPath);

// Cleanup
fs.rmSync(STAGE_DIR, { recursive: true });

console.log(`\n✅ Package created: ${VSIX_NAME}`);
console.log(`   Size: ${(fs.statSync(vsixPath).size / 1024).toFixed(1)} KB`);
console.log(`\n📦 Upload this file to:`);
console.log(`   https://marketplace.visualstudio.com/manage/publishers/firzaelbuho`);
