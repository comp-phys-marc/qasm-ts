import "jasmine";
import * as fs from "fs";
import { lex } from "../src/lexer";
import { Token as Qasm2Token } from "../src/qasm2/token";
import { Token as Qasm3Token } from "../src/qasm3/token";
import { BadGateError, MissingSemicolonError } from "../src/errors";
import { tokenSet } from "./tokens";

const genericTests = "spec/qasm/generic";
const invalidTests = "spec/qasm/invalid";

describe("lexer", () => {
  // Test both the Qasm2 and Qasm3 lexer
  ["v2.0", "v3.0"].forEach((version) => {
    describe(`QASM ${version}`, () => {
      it(`should lex generic QASM ${version} code correctly`, (done) => {
        fs.readdir(`${genericTests}/${version}`, (error, fileNames) => {
          if (error) {
            console.error(`Error reading directory: ${error}`);
            done.fail(error);
            return;
          }
          fileNames.forEach((scriptName) => {
            // console.log(`lexing ${version} ${scriptName}...`);
            const qasm = fs.readFileSync(
              `${genericTests}/${version}/${scriptName}`,
              "utf8",
            );

            if (tokenSet[version] && tokenSet[version][scriptName]) {
              const tokens = tokenSet[version][scriptName];

              let out: Array<[Qasm2Token | Qasm3Token, (string | number)?]>;
              switch (version) {
                case "v2.0":
                  out = lex(qasm, 0, 2);
                  break;
                case "v3.0":
                  out = lex(qasm, 0, 3);
                  break;
                default:
                  console.error(`Invalid OpenQASM version: ${version}`);
                  return;
              }

              expect(out.length).toEqual(tokens.length);

              for (let i = 0; i < out.length; i++) {
                if (tokens[i] === undefined) {
                  console.error(`tokens[${i}] is undefined`);
                  continue;
                }
                for (let j = 0; j < out[i].length; j++) {
                  if (tokens[i][j] === undefined) {
                    console.error(`tokens[${i}][${j}] is undefined`);
                    continue;
                  }
                  expect(out[i][j]).toEqual(tokens[i][j]);
                }
              }
            } else {
              console.log(`No token set found for ${version} ${scriptName}`);
            }
          });
          done();
        });
      });
    });

    describe("invalid cases", () => {
      it("should raise appropriate errors for invalid QASM", (done) => {
        fs.readdir(`${invalidTests}/${version}`, (error, fileNames) => {
          if (error) {
            console.error(`Error reading directory: ${error}`);
            done.fail(error);
            return;
          }
          fileNames.forEach((scriptName) => {
            // console.log(`testing invalid case ${version} ${scriptName}...`);
            const qasm = fs.readFileSync(
              `${invalidTests}/${version}/${scriptName}`,
              "utf8",
            );
            const failingLexer = () => lex(qasm, 0, 2);

            if (scriptName.includes("missing_semicolon")) {
              expect(failingLexer).toThrowError(MissingSemicolonError);
            } else if (scriptName.includes("bad_gate")) {
              expect(failingLexer).toThrowError(BadGateError);
            }
          });
          done();
        });
      });
    });
  });
});
