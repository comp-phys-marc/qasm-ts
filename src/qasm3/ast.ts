/* eslint-disable  @typescript-eslint/no-explicit-any */

import { OpenQASMVersion } from "../version";

/** Base class representing a basic AST node. */
class AstNode {}

/**
 * Base class representing an instruction which performs an action.
 *
 * statement
 *  : expressionStatement
 *  | assignmentStatement
 *  | classicalDeclarationStatement
 *  | branchingStatement
 *  | loopStatement
 *  | endStatement
 *  | aliasStatement
 *  | quantumStatement
 */
class Statement extends AstNode {}

/**
 * Class representing a custom grammar for specifying calibrations.
 *
 * calibrationGrammarDeclaration
 *  : 'defcalgrammar' calibrationGrammar SEMICOLON
 */
class CalibrationGrammarDeclaration extends Statement {
  name: string;
  constructor(name: string) {
    super();
    this.name = name;
  }
}

/**
 * Class representing an include statement.
 *
 * include
 *  : `include` StringLiteral SEMICOLON
 */
class Include extends AstNode {
  filename: string;
  constructor(filename: string) {
    super();
    this.filename = filename;
  }
}

/**
 * Class representing the version statement.
 *
 * version
 *  : 'OPENQASM'(Integer | RealNumber) SEMICOLON
 */
class Version extends AstNode {
  version: OpenQASMVersion;
  constructor(version: OpenQASMVersion) {
    super();
    this.version = version;
  }
}

/**
 * Base class representing a quantum instruction.
 *
 * quantumInstruction
 *  : quantumGateCall
 *  | quantumPhase
 *  | quantumMeasurement
 *  | quantumReset
 *  | quantumBarrier
 */
class QuantumInstrcution extends AstNode {}

/** Base class representing a classical computing type. */
class ClassicalType extends AstNode {}

/** Enum represnting the allowed values for floating-point type widths. */
enum FloatTypeWidth {
  HALF = 16,
  SINGLE = 32,
  DOUBLE = 64,
  QUAD = 128,
  OCT = 256,
}

/** Class representing a classical float type. */
class FloatType extends ClassicalType {
  width: FloatTypeWidth;
  constructor(width: FloatTypeWidth) {
    super();
    this.width = width;
  }
}

/** Class representing a classical boolean type. */
class BoolType extends ClassicalType {}

/** Class representing a classical signed integer type. */
class IntType extends ClassicalType {
  size: number | null;
  constructor(size?: number) {
    super();
    this.size = size ? size : null;
  }
}

/** Class representing a classical unsigned integer type. */
class UIntType extends ClassicalType {
  size: number | null;
  constructor(size?: number) {
    super();
    this.size = size ? size : null;
  }
}

/** Class representing a classical single bit type. */
class BitType extends ClassicalType {}

/** Class representing a classical, fixed number of bits. */
class BitArrayType extends ClassicalType {
  size: number;
  constructor(size: number) {
    super();
    this.size = size;
  }
}

/** Base class representing an expression. */
class Expression extends AstNode {}

/** Class representing a range. */
class Range extends Expression {
  start: Expression | null;
  end: Expression | null;
  step: Expression | null;
  constructor(start?: Expression, end?: Expression, step?: Expression) {
    super();
    this.start = start ? start : null;
    this.end = end ? end : null;
    this.step = step ? step : null;
  }
}

/** Class representing an expression identifier. */
class Identifier extends Expression {
  name: string;
  constructor(name: string) {
    super();
    this.name = name;
  }
}

/** Class representing an identifier with subscripted access. */
class SubscriptedIdentifier extends Identifier {
  subscript: Range | Expression;
  constructor(name: string, subscript: Range | Expression) {
    super(name);
    this.subscript = subscript;
  }
}

/** Class representing the Pi constant. */
class Pi extends Expression {}

/** Class representing the Euler constant. */
class Euler extends Expression {}

/** Class representing the Tau constant. */
class Tau extends Expression {}

/** Class representing an integer literal. */
class IntegerLiteral extends Expression {
  value: number;
  constructor(value: number) {
    super();
    this.value = value;
  }
}

/** Class representing a boolean literal. */
class BooleanLiteral extends Expression {
  value: boolean;
  constructor(value: boolean) {
    super();
    this.value = value;
  }
}

/** Class representing a bit string literal. */
class BitstringLiteral extends Expression {
  value: string;
  width: number;
  constructor(value: string, width: number) {
    super();
    this.value = value;
    this.width = width;
  }
}

/** Enum representing the supported duration units. */
enum DurationUnit {
  NANOSECOND = "ns",
  MICROSECOND = "us",
  MILLISECOND = "ms",
  SECOND = "s",
  SAMPLE = "dt",
}

/** Class representing a duration literal. */
class DurationLiteral extends Expression {
  value: number;
  unit: DurationUnit;
  constructor(value: number, unit: DurationUnit) {
    super();
    this.value = value;
    this.unit = unit;
  }
}

/** Enum representing Unary operands. */
enum UnaryOp {
  LOGIC_NOT = "!",
  BIT_NOT = "~",
}

/** Class representing a unary operator. */
class Unary extends Expression {
  op: UnaryOp;
  operand: Expression;
  constructor(op: UnaryOp, operand: Expression) {
    super();
    this.op = op;
    this.operand = operand;
  }
}

/** Enum representing binary operands. */
enum BinaryOp {
  BIT_AND = "&",
  BIT_OR = "|",
  BIT_XOR = "^",
  LOGIC_AND = "&&",
  LOGIC_OR = "||",
  LESS = "<",
  LESS_EQUAL = "<=",
  GREATER = ">",
  GREATER_EQUAL = ">=",
  EQUAL = "==",
  NOT_EQUAL = "!=",
  SHIFT_LEFT = "<<",
  SHIFT_RIGHT = ">>",
}

/** Class representing binary operator expressions. */
class Binary extends Expression {
  op: BinaryOp;
  left: Expression;
  right: Expression;
  constructor(op: BinaryOp, left: Expression, right: Expression) {
    super();
    this.op = op;
    this.left = left;
    this.right = right;
  }
}

/** Class representing an cast expression. */
class Cast extends Expression {
  type: ClassicalType;
  operand: Expression;
  constructor(type: ClassicalType, operand: Expression) {
    super();
    this.type = type;
    this.operand = operand;
  }
}

/** Class representing an index. */
class Index extends Expression {
  target: Expression;
  index: Expression;
  constructor(target: Expression, index: Expression) {
    super();
    this.target = target;
    this.index = index;
  }
}

/**
 * Class representing a literal index set of values.
 *
 * { Expression (, Expression )* }
 */
class IndexSet extends AstNode {
  values: Array<Expression>;
  constructor(values: Array<Expression>) {
    super();
    this.values = values;
  }
}

/**
 * Class representing a quantum measurement.
 *
 * quantumMeasurement
 *  : `measure` identifierList
 */
class QuantumMeasurement extends AstNode {
  identifierList: Array<Identifier>;
  constructor(identifierList: Array<Identifier>) {
    super();
    this.identifierList = identifierList;
  }
}

/**
 * Class representing a quantum measurement assignment statement.
 *
 * QuantumMeasurementAssignment
 *  : quantumMeasurement ARROW indexIdentifierList
 *  | indexIdentifier EQUALS quantumMeasurement
 */
class QuantumMeasurementAssignment extends Statement {
  identifier: Identifier;
  quantumMeasurement: QuantumMeasurement;
  constructor(identifier: Identifier, quantumMeasurement: QuantumMeasurement) {
    super();
    this.identifier = Identifier;
    this.quantumMeasurement = quantumMeasurement;
  }
}

/**
 * Class representing a designator.
 *
 * designator
 *  : LBRACKET expression RBRACKET
 */
class Designator extends AstNode {
  expression: Expression;
  constructor(expression: Expression) {
    super();
    this.expression = expression;
  }
}

/** Class representing the declaration of a classical type, optionally initializing it to a value. */
class ClassicalDeclaration extends Statement {
  classicalType: ClassicalType;
  identifier: Identifier;
  initializer: any | null;
  constructor(
    classicalType: ClassicalType,
    identifier: Identifier,
    initializer?: any,
  ) {
    super();
    this.classicalType = classicalType;
    this.identifier = identifier;
    this.initializer = initializer ? initializer : null;
  }
}

/** Class representing an expression to a left value. */
class AssignmentStatement extends Statement {
  leftValue: SubscriptedIdentifier;
  rightValue: Expression;
  constructor(leftValue: SubscriptedIdentifier, rightValue: Expression) {
    super();
    this.leftValue = leftValue;
    this.rightValue = rightValue;
  }
}

/**
 * Class representing a quantum declaration.
 *
 * quantumDeclaration
 *  : `qreg` Identifier designator?
 *    `qubit` designator? Identifier
 */
class QuantumDeclaration extends AstNode {
  identifier: Identifier;
  designator: any;
  constructor(identifier: Identifier, designator: any) {
    super();
    this.identifier = identifier;
    this.designator = designator;
  }
}

/** Class representing an alias statement. */
class AliasStatement extends AstNode {
  identifier: Identifier;
  value: Expression;
  constructor(identifier: Identifier, value: Expression) {
    super();
    this.identifier = identifier;
    this.value = value;
  }
}

/** Enum representing the available quantum gate modifiers. */
enum QuantumGateModifierName {
  CTRL,
  NRGCTRL,
  INV,
  POW,
}

/** Class representing a modifier of a gate. */
class QuantumGateModifier extends AstNode {
  modifier: QuantumGateModifierName;
  argument: Expression | null;
  constructor(modifier: QuantumGateModifierName, argument?: Expression) {
    super();
    this.modifier = modifier;
    this.argument = argument ? argument : null;
  }
}

/**
 * Class representing a quantum gate call.
 *
 * quantumGateCall
 *  : quantumGateModifier* quantumGateName ( LPAREN expressionList? RPAREN )? indexIdentifierList
 */
class QuantumGateCall extends QuantumInstrcution {
  quantumGateName: Identifier;
  indexIdentifierList: Array<Identifier>;
  parameters: Array<Expression> | null;
  modifiers: Array<QuantumGateModifier> | null;
  constructor(
    quantumGateCall: Identifier,
    indexIdentifierList: Array<Identifier>,
    parameters?: Array<Expression>,
    modifiers?: Array<QuantumGateModifier>,
  ) {
    super();
    this.quantumGateName = quantumGateCall;
    this.indexIdentifierList = indexIdentifierList;
    this.parameters = parameters ? parameters : [];
    this.modifiers = modifiers ? modifiers : [];
  }
}

/**
 * Class representing a quantum barrier.
 *
 * quantumBarrier
 *  : `barrier` indexIdentifierList
 */
class QuantumBarrier extends QuantumInstrcution {
  indexIdentifierList: Array<Identifier>;
  constructor(indexIdentifierList: Array<Identifier>) {
    super();
    this.indexIdentifierList = indexIdentifierList;
  }
}

/** Class representing a quantum reset instruction. */
class QuantumReset extends QuantumInstrcution {
  identifier: Identifier;
  constructor(identifier: Identifier) {
    super();
    this.identifier = identifier;
  }
}

/** Class representing a quantum delay instruction. */
class QuantumDelay extends QuantumInstrcution {
  duration: Expression;
  qubits: Array<Identifier>;
  constructor(duration: Expression, qubits: Array<Identifier>) {
    super();
    this.duration = duration;
    this.qubits = qubits;
  }
}

/** Class representing a return statement. */
class ReturnStatement extends AstNode {
  expression: Expression | QuantumMeasurement | null;
  constructor(expression?: Expression | QuantumMeasurement) {
    super();
    this.expression = expression ? expression : null;
  }
}

/**
 * Base class representing a program block.
 *
 * programBlock
 *  : statement | controlDirective
 *  | LBRACE(statement | controlDirective) * RBRACEj
 */
class ProgramBlock extends AstNode {
  statements: Array<Statement>;
  constructor(statements: Array<Statement>) {
    super();
    this.statements = statements;
  }
}

/**
 * Class representing a block of quantum operation statements.
 *
 * quantumBlock
 *  : LBRACE (quantumStatement | quantumLoop) * RBRACE
 */
class QuantumBlock extends ProgramBlock {
  constructor(statements: Array<Statement>) {
    super(statements);
  }
}

/**
 * Class representing a block of statements in a subroutine.
 *
 * subroutineBlock
 *  : LBRACE statement* returnStatement? RBRACE
 */
class SubroutineBlock extends ProgramBlock {
  constructor(statements: Array<Statement>) {
    super(statements);
  }
}

/**
 * Class representing a quantum gate definition.
 *
 * quantumGateDefinition
 *  : `gate` quantumGateDefinition quantumBlock
 */
class QuantumGateDefinition extends Statement {
  name: Identifier;
  params: Array<Identifier>;
  qubits: Array<Identifier>;
  body: QuantumBlock;
  constructor(
    name: Identifier,
    params: Array<Identifier>,
    qubits: Array<Identifier>,
    body: QuantumBlock,
  ) {
    super();
    this.name = name;
    this.params = params;
    this.qubits = qubits;
    this.body = body;
  }
}

/**
 * Class representing a subroutine.
 *
 * subroutineDefinition
 *  : `def` Identifier LPAREN anyTypeArgumentList? RPAREN
 *  returnSignature? subroutineBlock
 */
class SubroutineDefinition extends Statement {
  identifier: Identifier;
  subroutineBlock: SubroutineBlock;
  args: Array<any> | null;
  constructor(
    identifier: Identifier,
    subroutineBlock: SubroutineBlock,
    args: Array<any> | null,
  ) {
    super();
    this.identifier = identifier;
    this.subroutineBlock = subroutineBlock;
    this.args = args;
  }
}

/**
 * Class representing a calibration statement argument.
 *
 * calibrationArgumentList
 *  : classicalArgumentList | expressionList
 */
class CalibrationArgument extends AstNode {}

/**
 * Class representing a calibration definition.
 *
 * calibrationDefinition
 *  : `defcal` Identifier
 *  (LPAREN calibrationArgumentList? RPAREN)? identifierList
 *  returnSignature? LBRACE .*? RBRACE
 */
class CalibrationDefinition extends Statement {
  name: Identifier;
  identifierList: Array<Identifier>;
  calibrationArgumentList: Array<CalibrationArgument> | null;
  constructor(
    name: Identifier,
    identifierList: Array<Identifier>,
    calibrationArgumentList?: Array<CalibrationArgument>,
  ) {
    super();
    this.name = name;
    this.identifierList = identifierList;
    this.calibrationArgumentList = calibrationArgumentList
      ? calibrationArgumentList
      : null;
  }
}

/**
 * Class representing a branching if statement.
 *
 * branchingStatement
 *  : `if` LPAREN booleanExpression RPAREN programBlock (`else` programBlock)?
 */
class BranchingStatement extends Statement {
  condition: Expression;
  trueBody: ProgramBlock;
  falseBody: ProgramBlock | null;
  constructor(
    condition: Expression,
    trueBody: ProgramBlock,
    falseBody?: ProgramBlock,
  ) {
    super();
    this.condition = condition;
    this.trueBody = trueBody;
    this.falseBody = falseBody;
  }
}

/**
 * Class representing a for loop statement.
 *
 * ForLoop: "for" Identifier "in" SetDeclaration ProgramBlock
 * SetDeclaration:
 *  | Identifier
 *  | "{" Expression ("," Expression)* "}"
 *  | "[" Range "]"
 */
class ForLoopStatement extends Statement {
  indexSet: Identifier | IndexSet | Range;
  parameter: Identifier;
  body: ProgramBlock;
  constructor(
    indexSet: Identifier | IndexSet | Range,
    parameter: Identifier,
    body: ProgramBlock,
  ) {
    super();
    this.indexSet = indexSet;
    this.parameter = parameter;
    this.body = body;
  }
}

/**
 * Class representing a while loop statement.
 *
 * WhileLoop: "while" "(" Expression ")" ProgramBlock
 */
class WhileLoopStatement extends Statement {
  condition: Expression;
  body: ProgramBlock;
  constructor(condition: Expression, body: ProgramBlock) {
    super();
    this.condition = condition;
    this.body = body;
  }
}

/** Class representing a break loop statement. */
class BreakStatement extends Statement {}

/** Class representing a continue loop statement. */
class ContinueStatement extends Statement {}

/** Enum representing the available IO modifiers. */
enum IOModifier {
  INPUT,
  OUTPUT,
}

/** Class representing a declaration of an IO variable. */
class IODeclaration extends ClassicalDeclaration {
  modifier: IOModifier;
  constructor(
    modifier: IOModifier,
    classicalType: ClassicalType,
    identifier: Identifier,
  ) {
    super(classicalType, identifier);
    this.modifier = modifier;
  }
}

/** Class representing the `default` special label in switch statements. */
class DefaultCase extends Expression {}

/** Class representing a switch statement. */
class SwitchStatement extends Statement {
  target: Expression;
  cases: Array<[Array<Expression>, ProgramBlock]>;
  defaultBlock: ProgramBlock | null;
  constructor(
    target: Expression,
    cases: Array<[Array<Expression>, ProgramBlock]>,
    defaultBlock?: ProgramBlock,
  ) {
    super();
    this.target = target;
    this.cases = cases;
    this.defaultBlock = defaultBlock ? defaultBlock : null;
  }
}

export {
  AstNode,
  Statement,
  CalibrationGrammarDeclaration,
  Include,
  Version,
  FloatTypeWidth,
  FloatType,
  BoolType,
  IntType,
  UIntType,
  BitType,
  BitArrayType,
  Range,
  Identifier,
  SubscriptedIdentifier,
  Pi,
  Euler,
  Tau,
  IntegerLiteral,
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
  CalibrationDefinition,
  BranchingStatement,
  ForLoopStatement,
  WhileLoopStatement,
  BreakStatement,
  ContinueStatement,
  IOModifier,
  IODeclaration,
  DefaultCase,
  SwitchStatement,
};
