/**
 * OpenQASM 2.0 Parser Implementation
 *
 * This module implements a parser for OpenQASM 2.0 that focuses on the core
 * quantum circuit description language without the advanced features of version 3.0.
 * The parser handles quantum and classical register declarations, gate definitions
 * and applications, measurements, and basic control structures.
 *
 * OpenQASM 2.0 parsing capabilities:
 * - **Register declarations**: qreg and creg with size specifications
 * - **Gate definitions**: Custom gate definitions with parameters and bodies
 * - **Gate applications**: Built-in and custom gate applications
 * - **Measurements**: Quantum measurements with classical result storage
 * - **Basic conditionals**: Simple if statements based on classical register values
 * - **Arithmetic expressions**: Parameter expressions for gate operations
 * - **Opaque gates**: External gate declarations
 *
 * The parser maintains a list of known gates and validates gate applications
 * against declared gates and built-in operations.
 *
 * @module
 *
 * @example Parsing OpenQASM 2.0 code
 * ```typescript
 * const tokens = lexer.lex();
 * const parser = new Parser(tokens);
 * const ast = parser.parse();
 *
 * // AST contains simplified node structure for OpenQASM 2.0
 * ```
 */

import { Token, notParam } from "./token";
import { OpenQASMVersion } from "../version";
import {
  BadArgumentError,
  BadCregError,
  BadQregError,
  BadConditionalError,
  BadBarrierError,
  BadMeasurementError,
  BadGateError,
  BadParameterError,
  BadIncludeError,
  UnsupportedOpenQASMVersionError,
} from "../errors";
import {
  AstNode,
  Version,
  Include,
  QReg,
  CReg,
  Barrier,
  Measure,
  Gate,
  Opaque,
  If,
  ApplyGate,
  Divide,
  Power,
  Times,
  Plus,
  Minus,
  Sin,
  Cos,
  Tan,
  Exp,
  Ln,
  Sqrt,
  Pi,
  NNInteger,
  Real,
  Variable,
} from "./ast";

/**
 * OpenQASM 2.0 Parser
 *
 * A straightforward recursive descent parser for OpenQASM 2.0 that produces
 * a simplified AST structure appropriate for the more limited feature set
 * of the 2.0 language specification.
 *
 * @example Basic parsing workflow
 * ```typescript
 * const parser = new Parser(tokens);
 * const ast = parser.parse();
 *
 * // Process the resulting AST nodes
 * ast.forEach(node => {
 *   if (node instanceof QReg) {
 *     console.log(`Quantum register: ${node.id}[${node.size}]`);
 *   }
 * });
 * ```
 */
class Parser {
  /** The tokens to parse. */
  tokens: Array<[Token, (number | string)?]>;

  /** The allowed gates. */
  gates: Array<string>;

  /**
   * Creates a parser.
   * @param tokens - Tokens to parse.
   */
  constructor(tokens: Array<[Token, (number | string)?]>) {
    this.tokens = tokens;
    this.gates = [
      "x",
      "y",
      "z",
      "u1",
      "u2",
      "u3",
      "s",
      "sdg",
      "h",
      "tdg",
      "cx",
      "cy",
      "cz",
      "t",
      "ccx",
      "reset",
      "cu1",
      "ccy",
      "ccz",
    ];
  }

  /**
   * Calling this method parses the code represented by the provided tokens.
   * @return The abstract syntax tree.
   */
  parse(): Array<AstNode> {
    let ast: Array<AstNode> = [];
    let i = 0;
    while (i < this.tokens.length - 1) {
      const nodes = this.parseNode(this.tokens.slice(i));
      ast = ast.concat(nodes ? nodes : []);
      while (!this.matchNext(this.tokens.slice(i), [Token.Semicolon])) {
        if (this.matchNext(this.tokens.slice(i), [Token.LCParen])) {
          while (!this.matchNext(this.tokens.slice(i), [Token.RCParen])) {
            i++;
          }
          break;
        }
        i++;
      }
      i++;
    }
    return ast;
  }

  /**
  * Delegates the parsing of the next set of tokens to the appropriate method.
  * @param tokens - Remaining tokens to parse.
  * @param allowVariables - Whether encountered identifiers should be consider
      variable initializations or references.
  * @return A set of AST nodes.
  */
  parseNode(
    tokens: Array<[Token, (number | string)?]>,
    allowVariables = false,
  ): Array<AstNode> {
    const token = tokens[0];
    switch (token[0]) {
      case Token.Include:
        return [this.include(tokens.slice(1))];
      case Token.OpenQASM:
        return [this.versionHeader(tokens.slice(1))];
      case Token.QReg:
        return [this.qreg(tokens.slice(1))];
      case Token.CReg:
        return [this.creg(tokens.slice(1))];
      case Token.Barrier:
        return [this.barrier(tokens.slice(1))];
      case Token.Measure:
        return [this.measure(tokens.slice(1))];
      case Token.Id:
        if (
          !(token[1].toString().indexOf("QASM") != -1) &&
          !(token[1].toString().indexOf("include") != -1)
        ) {
          if (this.gates.includes(token[1].toString())) {
            return [this.application(tokens, token[1].toString())];
          } else if (allowVariables) {
            return [new Variable(token[1].toString())];
          } else {
            throw BadGateError;
          }
        } else {
          return [];
        }
      case Token.Gate:
        return [this.gate(tokens.slice(1))];
      case Token.Opaque:
        return [this.opaque(tokens.slice(1))];
      case Token.If:
        return [this.conditional(tokens.slice(1))];
      case Token.Power:
        return [new Power()];
      case Token.Divide:
        return [new Divide()];
      case Token.Times:
        return [new Times()];
      case Token.Plus:
        return [new Plus()];
      case Token.Minus:
        return [new Minus()];
      case Token.Pi:
        return [new Pi()];
      case Token.Sin:
        return [new Sin()];
      case Token.Cos:
        return [new Cos()];
      case Token.Exp:
        return [new Exp()];
      case Token.Ln:
        return [new Ln()];
      case Token.Sqrt:
        return [new Sqrt()];
      case Token.Tan:
        return [new Tan()];
      case Token.NNInteger:
        return [new NNInteger(Number(token[1]))];
      case Token.Real:
        return [new Real(Number(token[1]))];
    }
  }

  /**
   * Checks if the next tokens match those expected.
   * @param tokens - Remaining tokens to parse.
   * @param expectedTokens - Expected tokens.
   * @return Whether these is a match.
   */
  matchNext(
    tokens: Array<[Token, (number | string)?]>,
    expectedTokens: Array<Token>,
  ): boolean {
    let matches = true;
    let i = 0;
    if (tokens.length == 0) {
      return false;
    }
    while (i < expectedTokens.length) {
      if (tokens[i][0] != expectedTokens[i]) {
        matches = false;
        break;
      }
      i++;
    }
    return matches;
  }

  /**
   * Parses a quantum register.
   * @param tokens - Remaining tokens to parse.
   * @return An AST node representing the quantum register.
   */
  qreg(tokens: Array<[Token, (number | string)?]>): AstNode {
    if (
      this.matchNext(tokens, [
        Token.Id,
        Token.LSParen,
        Token.NNInteger,
        Token.RSParen,
        Token.Semicolon,
      ])
    ) {
      const id = tokens[0][1].toString();
      if (!this.validateIdentifier(id)) {
        throw BadQregError;
      }
      const size = tokens[2][1];
      return new QReg(id.toString(), Number(size));
    } else {
      throw BadQregError;
    }
  }

  /**
   * Parses a classical register.
   * @param tokens - Remaining tokens to parse.
   * @return An AST node representing the classical register.
   */
  creg(tokens: Array<[Token, (number | string)?]>): AstNode {
    if (
      this.matchNext(tokens, [
        Token.Id,
        Token.LSParen,
        Token.NNInteger,
        Token.RSParen,
        Token.Semicolon,
      ])
    ) {
      const id = tokens[0][1].toString();
      if (!this.validateIdentifier(id)) {
        throw BadCregError;
      }
      const size = tokens[2][1];
      return new CReg(id.toString(), Number(size));
    } else {
      throw BadCregError;
    }
  }

  /**
   * Parses a conditional.
   * @param tokens - Remaining tokens to parse.
   * @return An AST node representing the conditional.
   */
  conditional(tokens: Array<[Token, (number | string)?]>): AstNode {
    if (
      this.matchNext(tokens, [
        Token.LParen,
        Token.Id,
        Token.Equals,
        Token.NNInteger,
        Token.RParen,
      ])
    ) {
      const id = tokens[1][1];
      const val = tokens[3][1];
      const node = this.parseNode(tokens.slice(5));
      return new If(id.toString(), Number(val), node);
    } else {
      throw BadConditionalError;
    }
  }

  /**
   * Parses a barrier.
   * @param tokens - Remaining tokens to parse.
   * @return An AST node representing the barrier.
   */
  barrier(tokens: Array<[Token, (number | string)?]>): AstNode {
    if (this.matchNext(tokens, [Token.Id, Token.Semicolon])) {
      const id = tokens[0][1];
      return new Barrier(id.toString());
    } else if (
      this.matchNext(tokens, [
        Token.Id,
        Token.LParen,
        Token.NNInteger,
        Token.RParen,
        Token.Semicolon,
      ])
    ) {
      const id = tokens[0][1];
      const index = tokens[2][1];
      return new Barrier(id.toString(), Number(index));
    } else {
      throw BadBarrierError;
    }
  }

  /**
   * Parses a measurement.
   * @param tokens - Remaining tokens to parse.
   * @return An AST node representing the measurement.
   */
  measure(tokens: Array<[Token, (number | string)?]>): AstNode {
    let first_id: string;
    let second_id: string;
    let first_index: number;
    let second_index: number;
    if (this.matchNext(tokens, [Token.Id, Token.Arrow])) {
      first_id = tokens[0][1].toString();
      tokens = tokens.slice(2);
    } else if (
      this.matchNext(tokens, [
        Token.Id,
        Token.LSParen,
        Token.NNInteger,
        Token.RSParen,
        Token.Arrow,
      ])
    ) {
      first_id = tokens[0][1].toString();
      first_index = Number(tokens[2][1]);
      tokens = tokens.slice(5);
    } else {
      throw BadMeasurementError;
    }
    if (this.matchNext(tokens, [Token.Id, Token.Semicolon])) {
      second_id = tokens[0][1].toString();
      tokens = tokens.slice(2);
    } else if (
      this.matchNext(tokens, [
        Token.Id,
        Token.LSParen,
        Token.NNInteger,
        Token.RSParen,
        Token.Semicolon,
      ])
    ) {
      second_id = tokens[0][1].toString();
      second_index = Number(tokens[2][1]);
      tokens = tokens.slice(5);
    } else {
      throw BadMeasurementError;
    }
    if (first_index != undefined && second_index != undefined) {
      return new Measure(first_id, second_id, first_index, second_index);
    } else if (first_index != undefined) {
      return new Measure(first_id, second_id, first_index, null);
    } else if (second_index != undefined) {
      return new Measure(first_id, second_id, null, second_index);
    }
    return new Measure(first_id, second_id);
  }

  /**
   * Parses an application of one of the allowed gates.
   * @param tokens - Remaining tokens to parse.
   * @return An AST node representing the gate application.
   */
  application(
    tokens: Array<[Token, (number | string)?]>,
    op: string,
  ): Array<AstNode> {
    let params: Array<AstNode> = [];
    const list: Array<[string, number?]> = [];
    const applications: Array<AstNode> = [];
    if (tokens[0][1] == op) {
      tokens = tokens.slice(1);
    }
    if (this.matchNext(tokens, [Token.LParen])) {
      if (this.matchNext(tokens.slice(1), [Token.RParen])) {
        params = [];
        tokens = tokens.slice(2);
      } else {
        params = this.matchParamList(tokens.slice(1));
        let count = 0;
        let commas = 0;
        for (const i in params) {
          commas += 1;
          for (const j in params[i]) {
            count++;
          }
        }

        tokens = tokens.slice(count + (commas - 1) + 2);
      }
    }
    const args = this.matchArgList(tokens);
    for (const arg in args) {
      list.push(args[arg]);
    }
    applications.push(new ApplyGate(op, list, params));
    return applications;
  }

  /**
   * Parses a subroutine used in a custom gate definition.
   * @param tokens - Expression tokens to parse.
   * @return A parsed subroutine.
   */
  sub(tokens: Array<[Token, (number | string)?]>): Array<AstNode> {
    let ast: Array<AstNode> = [];
    let i = 0;
    if (this.matchNext(tokens.slice(i), [Token.LCParen])) {
      tokens = tokens.slice(1);
    }
    while (i < tokens.length - 1 && tokens[i][0] != Token.RCParen) {
      const nodes = this.parseNode(tokens.slice(i));
      ast = ast.concat(nodes ? nodes : []);
      while (
        !this.matchNext(tokens.slice(i), [Token.Semicolon]) &&
        !this.matchNext(tokens.slice(i), [Token.RCParen])
      ) {
        i++;
      }
      if (this.matchNext(tokens.slice(i), [Token.RCParen])) {
        break;
      }
      i++;
    }
    return ast;
  }

  /**
   * Parses a parameter value.
   * @param tokens - Tokens to parse.
   * @return An AST node representing the parameter value.
   */
  matchParam(tokens: Array<[Token, (number | string)?]>): AstNode {
    let param: AstNode;
    if (!notParam(tokens[0][0])) {
      param = this.parseNode([tokens[0]], true);
    } else {
      throw BadParameterError;
    }
    return param;
  }

  /**
   * Parses a list of parameter values.
   * @param tokens - Tokens to parse.
   * @return An array of AST nodes representing the parameter values.
   */
  matchParamList(
    tokens: Array<[Token, (number | string)?]>,
  ): Array<Array<AstNode>> {
    const args: Array<Array<AstNode>> = [];
    let i: number = 0;
    let j: number = 0;
    args[0] = [];
    while (!this.matchNext(tokens.slice(j), [Token.RParen])) {
      while (
        !this.matchNext(tokens.slice(j), [Token.Comma]) &&
        !this.matchNext(tokens.slice(j), [Token.RParen])
      ) {
        if (notParam(tokens[j][0])) {
          throw BadParameterError;
        }
        const next = this.matchParam(tokens.slice(j));
        args[i].push(next);
        j++;
      }
      if (this.matchNext(tokens.slice(j), [Token.RParen])) {
        break;
      }
      i++;
      j++;
      args[i] = [];
    }
    return args;
  }

  /**
   * Parses an argument value.
   * @param tokens - Tokens to parse.
   * @return An AST node representing the argument value.
   */
  matchArg(tokens: Array<[Token, (number | string)?]>): number {
    let index: number;
    if (this.matchNext(tokens, [Token.LSParen])) {
      tokens = tokens.slice(1);
      if (this.matchNext(tokens, [Token.NNInteger])) {
        index = Number(tokens[0][1]);
        tokens = tokens.slice(1);
      } else {
        throw BadArgumentError;
      }
      if (this.matchNext(tokens, [Token.RSParen])) {
        return index;
      } else {
        throw BadArgumentError;
      }
    }
  }

  /**
   * Parses a list of argument values.
   * @param tokens - Tokens to parse.
   * @return An array of AST nodes representing the argument values.
   */
  matchArgList(
    tokens: Array<[Token, (number | string)?]>,
  ): Array<[string, number?]> {
    const args: Array<[string, number?]> = [];
    let next: [string, number?];
    let id: string;
    let j: number = 0;
    while (
      j < tokens.length &&
      !this.matchNext(tokens.slice(j), [Token.Semicolon])
    ) {
      if (this.matchNext(tokens.slice(j), [Token.Id])) {
        id = tokens[j][1].toString();
        const index = this.matchArg(tokens.slice(j + 1));
        next = [id, index];
        args.push(next);
        if (index != undefined) {
          j += 4;
        } else {
          j++;
        }
        if (this.matchNext(tokens.slice(j), [Token.Comma])) {
          j++;
        }
      } else {
        throw BadArgumentError;
      }
    }
    return args;
  }

  /**
   * Parses an include statement.
   * @param tokens - Tokens to parse.
   * @return An Include node representing the include statement.
   */
  include(tokens: Array<[Token, (number | string)?]>): Include {
    let filename: string;
    if (this.matchNext(tokens, [Token.String, Token.Semicolon])) {
      filename = tokens[0][1].toString();
      return new Include(filename);
    }
    throw BadIncludeError;
  }

  /**
   * Parses the version header and sets the parser version.
   * @param tokens - Tokens to parse.
   * @return A Version node representing the version statement.
   */
  versionHeader(tokens: Array<[Token, (number | string)?]>): Version {
    let version: OpenQASMVersion;
    if (this.matchNext(tokens, [Token.NNInteger, Token.Semicolon])) {
      version = new OpenQASMVersion(Number(tokens[0][1]));
      if (!version.isVersion2()) {
        throw UnsupportedOpenQASMVersionError;
      }
      return new Version(version);
    } else if (this.matchNext(tokens, [Token.Real, Token.Semicolon])) {
      const versionSplits = tokens[0][1].toString().split(".");
      version = new OpenQASMVersion(
        Number(versionSplits[0]),
        Number(versionSplits[1]),
      );
      if (!version.isVersion2()) {
        throw UnsupportedOpenQASMVersionError;
      }
      return new Version(version);
    }
    throw UnsupportedOpenQASMVersionError;
  }

  /**
   * Parses a list of identifiers.
   * @param tokens - Tokens to parse.
   * @return An array of AST nodes representing the identifiers.
   */
  matchIdList(tokens: Array<[Token, (number | string)?]>): Array<string> {
    let args: Array<string> = [];
    let head: string;
    if (this.matchNext(tokens, [Token.Id])) {
      head = tokens[0][1].toString();
    }
    tokens = tokens.slice(1);
    args.push(head);
    if (this.matchNext(tokens, [Token.Comma])) {
      tokens = tokens.slice(1);
      const sub = this.matchIdList(tokens);
      args = args.concat(sub);
    }
    return args;
  }

  /**
   * Parses a gate.
   * @param tokens - Remaining tokens to parse.
   * @return An AST node representing the gate.
   */
  gate(tokens: Array<[Token, (number | string)?]>): AstNode {
    let name: string;
    let params: Array<string>;
    if (this.matchNext(tokens, [Token.Id])) {
      name = tokens[0][1].toString();
      if (!this.validateIdentifier(name)) {
        throw BadGateError;
      }
    } else {
      throw BadGateError;
    }
    tokens = tokens.slice(1);
    if (this.matchNext(tokens, [Token.LParen])) {
      tokens = tokens.slice(1);
      if (this.matchNext(tokens, [Token.RParen])) {
        params = [];
        tokens = tokens.slice(1);
      } else {
        params = this.matchIdList(tokens);
        const count = params.length;
        tokens = tokens.slice(count + 1);
      }
    }
    const registers: Array<string> = this.matchIdList(tokens);
    const count = registers.length;
    tokens = tokens.slice(count + (count - 1));
    const applications: Array<AstNode> = this.sub(tokens);
    this.gates.push(name);
    return new Gate(name, registers, params, applications);
  }

  /**
   * Parses an opaque declaration if using OpenQASM 2. If using OpenQASM 3 it skips the line.
   * @param tokens - Remaining tokens to parse.
   * @return An AST node representing the opaque declaration.
   */
  opaque(tokens: Array<[Token, (number | string)?]>): AstNode {
    let name: string;
    let params: Array<string>;
    let qubits: Array<[string, number?]> = [];
    if (this.matchNext(tokens, [Token.Id])) {
      name = tokens[0][1].toString();
      tokens = tokens.slice(1);
    } else {
      throw BadGateError;
    }

    if (this.matchNext(tokens, [Token.LParen])) {
      tokens = tokens.slice(1);
      if (!this.matchNext(tokens, [Token.RParen])) {
        params = this.matchIdList(tokens);
        tokens = tokens.slice(params.length + 1);
      } else {
        tokens = tokens.slice(1);
      }
    }

    qubits = this.matchArgList(tokens);
    tokens = tokens.slice(qubits.length * 2);

    if (!this.matchNext(tokens, [Token.Semicolon])) {
      throw BadGateError;
    }

    return new Opaque(name, qubits, params);
  }

  /**
   * Validates whether a register or gate identifier.
   * @param identifier - The identifier to validate.
   * @return Boolean indicating successful validation or not.
   */
  private validateIdentifier(identifier: string): boolean {
    const firstChar = identifier[0];
    return /^[a-z]$/.test(firstChar);
  }
}

export default Parser;
