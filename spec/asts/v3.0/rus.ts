import {
  Include,
  IntType,
  BitType,
  Identifier,
  SubscriptedIdentifier,
  Pi,
  TrigFunction,
  BitstringLiteral,
  TrigFunctionTypes,
  ArithmeticOp,
  Arithmetic,
  BinaryOp,
  Binary,
  Cast,
  QuantumMeasurement,
  QuantumMeasurementAssignment,
  ClassicalDeclaration,
  AssignmentStatement,
  QuantumDeclaration,
  QuantumGateCall,
  QuantumReset,
  ReturnStatement,
  ProgramBlock,
  SubroutineDefinition,
  SubroutineCall,
  WhileLoopStatement,
  IntegerLiteral,
  Parameters,
} from "../../../src/qasm3/ast";

export const rusAst = [
  new Include('"stdgates.inc"'),
  new SubroutineDefinition(
    new Identifier("segment"),
    new ProgramBlock([
      new ClassicalDeclaration(
        new BitType(new IntegerLiteral(2)),
        new Identifier("b"),
        null,
        false,
      ),
      new QuantumReset(new Identifier("anc")),
      new QuantumGateCall(
        new Identifier("h"),
        [new Identifier("anc")],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("ccx"),
        [
          new SubscriptedIdentifier("anc", new IntegerLiteral(0)),
          new SubscriptedIdentifier("anc", new IntegerLiteral(1)),
          new Identifier("psi"),
        ],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("s"),
        [new Identifier("psi")],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("ccx"),
        [
          new SubscriptedIdentifier("anc", new IntegerLiteral(0)),
          new SubscriptedIdentifier("anc", new IntegerLiteral(1)),
          new Identifier("psi"),
        ],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("z"),
        [new Identifier("psi")],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("h"),
        [new Identifier("anc")],
        null,
        [],
      ),
      new QuantumMeasurementAssignment(
        new Identifier("b"),
        new QuantumMeasurement([new Identifier("anc")]),
      ),
      new ReturnStatement([new Identifier("b")]),
    ]),
    new Parameters([
      [new QuantumDeclaration(new Identifier("anc"), new IntegerLiteral(2))],
      [new QuantumDeclaration(new Identifier("psi"), null)],
    ]),
    new BitType(new IntegerLiteral(2)),
  ),
  new QuantumDeclaration(new Identifier("input_qubit"), null),
  new QuantumDeclaration(new Identifier("ancilla"), new IntegerLiteral(2)),
  new ClassicalDeclaration(
    new BitType(new IntegerLiteral(2)),
    new Identifier("flags"),
    new BitstringLiteral('"11"'),
    false,
  ),
  new ClassicalDeclaration(
    new BitType(null),
    new Identifier("output_qubit"),
    null,
    false,
  ),
  new QuantumReset(new Identifier("input_qubit")),
  new QuantumGateCall(
    new Identifier("h"),
    [new Identifier("input_qubit")],
    null,
    [],
  ),
  new WhileLoopStatement(
    new Binary(
      BinaryOp.NOT_EQUAL,
      new Cast(new IntType(new IntegerLiteral(2)), new Identifier("flags")),
      new IntegerLiteral(0),
    ),
    new ProgramBlock([
      new AssignmentStatement(
        new Identifier("flags"),
        new SubroutineCall(
          new Identifier("segment"),
          new Parameters([
            new Identifier("ancilla"),
            new Identifier("input_qubit"),
          ]),
        ),
      ),
    ]),
  ),
  new QuantumGateCall(
    new Identifier("rz"),
    [new Identifier("input_qubit")],
    new Parameters([
      new Arithmetic(ArithmeticOp.MINUS, new Pi(), [
        new TrigFunction(
          TrigFunctionTypes.ARCCOS,
          new Arithmetic(
            ArithmeticOp.DIVISION,
            new IntegerLiteral(3),
            new IntegerLiteral(5),
          ),
        ),
        1,
      ]),
    ]),
    [],
  ),
  new QuantumGateCall(
    new Identifier("h"),
    [new Identifier("input_qubit")],
    null,
    [],
  ),
  new QuantumMeasurementAssignment(
    new Identifier("output_qubit"),
    new QuantumMeasurement([new Identifier("input_qubit")]),
  ),
];
