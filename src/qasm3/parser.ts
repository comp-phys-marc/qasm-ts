/* eslint-disable  @typescript-eslint/no-explicit-any */

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
  UnsupportedOpenQASMVersionError,
  BadStringLiteralError,
  BadClassicalTypeError,
  BadExpressionError,
  ReturnErrorConstructor,
  MissingSemicolonError,
  MissingBraceError,
} from "../errors";
import {
  AstNode,
  Statement,
  Expression,
  Parameters,
  CalibrationGrammarDeclaration,
  Include,
  Version,
  FloatType,
  BoolType,
  IntType,
  UIntType,
  BitType,
  DurationType,
  Range,
  Identifier,
  SubscriptedIdentifier,
  Pi,
  Euler,
  Tau,
  MathFunctionTypes,
  MathFunction,
  TrigFunctionTypes,
  TrigFunction,
  IntegerLiteral,
  NumericLiteral,
  FloatLiteral,
  BooleanLiteral,
  BitstringLiteral,
  DurationUnit,
  DurationLiteral,
  UnaryOp,
  Unary,
  BinaryOp,
  Binary,
  Cast,
  Index,
  IndexSet,
  QuantumMeasurement,
  QuantumMeasurementAssignment,
  Designator,
  ClassicalDeclaration,
  AssignmentStatement,
  QuantumDeclaration,
  AliasStatement,
  QuantumGateModifierName,
  QuantumGateModifier,
  QuantumGateCall,
  QuantumBarrier,
  QuantumReset,
  QuantumDelay,
  ReturnStatement,
  QuantumBlock,
  SubroutineBlock,
  QuantumGateDefinition,
  SubroutineDefinition,
  BranchingStatement,
  ForLoopStatement,
  WhileLoopStatement,
  BreakStatement,
  ContinueStatement,
  IOModifier,
  IODeclaration,
  DefaultCase,
  SwitchStatement,
  ClassicalType,
  ArithmeticOp,
  Arithmetic,
} from "./ast";

/**
 * Handles throwing parser errors with basic stack trace.
 * @param error - The error to throw.
 * @param token - The source token for the error.
 * @param index - The token index.
 * @param message - Optional additional error context.
 */
function throwParserError(
  error: ReturnErrorConstructor,
  token: Token | [Token, (string | number)?],
  index: number,
  message?: string,
) {
  const errorMessage = message
    ? `index: ${index} at token [${token}], ${message}`
    : `index: ${index} at token [${token}]`;
  throw new error(errorMessage);
}

/** Class representing a token parser. */
class Parser {
  /** The tokens to parse. */
  tokens: Array<[Token, (number | string)?]>;

  /** The allowed gates. */
  gates: Array<string>;

  /** Index of the current token. */
  index: number;

  /** The default machine precision float width. */
  machineFloatWidth: number;

  /** The default machine int size. */
  machineIntSize: number;

  /**
   * Creates a parser.
   * @param tokens - Tokens to parse.
   * @param defaultFloatWidth - Optional default float width override.
   * @param machineIntSize - Optional default int size override.
   */
  constructor(
    tokens: Array<[Token, (number | string)?]>,
    defaultFloatWidth?: number,
    machineIntSize?: number,
  ) {
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
    this.index = 0;
    this.machineFloatWidth = defaultFloatWidth ? defaultFloatWidth : 64;
    this.machineIntSize = machineIntSize ? machineIntSize : 32;
  }

  /**
   * Parses the token stream and generates an abstract syntax tree.
   * @return The abstract syntax tree.
   */
  parse(): Array<AstNode> {
    let ast: Array<AstNode> = [];
    let i = 0;
    while (i < this.tokens.length - 1) {
      this.index = i;
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
  * Parses a single statement or declaration by delegating the parsing of the next set of tokens to the appropriate method.
  * @param tokens - Remaining tokens to parse.
  * @param allowVariables - Whether encountered identifiers should be consider
      variable initializations or references.
  * @return A set of AST nodes.
  */
  parseNode(
    tokens: Array<[Token, (number | string)?]>,
    allowVariables = true,
  ): Array<AstNode> {
    const token = tokens[0];
    switch (token[0]) {
      case Token.DefcalGrammar:
        return [this.defcalGrammarDeclaration(tokens.slice(1))];
      case Token.Include:
        return [this.include(tokens.slice(1))];
      case Token.OpenQASM:
        return [this.versionHeader(tokens.slice(1))];
      case Token.Const:
        return [this.classicalDeclaration(tokens.slice(1), true)];
      case Token.Float:
      case Token.Int:
      case Token.UInt:
      case Token.Bool:
      case Token.Bit:
      case Token.Duration:
        return [this.classicalDeclaration(tokens)];
      case Token.Ceiling:
      case Token.Exp:
      case Token.Floor:
      case Token.Log:
      case Token.Mod:
      case Token.Popcount:
      case Token.Pow:
      case Token.Sqrt:
      case Token.Rotr:
      case Token.Rotl:
        return [
          this.createMathOrTrigFunction(
            token[0],
            this.binaryExpression(tokens.slice(1)),
          ),
        ];
      case Token.Id:
        if (
          this.matchNext(tokens.slice(1), [Token.EqualsAssmt]) ||
          this.matchNext(tokens.slice(1), [Token.CompoundArithmeticOp])
        ) {
          return [this.assignment(tokens)];
        } else if (allowVariables) {
          const [expr, consumed] = this.binaryExpression(tokens);
          if (this.matchNext(tokens.slice(consumed), [Token.Semicolon])) {
            return [expr];
          }
        }
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
   * Parses a `defcalgrammar` declaration.
   *
   * calibrationGrammarStatement:
   *   DEFCALGRAMMAR StringLiteral SEMICOLON
   *
   * @param tokens - Remaining tokens to parse.
   * @return The parsed CalibrationGrammarDeclaration AstNode node.
   */
  defcalGrammarDeclaration(
    tokens: Array<[Token, (number | string)?]>,
  ): CalibrationGrammarDeclaration {
    if (this.matchNext(tokens, [Token.String, Token.Semicolon])) {
      return new CalibrationGrammarDeclaration(tokens[0][1].toString());
    }
    throwParserError(
      BadStringLiteralError,
      tokens[0],
      this.index,
      "expected string literal following `defcalgrammar` keyword",
    );
  }

  /**
   * Parses a classical type declaration.
   * @param tokens - Remaining tokens to parse.
   * @param isConst - Whether the declaration is for a constant, defaults to False.
   * @return The parsed ClassicalDeclaration AstNode.
   */
  classicalDeclaration(
    tokens: Array<[Token, (number | string)?]>,
    isConst?: boolean,
  ): ClassicalDeclaration {
    const typeToken = tokens[0][0];
    const isConstParam = isConst ? isConst : false;
    let width: Expression | undefined;
    let consumed = 1;

    // Check if there's a width or size specification
    if (this.matchNext(tokens.slice(1), [Token.LSParen])) {
      const [widthExpr, widthConsumed] = this.binaryExpression(tokens.slice(2));
      width = widthExpr;
      consumed += widthConsumed + 1;
      if (!this.matchNext(tokens.slice(consumed), [Token.RSParen])) {
        throwParserError(
          MissingBraceError,
          tokens[0],
          this.index,
          "expected closing bracket ] for type width",
        );
      }
      consumed++;
    }

    const type = this.createClassicalType(typeToken, width);
    const [identifier, idConsumed] = this.unaryExpression(
      tokens.slice(consumed),
    );
    let initialValue: Expression | undefined;
    consumed += idConsumed;

    if (this.matchNext(tokens.slice(consumed), [Token.EqualsAssmt])) {
      consumed++;
      const [value, valueConsumed] = this.binaryExpression(
        tokens.slice(consumed),
      );
      initialValue = value;
      consumed += valueConsumed;
    }

    if (typeToken === Token.Duration) {
      if (
        this.matchNext(tokens.slice(consumed), [Token.Id]) &&
        Object.values(DurationUnit).includes(
          tokens[consumed][1] as DurationUnit,
        )
      ) {
        initialValue = new DurationLiteral(
          initialValue,
          tokens[consumed][1].toString() as DurationUnit,
        );
        consumed++;
      } else {
        throwParserError(
          BadClassicalTypeError,
          tokens[consumed],
          this.index,
          "invalid duration unit",
        );
      }
    }

    if (!this.matchNext(tokens.slice(consumed), [Token.Semicolon])) {
      throwParserError(
        MissingSemicolonError,
        tokens[0],
        this.index,
        "expected semicolon",
      );
    }

    return new ClassicalDeclaration(
      type,
      identifier as Identifier,
      initialValue,
      isConstParam,
    );
  }

  /**
   * Parses a unary expression.
   * @param tokens - Remaining tokens to parse.
   * @return A tuple containing the parsed Expression and the number of tokens consumed.
   */
  unaryExpression(
    tokens: Array<[Token, (number | string)?]>,
  ): [Expression, number] {
    const token = tokens[0];
    let consumed = 1;

    switch (token[0]) {
      case Token.NNInteger:
        return [new IntegerLiteral(Number(token[1])), consumed];
      case Token.Integer:
        return [new IntegerLiteral(token[1].toString()), consumed];
      case Token.BinaryLiteral:
      case Token.OctalLiteral:
      case Token.HexLiteral:
        return [new NumericLiteral(token[1].toString()), consumed];
      case Token.Real:
        return [new FloatLiteral(Number(token[1])), consumed];
      case Token.BoolLiteral:
        return [new BooleanLiteral(token[1] === "true"), consumed];
      case Token.Arccos:
      case Token.Arcsin:
      case Token.Arctan:
      case Token.Cos:
      case Token.Sin:
      case Token.Tan:
      case Token.Ceiling:
      case Token.Exp:
      case Token.Floor:
      case Token.Log:
      case Token.Mod:
      case Token.Popcount:
      case Token.Pow:
      case Token.Sqrt:
      case Token.Rotr:
      case Token.Rotl: {
        const [funcExpr, funcConsumed] = this.unaryExpression(tokens.slice(1));
        consumed += funcConsumed;
        return [
          this.createMathOrTrigFunction(tokens[0][0], funcExpr),
          consumed,
        ];
      }
      case Token.Id:
        // Handle identifiers and subscripted identifiers
        if (this.matchNext(tokens.slice(1), [Token.LSParen])) {
          const identifier = new Identifier(token[1].toString());
          const [subscript, subscriptConsumed] = this.parseSubscript(
            tokens.slice(2),
          );
          consumed += subscriptConsumed + 1;
          if (!this.matchNext(tokens.slice(consumed), [Token.RSParen])) {
            throwParserError(
              MissingBraceError,
              token,
              this.index,
              "expected closing bracket ] for subscripted identifier",
            );
          }
          consumed++;
          return [
            new SubscriptedIdentifier(identifier.name, subscript),
            consumed,
          ];
        }
        return [new Identifier(token[1].toString()), consumed];
      case Token.Pi:
        return [new Pi(), consumed];
      case Token.Euler:
        return [new Euler(), consumed];
      case Token.Tau:
        return [new Tau(), consumed];
      case Token.String:
        return [new BitstringLiteral(token[1].toString()), consumed];
      case Token.UnaryOp: {
        const [expr, exprConsumed] = this.unaryExpression(tokens.slice(1));
        return [new Unary(token[1] as UnaryOp, expr), consumed + exprConsumed];
      }
      case Token.LParen: {
        let consumed = 1;
        const args: Expression[] = [];
        while (!this.matchNext(tokens.slice(consumed), [Token.RParen])) {
          const [arg, argConsumed] = this.binaryExpression(
            tokens.slice(consumed),
          );
          args.push(arg);
          consumed += argConsumed;
          if (this.matchNext(tokens.slice(consumed), [Token.Comma])) {
            consumed++;
          } else if (!this.matchNext(tokens.slice(consumed), [Token.RParen])) {
            throwParserError(
              BadExpressionError,
              tokens[consumed],
              this.index + consumed,
              "expected comma or closing parenthesis ) in parenthesized expression",
            );
          }
        }
        consumed++;
        return [new Parameters(args), consumed];
      }
      default:
        if (isTypeToken(token[0])) {
          return this.parseTypeCast(tokens);
        }
        throwParserError(
          BadExpressionError,
          token,
          this.index,
          "invalid expression",
        );
    }
  }

  /**
   * Parses a binary expression.
   * @param tokens - Remaining tokens to parse.
   * @return A tuple containing the parsed Expression and the number of tokens consumed.
   */
  binaryExpression(
    tokens: Array<[Token, (number | string)?]>,
  ): [Expression, number] {
    let [leftExpr, leftConsumed] = this.unaryExpression(tokens);
    let index = leftConsumed;

    while (index < tokens.length) {
      const token = tokens[index];
      if (token[0] === Token.BinaryOp || token[0] === Token.ArithmeticOp) {
        index++;
        const [rightExpr, rightConsumed] = this.unaryExpression(
          tokens.slice(index),
        );
        if (token[0] === Token.BinaryOp) {
          leftExpr = new Binary(token[1] as BinaryOp, leftExpr, rightExpr);
        } else {
          leftExpr = new Arithmetic(
            token[1] as ArithmeticOp,
            leftExpr,
            rightExpr,
          );
        }
        index += rightConsumed;
      } else {
        break;
      }
    }

    return [leftExpr, index];
  }

  /**
   * Parses an assignment statement.
   * @param tokens - Remaining tokens to parse.
   * @return The parsed AssignmentStatement AstNode.
   */
  assignment(tokens: Array<[Token, (number | string)?]>): AssignmentStatement {
    const [lhs, lhsConsumed] = this.unaryExpression(tokens);

    // Handle compound assignments
    if (tokens[lhsConsumed][0] === Token.CompoundArithmeticOp) {
      const operator = tokens[lhsConsumed][1].toString();
      const [rhs, rhsConsumed] = this.binaryExpression(
        tokens.slice(lhsConsumed + 1),
      );

      if (
        !this.matchNext(tokens.slice(lhsConsumed + rhsConsumed + 1), [
          Token.Semicolon,
        ])
      ) {
        throwParserError(
          MissingSemicolonError,
          tokens[lhsConsumed + rhsConsumed + 1],
          this.index,
          "expected semicolon",
        );
      }

      const arithmeticOp = operator.slice(0, -1) as ArithmeticOp;
      const arithmeticExpression = new Arithmetic(arithmeticOp, lhs, rhs);
      return new AssignmentStatement(
        lhs as SubscriptedIdentifier,
        arithmeticExpression,
      );
    }

    const [rhs, rhsConsumed] = this.binaryExpression(
      tokens.slice(lhsConsumed + 1),
    );
    if (
      !this.matchNext(tokens.slice(lhsConsumed + rhsConsumed + 1), [
        Token.Semicolon,
      ])
    ) {
      throwParserError(
        MissingSemicolonError,
        tokens[0],
        this.index,
        "expected semicolon",
      );
    }

    return new AssignmentStatement(lhs as SubscriptedIdentifier, rhs);
  }

  /**
   * Parses a subscript expression.
   * @param tokens - Remaining tokens to parse.
   * @return A tuple containing the parsed Expression or Range and the number of tokens consumed.
   */
  parseSubscript(
    tokens: Array<[Token, (number | string)?]>,
  ): [Expression | Range, number] {
    if (this.matchNext(tokens, [Token.Colon])) {
      // Full range
      return [new Range(null, null), 1];
    }

    const [start, startConsumed] = this.binaryExpression(tokens);

    if (this.matchNext(tokens.slice(startConsumed), [Token.Colon])) {
      if (this.matchNext(tokens.slice(startConsumed + 1), [Token.RSParen])) {
        // Range with only start
        return [new Range(start, null), startConsumed + 1];
      }
      const [end, endConsumed] = this.binaryExpression(
        tokens.slice(startConsumed + 1),
      );
      return [new Range(start, end), startConsumed + endConsumed + 1];
    }

    return [start, startConsumed];
  }

  /**
   * Parses a type cast expression.
   * @param tokens - Remaining tokens to parse.
   * @return A tuple containing the parsed Cast Expression and the number of tokens consumed.
   */
  parseTypeCast(
    tokens: Array<[Token, (number | string)?]>,
  ): [Expression, number] {
    if (!this.matchNext(tokens.slice(1), [Token.LParen])) {
      throwParserError(
        MissingBraceError,
        tokens[0],
        this.index,
        "expected opening parenthesis ( for type cast",
      );
    }
    const [castExpr, consumed] = this.binaryExpression(tokens.slice(2));
    if (!this.matchNext(tokens.slice(2 + consumed), [Token.RParen])) {
      throwParserError(
        MissingBraceError,
        tokens[0],
        this.index,
        "expected closing parenthesis ) for type cast",
      );
    }
    const castType = this.createClassicalType(tokens[0][0]);
    return [new Cast(castType, castExpr), consumed + 3];
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
    throwParserError(
      BadStringLiteralError,
      tokens[0],
      this.index,
      "expected string literal following `include` keyword",
    );
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
      if (!version.isVersion3()) {
        throwParserError(
          UnsupportedOpenQASMVersionError,
          tokens[0],
          this.index,
          "expected QASM version 3",
        );
      }
      return new Version(version);
    } else if (this.matchNext(tokens, [Token.Real, Token.Semicolon])) {
      const versionSplits = tokens[0][1].toString().split(".");
      version = new OpenQASMVersion(
        Number(versionSplits[0]),
        Number(versionSplits[1]),
      );
      if (!version.isVersion3()) {
        throwParserError(
          UnsupportedOpenQASMVersionError,
          tokens[0],
          this.index,
          "expected QASM version 3",
        );
      }
      return new Version(version);
    }
    throwParserError(
      UnsupportedOpenQASMVersionError,
      tokens[0],
      this.index,
      "expected QASM version 3",
    );
  }

  /**
   * Creates a classical type.
   * @param token - The token that represents the type.
   * @width - The type's width or size, if applicable.
   * @return The created ClassicalType.
   */
  private createClassicalType(
    token: Token,
    width?: Expression | number,
  ): ClassicalType {
    switch (token) {
      case Token.Int:
        return new IntType(width || this.machineIntSize);
      case Token.UInt:
        return new UIntType(width || this.machineIntSize);
      case Token.Float:
        return new FloatType(width || this.machineFloatWidth);
      case Token.Bool:
        return new BoolType();
      case Token.Bit:
        return new BitType(width);
      case Token.Duration:
        return new DurationType();
      default:
        throwParserError(
          BadClassicalTypeError,
          token,
          this.index,
          "unsupported classical type",
        );
    }
  }

  /**
   * Creates a math or trigonometric function node.
   * @param token - The token representing the function.
   * @param expr - The expression to which the function is applied.
   * @return The created MathFunction or TrigFunction node.
   */
  private createMathOrTrigFunction(
    token: Token,
    expr: Expression,
  ): MathFunction | TrigFunction {
    switch (token) {
      case Token.Arccos:
        return new TrigFunction(TrigFunctionTypes.ARCCOS, expr);
      case Token.Arcsin:
        return new TrigFunction(TrigFunctionTypes.ARCSIN, expr);
      case Token.Arctan:
        return new TrigFunction(TrigFunctionTypes.ARCTAN, expr);
      case Token.Cos:
        return new TrigFunction(TrigFunctionTypes.COS, expr);
      case Token.Sin:
        return new TrigFunction(TrigFunctionTypes.SIN, expr);
      case Token.Tan:
        return new TrigFunction(TrigFunctionTypes.TAN, expr);
      case Token.Ceiling:
        return new MathFunction(MathFunctionTypes.CEILING, expr);
      case Token.Exp:
        return new MathFunction(MathFunctionTypes.EXP, expr);
      case Token.Floor:
        return new MathFunction(MathFunctionTypes.FLOOR, expr);
      case Token.Log:
        return new MathFunction(MathFunctionTypes.LOG, expr);
      case Token.Mod:
        return new MathFunction(MathFunctionTypes.MOD, expr);
      case Token.Popcount:
        return new MathFunction(MathFunctionTypes.POPCOUNT, expr);
      case Token.Pow:
        return new MathFunction(MathFunctionTypes.POW, expr);
      case Token.Rotl:
        return new MathFunction(MathFunctionTypes.ROTL, expr);
      case Token.Rotr:
        return new MathFunction(MathFunctionTypes.ROTR, expr);
      case Token.Sqrt:
        return new MathFunction(MathFunctionTypes.SQRT, expr);
      default:
        throwParserError(
          BadExpressionError,
          token,
          this.index,
          "unsupported math or trig function",
        );
    }
  }

  /** TODO : update this
   * Validates whether a register or gate identifier.
   * @param identifier - The identifier to validate.
   * @return Boolean indicating successful validation or not.
   */
  private validateIdentifier(identifier: string): boolean {
    const firstChar = identifier[0];
    return /^[a-z]$/.test(firstChar);
  }
}

/**
 * Checks if a token represents a type.
 */
function isTypeToken(token: Token): boolean {
  return (
    token === Token.Float ||
    token === Token.Int ||
    token === Token.UInt ||
    token === Token.Bool ||
    token === Token.Duration
  );
}

export default Parser;
