import fs from 'fs';
import { Command } from 'commander';
import { name, version, description } from './package.json';

const program = new Command();

program
  .name(name)
  .description(description)
  .version(version)
  .argument('inputPath')
  .argument('outputPath')
  .showHelpAfterError()
  .action(
    (inputPath, outputPath) =>
      new Promise((resolve, reject) => {
        if (!fs.existsSync(inputPath)) {
          reject('Cannot read from provided input file');
          return;
        }
        let inputLines: string[];
        try {
          inputLines = fs.readFileSync(inputPath, { encoding: 'utf8' }).split('\n');
        } catch {
          reject('failed to parse input file');
          return;
        }
        const outputLines = inputLines.map((line) =>
          line.includes('OWNER TO') || line.includes('GRANT ALL') ? `-- ${line}` : line
        );
        const output = outputLines.join('\n');
        try {
          fs.writeFileSync(outputPath, output);
        } catch {
          reject('failed to write to output path');
          return;
        }
        resolve();
      })
  );

program.parse();
