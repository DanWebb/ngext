import {
  ClassDeclaration,
  Project,
  SourceFile,
  ObjectLiteralExpression,
  Decorator,
  ImportDeclaration,
  ts,
} from "ts-morph";
const CJSON = require('circular-json');

export function processComponentSourceFile(tsSourceFile: SourceFile): SourceFile {
  const foundComponent = tsSourceFile
    .getClasses()
    .find((a) => !!a.getDecorator("Component"));
  if (!foundComponent) {
    return tsSourceFile;
  }
  const pmDecorator = foundComponent.getDecorator("Component");
  const templateVal = getDecoratorPropertyValue(pmDecorator);
  const pageName = foundComponent.getName();
  foundComponent.remove();
  tsSourceFile.addClass({
    name: "PageComp",
    decorators: [
      {
        name: "Component",
        arguments: [
          (w) =>
            w.write(`{
  template: ${templateVal}
}`),
        ],
      },
    ],
  });
  tsSourceFile.addVariableStatement({
    declarations: [
      {
        name: "imports",
        initializer:
          '[RouterModule.forChild([{ path: "**", component: PageComp }])];',
      },
    ],
  });
  tsSourceFile.addVariableStatement({
    declarations: [
      {
        name: "declarations",
        initializer: "[PageComp];",
      },
    ],
  });
  tsSourceFile.addClass({
    isExported: true,
    name: pageName,
    decorators: [
      {
        name: "NgModule",
        arguments: [
          (w) =>
            w.write(`{
  imports: imports,
  declarations: declarations,
}`),
        ],
      },
    ],
  });

  tsSourceFile.insertImportDeclarations(0, [
    {
      moduleSpecifier: "@angular/core",
      namedImports: ["Component", "NgModule"],
    },
    {
      moduleSpecifier: "@angular/router",
      namedImports: ["RouterModule"],
    },
  ]);

  return tsSourceFile;
}

export function processComponent(contentOriginal: string): string {
  // initialize
  const project = new Project({ useInMemoryFileSystem: true });

  const tsFileNameFake = "file.ts";
  const tsSourceFile = project.createSourceFile(
    tsFileNameFake,
    contentOriginal
  );
  const tsSourceFileConverted = processComponentSourceFile(tsSourceFile);
  const text =  tsSourceFileConverted.getText();
  return text;
}

import * as fs from 'fs';
import * as path from 'path';

export function reportNodes(source: ts.SourceFile, newSource: ts.SourceFile) {
  console.log('--------------')
  function saveSourceFile(n: ts.SourceFile, fileName: string) {
    const nObj = JSON.parse(CJSON.stringify(n, null, 2));
    const nStr = JSON.stringify(nObj, null, 2);
    const fname = path.join('/home/ben/projects/ng-ts-transformations/dist', fileName);
    fs.writeFileSync(fname, nStr);
  }
  saveSourceFile(source, 'source.json');
  saveSourceFile(newSource, 'newSource.json');

  // const result = diff(sourceObj, newSourceObj);
  // console.log('DIFF = ', JSON.stringify(result, null, 2));
 
}

export function processComponentTsFile(source: ts.SourceFile): ts.SourceFile {
  console.log('---- > processing: ' + source.fileName);
  // initialize
  const project = new Project({ useInMemoryFileSystem: true });
  const tsSourceFile = project.createSourceFile(
    source.fileName,
    source.getText()
  );
  const foundComponent = tsSourceFile
    .getClasses()
    .find((a) => !!a.getDecorator("Component"));
  if (!foundComponent) {
    return source;
  }
  // reportNodes(source, tsSourceFile.compilerNode);

  const pmDecorator = foundComponent?.getDecorator("Component");
  const templateVal = getDecoratorPropertyValue(pmDecorator);
  const pageName = foundComponent?.getName();
  foundComponent?.remove();
  tsSourceFile.addClass({
    name: "PageComp",
    decorators: [
      {
        name: "Component",
        arguments: [
          (w) =>
            w.write(`{
  template: ${templateVal}
}`),
        ],
      },
    ],
  });
  tsSourceFile.addVariableStatement({
    declarations: [
      {
        name: "imports",
        initializer:
          '[RouterModule.forChild([{ path: "**", component: PageComp }])];',
      },
    ],
  });
  tsSourceFile.addVariableStatement({
    declarations: [
      {
        name: "declarations",
        initializer: "[PageComp];",
      },
    ],
  });
  tsSourceFile.addClass({
    isExported: true,
    name: pageName,
    decorators: [
      {
        name: "NgModule",
        arguments: [
          (w) =>
            w.write(`{
  imports: imports,
  declarations: declarations,
}`),
        ],
      },
    ],
  });

  tsSourceFile.insertImportDeclarations(0, [
    {
      moduleSpecifier: "@angular/core",
      namedImports: ["Component", "NgModule"],
    },
    {
      moduleSpecifier: "@angular/router",
      namedImports: ["RouterModule"],
    },
  ]);
  const returnSource = tsSourceFile.compilerNode;
  return returnSource;
}

export function processComponentTsFileOld(source: ts.SourceFile): ts.SourceFile {
  console.log('---- > processing: ' + source.fileName);
  // initialize
  const project = new Project({ useInMemoryFileSystem: true });
  const tsSourceFile = project.createSourceFile(
    source.fileName,
    source.getText()
  );
  const foundComponent = tsSourceFile
    .getClasses()
    .find((a) => !!a.getDecorator("Component"));
  if (!foundComponent) {
    return source;
  }
  // reportNodes(source, tsSourceFile.compilerNode);

  const pmDecorator = foundComponent?.getDecorator("Component");
  const templateVal = getDecoratorPropertyValue(pmDecorator);
  const pageName = foundComponent?.getName();
  foundComponent?.remove();
  tsSourceFile.addClass({
    name: "PageComp",
    decorators: [
      {
        name: "Component",
        arguments: [
          (w) =>
            w.write(`{
  template: ${templateVal}
}`),
        ],
      },
    ],
  });
  tsSourceFile.addVariableStatement({
    declarations: [
      {
        name: "imports",
        initializer:
          '[RouterModule.forChild([{ path: "**", component: PageComp }])];',
      },
    ],
  });
  tsSourceFile.addVariableStatement({
    declarations: [
      {
        name: "declarations",
        initializer: "[PageComp];",
      },
    ],
  });
  tsSourceFile.addClass({
    isExported: true,
    name: pageName,
    decorators: [
      {
        name: "NgModule",
        arguments: [
          (w) =>
            w.write(`{
  imports: imports,
  declarations: declarations,
}`),
        ],
      },
    ],
  });

  tsSourceFile.insertImportDeclarations(0, [
    {
      moduleSpecifier: "@angular/core",
      namedImports: ["Component", "NgModule"],
    },
    {
      moduleSpecifier: "@angular/router",
      namedImports: ["RouterModule"],
    },
  ]);
  return tsSourceFile.compilerNode;
}

export function getComponent(
  tsSourceFile: SourceFile
): ClassDeclaration | undefined {
  const foundComponent = tsSourceFile
    .getClasses()
    .find((a) => !!a.getDecorator("Component"));
  return foundComponent;
}

export function getDecoratorPropertyValue(
  ComponentDecorator: Decorator | undefined
): string | undefined {
  const args = ComponentDecorator?.getArguments();
  if (!args || !args.length) {
    return "";
  }
  const obj = args[0] as ObjectLiteralExpression;
  if (!obj) {
    return "";
  }
  const templateVal = obj.getProperty("template")?.getLastChild()?.getText();
  return templateVal;
}

export function createNgPageComponent(
  ComponentNode: ClassDeclaration,
  p: Project
): ClassDeclaration | undefined {
  /* 
@Component({ template: "`<h1> Component Breaks! </h1>`" })
class PageComp { }
  */
  const pmDecorator = ComponentNode.getDecorator("Component");
  const templateVal = getDecoratorPropertyValue(pmDecorator);
  const newVal = p.createSourceFile(
    "pcom.ts",
    `@Component({
  template: ${templateVal}
})
class PageComp {}`
  );
  const classDec = newVal.getClass("PageComp");
  return classDec;
}

export function createNgComponent(
  ComponentNode: ClassDeclaration,
  p: Project
) {
  /* 
const imports = [RouterModule.forChild([{ path: "**", component: Comp }])];
const declarations = [Comp];
@NgModule({
  imports: imports,
  declarations: declarations,
})
export class XXXXXXXXXX {}
*/
  const className = ComponentNode.getSymbol()?.getName();
  const newVal = p.createSourceFile(
    "pcommodule.ts",
    `const imports = [RouterModule.forChild([{ path: "**", component: PageComp }])];
const declarations = [PageComp];
@NgModule({
  imports: imports,
  declarations: declarations,
})
class ${className} {}`
  );
  const classDec = newVal.getClass(className as string);
  return classDec;
}

export function createImportStateMents(p: Project): ImportDeclaration[] {
  const newVal = p.createSourceFile(
    "pc_importstatements.ts",
    `import { Component, NgModule } from "@angular/core";
    import { RouterModule } from "@angular/router";`
  );
  const importDecs = newVal.getImportDeclarations();
  return importDecs;
}
