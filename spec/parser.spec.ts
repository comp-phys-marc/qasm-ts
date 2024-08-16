import "jasmine";
import { basename } from "path";
import * as fs from "fs";
import Parser from "../src/parser";
import { astSet } from "./asts";
import { tokenSet } from "./tokens";

const genericTests = "spec/tokens/generic";

describe("parser", () => {
  // TODO : add v3.0 tests
  ["v2.0"].forEach((version) => {
    describe(`QASM ${version}`, () => {
      it(`should parse generic QASM ${version} tokens correctly`, (done) => {
        fs.readdir(`${genericTests}/${version}`, (error, fileNames) => {
          if (error) {
            console.error(`Error reading directory: ${error}`);
            done.fail(error);
            return;
          }
          fileNames.forEach((scriptName) => {
            // console.log(`parsing ${version} ${scriptName}...`)
            if (astSet[version] && astSet[version][scriptName]) {
              const lexed =
                tokenSet[version][`${basename(scriptName, ".ts")}.qasm`];
              const ast = astSet[version][scriptName];

              const passingParser = new Parser(lexed);
              const out = passingParser.parse();

              expect(out.length).toEqual(ast.length);

              for (let i = 0; i < out.length; i++) {
                expect(out[i]).toEqual(ast[i]);
              }
            } else {
              console.log(`No AST set found for ${version} ${scriptName}`);
            }
          });
          done();
        });
      });
    });
  });
});
