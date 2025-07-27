import * as fs from 'fs';
import * as path from 'path';

const moduleName = process.argv[2];

if (!moduleName) {
  console.error(
    '❌ Please provide a module name:\n   npm run generate:module <module-name>',
  );
  process.exit(1);
}

const basePath = path.join(__dirname, '..', 'src', 'modules', moduleName);
const appModulePath = path.join(
  __dirname,
  '..',
  'src',
  'modules',
  'base',
  'app.module.ts',
);
const folders = ['controllers', 'dtos', 'entities', 'repositories', 'services'];

function toPascalCase(str: string): string {
  return str
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function toSingular(str: string): string {
  return str.endsWith('s') ? str.slice(0, -1) : str;
}

function createFile(filePath: string, content: string) {
  fs.writeFileSync(filePath, content);
  console.log(`📄 Created: ${filePath}`);
}

function createModuleStructure() {
  if (fs.existsSync(basePath)) {
    console.error(`❌ Module "${moduleName}" already exists.`);
    process.exit(1);
  }

  fs.mkdirSync(basePath, { recursive: true });
  const classPrefix = toPascalCase(moduleName);
  const singularModuleName = toSingular(moduleName); // for repository file

  folders.forEach((folder) => {
    const folderPath = path.join(basePath, folder);
    fs.mkdirSync(folderPath);
    console.log(`📁 Created: ${folderPath}`);

    let fileBase = `${moduleName}.${folder.slice(0, -1)}`;
    if (folder === 'repositories') {
      fileBase = `${singularModuleName}.repository`;
    }

    switch (folder) {
      case 'controllers':
        createFile(
          path.join(folderPath, `${fileBase}.ts`),
          `import { Controller } from '@nestjs/common';

@Controller('${moduleName}')
export class ${classPrefix}Controller {}
`,
        );
        break;

      case 'services':
        createFile(
          path.join(folderPath, `${fileBase}.ts`),
          `import { Injectable } from '@nestjs/common';

@Injectable()
export class ${classPrefix}Service {}
`,
        );
        break;

      case 'repositories':
        createFile(
          path.join(folderPath, `${fileBase}.ts`),
          `export class ${classPrefix}Repository {}
`,
        );
        break;

      default:
        // Skip files for dtos/entities
        break;
    }
  });

  // Create the module file itself
  createFile(
    path.join(basePath, `${moduleName}.module.ts`),
    `import { Module } from '@nestjs/common';
import { ${classPrefix}Controller } from './controllers/${moduleName}.controller';
import { ${classPrefix}Service } from './services/${moduleName}.service';

@Module({
  controllers: [${classPrefix}Controller],
  providers: [${classPrefix}Service],
})
export class ${classPrefix}Module {}
`,
  );
}

function registerModuleInAppModule() {
  const className = `${toPascalCase(moduleName)}Module`;
  const importPath = `../${moduleName}/${moduleName}.module`;
  const importStatement = `import { ${className} } from '${importPath}';`;

  let appModuleContent = fs.readFileSync(appModulePath, 'utf8');

  if (!appModuleContent.includes(importStatement)) {
    // Insert import after the last import
    const lastImportIndex = appModuleContent.lastIndexOf('from ');
    const insertPos = appModuleContent.indexOf('\n', lastImportIndex) + 1;
    appModuleContent =
      appModuleContent.slice(0, insertPos) +
      importStatement +
      '\n' +
      appModuleContent.slice(insertPos);

    // Add to imports array
    appModuleContent = appModuleContent.replace(
      /imports:\s*\[((.|\n)*?)\]/m,
      (match, inner) => {
        if (inner.includes(className)) return match; // already present
        return `imports: [${inner.trim()},\n    ${className}]`;
      },
    );

    fs.writeFileSync(appModulePath, appModuleContent, 'utf8');
    console.log(`✅ Registered ${className} in app.module.ts`);
  } else {
    console.log(`ℹ️ ${className} already registered in app.module.ts`);
  }
}

// Run the generator
createModuleStructure();
registerModuleInAppModule();
