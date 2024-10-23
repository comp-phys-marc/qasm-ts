/* eslint-disable  @typescript-eslint/no-explicit-any */

import { Token, notParam } from "./token";
import { OpenQASMVersion } from "../version";
import {
  BadQregError,
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
  BadQuantumInstructionError,
  BadSubroutineError,
} from "../errors";
import {
  AstNode,
  Statement,
  Expression,
  Parameters,
  ArrayReferenceModifier,
  ArrayReference,
  CalibrationGrammarDeclaration,
  Include,
  Version,
  FloatType,
  ComplexType,
  BoolType,
  IntType,
  UIntType,
  BitType,
  AngleType,
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
  DurationOf,
  UnaryOp,
  Unary,
  BinaryOp,
  Binary,
  Cast,
  IndexSet,
  ArrayDeclaration,
  ArrayInitializer,
  ArrayAccess,
  QuantumMeasurement,
  QuantumMeasurementAssignment,
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
  BoxDefinition,
  SubroutineDefinition,
  SubroutineCall,
  BranchingStatement,
  ForLoopStatement,
  WhileLoopStatement,
  BreakStatement,
  ContinueStatement,
  IOModifier,
  IODeclaration,
  SwitchStatement,
  CaseStatement,
  DefaultStatement,
  ClassicalType,
  ArithmeticOp,
  Arithmetic,
  ImaginaryLiteral,
  HardwareQubit,
  StretchType,
  SizeOf,
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

  /** The built in gates. */
  gates: Set<string>;

  /** Custom defined gates. */
  customGates: Set<string>;

  /** Standard library gates. */
  standardGates: Set<string>;

  /** Custom defined subroutines. */
  subroutines: Set<string>;

  /** User defined arrays. */
  customArrays: Set<string>;

  /** User defined aliases. */
  aliases: Map<string, string>;

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
    this.gates = new Set(["U", "gphase"]);
    this.standardGates = new Set();
    this.customGates = new Set();
    this.subroutines = new Set();
    this.customArrays = new Set();
    this.aliases = new Map();
    this.index = 0;
    this.machineFloatWidth = defaultFloatWidth ? defaultFloatWidth : 64;
    this.machineIntSize = machineIntSize ? machineIntSize : 32;
  }

  /**
   * Loads the standard library gates.
   */
  stdGates() {
    const gates = [
      "p",
      "x",
      "y",
      "z",
      "h",
      "s",
      "sdg",
      "t",
      "tdg",
      "sx",
      "rx",
      "ry",
      "rz",
      "cx",
      "cy",
      "cz",
      "cp",
      "crx",
      "cry",
      "crz",
      "ch",
      "swap",
      "ccx",
      "cswap",
      "cu",
      // OpenQASM 2 backwards compatibility gates
      "CX",
      "phase",
      "cphase",
      "id",
      "u1",
      "u2",
      "u3",
    ];
    gates.forEach(this.standardGates.add, this.standardGates);
  }

  /**
   * Parses the token stream and generates an abstract syntax tree.
   * @return The abstract syntax tree.
   */
  parse(): Array<AstNode> {
    let ast: Array<AstNode> = [];
    while (this.index < this.tokens.length - 1) {
      const [nodes, consumed] = this.parseNode(this.tokens.slice(this.index));
      ast = ast.concat(nodes ? nodes : []);
      this.index += consumed;
    }
    return ast;
    // let i = 0;
    // while (i < this.tokens.length - 1) {
    //   this.index = i;
    //   const nodes = this.parseNode(this.tokens.slice(i))[0];
    //   ast = ast.concat(nodes ? nodes : []);
    //   while (!this.matchNext(this.tokens.slice(i), [Token.Semicolon])) {
    //     if (this.matchNext(this.tokens.slice(i), [Token.LCParen])) {
    //       while (!this.matchNext(this.tokens.slice(i), [Token.RCParen])) {
    //         i++;
    //       }
    //       break;
    //     } else if (this.matchNext(this.tokens.slice(i), [Token.RCParen])) {
    //       break;
    //     }
    //     i++;
    //   }
    //   i++;
    // }
    // return ast;
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
        if (includeNode.filename === '"stdgates.inc"') {
          this.stdGates();
        }
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
      case Token.Angle:
      case Token.Stretch:
      case Token.Complex:
      case Token.Duration: {
        const [classicalNode, consumed] = this.classicalDeclaration(
          tokens,
          false,
        );
        return [[classicalNode], consumed];
      }
      case Token.Qubit:
      case Token.QReg: {
        const [qregNode, qregConsumed] = this.quantumDeclaration(tokens);
        return [[qregNode], qregConsumed];
      }
      case Token.Break:
        return [[new BreakStatement()], 1];
      case Token.Reset: {
        const [resetNode, resetConsumed] = this.resetStatement(tokens);
        return [[resetNode], resetConsumed];
      }
      case Token.Continue:
        return [[new ContinueStatement()], 1];
      case Token.Let: {
        const [letNode, letConsumed] = this.aliasStatement(tokens);
        return [[letNode], letConsumed];
      }
      case Token.Bit:
        if (this.isMeasurement(tokens.slice(1))) {
          const [measureNode, measureConsumed] = this.measureStatement(tokens);
          return [[measureNode], measureConsumed];
        } else {
          const [classicalNode, consumed] = this.classicalDeclaration(
            tokens,
            false,
          );
          return [[classicalNode], consumed];
        }
      case Token.Measure: {
        const [measureNode, measureConsumed] = this.measureStatement(tokens);
        return [[measureNode], measureConsumed];
      }
      case Token.Gate: {
        const [gateNode, gateConsumed] = this.quantumGateDefinition(tokens);
        this.customGates.add(gateNode.name.name);
        return [[gateNode], gateConsumed];
      }
      case Token.Return: {
        const [returnNode, returnConsumed] = this.returnStatement(tokens);
        return [[returnNode], returnConsumed];
      }
      case Token.Def: {
        const [subroutineNode, subroutineConsumed] =
          this.subroutineDefinition(tokens);
        this.subroutines.add(subroutineNode.name.name);
        return [[subroutineNode], subroutineConsumed];
      }
      case Token.Ctrl:
      case Token.NegCtrl:
      case Token.Inv:
      case Token.PowM: {
        const [gateCallNode, gateCallConsumed] = this.quantumGateCall(tokens);
        return [[gateCallNode], gateCallConsumed];
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
      case Token.Opaque: {
        let consumed = 1;
        while (
          consumed < this.tokens.length &&
          !this.matchNext(tokens.slice(consumed), [Token.Semicolon])
        ) {
          consumed++;
        }
        return [[], consumed];
      }
      case Token.DurationOf: {
        const [durationOfNOde, consumed] = this.durationOf(tokens);
        return [[durationOfNOde], consumed];
      }
      case Token.SizeOf: {
        const [sizeOfNode, consumed] = this.sizeOf(tokens);
        return [[sizeOfNode], consumed];
      }
      case Token.Delay: {
        const [delayNode, delayConsumed] = this.delay(tokens);
        return [[delayNode], delayConsumed];
      }
      case Token.If: {
        const [ifNode, ifConsumed] = this.ifStatement(tokens);
        return [[ifNode], ifConsumed];
      }
      case Token.For: {
        const [forNode, forConsumed] = this.forLoopStatement(tokens);
        return [[forNode], forConsumed];
      }
      case Token.While: {
        const [whileNode, whileConsumed] = this.whileLoopStatement(tokens);
        return [[whileNode], whileConsumed];
      }
      case Token.Switch: {
        const [switchNode, switchConsumed] = this.switchStatement(tokens);
        return [[switchNode], switchConsumed];
      }
      case Token.Array: {
        const [arrayNode, arrayConsumed] = this.arrayDeclaration(tokens);
        this.customArrays.add(arrayNode.identifier.name);
        return [[arrayNode], arrayConsumed];
      }
      case Token.Box: {
        const [boxNode, boxConsumed] = this.box(tokens);
        return [[boxNode], boxConsumed];
      }
      case Token.Barrier: {
        const [barrierNode, barrierConsumed] = this.barrier(tokens);
        return [[barrierNode], barrierConsumed];
      }
      case Token.Id:
        if (this.isQuantumGateCall(tokens)) {
          const [gateCallNode, gateCallConsumed] = this.quantumGateCall(tokens);
          return [[gateCallNode], gateCallConsumed];
        } else if (this.isSubroutineCall(tokens)) {
          const [subroutineCallNode, subroutineCallConsumed] =
            this.subroutineCall(tokens);
          return [[subroutineCallNode], subroutineCallConsumed];
        } else if (this.isMeasurement(tokens)) {
          const [measureNode, measureConsumed] = this.measureStatement(tokens);
          return [[measureNode], measureConsumed];
        } else if (
          this.matchNext(tokens.slice(1), [Token.EqualsAssmt]) ||
          this.matchNext(tokens.slice(1), [Token.CompoundArithmeticOp]) ||
          this.isAssignment(tokens)
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

    if (this.matchNext(tokens.slice(consumed), [Token.Semicolon])) {
      consumed++;
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
      case Token.NNInteger: {
        if (this.isImaginary(tokens[consumed])) {
          return [
            new ImaginaryLiteral(`${token[1].toString()}im`),
            consumed + 1,
          ];
        } else if (this.isDuration(tokens.slice(consumed))) {
          return [
            new DurationLiteral(
              Number(token[1]),
              tokens[consumed][1].toString() as DurationUnit,
            ),
            consumed + 1,
          ];
        }
        return [new IntegerLiteral(Number(token[1])), consumed];
      }
      case Token.Integer: {
        if (this.isImaginary(tokens[consumed])) {
          return [
            new ImaginaryLiteral(`${token[1].toString()}im`),
            consumed + 1,
          ];
        }
        return [new IntegerLiteral(token[1].toString()), consumed];
      }
      case Token.BinaryLiteral:
      case Token.OctalLiteral:
      case Token.HexLiteral:
      case Token.ScientificNotation:
        return [new NumericLiteral(token[1].toString()), consumed];
      case Token.Real:
        if (this.isImaginary(tokens[consumed])) {
          return [
            new ImaginaryLiteral(`${token[1].toString()}im`),
            consumed + 1,
          ];
        }
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
        // Handle array identifiers, identifiers, and subscripted identifiers
        if (this.matchNext(tokens.slice(1), [Token.LSParen])) {
          if (this.isArray(tokens)) {
            const [arrayAccess, arrayAccessConsumed] =
              this.parseArrayAccess(tokens);
            return [arrayAccess, arrayAccessConsumed];
          } else {
            const identifier = new Identifier(token[1].toString());
            const [subscript, subscriptConsumed] = this.parseSubscript(
              tokens.slice(1),
            );
            consumed += subscriptConsumed;
            return [
              new SubscriptedIdentifier(identifier.name, subscript),
              consumed,
            ];
          }
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
      case Token.DurationOf:
        return this.durationOf(tokens);
      case Token.SizeOf:
        return this.sizeOf(tokens);
      case Token.UnaryOp: {
        const [expr, exprConsumed] = this.unaryExpression(tokens.slice(1));
        return [new Unary(token[1] as UnaryOp, expr), consumed + exprConsumed];
      }
      case Token.LParen:
        return this.parseParameters(tokens);
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
    const unaryExpr = this.unaryExpression(tokens);
    let leftExpr = unaryExpr[0];
    const leftConsumed = unaryExpr[1];
    let consumed = leftConsumed;

    while (consumed < tokens.length) {
      const token = tokens[consumed];
      if (token[0] === Token.BinaryOp || token[0] === Token.ArithmeticOp) {
        consumed++;
        const [rightExpr, rightConsumed] = this.unaryExpression(
          tokens.slice(consumed),
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
        consumed += rightConsumed;
      } else {
        break;
      }
    }

    return [leftExpr, consumed];
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
      consumed++;

      const arithmeticOp = operator.slice(0, -1) as ArithmeticOp;
      const arithmeticExpression = new Arithmetic(arithmeticOp, lhs, rhs);
      return [
        new AssignmentStatement(
          lhs as SubscriptedIdentifier | Identifier,
          arithmeticExpression,
        ),
        consumed,
      ];
    }

    if (this.matchNext(tokens.slice(consumed), [Token.EqualsAssmt])) {
      consumed++;
    } else {
      throwParserError(
        BadExpressionError,
        tokens[consumed],
        this.index + consumed,
        "expected `=` in assignment statement",
      );
    }

    let rhs: Expression | SubroutineCall;
    if (this.isSubroutineCall(tokens.slice(consumed))) {
      const [subroutineCall, subroutineCallConsumed] = this.subroutineCall(
        tokens.slice(consumed),
      );
      rhs = subroutineCall;
      consumed += subroutineCallConsumed;
    } else {
      const [rhsExpression, rhsConsumed] = this.binaryExpression(
        tokens.slice(consumed),
      );
      rhs = rhsExpression;
      consumed += rhsConsumed;
    }

    // if (!this.matchNext(tokens.slice(consumed), [Token.Semicolon])) {
    //   throwParserError(
    //     MissingSemicolonError,
    //     tokens[consumed],
    //     this.index + consumed,
    //     "expected semicolon",
    //   );
    // }
    // consumed++;

    return [
      new AssignmentStatement(lhs as SubscriptedIdentifier, rhs),
      consumed,
    ];
  }

  /**
   * Parses a quantum declaration.
   * @param tokens - Tokens to parse.
   * @return A QuantumDeclaration node and the number of tokens consumed.
   */
  quantumDeclaration(
    tokens: Array<[Token, (number | string)?]>,
  ): [QuantumDeclaration, number] {
    let consumed = 1;
    const isQubit = tokens[0][0] === Token.Qubit;

    let size: Expression | null = null;
    // Qubit
    if (isQubit) {
      if (this.matchNext(tokens.slice(consumed), [Token.LSParen])) {
        consumed++;
        const [sizeExpr, sizeConsumed] = this.binaryExpression(
          tokens.slice(consumed),
        );
        consumed += sizeConsumed;
        size = sizeExpr;

        if (!this.matchNext(tokens.slice(consumed), [Token.RSParen])) {
          throwParserError(
            MissingBraceError,
            tokens[consumed],
            this.index + consumed,
            "expected closing bracket ] for qubit declaration size",
          );
        }
        consumed++;
      }
    }

    if (!this.matchNext(tokens.slice(consumed), [Token.Id])) {
      throwParserError(
        BadQregError,
        tokens[consumed],
        this.index + consumed,
        "expected identifier for quantum declaration",
      );
    }

    const [identifier, idConsumed] = this.unaryExpression(
      tokens.slice(consumed, consumed + 1),
    );
    consumed += idConsumed;

    // Qreg
    if (!isQubit && this.matchNext(tokens.slice(consumed), [Token.LSParen])) {
      consumed++;
      const [sizeExpr, sizeConsumed] = this.binaryExpression(
        tokens.slice(consumed),
      );
      size = sizeExpr;
      consumed += sizeConsumed;

      if (!this.matchNext(tokens.slice(consumed), [Token.RSParen])) {
        throwParserError(
          MissingBraceError,
          tokens[consumed],
          this.index + consumed,
          "expected closing bracket ] for quantum register size",
        );
      }
      consumed++;
    }

    if (
      !(
        this.matchNext(tokens.slice(consumed), [Token.Semicolon]) ||
        this.matchNext(tokens.slice(consumed), [Token.Comma]) ||
        this.matchNext(tokens.slice(consumed), [Token.RParen])
      )
    ) {
      throwParserError(
        BadQregError,
        tokens[consumed],
        this.index + consumed,
        "expected semicolon, comma, or closing parenthesis after quantum register declaration",
      );
    }
    // Only consume semicolon, if paren or comma that token will be handled in calling function
    if (this.matchNext(tokens.slice(consumed), [Token.Semicolon])) {
      consumed++;
    }

    return [new QuantumDeclaration(identifier as Identifier, size), consumed];
  }

  /**
   * Parses a measure statement.
   * @param tokens - Remaining tokens to parse.
   * @return A tuple containing the QuantumMeasurementAssignment or QuantumMeasurement and the number of tokens consumed.
   */
  measureStatement(
    tokens: Array<[Token, (number | string)?]>,
  ): [QuantumMeasurementAssignment | QuantumMeasurement, number] {
    let consumed = 0;

    // Legacy syntax: measure qubit|qubit[] -> bit|bit[];
    if (this.matchNext(tokens.slice(consumed), [Token.Measure])) {
      consumed++;
      const qubitIdentifiers: (Identifier | SubscriptedIdentifier)[] = [];
      while (
        !(
          this.matchNext(tokens.slice(consumed), [Token.Arrow]) ||
          this.matchNext(tokens.slice(consumed), [Token.Semicolon])
        )
      ) {
        const [identifier, idConsumed] = this.unaryExpression(
          tokens.slice(consumed),
        );
        qubitIdentifiers.push(identifier as Identifier | SubscriptedIdentifier);
        consumed += idConsumed;

        if (this.matchNext(tokens.slice(consumed), [Token.Comma])) {
          consumed++;
        } else if (
          !(
            this.matchNext(tokens.slice(consumed), [Token.Arrow]) ||
            this.matchNext(tokens.slice(consumed), [Token.Semicolon])
          )
        ) {
          throwParserError(
            BadMeasurementError,
            tokens[consumed],
            this.index + consumed,
            "expected comma or arrow in measurement statement",
          );
        }
      }
      const measurement = new QuantumMeasurement(qubitIdentifiers);

      // If there's an arrow, build a QuantumMeasurementAssignment
      if (this.matchNext(tokens.slice(consumed), [Token.Arrow])) {
        consumed++;
        const [identifier, idConsumed] = this.unaryExpression(
          tokens.slice(consumed),
        );
        const classicalBit = identifier as Identifier | SubscriptedIdentifier;
        consumed += idConsumed;

        if (!this.matchNext(tokens.slice(consumed), [Token.Semicolon])) {
          throwParserError(
            MissingSemicolonError,
            tokens[consumed],
            this.index + consumed,
          );
        }
        consumed++;
        return [
          new QuantumMeasurementAssignment(
            classicalBit as Identifier,
            measurement,
          ),
          consumed,
        ];
      } else {
        if (!this.matchNext(tokens.slice(consumed), [Token.Semicolon])) {
          throwParserError(
            MissingSemicolonError,
            tokens[consumed],
            this.index + consumed,
          );
        }
        consumed++;

        return [measurement, consumed];
      }
    }
    // New syntax: bit|bit[] = measure qubit|qreg;
    else {
      const [leftIdentifier, leftIdConsumed] = this.unaryExpression(
        tokens.slice(consumed),
      );
      const classicalBit = leftIdentifier as Identifier | SubscriptedIdentifier;
      consumed += leftIdConsumed;

      if (!this.matchNext(tokens.slice(consumed), [Token.EqualsAssmt])) {
        throwParserError(
          BadMeasurementError,
          tokens[consumed],
          this.index + consumed,
          "expected `=` in measurement assignment",
        );
      }
      consumed++;

      if (!this.matchNext(tokens.slice(consumed), [Token.Measure])) {
        throwParserError(
          BadMeasurementError,
          tokens[consumed],
          this.index + consumed,
          "expected `measure` keyword in measurement assignment",
        );
      }
      consumed++;

      const [rightIdentifier, rightIdConsumed] = this.unaryExpression(
        tokens.slice(consumed),
      );
      const qubitIdentifier = rightIdentifier as
        | Identifier
        | SubscriptedIdentifier;
      consumed += rightIdConsumed;

      if (!this.matchNext(tokens.slice(consumed), [Token.Semicolon])) {
        throwParserError(
          MissingSemicolonError,
          tokens[consumed],
          this.index + consumed,
        );
      }
      consumed++;

      const measurement = new QuantumMeasurement([
        qubitIdentifier as Identifier,
      ]);
      return [
        new QuantumMeasurementAssignment(
          classicalBit as Identifier,
          measurement,
        ),
        consumed,
      ];
    }
  }

  /**
   * Parses a subroutine return statement.
   * @param tokens - Remaining tokens to parse.
   * @return A tuple containing the SubroutineDefinition and the number of tokens consumed.
   */
  returnStatement(
    tokens: Array<[Token, (number | string)?]>,
  ): [ReturnStatement, number] {
    let consumed = 1;
    let expression: Expression | null = null;

    if (!this.matchNext(tokens.slice(consumed), [Token.Semicolon])) {
      const [expr, exprConsumed] = this.parseNode(tokens.slice(consumed));
      expression = expr;
      consumed += exprConsumed;
    }

    return [new ReturnStatement(expression), consumed];
  }

  /**
   * Parses a subroutine definition.
   * @param tokens - Remaining tokens to parse.
   * @return A tuple containing the SubroutineDefinition and the number of tokens consumed.
   */
  subroutineDefinition(
    tokens: Array<[Token, (number | string)?]>,
  ): [SubroutineDefinition, number] {
    let consumed = 1;

    if (!this.matchNext(tokens.slice(consumed), [Token.Id])) {
      throwParserError(
        BadSubroutineError,
        tokens[consumed],
        this.index + consumed,
        "expected subroutine name",
      );
    }
    const [name, nameConsumed] = this.unaryExpression(tokens.slice(consumed));
    consumed += nameConsumed;

    if (!this.matchNext(tokens.slice(consumed), [Token.LParen])) {
      throwParserError(
        MissingBraceError,
        tokens[consumed],
        this.index + consumed,
        "expected opening parenthesis for subroutine definition",
      );
    }
    const [params, paramsConsumed] = this.parseParameters(
      tokens.slice(consumed),
    );
    consumed += paramsConsumed;

    let returnType: ClassicalType | null = null;
    if (this.matchNext(tokens.slice(consumed), [Token.Arrow])) {
      consumed++;
      const [type, typeConsumed] = this.parseClassicalType(
        tokens.slice(consumed),
      );
      returnType = type;
      consumed += typeConsumed;
    }

    if (!this.matchNext(tokens.slice(consumed), [Token.LCParen])) {
      throwParserError(
        MissingBraceError,
        tokens[consumed],
        this.index + consumed,
        "expected opening brace for subroutine body",
      );
    }
    const [body, bodyConsumed] = this.programBlock(tokens.slice(consumed));
    consumed += bodyConsumed;

    return [
      new SubroutineDefinition(
        name as Identifier,
        body as SubroutineBlock,
        params,
        returnType,
      ),
      consumed,
    ];
  }

  /**
   * Parses a subroutine call.
   * @param tokens - Remaining tokens to parse.
   * @return A tuple containing the SubroutineCall and the number of tokens consumed.
   */
  subroutineCall(
    tokens: Array<[Token, (number | string)?]>,
  ): [SubroutineCall, number] {
    let consumed = 0;
    if (!this.matchNext(tokens.slice(consumed), [Token.Id])) {
      throwParserError(
        BadSubroutineError,
        tokens[consumed],
        this.index + consumed,
        "expected subroutine name",
      );
    }
    const [subroutineName, subroutineNameConsumed] = this.unaryExpression(
      tokens.slice(consumed),
    );
    consumed += subroutineNameConsumed;

    let callParams: Parameters | null = null;
    if (this.matchNext(tokens.slice(consumed), [Token.LParen])) {
      const [params, paramsConsumed] = this.parseParameters(
        tokens.slice(consumed),
      );
      callParams = params;
      consumed += paramsConsumed;
    }

    if (!this.matchNext(tokens.slice(consumed), [Token.Semicolon])) {
      throwParserError(
        MissingSemicolonError,
        tokens[consumed],
        this.index + consumed,
        "expected semicolon after subroutine call",
      );
    }
    consumed++;

    return [
      new SubroutineCall(subroutineName as Identifier, callParams),
      consumed,
    ];
  }

  /**
   * Parses a quantum gate definition.
   * @param tokens - Remaining tokens to parse.
   * @return A tuple containing the QuantumGateDefinition and the number of tokens consumed.
   */
  quantumGateDefinition(
    tokens: Array<[Token, (number | string)?]>,
  ): [QuantumGateDefinition, number] {
    let consumed = 1;

    if (!this.matchNext(tokens.slice(consumed), [Token.Id])) {
      throwParserError(
        BadGateError,
        tokens[consumed],
        this.index + consumed,
        "expected gate name",
      );
    }
    const [name, nameConsumed] = this.unaryExpression(tokens.slice(consumed));
    consumed += nameConsumed;

    // Parse optional parameters
    const [params, paramsConsumed] = this.parseParameters(
      tokens.slice(consumed),
    );
    consumed += paramsConsumed;

    // Parse qubits
    const qubits: Array<Identifier> = [];
    while (!this.matchNext(tokens.slice(consumed), [Token.LCParen])) {
      if (!this.matchNext(tokens.slice(consumed), [Token.Id])) {
        throwParserError(
          BadGateError,
          tokens[consumed],
          this.index + consumed,
          "expected qubit argument",
        );
      }
      const [qubit, qubitConsumed] = this.unaryExpression(
        tokens.slice(consumed),
      );
      qubits.push(qubit as Identifier | SubscriptedIdentifier);
      consumed += qubitConsumed;

      if (this.matchNext(tokens.slice(consumed), [Token.Comma])) {
        consumed++;
      } else if (!this.matchNext(tokens.slice(consumed), [Token.LCParen])) {
        throwParserError(
          BadGateError,
          tokens[consumed],
          this.index + consumed,
          "expected comma or opening brace for gate body",
        );
      }
    }

    const [body, bodyConsumed] = this.programBlock(tokens.slice(consumed));
    consumed += bodyConsumed;

    return [
      new QuantumGateDefinition(
        name as Identifier,
        params,
        qubits,
        body as QuantumBlock,
      ),
      consumed,
    ];
  }

  /**
   * Parses a quantum gate call.
   * @param tokens - Remaining tokens to parse.
   * @return A tuple containing the QuantumGateCall and the number of tokens consumed.
   */
  quantumGateCall(
    tokens: Array<[Token, (number | string)?]>,
  ): [QuantumGateCall, number] {
    let consumed = 0;
    const modifiers: Array<QuantumGateModifier> = [];

    // Parse modifier(s)
    while (
      this.matchNext(tokens.slice(consumed), [Token.Ctrl]) ||
      this.matchNext(tokens.slice(consumed), [Token.NegCtrl]) ||
      this.matchNext(tokens.slice(consumed), [Token.Inv]) ||
      this.matchNext(tokens.slice(consumed), [Token.PowM])
    ) {
      const [modifier, modifierConsumed] = this.parseQuantumGateModifier(
        tokens.slice(consumed),
      );
      modifiers.push(modifier);
      consumed += modifierConsumed;
    }

    // Parse gate name
    if (!this.matchNext(tokens.slice(consumed), [Token.Id])) {
      throwParserError(
        BadGateError,
        tokens[consumed],
        this.index + consumed,
        "expected gate name",
      );
    }
    const [gateName, gateNameConsumed] = this.unaryExpression(
      tokens.slice(consumed),
    );
    consumed += gateNameConsumed;

    let callParams: Parameters = null;
    // Parse optional parameters
    if (this.matchNext(tokens.slice(consumed), [Token.LParen])) {
      const [params, paramsConsumed] = this.parseParameters(
        tokens.slice(consumed),
      );
      callParams = params;
      consumed += paramsConsumed;
    }

    // Parse qubit arguments
    const [qubits, qubitsConsumed] = this.parseQubitList(
      tokens.slice(consumed),
    );
    consumed += qubitsConsumed;

    if (!this.matchNext(tokens.slice(consumed), [Token.Semicolon])) {
      throwParserError(
        MissingSemicolonError,
        tokens[consumed],
        this.index + consumed,
        "expected semicolon",
      );
    }
    consumed++;

    return [
      new QuantumGateCall(
        gateName as Identifier,
        qubits,
        callParams,
        modifiers,
      ),
      consumed,
    ];
  }

  /**
   * Parses a list of qubits.
   * @param tokens - Remaining tokens to parse.
   * @return A tuple containing the list of qubits and the number of tokens consumed.
   */
  parseQubitList(
    tokens: Array<[Token, (number | string)?]>,
  ): [Array<Identifier | SubscriptedIdentifier | HardwareQubit>, number] {
    let consumed = 0;
    const qubits: Array<Identifier | SubscriptedIdentifier | HardwareQubit> =
      [];

    while (!this.matchNext(tokens.slice(consumed), [Token.Semicolon])) {
      if (
        this.matchNext(tokens.slice(consumed), [Token.Dollar, Token.NNInteger])
      ) {
        const [hardwareQubit, hardwareQubitConsumed] = this.parseHardwareQubit(
          tokens.slice(consumed),
        );
        qubits.push(hardwareQubit);
        consumed += hardwareQubitConsumed;
        if (this.matchNext(tokens.slice(consumed), [Token.Comma])) {
          consumed++;
        }
        continue;
      } else if (!this.matchNext(tokens.slice(consumed), [Token.Id])) {
        throwParserError(
          BadExpressionError,
          tokens[consumed],
          this.index + consumed,
          "expected qubit argument",
        );
      }
      const [qubit, qubitConsumed] = this.unaryExpression(
        tokens.slice(consumed),
      );
      qubits.push(qubit as Identifier);
      consumed += qubitConsumed;

      if (this.matchNext(tokens.slice(consumed), [Token.Comma])) {
        consumed++;
      } else if (!this.matchNext(tokens.slice(consumed), [Token.Semicolon])) {
        break;
      }
    }

    return [qubits, consumed];
  }

  /**
   * Parses a hardware qubit.
   * @param tokens - Remaining tokens to parse.
   * @return A tuple containing the HardwareQubit and the number of tokens consumed.
   */
  parseHardwareQubit(
    tokens: Array<[Token, (number | string)?]>,
  ): [HardwareQubit, number] {
    let consumed = 0;
    if (!this.matchNext(tokens.slice(consumed), [Token.Dollar])) {
      throwParserError(
        BadGateError,
        tokens[consumed],
        this.index + consumed,
        "expected dollar sign for hardware qubit",
      );
    }
    consumed++;
    if (!this.matchNext(tokens.slice(consumed), [Token.NNInteger])) {
      throwParserError(
        BadGateError,
        tokens[consumed],
        this.index + consumed,
        "expected non-negative integer for hardware qubit",
      );
    }
    return [new HardwareQubit(Number(tokens[consumed][1])), consumed + 1];
  }

  /**
   * Parses a gate modifier.
   * @param tokens - Remaining tokens to parse.
   * @return A tuple containing the gate modifier and the number of tokens consumed.
   */
  parseQuantumGateModifier(
    tokens: Array<[Token, (number | string)?]>,
  ): [QuantumGateModifier, number] {
    let consumed = 1;
    const modifierToken = tokens[0][0];
    let modifier: QuantumGateModifierName;
    let argument: Expression | null = null;

    switch (modifierToken) {
      case Token.Ctrl:
        modifier = QuantumGateModifierName.CTRL;
        break;
      case Token.NegCtrl:
        modifier = QuantumGateModifierName.NRGCTRL;
        break;
      case Token.Inv:
        modifier = QuantumGateModifierName.INV;
        break;
      case Token.PowM:
        modifier = QuantumGateModifierName.POW;
        break;
      default:
        throwParserError(
          BadGateError,
          tokens[0],
          this.index,
          "invalid gate modifier",
        );
    }

    if (!this.matchNext(tokens.slice(consumed), [Token.At])) {
      throwParserError(
        BadGateError,
        tokens[consumed],
        this.index + consumed,
        "expected `@` symbol after gate modifier",
      );
    }
    consumed++;

    if (this.matchNext(tokens.slice(consumed), [Token.LParen])) {
      consumed++;
      const [arg, argConsumed] = this.binaryExpression(tokens.slice(consumed));
      argument = arg;
      consumed += argConsumed;

      if (!this.matchNext(tokens.slice(consumed), [Token.RParen])) {
        throwParserError(
          BadGateError,
          tokens[consumed],
          this.index + consumed,
          "expected closing parenthesis after gate modifier argument",
        );
      }
      consumed++;
    }
    return [new QuantumGateModifier(modifier, argument), consumed];
  }

  /**
   * Parses a set of parameters.
   * @param tokens - Remaining tokens to parse.
   * @return A tuple containing the Parameters and the number of tokens consumed.
   */
  parseParameters(
    tokens: Array<[Token, (number | string)?]>,
  ): [Parameters, number] {
    let consumed = 0;
    const args: Array<Expression> = [];

    if (this.matchNext(tokens, [Token.LParen])) {
      consumed++;
      while (!this.matchNext(tokens.slice(consumed), [Token.RParen])) {
        if (this.matchNext(tokens.slice(consumed), [Token.Qubit])) {
          const [qubitParam, qubitConsumed] = this.parseNode(
            tokens.slice(consumed),
          );
          args.push(qubitParam);
          consumed += qubitConsumed;
        } else if (this.matchNext(tokens.slice(consumed), [Token.Bit])) {
          const [bitParam, bitConsumed] = this.parseNode(
            tokens.slice(consumed),
          );
          args.push(bitParam);
          consumed += bitConsumed;
        } else if (isTypeToken(tokens[consumed][0])) {
          const [param, paramConsumed] = this.classicalDeclaration(
            tokens.slice(consumed),
          );
          args.push(param);
          consumed += paramConsumed;
        } else if (
          this.matchNext(tokens.slice(consumed), [Token.ReadOnly]) ||
          this.matchNext(tokens.slice(consumed), [Token.Mutable])
        ) {
          const [arrayRef, arrayRefConsumed] = this.parseArrayReference(
            tokens.slice(consumed),
          );
          args.push(arrayRef);
          consumed += arrayRefConsumed;
        } else {
          const [param, paramConsumed] = this.binaryExpression(
            tokens.slice(consumed),
          );
          args.push(param);
          consumed += paramConsumed;
        }

        if (this.matchNext(tokens.slice(consumed), [Token.Comma])) {
          consumed++;
        } else if (!this.matchNext(tokens.slice(consumed), [Token.RParen])) {
          throwParserError(
            BadParameterError,
            tokens[consumed],
            this.index + consumed,
            "expected comma or closing parenthesis in parameter list",
          );
        }
      }
      consumed++;
    }

    return [new Parameters(args), consumed];
  }

  /**
   * Parses an array reference.
   * @param tokens - Remaining tokens to parse.
   * @return A tuple containing the ArrayReference and the number of tokens consumed.
   */
  parseArrayReference(
    tokens: Array<[Token, (number | string)?]>,
  ): [ArrayReference, number] {
    let consumed = 0;
    let modifier: ArrayReferenceModifier;
    switch (tokens[consumed][0]) {
      case Token.Mutable:
        modifier = ArrayReferenceModifier.MUTABLE;
        break;
      case Token.ReadOnly:
        modifier = ArrayReferenceModifier.READONLY;
        break;
      default:
        throwParserError(
          BadExpressionError,
          tokens[consumed],
          this.index + consumed,
          "unsupported array reference modifier",
        );
    }
    consumed++;

    const [arrayNode, arrayConsumed] = this.arrayDeclaration(
      tokens.slice(consumed),
    );
    consumed += arrayConsumed;

    return [new ArrayReference(arrayNode, modifier), consumed];
  }

  /**
   * Parses an alias statement.
   * @param tokens - Remaining tokens to parse.
   * @return A tuple containing the AliasStatement and the number of tokens consumed.
   */
  aliasStatement(
    tokens: Array<[Token, (number | string)?]>,
  ): [AliasStatement, number] {
    let consumed = 1;

    if (!this.matchNext(tokens.slice(consumed), [Token.Id])) {
      throwParserError(
        BadExpressionError,
        tokens[consumed],
        this.index + consumed,
        "expected identifier for alias statement",
      );
    }
    const [identifier, identifierConsumed] = this.unaryExpression(
      tokens.slice(consumed),
    );
    consumed += identifierConsumed;

    if (!this.matchNext(tokens.slice(consumed), [Token.EqualsAssmt])) {
      throwParserError(
        BadExpressionError,
        tokens[consumed],
        this.index + consumed,
        "expected `=` symbol following identifier for alias statement",
      );
    }
    consumed++;

    const [aliasExpression, aliasExpressionConsumed] = this.binaryExpression(
      tokens.slice(consumed),
    );
    consumed += aliasExpressionConsumed;

    if (!this.matchNext(tokens.slice(consumed), [Token.Semicolon])) {
      throwParserError(
        MissingSemicolonError,
        tokens[consumed],
        this.index + consumed,
        "expected semicolon",
      );
    }
    consumed++;

    return [
      new AliasStatement(identifier as Identifier, aliasExpression),
      consumed,
    ];
  }

  /**
   * Parses a quantum reset.
   * @param tokens - Remaining tokens to parse.
   * @return A tuple containing the QuantumReset and the number of tokens consumed.
   */
  resetStatement(
    tokens: Array<[Token, (number | string)?]>,
  ): [QuantumReset, number] {
    let consumed = 1;

    if (!this.matchNext(tokens.slice(consumed), [Token.Id])) {
      throwParserError(
        BadQuantumInstructionError,
        tokens[consumed],
        this.index + consumed,
        "expected identifier after reset keyword",
      );
    }
    const [idNode, idConsumed] = this.unaryExpression(tokens.slice(consumed));
    consumed += idConsumed;

    let id: Identifier | SubscriptedIdentifier = null;
    if (idNode instanceof SubscriptedIdentifier) {
      id = idNode as SubscriptedIdentifier;
    } else {
      id = idNode as Identifier;
    }
    consumed++;

    return [new QuantumReset(id), consumed];
  }

  /**
   * Parses a subscript expression as a Range.
   * @param tokens - Remaining tokens to parse.
   * @return A tuple containing the parsed Expression or Range and the number of tokens consumed.
   */
  parseSubscript(
    tokens: Array<[Token, (number | string)?]>,
  ): [Expression | Range | IndexSet, number] {
    let consumed = 1;
    let start: Expression | null = null;
    let step: Expression = new IntegerLiteral(1);
    let stop: Expression | null = null;

    if (this.matchNext(tokens.slice(consumed), [Token.LCParen])) {
      const [indexSet, indexSetConsumed] = this.parseIndexSet(
        tokens.slice(consumed),
      );
      consumed += indexSetConsumed;
      if (!this.matchNext(tokens.slice(consumed), [Token.RSParen])) {
        throwParserError(
          MissingBraceError,
          tokens[consumed],
          this.index + consumed,
          "expected closing curly bracket } for index set",
        );
      }
      consumed++;
      return [indexSet, consumed];
    }

    if (!this.matchNext(tokens.slice(consumed), [Token.Colon])) {
      // Parse start
      const [startExpr, startConsumed] = this.binaryExpression(
        tokens.slice(consumed),
      );
      start = startExpr;
      consumed += startConsumed;
    }

    if (this.matchNext(tokens.slice(consumed), [Token.RSParen])) {
      return [start, consumed + 1];
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

    if (!this.matchNext(tokens.slice(consumed), [Token.RSParen])) {
      const [expr, exprConsumed] = this.binaryExpression(
        tokens.slice(consumed),
      );
      consumed += exprConsumed;

      // Check if its a step or stop
      if (this.matchNext(tokens.slice(consumed), [Token.Colon])) {
        step = expr;
        consumed++;

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
      } else {
        stop = expr;
      }
    }

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
    let consumed = 1;
    let widthExpr: Expression | null = null;
    if (this.matchNext(tokens.slice(consumed), [Token.LSParen])) {
      consumed++;
      const [width, widthConsumed] = this.binaryExpression(
        tokens.slice(consumed),
      );
      consumed += widthConsumed;
      widthExpr = width;
      if (!this.matchNext(tokens.slice(consumed), [Token.RSParen])) {
        throwParserError(
          MissingBraceError,
          tokens[consumed],
          this.index + consumed,
          "missing closing bracket ] for type designator",
        );
      }
      consumed++;
    }

    if (!this.matchNext(tokens.slice(consumed), [Token.LParen])) {
      throwParserError(
        MissingBraceError,
        tokens[0],
        this.index,
        "expected opening parenthesis ( for type cast",
      );
    }
    consumed++;
    const [castExpr, castConsumed] = this.binaryExpression(
      tokens.slice(consumed),
    );
    consumed += castConsumed;
    if (!this.matchNext(tokens.slice(consumed), [Token.RParen])) {
      throwParserError(
        MissingBraceError,
        tokens[0],
        this.index,
        "expected closing parenthesis ) for type cast",
      );
    }
    consumed++;
    const castType = this.createClassicalType(tokens[0][0], widthExpr);
    return [new Cast(castType, castExpr), consumed];
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
   * Parses a while loop.
   * @param tokens - Tokens to parse.
   * @return A ForLoopStatement node and the number of tokens consumed.
   */
  whileLoopStatement(
    tokens: Array<[Token, (number | string)?]>,
  ): [WhileLoopStatement, number] {
    let consumed = 1;

    if (!this.matchNext(tokens.slice(consumed), [Token.LParen])) {
      throwParserError(
        MissingBraceError,
        tokens[consumed],
        this.index + consumed,
        "expected opening parenthesis after while keyword",
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
        "expected closing parenthesis after while loop condition",
      );
    }
    consumed++;

    const [body, bodyConsumed] = this.programBlock(tokens.slice(consumed));
    consumed += bodyConsumed;

    return [new WhileLoopStatement(condition, body), consumed];
  }

  /**
   * Parses a barrier statement.
   * @param tokens - Tokens to parse.
   * @return An QuantumBarrier node and the number of tokens consumed.
   */
  barrier(
    tokens: Array<[Token, (number | string)?]>,
  ): [QuantumBarrier, number] {
    let consumed = 1;
    const [qubits, qubitsConsumed] = this.parseQubitList(
      tokens.slice(consumed),
    );
    consumed += qubitsConsumed;
    return [new QuantumBarrier(qubits), consumed];
  }

  /**
   * Parses a box statement.
   * @param tokens - Tokens to parse.
   * @return An BoxDefinition node and the number of tokens consumed.
   */
  box(tokens: Array<[Token, (number | string)?]>): [BoxDefinition, number] {
    let consumed = 1;
    let designator: Expression | null = null;

    if (this.matchNext(tokens.slice(consumed), [Token.LSParen])) {
      consumed++;
      const [desginatorNode, designatorConsumed] = this.binaryExpression(
        tokens.slice(consumed),
      );
      consumed += designatorConsumed;
      designator = desginatorNode;
      if (!this.matchNext(tokens.slice(consumed), [Token.RSParen])) {
        throwParserError(
          MissingBraceError,
          tokens[consumed],
          this.index + consumed,
          "expected closing ] bracket following box designator",
        );
      }
      consumed++;
    }

    const [scope, scopeConsumed] = this.programBlock(tokens.slice(consumed));
    consumed += scopeConsumed;

    return [new BoxDefinition(scope, designator), consumed];
  }

  /**
   * Parses an array statement.
   * @param tokens - Tokens to parse.
   * @return An ArrayDeclaration node and the number of tokens consumed.
   */
  arrayDeclaration(
    tokens: Array<[Token, (number | string)?]>,
  ): [ArrayDeclaration, number] {
    let consumed = 1;
    if (!this.matchNext(tokens.slice(consumed), [Token.LSParen])) {
      throwParserError(
        MissingBraceError,
        tokens[consumed],
        this.index + consumed,
        "expected [ after array keyword",
      );
    }
    consumed++;

    const [baseType, baseTypeConsumed] = this.parseClassicalType(
      tokens.slice(consumed),
    );
    consumed += baseTypeConsumed;

    let dimensions: Array<Expression> | number = [];
    while (this.matchNext(tokens.slice(consumed), [Token.Comma])) {
      consumed++;
      if (
        this.matchNext(tokens.slice(consumed), [
          Token.Dim,
          Token.EqualsAssmt,
          Token.NNInteger,
        ])
      ) {
        consumed += 2;
        dimensions = Number(tokens[consumed][1]);
        consumed++;
        break;
      }
      const [dimension, dimensionConsumed] = this.binaryExpression(
        tokens.slice(consumed),
      );
      dimensions.push(dimension);
      consumed += dimensionConsumed;
    }
    if (!this.matchNext(tokens.slice(consumed), [Token.RSParen])) {
      throwParserError(
        MissingBraceError,
        tokens[consumed],
        this.index + consumed,
        "expected ] after array type declaration",
      );
    }
    consumed++;

    if (!this.matchNext(tokens.slice(consumed), [Token.Id])) {
      throwParserError(
        BadExpressionError,
        tokens[consumed],
        this.index + consumed,
        "expected identifier for array declaration",
      );
    }
    const [identifier, identifierConsumed] = this.unaryExpression(
      tokens.slice(consumed),
    );
    consumed += identifierConsumed;

    let initializer: ArrayInitializer | Expression | null = null;
    if (this.matchNext(tokens.slice(consumed), [Token.EqualsAssmt])) {
      consumed++;
      const [parsedInitializer, initializerConsumed] =
        this.parseArrayInitializer(tokens.slice(consumed));
      initializer = parsedInitializer;
      consumed += initializerConsumed;
    }

    if (this.matchNext(tokens.slice(consumed), [Token.Semicolon])) {
      consumed++;
    }

    return [
      new ArrayDeclaration(
        baseType,
        dimensions,
        identifier as Identifier,
        initializer,
      ),
      consumed,
    ];
  }

  /**
   * Parses an array initializer.
   * @param tokens - Tokens to parse.
   * @return An ArrayInitializer node and the number of tokens consumed.
   */
  parseArrayInitializer(
    tokens: Array<[Token, (number | string)?]>,
  ): [ArrayInitializer | Expression, number] {
    let consumed = 0;
    if (!this.matchNext(tokens, [Token.LCParen])) {
      const [expr, exprConsumed] = this.binaryExpression(
        tokens.slice(consumed),
      );
      consumed += exprConsumed;
      return [expr, consumed];
    }
    consumed++;

    const values: Array<Expression | ArrayInitializer> = [];
    while (!this.matchNext(tokens.slice(consumed), [Token.RCParen])) {
      if (this.matchNext(tokens.slice(consumed), [Token.LCParen])) {
        const [subInitializer, subConsumed] = this.parseArrayInitializer(
          tokens.slice(consumed),
        );
        values.push(subInitializer);
        consumed += subConsumed;
      } else {
        const [expr, exprConsumed] = this.binaryExpression(
          tokens.slice(consumed),
        );
        values.push(expr);
        consumed += exprConsumed;
      }

      if (this.matchNext(tokens.slice(consumed), [Token.Comma])) {
        consumed++;
      } else if (!this.matchNext(tokens.slice(consumed), [Token.RCParen])) {
        throwParserError(
          BadExpressionError,
          tokens[consumed],
          this.index + consumed,
          "expected comma or } in array initializer",
        );
      }
    }
    consumed++;

    return [new ArrayInitializer(values), consumed];
  }

  /**
   * Parses an array access.
   * @param tokens - Tokens to parse.
   * @return An ArrayAccess  node and the number of tokens consumed.
   */
  parseArrayAccess(
    tokens: Array<[Token, (number | string)?]>,
  ): [ArrayAccess, number] {
    let consumed = 0;
    if (!this.matchNext(tokens.slice(consumed), [Token.Id])) {
      throwParserError(
        BadExpressionError,
        tokens[consumed],
        this.index + consumed,
        "expected identifier for array access",
      );
    }
    const identifier = new Identifier(tokens[0][1].toString());
    consumed++;

    let indices: Array<Expression> | Range = [];
    if (this.matchNext(tokens.slice(consumed), [Token.LSParen])) {
      consumed++;
      while (!this.matchNext(tokens.slice(consumed), [Token.RSParen])) {
        const [index1, index1Consumed] = this.binaryExpression(
          tokens.slice(consumed),
        );
        indices.push(index1);
        consumed += index1Consumed;

        if (this.matchNext(tokens.slice(consumed), [Token.Comma])) {
          consumed++;
        } else if (this.matchNext(tokens.slice(consumed), [Token.Colon])) {
          consumed++;
          let step: Expression = new IntegerLiteral(1);
          let stop: Expression;
          const [index2, index2Consumed] = this.binaryExpression(
            tokens.slice(consumed),
          );
          consumed += index2Consumed;
          if (this.matchNext(tokens.slice(consumed), [Token.Colon])) {
            consumed++;
            const [index3, index3Consumed] = this.binaryExpression(
              tokens.slice(consumed),
            );
            consumed += index3Consumed;
            stop = index3;
            step = index2;
          } else {
            stop = index2;
          }
          indices = new Range(index1, stop, step);
          break;
        } else if (!this.matchNext(tokens.slice(consumed), [Token.RSParen])) {
          throwParserError(
            BadExpressionError,
            tokens[consumed],
            this.index + consumed,
            "expected comma or closing bracket for array access",
          );
        }
      }

      if (!this.matchNext(tokens.slice(consumed), [Token.RSParen])) {
        throwParserError(
          MissingBraceError,
          tokens[consumed],
          this.index + consumed,
          "expected closing bracket ] for array access",
        );
      }
      consumed++;
    }

    return [new ArrayAccess(identifier, indices), consumed];
  }

  /**
   * Parses a switch statement.
   * @param tokens - Tokens to parse.
   * @return A SwitchStatement node and the number of tokens consumed.
   */
  switchStatement(
    tokens: Array<[Token, (number | string)?]>,
  ): [SwitchStatement, number] {
    let consumed = 1;

    if (!this.matchNext(tokens.slice(consumed), [Token.LParen])) {
      throwParserError(
        MissingBraceError,
        tokens[consumed],
        this.index + consumed,
        "expected opening parenthesis after switch keywork",
      );
    }
    consumed++;

    const [controlExpr, controlExprConsumed] = this.binaryExpression(
      tokens.slice(consumed),
    );
    consumed += controlExprConsumed;

    if (!this.matchNext(tokens.slice(consumed), [Token.RParen])) {
      throwParserError(
        MissingBraceError,
        tokens[consumed],
        this.index + consumed,
        "expected closing parenthesis after switch control expression",
      );
    }
    consumed++;

    if (!this.matchNext(tokens.slice(consumed), [Token.LCParen])) {
      throwParserError(
        MissingBraceError,
        tokens[consumed],
        this.index + consumed,
        "expected opening curly brace for switch body",
      );
    }
    consumed++;

    const cases: Array<CaseStatement> = [];
    let defaultCase: DefaultStatement | null = null;

    while (!this.matchNext(tokens.slice(consumed), [Token.RCParen])) {
      if (this.matchNext(tokens.slice(consumed), [Token.Case])) {
        const [caseStmt, caseConsumed] = this.parseCaseStatement(
          tokens.slice(consumed),
        );
        cases.push(caseStmt);
        consumed += caseConsumed;
      } else if (this.matchNext(tokens.slice(consumed), [Token.Default])) {
        if (defaultCase !== null) {
          throwParserError(
            BadExpressionError,
            tokens[consumed],
            this.index + consumed,
            "multiple default statements not allowed in a swtich statement",
          );
        }
        const [defaultStmt, defaultConsumed] = this.parseDefaultStatement(
          tokens.slice(consumed),
        );
        defaultCase = defaultStmt;
        consumed += defaultConsumed;
      } else {
        throwParserError(
          BadExpressionError,
          tokens[consumed],
          this.index + consumed,
          "expected case or default statement in switch body",
        );
      }
    }

    if (cases.length === 0) {
      throwParserError(
        BadExpressionError,
        tokens[consumed],
        this.index + consumed,
        "swtich statement must contain at least one case statement",
      );
    }
    consumed++;

    return [new SwitchStatement(controlExpr, cases, defaultCase), consumed];
  }

  /**
   * Parses a case statement.
   * @param tokens - Tokens to parse.
   * @return A CaseStatement node and the number of tokens consumed.
   */
  parseCaseStatement(
    tokens: Array<[Token, (number | string)?]>,
  ): [CaseStatement, number] {
    let consumed = 1;
    const labels: Array<Expression> = [];

    while (!this.matchNext(tokens.slice(consumed), [Token.LCParen])) {
      const [label, labelConsumed] = this.binaryExpression(
        tokens.slice(consumed),
      );
      labels.push(label);
      consumed += labelConsumed;

      if (this.matchNext(tokens.slice(consumed), [Token.Comma])) {
        consumed++;
      } else if (!this.matchNext(tokens.slice(consumed), [Token.LCParen])) {
        throwParserError(
          BadExpressionError,
          tokens[consumed],
          this.index + consumed,
          "expected comma or opening brace in case statement",
        );
      }
    }

    const [body, bodyConsumed] = this.programBlock(tokens.slice(consumed));
    consumed += bodyConsumed;

    return [new CaseStatement(labels, body), consumed];
  }

  /**
   * Parses a default statement.
   * @param tokens - Tokens to parse.
   * @return A DefaultStatement node and the number of tokens consumed.
   */
  parseDefaultStatement(
    tokens: Array<[Token, (number | string)?]>,
  ): [DefaultStatement, number] {
    let consumed = 1;

    if (!this.matchNext(tokens.slice(consumed), [Token.LCParen])) {
      throwParserError(
        MissingBraceError,
        tokens[consumed],
        this.index + consumed,
        "expecting opening brace for default statement",
      );
    }

    const [body, bodyConsumed] = this.programBlock(tokens.slice(consumed));
    consumed += bodyConsumed;

    return [new DefaultStatement(body), consumed];
  }

  /**
   * Parses a delay statement.
   * @param tokens - Tokens to parse.
   * @return A QuantumDelay node and the number of tokens consumed.
   */
  delay(tokens: Array<[Token, (number | string)?]>): [QuantumDelay, number] {
    let consumed = 1;

    if (!this.matchNext(tokens.slice(consumed), [Token.LSParen])) {
      throwParserError(
        MissingBraceError,
        tokens[consumed],
        this.index + consumed,
        "expected opening bracket [ after delay keyword",
      );
    }
    consumed++;

    const [duration, durationConsumed] = this.binaryExpression(
      tokens.slice(consumed),
    );
    consumed += durationConsumed;
    if (!this.matchNext(tokens.slice(consumed), [Token.RSParen])) {
      throwParserError(
        MissingBraceError,
        tokens[consumed],
        this.index + consumed,
        "expected closing bracket ] after delay designator",
      );
    }
    consumed++;

    const [qubits, qubitsConsumed] = this.parseQubitList(
      tokens.slice(consumed),
    );
    consumed += qubitsConsumed;

    if (!this.matchNext(tokens.slice(consumed), [Token.Semicolon])) {
      throwParserError(
        MissingSemicolonError,
        tokens[consumed],
        this.index + consumed,
        "expected semicolon",
      );
    }
    consumed++;

    return [new QuantumDelay(duration, qubits), consumed];
  }

  /**
   * Parses a durationof function call.
   * @param tokens - Tokens to parse.
   * @return A DurationOf node and the number of tokens consumed.
   */
  durationOf(tokens: Array<[Token, (number | string)?]>): [DurationOf, number] {
    let consumed = 1;

    if (!this.matchNext(tokens.slice(consumed), [Token.LParen])) {
      throwParserError(
        MissingBraceError,
        tokens[consumed],
        this.index + consumed,
        "expected opening parenthesis after durationof",
      );
    }
    consumed++;

    if (!this.matchNext(tokens.slice(consumed), [Token.LCParen])) {
      throwParserError(
        MissingBraceError,
        tokens[consumed],
        this.index + consumed,
        "expected opening brace for durationof scope",
      );
    }
    const [scope, scopeConsumed] = this.programBlock(tokens.slice(consumed));
    consumed += scopeConsumed;

    if (!this.matchNext(tokens.slice(consumed), [Token.RParen])) {
      throwParserError(
        MissingBraceError,
        tokens[consumed],
        this.index + consumed,
        "expected closing parenthesis after durationof scope",
      );
    }
    consumed++;

    if (this.matchNext(tokens.slice(consumed), [Token.Semicolon])) {
      consumed++;
    }

    return [new DurationOf(scope), consumed];
  }

  /**
   * Parses a sizeof function call.
   * @param tokens - Tokens to parse.
   * @return A SizeOf node and the number of tokens consumed.
   */
  sizeOf(tokens: Array<[Token, (number | string)?]>): [SizeOf, number] {
    let consumed = 1;
    let dimensions: Expression | null = null;
    if (!this.matchNext(tokens.slice(consumed), [Token.LParen])) {
      throwParserError(
        MissingBraceError,
        tokens[consumed],
        this.index + consumed,
        "expected opening parenthesis for sizeof function call",
      );
    }
    consumed++;

    const [arrayId, arrayIdConsumed] = this.unaryExpression(
      tokens.slice(consumed),
    );
    consumed += arrayIdConsumed;

    if (this.matchNext(tokens.slice(consumed), [Token.Comma])) {
      consumed++;
      const [dim, dimConsumed] = this.binaryExpression(tokens.slice(consumed));
      consumed += dimConsumed;
      dimensions = dim;
    }

    if (!this.matchNext(tokens.slice(consumed), [Token.RParen])) {
      throwParserError(
        MissingBraceError,
        tokens[consumed],
        this.index + consumed,
        "expected closing parenthesis for sizeof function call",
      );
    }
    consumed++;

    return [new SizeOf(arrayId as Identifier, dimensions), consumed];
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
    let braceCount = 0;

    if (this.matchNext(tokens, [Token.LCParen])) {
      consumed++;
      braceCount++;
      while (braceCount > 0 && consumed < tokens.length) {
        if (this.matchNext(tokens.slice(consumed), [Token.LCParen])) {
          braceCount++;
        } else if (this.matchNext(tokens.slice(consumed), [Token.RCParen])) {
          braceCount--;
        }

        if (braceCount === 0) {
          break;
        }

        const [node, nodeConsumed] = this.parseNode(tokens.slice(consumed));
        if (node && node.length > 0) {
          statements.push(node[0]);
        }
        consumed += nodeConsumed;

        if (this.matchNext(tokens.slice(consumed), [Token.Semicolon])) {
          consumed++;
        }
      }
      if (braceCount !== 0) {
        throwParserError(
          MissingBraceError,
          tokens[consumed],
          this.index + consumed,
          "mismatched curly braces in program block",
        );
      }
      consumed++;
    } else {
      const [node, nodeConsumed] = this.parseNode(tokens.slice(consumed));
      if (node && node.length > 0) {
        statements.push(node[0]);
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
      filename = tokens[consumed][1].toString();
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
      const versionSplits = tokens[consumed][1].toString().split(".");
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
    let typeToken = tokens[0][0];
    let consumed = 1;
    let width: Expression | undefined;
    let isComplex = false;

    if (typeToken === Token.Complex) {
      if (
        !this.matchNext(tokens.slice(consumed), [Token.LSParen, Token.Float])
      ) {
        throwParserError(
          BadClassicalTypeError,
          tokens[consumed],
          this.index + consumed,
          "expected float type for complex number",
        );
      }
      isComplex = true;
      consumed += 2;
      typeToken = tokens[2][0];
    }

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
      if (isComplex) {
        consumed++;
      }
      consumed++;
    }

    const classicalType = this.createClassicalType(typeToken, width);

    if (isComplex) {
      return [new ComplexType(classicalType as FloatType), consumed];
    } else {
      return [classicalType, consumed];
    }
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
      case Token.Stretch:
        return new StretchType();
      case Token.Duration:
        return new DurationType();
      case Token.Angle:
        return new AngleType(width);
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

  /** Checks whether a Bit token precedes a measurement statement. */
  private isMeasurement(tokens: Array<[Token, (number | string)?]>): boolean {
    let i = 0;
    while (
      i < tokens.length - 1 &&
      tokens[i][0] !== Token.LCParen &&
      tokens[i][0] !== Token.Semicolon &&
      tokens[i][0] !== Token.EqualsAssmt
    ) {
      i++;
    }
    return (
      tokens[i][0] === Token.EqualsAssmt && tokens[i + 1][0] === Token.Measure
    );
  }

  /** Checks whether the statement is part of an assignment. */
  private isAssignment(tokens: Array<[Token, (number | string)?]>): boolean {
    let i = 0;
    while (
      i < tokens.length - 1 &&
      tokens[i][0] !== Token.LCParen &&
      tokens[i][0] !== Token.Semicolon &&
      tokens[i][0] !== Token.EqualsAssmt
    ) {
      i++;
    }
    return tokens[i][0] === Token.EqualsAssmt;
  }

  /** Checks whether an identifier is a quantum gate call. */
  private isQuantumGateCall(
    tokens: Array<[Token, (number | string)?]>,
  ): boolean {
    const gateName = tokens[0][1] as string;
    return (
      this.gates.has(gateName) ||
      this.standardGates.has(gateName) ||
      this.customGates.has(gateName)
    );
  }

  /** Checks whether an identifier is a subroutine call. */
  private isSubroutineCall(
    tokens: Array<[Token, (number | string)?]>,
  ): boolean {
    const subroutineName = tokens[0][1] as string;
    return this.subroutines.has(subroutineName);
  }

  /** Checks whether a number is imaginary. */
  private isImaginary(token: [Token, (number | string)?]): boolean {
    if (token.length !== 2) {
      return false;
    }
    return token[1].toString() === "im";
  }

  /** Checks whether an identifier is an array. */
  private isArray(tokens: Array<[Token, (number | string)?]>): boolean {
    if (tokens[0][0] !== Token.Id) {
      return false;
    }
    const identifierName = tokens[0][1].toString();
    return this.customArrays.has(identifierName);
  }

  /** Checks whether an identifier represents a duration literal unit. */
  private isDuration(tokens: Array<[Token, (number | string)?]>): boolean {
    const checkToken = tokens[0];
    if (checkToken.length !== 2 || checkToken[0] !== Token.Id) {
      return false;
    }
    if (
      Object.values(DurationUnit).includes(
        checkToken[1].toString() as DurationUnit,
      )
    ) {
      return true;
    }
    return false;
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
    token === Token.Duration ||
    token === Token.Angle ||
    token === Token.Stretch
  );
}

export default Parser;
