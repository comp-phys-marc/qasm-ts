/**
 * Main lexer interface for tokenizing QASM code
 *
 * The lexer is responsible for breaking down QASM source code into tokens
 * that can be consumed by the parser. It supports both OpenQASM 2.0 and 3.0
 * syntax, with version-specific lexers handling the differences in token types
 * and syntax rules.
 *
 * The specific Lexer implementations can be found at:
 * - {@link Qasm3Lexer}
 * - {@link Qasm2Lexer}
 *
 * @module Lexing
 *
 * @example Token Flow
 * ```
 * Source Code → Lexer → Tokens → Parser → AST
 * "h q[0];"  →  [Id, Id, LSParen, NNInteger, RSParen, Semicolon]
 * ```
 *
 *  * @example Basic lexing workflow
 * ```typescript
 * import { lex } from './lexer';
 *
 * const qasmCode = 'OPENQASM 3.0; qubit q; h q;';
 * const tokens = lex(qasmCode);
 * console.log(tokens);
 * // [
 * //   [Token.OpenQASM, undefined],
 * //   [Token.Id, 'qubit'],
 * //   [Token.Id, 'q'],
 * //   [Token.Semicolon, undefined],
 * //   [Token.Id, 'h'],
 * //   [Token.Id, 'q'],
 * //   [Token.Semicolon, undefined]
 * // ]
 * ```
 */

import { default as Qasm2Lexer } from "./qasm2/lexer";
import { default as Qasm3Lexer } from "./qasm3/lexer";
import { Token as Qasm2Token } from "./qasm2/token";
import { Token as Qasm3Token } from "./qasm3/token";
import { OpenQASMVersion, OpenQASMMajorVersion } from "./version";
import { UnsupportedOpenQASMVersionError } from "./errors";

/**
 * Tokenizes OpenQASM source code into an array of tokens.
 *
 * This is the main entry point for lexical analysis. It automatically selects
 * the appropriate lexer implementation based on the OpenQASM version and returns
 * an array of tokens that can be consumed by the parser.
 *
 * Each token is represented as a tuple containing:
 * - **Token type**: An enum value indicating the kind of token
 * - **Token value**: The associated value (for literals, identifiers, operators)
 *
 * @group Lexing
 * @param qasm - The OpenQASM source code to tokenize
 * @param cursor - Starting position in the input string (defaults to 0)
 * @param version - OpenQASM version to use for lexing (defaults to 3.0)
 * @returns Array of token tuples [TokenType, value?]
 * @throws {UnsupportedOpenQASMVersionError} When an unsupported version is specified
 *
 * @example Tokenize OpenQASM 3.0 code
 * ```typescript
 * const tokens = lex('qubit[2] q; h q[0];', 0, 3);
 * // Returns tokens using OpenQASM 3.0 syntax rules
 * ```
 *
 * @example Tokenize OpenQASM 2.0 code
 * ```typescript
 * const tokens = lex('qreg q[2]; h q[0];', 0, 2);
 * // Returns tokens using OpenQASM 2.0 syntax rules
 * ```
 *
 * @example Resume lexing from specific position
 * ```typescript
 * const code = 'OPENQASM 3.0; qubit q;';
 * const tokens = lex(code, 12); // Start after "OPENQASM 3.0"
 * ```
 */
export function lex(
  qasm: string,
  cursor?: number,
  version?: OpenQASMVersion | OpenQASMMajorVersion | number,
): Array<[Qasm2Token | Qasm3Token, (number | string)?]> {
  let lexer: Qasm2Lexer | Qasm3Lexer;
  if (version instanceof OpenQASMVersion) {
    switch (version.major) {
      case OpenQASMMajorVersion.Version2:
        lexer = new Qasm2Lexer(qasm, cursor);
        break;
      case OpenQASMMajorVersion.Version3:
        lexer = new Qasm3Lexer(qasm, cursor);
        break;
      default:
        throw new UnsupportedOpenQASMVersionError(
          `Unsupported OpenQASM version detected: ${version.major}`,
        );
    }
  } else if (typeof version === "number") {
    switch (version) {
      case 2:
        lexer = new Qasm2Lexer(qasm, cursor);
        break;
      case 3:
        lexer = new Qasm3Lexer(qasm, cursor);
        break;
      default:
        throw new UnsupportedOpenQASMVersionError(
          `Unsupported OpenQASM version detected: ${version}`,
        );
    }
  } else if (version === OpenQASMMajorVersion.Version2) {
    lexer = new Qasm2Lexer(qasm, cursor);
  } else if (version === OpenQASMMajorVersion.Version3) {
    lexer = new Qasm3Lexer(qasm, cursor);
  } else {
    lexer = new Qasm3Lexer(qasm, cursor);
  }
  const tokens = lexer.lex();
  return tokens;
}
