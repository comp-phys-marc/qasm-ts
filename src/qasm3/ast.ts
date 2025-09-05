/* eslint-disable  @typescript-eslint/no-explicit-any */

/**
 * OpenQASM 3.0 Abstract Syntax Tree Node Definitions
 * 
 * This module defines all the AST node classes that represent the parsed structure
 * of OpenQASM 3.0 programs. Each class corresponds to a specific language construct
 * and contains the necessary information to represent that construct in memory.
 * 
 * The AST provides a hierarchical representation where:
 * - **AstNode**: Base class for all nodes
 * - **Statement**: Executable instructions (declarations, assignments, control flow)
 * - **Expression**: Value-producing constructs (literals, identifiers, operations)
 * - **ClassicalType**: Type system for classical data
 * 
 * Key node categories:
 * - **Declarations**: Variable, type, and quantum register declarations
 * - **Quantum Operations**: Gate calls, measurements, barriers, delays
 * - **Control Flow**: If/else, loops, switch statements
 * - **Expressions**: Arithmetic, logical, and function call expressions
 * - **Types**: Classical type specifications (int, float, bool, etc.)
 * 
 * @module
 * 
 * @example Building a quantum declaration
 * ```typescript
 * import { QuantumDeclaration, Identifier, IntegerLiteral } from './ast';
 * 
 * // Represents: qubit[2] q;
 * const qubitDecl = new QuantumDeclaration(
 *   new Identifier('q'),
 *   new IntegerLiteral(2)
 * );
 * ```
 * 
 * @example Creating expressions
 * ```typescript
 * import { Arithmetic, ArithmeticOp, Identifier, FloatLiteral } from './ast';
 * 
 * // Represents: theta * 2.0
 * const expr = new Arithmetic(
 *   ArithmeticOp.TIMES,
 *   new Identifier('theta'),
 *   new FloatLiteral(2.0)
 * );
 * ```
 */

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
 * calibrationGrammarStatement:
 *  | DEFCALGRAMMAR StringLiteral SEMICOLON
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
 * includeStatement:
 *   INCLUDE StringLiteral SEMICOLON
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
class QuantumInstruction extends AstNode {}

/** Base class representing a classical computing type. */
class ClassicalType extends AstNode {}

/**
 * Class representing a classical float type.
 *
 * scalarType:
 *   FLOAT designator?
 */
class FloatType extends ClassicalType {
  width: number | Expression | null;
  constructor(width?: number | Expression) {
    super();
    this.width = width ? width : null;
  }
}

/**
 * Class representing a complex number type.
 *
 * scalarType:
 *   COMPLEX (LBRACKET scalarType RBRACKET)?
 */
class ComplexType extends ClassicalType {
  float: FloatType;
  constructor(float: FloatType) {
    super();
    this.float = float;
  }
}

/** Class representing a classical boolean type. */
class BoolType extends ClassicalType {}

/** Class representing a classical signed integer type. */
class IntType extends ClassicalType {
  size: number | Expression | null;
  constructor(size?: number | Expression) {
    super();
    this.size = size ? size : null;
  }
}

/** Class representing a classical unsigned integer type. */
class UIntType extends ClassicalType {
  size: number | Expression | null;
  constructor(size?: number | Expression) {
    super();
    this.size = size ? size : null;
  }
}

/** Class representing a classical bit type. */
class BitType extends ClassicalType {
  size: number | Expression | null;
  constructor(size?: number | Expression) {
    super();
    this.size = size ? size : null;
  }
}

/** Class representing an angle type. */
class AngleType extends ClassicalType {
  size: number | Expression | null;
  constructor(size?: number | Expression) {
    super();
    this.size = size ? size : null;
  }
}

/** Class representing the stretch type. */
class StretchType extends ClassicalType {}

/** Class representing a duration type. */
class DurationType extends ClassicalType {}

/** Base class representing an expression. */
class Expression extends AstNode {}

/** Class representing a list of parameters. */
class Parameters extends Expression {
  args: Array<Expression>;
  constructor(args: Array<Expression>) {
    super();
    this.args = args;
  }
}

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

/** Enum representing the available mathematical functions. */
enum MathFunctionTypes {
  CEILING = "ceiling",
  EXP = "exponential",
  FLOOR = "floor",
  LOG = "logarithm",
  MOD = "modulus",
  POPCOUNT = "popcount",
  POW = "power",
  SQRT = "sqrt",
  ROTR = "rotr",
  ROTL = "rotl",
}

/** Class representing a mathematical function. */
class MathFunction extends Expression {
  mathType: MathFunctionTypes;
  operands: Expression;
  constructor(
    mathType: MathFunctionTypes,
    operands: Expression | Array<Expression>,
  ) {
    super();
    this.mathType = mathType;
    this.operands = operands;
  }
}

/** Enum representing the available trigonometric functions. */
enum TrigFunctionTypes {
  ARCCOS = "ArcCos",
  ARCSIN = "ArcSin",
  ARCTAN = "ArcTan",
  COS = "Cos",
  SIN = "Sin",
  TAN = "Tan",
}

/** Class representing a trigonometric function. */
class TrigFunction extends Expression {
  trigType: TrigFunctionTypes;
  operand: Expression;
  constructor(trigType: TrigFunctionTypes, operand: Expression) {
    super();
    this.trigType = trigType;
    this.operand = operand;
  }
}

/** Class representing an integer literal. */
class IntegerLiteral extends Expression {
  value: number | string;
  constructor(value: number | string) {
    super();
    this.value = value;
  }
}

/** Class representing a scientific notation, binary, octal, or hex literal. */
class NumericLiteral extends Expression {
  value: string;
  constructor(value: string) {
    super();
    this.value = value;
  }
}

/** Class representing a float literal. */
class FloatLiteral extends Expression {
  value: number | string;
  constructor(value: number | string) {
    super();
    this.value = value;
  }
}

/** Class representing an imaginary number literal. */
class ImaginaryLiteral extends Expression {
  value: string;
  constructor(value: string) {
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
  constructor(value: string) {
    super();
    this.value = value;
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
  value: number | Expression;
  unit: DurationUnit;
  constructor(value: number | Expression, unit: DurationUnit) {
    super();
    this.value = value;
    this.unit = unit;
  }
}

/** Class representing a durationof function call. */
class DurationOf extends Expression {
  scope: ProgramBlock;
  constructor(scope: ProgramBlock) {
    super();
    this.scope = scope;
  }
}

/** Class representing a sizeof function call. */
class SizeOf extends Expression {
  array: Identifier;
  dimensionIndex: Expression;
  constructor(array: Identifier, dimensionIndex?: Expression | null) {
    super();
    this.array = array;
    this.dimensionIndex =
      dimensionIndex !== undefined && dimensionIndex !== null
        ? dimensionIndex
        : new IntegerLiteral(0);
  }
}

/** Enum representing Unary operands. */
enum UnaryOp {
  LOGIC_NOT = "!",
  BIT_NOT = "~",
  MINUS = "-",
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

/** Enum representing arithmetic operations. */
enum ArithmeticOp {
  POWER = "**",
  TIMES = "*",
  DIVISION = "/",
  MOD = "%",
  PLUS = "+",
  MINUS = "-",
  CONCAT = "++",
}

/** Class representing an arithmetic operator expression. */
class Arithmetic extends Expression {
  op: ArithmeticOp;
  left: Expression;
  right: Expression;
  constructor(op: ArithmeticOp, left: Expression, right: Expression) {
    super();
    this.op = op;
    this.left = left;
    this.right = right;
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

/**
 * Class representing a literal index set of values.
 *
 * { Expression (, Expression )* }
 */
class IndexSet extends Expression {
  values: Array<Expression>;
  constructor(values: Array<Expression>) {
    super();
    this.values = values;
  }
}

/** Enum representing the supported array reference modifiers. */
enum ArrayReferenceModifier {
  READONLY = "readonly",
  MUTABLE = "mutable",
}

/** Class representing an array reference. */
class ArrayReference extends Expression {
  array: ArrayDeclaration;
  modifier: ArrayReferenceModifier;
  constructor(array: ArrayDeclaration, modifier: ArrayReferenceModifier) {
    super();
    this.array = array;
    this.modifier = modifier;
  }
}

/** Class representing a statically sized array. */
class ArrayDeclaration extends Statement {
  baseType: ClassicalType;
  dimensions: Array<Expression> | number;
  identifier: Identifier;
  initializer: ArrayInitializer | Expression | null;
  constructor(
    baseType: ClassicalType,
    dimensions: Array<Expression> | number,
    identifier: Identifier,
    initializer?: ArrayInitializer | Expression | null,
  ) {
    super();
    this.baseType = baseType;
    this.dimensions = dimensions;
    this.identifier = identifier;
    this.initializer =
      initializer !== undefined && initializer !== null ? initializer : null;
  }
}

/** Class representing an initial value for an ArrayDeclaration. */
class ArrayInitializer extends Expression {
  values: Array<Expression | ArrayInitializer>;
  constructor(values: Array<Expression | ArrayInitializer>) {
    super();
    this.values = values;
  }
}

/** Class representing an array access */
class ArrayAccess extends Expression {
  array: Identifier;
  indices: Array<Expression> | Range | null;
  constructor(array: Identifier, indices?: Array<Expression> | Range) {
    super();
    this.array = array;
    this.indices = indices !== undefined && indices !== null ? indices : null;
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
  identifier: Identifier | SubscriptedIdentifier;
  quantumMeasurement: QuantumMeasurement;
  constructor(
    identifier: Identifier | SubscriptedIdentifier,
    quantumMeasurement: QuantumMeasurement,
  ) {
    super();
    this.identifier = identifier;
    this.quantumMeasurement = quantumMeasurement;
  }
}

/** Class representing the declaration of a classical type, optionally initializing it to a value. */
class ClassicalDeclaration extends Statement {
  classicalType: ClassicalType;
  identifier: Identifier | null;
  initializer: any | null;
  isConst: boolean;
  constructor(
    classicalType: ClassicalType,
    identifier?: Identifier,
    initializer?: any,
    isConst?: boolean,
  ) {
    super();
    this.classicalType = classicalType;
    this.identifier =
      identifier !== undefined && identifier !== null ? identifier : null;
    this.initializer =
      initializer !== undefined && initializer !== null ? initializer : null;
    this.isConst = isConst !== undefined && isConst !== null ? isConst : false;
  }
}

/** Class representing an expression to a left value. */
class AssignmentStatement extends Statement {
  leftValue: SubscriptedIdentifier | Identifier | ArrayAccess;
  rightValue: Expression | SubroutineCall | ArrayAccess;
  constructor(
    leftValue: SubscriptedIdentifier | Identifier | ArrayAccess,
    rightValue: Expression | SubroutineCall | ArrayAccess,
  ) {
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
  size: Expression | null;
  constructor(identifier: Identifier, size?: Expression | null) {
    super();
    this.identifier = identifier;
    this.size = size ? size : null;
  }
}

/**
 * Class representing a hardware qubit.
 *
 * $[NUM]
 */
class HardwareQubit extends AstNode {
  number: number;
  constructor(number: number) {
    super();
    this.number = number;
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
class QuantumGateCall extends QuantumInstruction {
  quantumGateName: Identifier;
  qubits: Array<Identifier | SubscriptedIdentifier | HardwareQubit>;
  parameters: Parameters | null;
  modifiers: Array<QuantumGateModifier> | null;
  constructor(
    quantumGateCall: Identifier,
    qubits: Array<Identifier | HardwareQubit>,
    parameters?: Parameters,
    modifiers?: Array<QuantumGateModifier>,
  ) {
    super();
    this.quantumGateName = quantumGateCall;
    this.qubits = qubits;
    this.parameters = parameters ? parameters : null;
    this.modifiers = modifiers ? modifiers : [];
  }
}

/**
 * Class representing a quantum barrier.
 *
 * quantumBarrier
 *  : `barrier` indexIdentifierList
 */
class QuantumBarrier extends QuantumInstruction {
  qubits: Array<Identifier | SubscriptedIdentifier | HardwareQubit>;
  constructor(
    qubits: Array<Identifier | SubscriptedIdentifier | HardwareQubit>,
  ) {
    super();
    this.qubits = qubits;
  }
}

/** Class representing a quantum reset instruction. */
class QuantumReset extends QuantumInstruction {
  identifier: Identifier;
  constructor(identifier: Identifier) {
    super();
    this.identifier = identifier;
  }
}

/** Class representing a quantum delay instruction. */
class QuantumDelay extends QuantumInstruction {
  duration: Expression;
  qubits: Array<Identifier | SubscriptedIdentifier | HardwareQubit>;
  constructor(duration: Expression, qubits: Array<Identifier | HardwareQubit>) {
    super();
    this.duration = duration;
    this.qubits = qubits;
  }
}

/** Class representing a return statement. */
class ReturnStatement extends Statement {
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
  statements: Array<Statement | Expression>;
  constructor(statements: Array<Statement | Expression>) {
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
  params: Parameters;
  qubits: Array<Identifier>;
  body: QuantumBlock;
  constructor(
    name: Identifier,
    params: Parameters,
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
 * Class representing an extern function signature.
 *
 * externStatement
 *   : EXTERN Identifier LPAREN externArgumentList? RPAREN returnSignature? SEMICOLON;
 */
class ExternSignature extends Statement {
  name: Identifier;
  args: Parameters | null;
  returnType: ClassicalType | null;
  constructor(
    name: Identifier,
    args: Parameters | null,
    returnType?: ClassicalType,
  ) {
    super();
    this.name = name;
    this.args = args;
    this.returnType =
      returnType !== undefined && returnType !== null ? returnType : null;
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
  name: Identifier;
  subroutineBlock: SubroutineBlock;
  args: Parameters | null;
  returnType: ClassicalType | null;
  constructor(
    name: Identifier,
    subroutineBlock: SubroutineBlock,
    args: Parameters | null,
    returnType?: ClassicalType,
  ) {
    super();
    this.name = name;
    this.subroutineBlock = subroutineBlock;
    this.args = args;
    this.returnType = returnType ? returnType : null;
  }
}

/**
 * Class representing a box scoping statement.
 *
 * boxStatement
 *   : BOX designator? scope;
 */
class BoxDefinition extends Statement {
  designator: Expression | null;
  scope: ProgramBlock;
  constructor(scope: ProgramBlock, designator?: Expression) {
    super();
    this.scope = scope;
    this.designator =
      designator !== undefined && designator !== null ? designator : null;
  }
}

/** Class representing a subroutine call. */
class SubroutineCall extends Statement {
  subroutineName: Identifier;
  parameters: Parameters | null;
  constructor(subroutineName: Identifier, parameters?: Parameters) {
    super();
    this.subroutineName = subroutineName;
    this.parameters = parameters ? parameters : null;
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
  indexSet: IndexSet | Range | Expression;
  loopVarType: ClassicalType;
  parameter: Identifier;
  body: ProgramBlock;
  constructor(
    indexSet: IndexSet | Range | Expression,
    loopVarType: ClassicalType,
    parameter: Identifier,
    body: ProgramBlock,
  ) {
    super();
    this.indexSet = indexSet;
    this.loopVarType = loopVarType;
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
  INPUT = "input",
  OUTPUT = "output",
}

/** Class representing a declaration of an IO variable. */
class IODeclaration extends Statement {
  modifier: IOModifier;
  classicalType: ClassicalDeclaration;
  constructor(modifier: IOModifier, classicalType: ClassicalDeclaration) {
    super();
    this.modifier = modifier;
    this.classicalType = classicalType;
  }
}

/** Class representing a switch statement. */
class SwitchStatement extends Statement {
  controlExpression: Expression;
  cases: Array<CaseStatement>;
  defaultBlock: DefaultStatement | null;
  constructor(
    controlExpression: Expression,
    cases: Array<CaseStatement>,
    defaultBlock?: DefaultStatement,
  ) {
    super();
    this.controlExpression = controlExpression;
    this.cases = cases;
    this.defaultBlock = defaultBlock ? defaultBlock : null;
  }
}

/** Class representing a single case in a switch statement. */
class CaseStatement extends Statement {
  labels: Array<Expression>;
  body: ProgramBlock;
  constructor(labels: Array<Expression>, body: ProgramBlock) {
    super();
    this.labels = labels;
    this.body = body;
  }
}

/** Class representing the default case in a swtich statement. */
class DefaultStatement extends Statement {
  body: ProgramBlock;
  constructor(body: ProgramBlock) {
    super();
    this.body = body;
  }
}

export {
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
  StretchType,
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
  ImaginaryLiteral,
  BooleanLiteral,
  BitstringLiteral,
  DurationUnit,
  DurationLiteral,
  DurationOf,
  SizeOf,
  UnaryOp,
  Unary,
  ArithmeticOp,
  Arithmetic,
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
  HardwareQubit,
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
  ExternSignature,
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
};
