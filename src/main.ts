import * as fs from "fs";
import { OpenQASMVersion, OpenQASMMajorVersion } from "./version";
import { lex } from "./lexer";
import { parse } from "./parser";

/**
 * Returns the abstract syntax tree for a given string of QASM code.
 * @param qasm - The code string.
 * @return The corresponding AST.
 */
export function parseString(
  qasm: string,
  version?: number | OpenQASMVersion | OpenQASMMajorVersion,
) {
  const tokens = lex(qasm, undefined, version);
  console.log(tokens);
  const ast = parse(tokens, version);
  return ast;
}

/**
 * Returns the abstract syntax tree for a given QASM file.
 * @param file - The file location.
 * @return The corresponding AST.
 */
export function parseFile(
  file: string,
  version?: number | OpenQASMVersion | OpenQASMMajorVersion,
) {
  return parseString(fs.readFileSync(file, "utf8"), version);
}
