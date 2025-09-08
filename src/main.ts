/* eslint-disable  @typescript-eslint/no-explicit-any */

/**
 * Main parsing functions for qasm-ts - the primary entry points for parsing OpenQASM code
 * @module Main Functions
 */

import * as fs from "fs";
import { OpenQASMVersion, OpenQASMMajorVersion } from "./version";
import { lex } from "./lexer";
import { parse } from "./parser";

/**
 * Parses OpenQASM code from a string and returns the abstract syntax tree.
 *
 * This is the primary entry point for parsing OpenQASM code. It handles both
 * OpenQASM 2.0 and 3.0 syntax, automatically selecting the appropriate lexer
 * and parser based on the version parameter.
 *
 * @group Main Functions
 * @param qasm - The OpenQASM code string to parse
 * @param version - The OpenQASM version to use (defaults to 3.0)
 * @param verbose - Whether to include class names in the output (defaults to false)
 * @param stringify - Whether to return stringified JSON (defaults to false)
 * @returns The corresponding AST as an array of nodes, or stringified JSON if stringify is true
 *
 * @example Basic OpenQASM 3.0 parsing
 * ```typescript
 * import { parseString } from 'qasm-ts';
 *
 * const qasmCode = `
 * OPENQASM 3.0;
 * include "stdgates.inc";
 * qubit[2] q;
 * h q[0];
 * cx q[0], q[1];
 * `;
 *
 * const ast = parseString(qasmCode);
 * console.log(ast);
 * ```
 *
 * @example OpenQASM 2.0 parsing
 * ```typescript
 * const qasm2Code = `
 * OPENQASM 2.0;
 * include "qelib1.inc";
 * qreg q[2];
 * creg c[2];
 * h q[0];
 * cx q[0],q[1];
 * measure q -> c;
 * `;
 *
 * const ast = parseString(qasm2Code, 2);
 * ```
 *
 * @example Verbose output with class names
 * ```typescript
 * const ast = parseString(qasmCode, 3, true);
 * // Output will include __className__ properties for each node
 * ```
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
 * Parses OpenQASM code from a file and returns the abstract syntax tree.
 *
 * @group Main Functions
 * @param file - The path to the .qasm file to parse
 * @param version - The OpenQASM version to use (defaults to 3.0)
 * @param verbose - Whether to include class names in the output (defaults to false)
 * @param stringify - Whether to return stringified JSON (defaults to false)
 * @returns The corresponding AST as an array of nodes, or stringified JSON if stringify is true
 *
 * @example Parse a QASM file
 * ```typescript
 * import { parseFile } from 'qasm-ts';
 *
 * // Parse OpenQASM 3.0 file
 * const ast = parseFile('./my-circuit.qasm');
 *
 * // Parse OpenQASM 2.0 file
 * const ast2 = parseFile('./legacy-circuit.qasm', 2);
 * ```
 *
 * @example Parse with verbose output
 * ```typescript
 * const ast = parseFile('./circuit.qasm', 3, true);
 * // Includes detailed class information for each AST node
 * ```
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

/**
 * Adds class names to AST nodes for detailed inspection.
 * @internal
 */
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
