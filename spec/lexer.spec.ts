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
            const filePath = `${genericTests}/${version}/${scriptName}`;

            if (!fs.existsSync(filePath)) {
              console.error(`Missing file: ${filePath}`);
              return;
            }

            const raw = fs.readFileSync(filePath, "utf8");
            const qasm = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

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

              if (out.length !== tokens.length) {
                console.error(
                  `Token count mismatch in ${scriptName}: expected ${tokens.length}, got ${out.length}`
                );
                for (let i = 0; i < Math.max(out.length, tokens.length); i++) {
                  const actual = out[i];
                  const expected = tokens[i];
                  if (!expected) {
                    console.error(`Extra token at index ${i}: ${JSON.stringify(actual)}`);
                  } else if (!actual) {
                    console.error(`Missing token at index ${i}: ${JSON.stringify(expected)}`);
                  }
                }
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
            const filePath = `${invalidTests}/${version}/${scriptName}`;

            if (!fs.existsSync(filePath)) {
              console.error(`Missing file: ${filePath}`);
              return;
            }

            const raw = fs.readFileSync(filePath, "utf8");
            const qasm = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

            const failingLexer = () => lex(qasm, 0, version === "v2.0" ? 2 : 3);

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
