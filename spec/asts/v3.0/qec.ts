import {
  Include,
  IntType,
  BitType,
  Identifier,
  SubscriptedIdentifier,
  BinaryOp,
  Binary,
  Cast,
  QuantumMeasurement,
  QuantumMeasurementAssignment,
  ClassicalDeclaration,
  AssignmentStatement,
  QuantumDeclaration,
  QuantumGateCall,
  QuantumBarrier,
  QuantumReset,
  ReturnStatement,
  ProgramBlock,
  SubroutineDefinition,
  SubroutineCall,
  BranchingStatement,
  IntegerLiteral,
  Parameters,
} from "../../../src/qasm3/ast";

export const qecAst = [
  new Include('"stdgates.inc"'),
  new QuantumDeclaration(new Identifier("q"), new IntegerLiteral(3)),
  new QuantumDeclaration(new Identifier("a"), new IntegerLiteral(2)),
  new ClassicalDeclaration(
    new BitType(new IntegerLiteral(3)),
    new Identifier("c"),
    null,
    false,
  ),
  new ClassicalDeclaration(
    new BitType(new IntegerLiteral(2)),
    new Identifier("syn"),
    null,
    false,
  ),
  new SubroutineDefinition(
    new Identifier("syndrome"),
    new ProgramBlock([
      new ClassicalDeclaration(
        new BitType(new IntegerLiteral(2)),
        new Identifier("b"),
        null,
        false,
      ),
      new QuantumGateCall(
        new Identifier("cx"),
        [
          new SubscriptedIdentifier("d", new IntegerLiteral(0)),
          new SubscriptedIdentifier("a", new IntegerLiteral(0)),
        ],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("cx"),
        [
          new SubscriptedIdentifier("d", new IntegerLiteral(1)),
          new SubscriptedIdentifier("a", new IntegerLiteral(0)),
        ],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("cx"),
        [
          new SubscriptedIdentifier("d", new IntegerLiteral(1)),
          new SubscriptedIdentifier("a", new IntegerLiteral(1)),
        ],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("cx"),
        [
          new SubscriptedIdentifier("d", new IntegerLiteral(2)),
          new SubscriptedIdentifier("a", new IntegerLiteral(1)),
        ],
        null,
        [],
      ),
      new QuantumMeasurementAssignment(
        new Identifier("b"),
        new QuantumMeasurement([new Identifier("a")]),
      ),
      new ReturnStatement([new Identifier("b")]),
    ]),
    new Parameters([
      [new QuantumDeclaration(new Identifier("d"), new IntegerLiteral(3))],
      [new QuantumDeclaration(new Identifier("a"), new IntegerLiteral(2))],
    ]),
    new BitType(new IntegerLiteral(2)),
  ),
  new QuantumReset(new Identifier("q")),
  new QuantumReset(new Identifier("a")),
  new QuantumGateCall(
    new Identifier("x"),
    [new SubscriptedIdentifier("q", new IntegerLiteral(0))],
    null,
    [],
  ),
  new QuantumBarrier([new Identifier("q")]),
  new AssignmentStatement(
    new Identifier("syn"),
    new SubroutineCall(
      new Identifier("syndrome"),
      new Parameters([new Identifier("q"), new Identifier("a")]),
    ),
  ),
  new BranchingStatement(
    new Binary(
      BinaryOp.EQUAL,
      new Cast(new IntType(new IntegerLiteral(2)), new Identifier("syn")),
      new IntegerLiteral(1),
    ),
    new ProgramBlock([
      new QuantumGateCall(
        new Identifier("x"),
        [new SubscriptedIdentifier("q", new IntegerLiteral(0))],
        null,
        [],
      ),
    ]),
    null,
  ),
  new BranchingStatement(
    new Binary(
      BinaryOp.EQUAL,
      new Cast(new IntType(new IntegerLiteral(2)), new Identifier("syn")),
      new IntegerLiteral(2),
    ),
    new ProgramBlock([
      new QuantumGateCall(
        new Identifier("x"),
        [new SubscriptedIdentifier("q", new IntegerLiteral(2))],
        null,
        [],
      ),
    ]),
    null,
  ),
  new BranchingStatement(
    new Binary(
      BinaryOp.EQUAL,
      new Cast(new IntType(new IntegerLiteral(2)), new Identifier("syn")),
      new IntegerLiteral(3),
    ),
    new ProgramBlock([
      new QuantumGateCall(
        new Identifier("x"),
        [new SubscriptedIdentifier("q", new IntegerLiteral(1))],
        null,
        [],
      ),
    ]),
    null,
  ),
  new QuantumMeasurementAssignment(
    new Identifier("c"),
    new QuantumMeasurement([new Identifier("q")]),
  ),
];
