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
  BadLoopError,
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
  ProgramBlock,
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
      const nodes = this.parseNode(this.tokens.slice(i))[0];
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
  * @return A set of AST nodes and the number of consumed tokens.
  */
  parseNode(
    tokens: Array<[Token, (number | string)?]>,
    allowVariables = true,
  ): [Array<AstNode>, number] {
    const token = tokens[0];
    switch (token[0]) {
      case Token.DefcalGrammar: {
        const [defcalGrammarNode, consumed] =
          this.defcalGrammarDeclaration(tokens);
        return [[defcalGrammarNode], consumed];
      }
      case Token.Include: {
        const [includeNode, consumed] = this.include(tokens);
        return [[includeNode], consumed];
      }
      case Token.OpenQASM: {
        const [qasmNode, consumed] = this.versionHeader(tokens);
        return [[qasmNode], consumed];
      }
      case Token.Const: {
        const [constNode, consumed] = this.classicalDeclaration(
          tokens.slice(1),
          true,
        );
        return [[constNode], consumed + 1];
      }
      case Token.Float:
      case Token.Int:
      case Token.UInt:
      case Token.Bool:
      case Token.Bit:
      case Token.Duration: {
        const [classicalNode, consumed] = this.classicalDeclaration(
          tokens,
          false,
        );
        return [[classicalNode], consumed];
      }
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
        const [expr, exprConsumed] = this.binaryExpression(tokens.slice(1));
        let consumed = exprConsumed + 1;
        const [math, mathConsumed] = this.createMathOrTrigFunction(
          token[0],
          expr,
        );
        consumed += mathConsumed;
        return [[math], consumed];
      }
      case Token.If: {
        const [ifNode, ifConsumed] = this.ifStatement(tokens);
        return [[ifNode], ifConsumed];
      }
      case Token.For: {
        const [forNode, forConsumed] = this.forLoopStatement(tokens);
        return [[forNode], forConsumed];
      }
      case Token.Id:
        if (
          this.matchNext(tokens.slice(1), [Token.EqualsAssmt]) ||
          this.matchNext(tokens.slice(1), [Token.CompoundArithmeticOp])
        ) {
          const [assignmentNode, consumed] = this.assignment(tokens);
          return [[assignmentNode], consumed];
        } else if (allowVariables) {
          const [expr, consumed] = this.binaryExpression(tokens);
          if (this.matchNext(tokens.slice(consumed), [Token.Semicolon])) {
            return [[expr], consumed + 1];
          } else {
            throwParserError(
              MissingSemicolonError,
              tokens[consumed],
              this.index + consumed,
              "expected semicolon",
            );
          }
        }
        break;
      default:
        return [[], 1];
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
   * @return The parsed CalibrationGrammarDeclaration AstNode node and the number of consumed tokens.
   */
  defcalGrammarDeclaration(
    tokens: Array<[Token, (number | string)?]>,
  ): [CalibrationGrammarDeclaration, number] {
    const consumed = 1;
    if (
      this.matchNext(tokens.slice(consumed), [Token.String, Token.Semicolon])
    ) {
      return [
        new CalibrationGrammarDeclaration(tokens[0][1].toString()),
        consumed + 2,
      ];
    }
    throwParserError(
      BadStringLiteralError,
      tokens[consumed],
      this.index + consumed,
      "expected string literal following `defcalgrammar` keyword",
    );
  }

  /**
   * Parses a classical type declaration.
   * @param tokens - Remaining tokens to parse.
   * @param isConst - Whether the declaration is for a constant, defaults to False.
   * @return The parsed ClassicalDeclaration AstNode and the number of consumed tokens.
   */
  classicalDeclaration(
    tokens: Array<[Token, (number | string)?]>,
    isConst?: boolean,
  ): [ClassicalDeclaration, number] {
    const isConstParam = isConst ? isConst : false;
    let consumed = 0;

    const [classicalType, classicalTypeConsumed] =
      this.parseClassicalType(tokens);
    consumed += classicalTypeConsumed;

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

    if (classicalType instanceof DurationType) {
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
          this.index + consumed,
          "invalid duration unit",
        );
      }
    }

    if (!this.matchNext(tokens.slice(consumed), [Token.Semicolon])) {
      throwParserError(
        MissingSemicolonError,
        tokens[consumed],
        this.index + consumed,
        "expected semicolon",
      );
    }

    return [
      new ClassicalDeclaration(
        classicalType,
        identifier as Identifier,
        initialValue,
        isConstParam,
      ),
      consumed,
    ];
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
            tokens.slice(1),
          );
          consumed += subscriptConsumed + 1;
          if (!this.matchNext(tokens.slice(consumed), [Token.RSParen])) {
            throwParserError(
              MissingBraceError,
              tokens[consumed],
              this.index + consumed,
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
   * @return The parsed AssignmentStatement AstNode and the number of consumed tokens.
   */
  assignment(
    tokens: Array<[Token, (number | string)?]>,
  ): [AssignmentStatement, number] {
    let consumed = 0;
    const [lhs, lhsConsumed] = this.unaryExpression(tokens);
    consumed += lhsConsumed;

    // Handle compound assignments
    if (tokens[consumed][0] === Token.CompoundArithmeticOp) {
      consumed++;
      const operator = tokens[lhsConsumed][1].toString();
      const [rhs, rhsConsumed] = this.binaryExpression(tokens.slice(consumed));
      consumed += rhsConsumed;

      if (!this.matchNext(tokens.slice(consumed), [Token.Semicolon])) {
        throwParserError(
          MissingSemicolonError,
          tokens[consumed],
          this.index + consumed,
          "expected semicolon",
        );
      }

      const arithmeticOp = operator.slice(0, -1) as ArithmeticOp;
      const arithmeticExpression = new Arithmetic(arithmeticOp, lhs, rhs);
      return [
        new AssignmentStatement(
          lhs as SubscriptedIdentifier,
          arithmeticExpression,
        ),
        consumed,
      ];
    }

    const [rhs, rhsConsumed] = this.binaryExpression(tokens.slice(consumed));
    consumed += rhsConsumed;
    if (!this.matchNext(tokens.slice(consumed), [Token.Semicolon])) {
      throwParserError(
        MissingSemicolonError,
        tokens[consumed],
        this.index + consumed,
        "expected semicolon",
      );
    }

    return [
      new AssignmentStatement(lhs as SubscriptedIdentifier, rhs),
      consumed,
    ];
  }

  /**
   * Parses a subscript expression as a Range.
   * @param tokens - Remaining tokens to parse.
   * @return A tuple containing the parsed Expression or Range and the number of tokens consumed.
   */
  parseSubscript(
    tokens: Array<[Token, (number | string)?]>,
  ): [Expression | Range, number] {
    let consumed = 1;
    let start: Expression | null = null;
    let step: Expression | null = null;
    let stop: Expression | null = null;

    if (!this.matchNext(tokens.slice(consumed), [Token.Colon])) {
      // Parse start
      const [startExpr, startConsumed] = this.binaryExpression(
        tokens.slice(consumed),
      );
      start = startExpr;
      consumed += startConsumed;
    }

    // Check for colon after start
    if (!this.matchNext(tokens.slice(consumed), [Token.Colon])) {
      throwParserError(
        BadExpressionError,
        tokens[consumed],
        this.index + consumed,
        "expected colon in range expression",
      );
    }
    consumed++;

    if (!this.matchNext(tokens.slice(consumed), [Token.Colon, Token.RSParen])) {
      const [stepExpr, stepConsumed] = this.binaryExpression(
        tokens.slice(consumed),
      );
      step = stepExpr;
      consumed += stepConsumed;

      // Check for colon after step
      if (!this.matchNext(tokens.slice(consumed), [Token.Colon])) {
        throwParserError(
          BadExpressionError,
          tokens[consumed],
          this.index + consumed,
          "expected colon after step in range expression",
        );
      }
      consumed++;
    }

    // Parse stop
    if (this.matchNext(tokens.slice(consumed), [Token.RSParen])) {
      throwParserError(
        BadExpressionError,
        tokens[consumed],
        this.index + consumed,
        "expected stop value in range expression",
      );
    }
    const [stopExpr, stopConsumed] = this.binaryExpression(
      tokens.slice(consumed),
    );
    stop = stopExpr;
    consumed += stopConsumed;

    // Check for closing square bracket
    if (!this.matchNext(tokens.slice(consumed), [Token.RSParen])) {
      throwParserError(
        MissingBraceError,
        tokens[consumed],
        this.index + consumed,
        "expected closing bracket ] for range expression",
      );
    }
    consumed++;

    // Validate that both start and stop are provided
    if (start === null || stop === null) {
      throwParserError(
        BadExpressionError,
        tokens[0],
        this.index,
        "both start and stop must be provided in range expression",
      );
    }

    return [new Range(start, stop, step), consumed];
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
   * Parses a branching condition (if) statement.
   * @param tokens - Tokens to parse.
   * @return A BranchingStatement node representing the if statement and the number of tokens consumed.
   */
  ifStatement(
    tokens: Array<[Token, (number | string)?]>,
  ): [BranchingStatement, number] {
    let consumed = 1;
    if (!this.matchNext(tokens.slice(consumed), [Token.LParen])) {
      throwParserError(
        MissingBraceError,
        tokens[consumed],
        this.index + consumed,
        "expected opening parenthesis after if",
      );
    }
    consumed++;

    const [condition, conditionConsumed] = this.binaryExpression(
      tokens.slice(consumed),
    );
    consumed += conditionConsumed;

    if (!this.matchNext(tokens.slice(consumed), [Token.RParen])) {
      throwParserError(
        MissingBraceError,
        tokens[consumed],
        this.index + consumed,
        "expected closing parenthesis after if statement condition",
      );
    }
    consumed++;

    const [trueBody, trueBodyConsumed] = this.programBlock(
      tokens.slice(consumed),
    );
    consumed += trueBodyConsumed;

    let falseBody: ProgramBlock | null = null;
    if (this.matchNext(tokens.slice(consumed), [Token.Else])) {
      consumed++;
      const [elseBody, elseBodyConsumed] = this.programBlock(
        tokens.slice(consumed),
      );
      falseBody = elseBody;
      consumed += elseBodyConsumed;
    }

    return [new BranchingStatement(condition, trueBody, falseBody), consumed];
  }

  /**
   * Parses a for loop.
   * @param tokens - Tokens to parse.
   * @return A ForLoopStatement node and the number of tokens consumed.
   */
  forLoopStatement(
    tokens: Array<[Token, (number | string)?]>,
  ): [ForLoopStatement, number] {
    let consumed = 1;

    // Parse the type of the loop variable
    const [loopVarType, loopVarTypeConsumed] = this.parseClassicalType(
      tokens.slice(consumed),
    );
    consumed += loopVarTypeConsumed;

    // Expect an identifier (loop variable)
    if (!this.matchNext(tokens.slice(consumed), [Token.Id])) {
      throwParserError(
        BadLoopError,
        tokens[consumed],
        this.index + consumed,
        "expected identifier for loop variable",
      );
    }
    const [loopVar, loopVarConsumed] = this.unaryExpression(
      tokens.slice(consumed),
    );
    if (!(loopVar instanceof Identifier)) {
      throwParserError(
        BadLoopError,
        tokens[consumed],
        this.index + consumed,
        "expected identifier for loop variable",
      );
    }
    consumed += loopVarConsumed;

    // Expect `in` keyword
    if (!this.matchNext(tokens.slice(consumed), [Token.In])) {
      throwParserError(
        BadLoopError,
        tokens[consumed],
        this.index + consumed,
        "expected `in` keyword in for loop",
      );
    }
    consumed++;

    const [indexSet, indexSetConsumed] = this.parseSetDeclaration(
      tokens.slice(consumed),
    );
    consumed += indexSetConsumed;

    const [body, bodyConsumed] = this.programBlock(tokens.slice(consumed));
    consumed += bodyConsumed;

    return [
      new ForLoopStatement(indexSet, loopVarType, loopVar as Identifier, body),
      consumed,
    ];
  }

  /**
   * Parses a program block.
   * @param tokens - Tokens to parse.
   * @return A ProgramBlock node and the number of tokens consumed.
   */
  programBlock(
    tokens: Array<[Token, (number | string)?]>,
  ): [ProgramBlock, number] {
    const statements: (Statement | Expression)[] = [];
    let consumed = 0;

    if (this.matchNext(tokens, [Token.LCParen])) {
      consumed++;
      while (!this.matchNext(tokens.slice(consumed), [Token.RCParen])) {
        const [node, nodeConsumed] = this.parseNode(tokens.slice(consumed));
        if (node) {
          statements.push(node);
        }
        consumed += nodeConsumed;
        if (this.matchNext(tokens.slice(consumed), [Token.Semicolon])) {
          consumed++;
        }
      }
      consumed++;
    } else {
      const [node, nodeConsumed] = this.parseNode(tokens.slice(consumed));
      if (node) {
        statements.push(node);
      }
      consumed += nodeConsumed;
      if (this.matchNext(tokens.slice(consumed), [Token.Semicolon])) {
        consumed++;
      }
    }
    return [new ProgramBlock(statements), consumed];
  }

  /**
   * Parses an include statement.
   * @param tokens - Tokens to parse.
   * @return An Include node representing the include statement and the number of consumed tokens.
   */
  include(tokens: Array<[Token, (number | string)?]>): [Include, number] {
    let filename: string;
    const consumed = 1;
    if (
      this.matchNext(tokens.slice(consumed), [Token.String, Token.Semicolon])
    ) {
      filename = tokens[0][1].toString();
      return [new Include(filename), consumed + 2];
    }
    throwParserError(
      BadStringLiteralError,
      tokens[consumed],
      this.index + consumed,
      "expected string literal following `include` keyword",
    );
  }

  /**
   * Parses the version header and sets the parser version.
   * @param tokens - Tokens to parse.
   * @return A Version node representing the version statement and the number of consumed tokens.
   */
  versionHeader(tokens: Array<[Token, (number | string)?]>): [Version, number] {
    let version: OpenQASMVersion;
    let consumed = 1;
    const slicedTokens = tokens.slice(consumed);
    if (this.matchNext(slicedTokens, [Token.NNInteger, Token.Semicolon])) {
      version = new OpenQASMVersion(Number(tokens[0][1]));
      if (!version.isVersion3()) {
        throwParserError(
          UnsupportedOpenQASMVersionError,
          tokens[consumed],
          this.index + consumed,
          "expected QASM version 3",
        );
      }
      consumed += 2;
      return [new Version(version), consumed];
    } else if (this.matchNext(slicedTokens, [Token.Real, Token.Semicolon])) {
      const versionSplits = tokens[0][1].toString().split(".");
      version = new OpenQASMVersion(
        Number(versionSplits[0]),
        Number(versionSplits[1]),
      );
      if (!version.isVersion3()) {
        throwParserError(
          UnsupportedOpenQASMVersionError,
          tokens[consumed],
          this.index + consumed,
          "expected QASM version 3",
        );
      }
      consumed += 2;
      return [new Version(version), consumed];
    }
    throwParserError(
      UnsupportedOpenQASMVersionError,
      tokens[consumed],
      this.index + consumed,
      "expected QASM version 3",
    );
  }

  /**
   * Parses a classical type.
   * @param token - The token that represents the type.
   * @return The ClassicalType and the number of consumed tokens.
   */
  parseClassicalType(
    tokens: Array<[Token, (number | string)?]>,
  ): [ClassicalType, number] {
    const typeToken = tokens[0][0];
    let consumed = 1;
    let width: Expression | undefined;

    // Check if there's a width or size specification
    if (this.matchNext(tokens.slice(consumed), [Token.LSParen])) {
      consumed++;
      const [widthExpr, widthConsumed] = this.binaryExpression(
        tokens.slice(consumed),
      );
      width = widthExpr;
      consumed += widthConsumed;
      if (!this.matchNext(tokens.slice(consumed), [Token.RSParen])) {
        throwParserError(
          MissingBraceError,
          tokens[consumed],
          this.index + consumed,
          "expected closing bracket ] for type width",
        );
      }
      consumed++;
    }
    return [this.createClassicalType(typeToken, width), consumed];
  }

  /**
   * Parses a set declaration.
   * @param token - The token that represents the type.
   * @return The resulting Identifier, IndexSet, or Range node and the number of consumed tokens.
   */
  parseSetDeclaration(
    tokens: Array<[Token, (number | string)?]>,
  ): [Expression | IndexSet | Range, number] {
    if (this.matchNext(tokens, [Token.Id])) {
      const [identifier, identifierConsumed] = this.unaryExpression(tokens);
      return [identifier as Identifier, identifierConsumed];
    } else if (this.matchNext(tokens, [Token.LCParen])) {
      return this.parseIndexSet(tokens);
    } else if (this.matchNext(tokens, [Token.LSParen])) {
      return this.parseSubscript(tokens);
    } else {
      return this.binaryExpression(tokens);
    }
  }

  /**
   * Parses an index set.
   * @param token - The token that represents the type.
   * @return The resulting Identifier, IndexSet, or Range node and the number of consumed tokens.
   */
  parseIndexSet(
    tokens: Array<[Token, (number | string)?]>,
  ): [IndexSet, number] {
    let consumed = 1;
    const values: Expression[] = [];

    while (!this.matchNext(tokens.slice(consumed), [Token.RCParen])) {
      const [expr, exprConsumed] = this.binaryExpression(
        tokens.slice(consumed),
      );
      values.push(expr);
      consumed += exprConsumed;

      if (this.matchNext(tokens.slice(consumed), [Token.Comma])) {
        consumed++;
      } else if (!this.matchNext(tokens.slice(consumed), [Token.RCParen])) {
        throwParserError(
          BadExpressionError,
          tokens[consumed],
          this.index + consumed,
          "expected comma or closing curly brace in index set",
        );
      }
    }
    consumed++;

    return [new IndexSet(values), consumed];
  }

  /**
   * Creates a classical type.
   * @param token - The token that represents the type.
   * @width - The type's width or size, if applicable.
   * @return The created ClassicalType.
   */
  createClassicalType(
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
   * @return The created MathFunction or TrigFunction node and the number of consumed tokens.
   */
  createMathOrTrigFunction(
    token: Token,
    expr: Expression,
  ): [MathFunction | TrigFunction, number] {
    switch (token) {
      case Token.Arccos:
        return [new TrigFunction(TrigFunctionTypes.ARCCOS, expr), 1];
      case Token.Arcsin:
        return [new TrigFunction(TrigFunctionTypes.ARCSIN, expr), 1];
      case Token.Arctan:
        return [new TrigFunction(TrigFunctionTypes.ARCTAN, expr), 1];
      case Token.Cos:
        return [new TrigFunction(TrigFunctionTypes.COS, expr), 1];
      case Token.Sin:
        return [new TrigFunction(TrigFunctionTypes.SIN, expr), 1];
      case Token.Tan:
        return [new TrigFunction(TrigFunctionTypes.TAN, expr), 1];
      case Token.Ceiling:
        return [new MathFunction(MathFunctionTypes.CEILING, expr), 1];
      case Token.Exp:
        return [new MathFunction(MathFunctionTypes.EXP, expr), 1];
      case Token.Floor:
        return [new MathFunction(MathFunctionTypes.FLOOR, expr), 1];
      case Token.Log:
        return [new MathFunction(MathFunctionTypes.LOG, expr), 1];
      case Token.Mod:
        return [new MathFunction(MathFunctionTypes.MOD, expr), 1];
      case Token.Popcount:
        return [new MathFunction(MathFunctionTypes.POPCOUNT, expr), 1];
      case Token.Pow:
        return [new MathFunction(MathFunctionTypes.POW, expr), 1];
      case Token.Rotl:
        return [new MathFunction(MathFunctionTypes.ROTL, expr), 1];
      case Token.Rotr:
        return [new MathFunction(MathFunctionTypes.ROTR, expr), 1];
      case Token.Sqrt:
        return [new MathFunction(MathFunctionTypes.SQRT, expr), 1];
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
