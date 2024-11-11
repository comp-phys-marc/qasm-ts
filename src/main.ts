/* eslint-disable  @typescript-eslint/no-explicit-any */

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
  verbose?: boolean,
  stringify?: boolean,
) {
  let ast: any;
  const tokens = lex(qasm, undefined, version);
  ast = parse(tokens, version);
  if (verbose === true) {
    if (stringify === true) {
      ast = JSON.stringify(getDetailedOutput(ast), null, 2);
    }
    ast = getDetailedOutput(ast);
  } else {
    if (stringify === true) {
      ast = JSON.stringify(ast, null, 2);
    }
  }
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
  verbose?: boolean,
  stringify?: boolean,
) {
  return parseString(
    fs.readFileSync(file, "utf8"),
    version,
    verbose,
    stringify,
  );
}

/** Adds class names to the ast. */
function getDetailedOutput(object) {
  if (Array.isArray(object)) {
    return object.map(getDetailedOutput);
  } else if (object !== null && typeof object === "object") {
    const result = {};
    result["__className__"] = object.constructor.name;
    for (const [key, value] of Object.entries(object)) {
      result[key] = getDetailedOutput(value);
    }
    return result;
  } else {
    return object;
  }
}
