import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ganttTypesPath = path.resolve(__dirname, '../../sources/dist/dhtmlxgantt.es.d.ts');
const outputPath = path.resolve(__dirname, '../src/types/react-gantt-templates.ts');

const originalInterfaceName = 'GanttTemplates';
const newInterfaceName = 'ReactGanttTemplates';

const ganttTypes = fs.readFileSync(ganttTypesPath, 'utf-8');

const interfaceRegex = new RegExp(
  `export interface ${originalInterfaceName} \\{([\\s\\S]*?)^\\}`,
  'm'
);
const match = ganttTypes.match(interfaceRegex);

if (!match) {
  throw new Error(`${originalInterfaceName} interface not found`);
}

const methodsBlock = match[1];

const methodWithCommentsRegex = /((?:\s*\/\*\*[\s\S]+?\*\/)?\s*\w+\([^)]*\):\s*[^;]+;)/g;
const methodMatches = methodsBlock.match(methodWithCommentsRegex);

if (!methodMatches) {
  throw new Error('No methods found in the interface');
}

type Method = {
  jsDocComment: string;
  signature: string;
  name: string;
  params: string;
  returns: string;
};

const methods: Method[] = [];

methodMatches.forEach((methodText) => {
  const jsDocCommentMatch = methodText.match(/\/\*\*[\s\S]+?\*\//);
  const jsDocComment = jsDocCommentMatch ? jsDocCommentMatch[0].trim() : '';

  const signatureMatch = methodText.match(/(\w+)\(([^)]*)\):\s*([^;]+);/);
  if (!signatureMatch) return;

  const [, name, params, returns] = signatureMatch;
  methods.push({ jsDocComment, signature: signatureMatch[0], name, params, returns });
});

const outputLines = [
  `import type { ReactElement } from "react";`,
  `import type { ${originalInterfaceName}, Task, Link, Baseline, Scale } from "@dhx/gantt";`,
  '',
  `export interface ${newInterfaceName} extends Partial<Omit<${originalInterfaceName},`,
  methods.map((m) => `  '${m.name}'`).join(' |\n'),
  `>> {`,
];

methods.forEach(({ jsDocComment, name, params, returns }) => {
  let needAdjust = true;
  if (!returns.includes('string')) {
    needAdjust = false;
  }

  const adjustedReturns = needAdjust ? returns.replace(/\bstring\b/, 'ReactElement | string').trim(): returns;

  if (jsDocComment) {
    outputLines.push(`  ${jsDocComment.replace(/^/gm, '  ')}`);
  }

  outputLines.push(`  ${name}?(${params}): ${adjustedReturns};`);
});

outputLines.push('}');

const outputContent = outputLines.join('\n');

fs.writeFileSync(outputPath, outputContent, 'utf-8');

console.log(`✅ ${newInterfaceName} interface generated at ${outputPath}`);
