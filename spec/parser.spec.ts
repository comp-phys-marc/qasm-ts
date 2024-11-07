import "jasmine";
import { basename } from "path";
import * as fs from "fs";
import { astSet } from "./asts";
import { tokenSet } from "./tokens";
import { parse } from "../src/parser";
import { AstNode as AstNode2 } from "../src/qasm2/ast";
import { AstNode as AstNode3 } from "../src/qasm3/ast";

const genericTests = "spec/tokens/generic";

describe("parser", () => {
  ["v2.0", "v3.0"].forEach((version) => {
    describe(`QASM ${version}`, () => {
      it(`should parse generic QASM ${version} tokens correctly`, (done) => {
        fs.readdir(`${genericTests}/${version}`, (error, fileNames) => {
          if (error) {
            console.error(`Error reading directory: ${error}`);
            done.fail(error);
            return;
          }
          fileNames.forEach((scriptName) => {
            if (astSet[version] && astSet[version][scriptName]) {
              const tokens =
                tokenSet[version][`${basename(scriptName, ".ts")}.qasm`];
              const ast = astSet[version][scriptName];

              let out: Array<AstNode2 | AstNode3>;
              switch (version) {
                case "v2.0":
                  out = parse(tokens, 2);
                  break;
                case "v3.0":
                  out = parse(tokens, 3);
                  break;
                default:
                  console.error(`Invalid OpenQASM version: ${version}`);
                  return;
              }

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
