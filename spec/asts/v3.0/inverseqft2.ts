import {
  Include,
  BitType,
  Identifier,
  SubscriptedIdentifier,
  Pi,
  ArithmeticOp,
  Arithmetic,
  BinaryOp,
  Binary,
  QuantumMeasurement,
  QuantumMeasurementAssignment,
  ClassicalDeclaration,
  QuantumDeclaration,
  QuantumGateCall,
  QuantumBarrier,
  QuantumReset,
  ProgramBlock,
  BranchingStatement,
  IntegerLiteral,
  Parameters,
} from "../../../src/qasm3/ast";

export const inverseqft2Ast = [
  new Include('"stdgates.inc"'),
  new QuantumDeclaration(new Identifier("q"), new IntegerLiteral(4)),
  new ClassicalDeclaration(
    new BitType(null),
    new Identifier("c0"),
    null,
    false,
  ),
  new ClassicalDeclaration(
    new BitType(null),
    new Identifier("c1"),
    null,
    false,
  ),
  new ClassicalDeclaration(
    new BitType(null),
    new Identifier("c2"),
    null,
    false,
  ),
  new ClassicalDeclaration(
    new BitType(null),
    new Identifier("c3"),
    null,
    false,
  ),
  new QuantumReset(new Identifier("q")),
  new QuantumGateCall(new Identifier("h"), [new Identifier("q")], null, []),
  new QuantumBarrier([new Identifier("q")]),
  new QuantumGateCall(
    new Identifier("h"),
    [new SubscriptedIdentifier("q", new IntegerLiteral(0))],
    null,
    [],
  ),
  new QuantumMeasurementAssignment(
    new Identifier("c0"),
    new QuantumMeasurement([
      new SubscriptedIdentifier("q", new IntegerLiteral(0)),
    ]),
  ),
  new BranchingStatement(
    new Binary(BinaryOp.EQUAL, new Identifier("c0"), new IntegerLiteral(1)),
    new ProgramBlock([
      new QuantumGateCall(
        new Identifier("rz"),
        [new SubscriptedIdentifier("q", new IntegerLiteral(1))],
        new Parameters([
          new Arithmetic(
            ArithmeticOp.DIVISION,
            new Pi(),
            new IntegerLiteral(2),
          ),
        ]),
        [],
      ),
    ]),
    null,
  ),
  new QuantumGateCall(
    new Identifier("h"),
    [new SubscriptedIdentifier("q", new IntegerLiteral(1))],
    null,
    [],
  ),
  new QuantumMeasurementAssignment(
    new Identifier("c1"),
    new QuantumMeasurement([
      new SubscriptedIdentifier("q", new IntegerLiteral(1)),
    ]),
  ),
  new BranchingStatement(
    new Binary(BinaryOp.EQUAL, new Identifier("c0"), new IntegerLiteral(1)),
    new ProgramBlock([
      new QuantumGateCall(
        new Identifier("rz"),
        [new SubscriptedIdentifier("q", new IntegerLiteral(2))],
        new Parameters([
          new Arithmetic(
            ArithmeticOp.DIVISION,
            new Pi(),
            new IntegerLiteral(4),
          ),
        ]),
        [],
      ),
    ]),
    null,
  ),
  new BranchingStatement(
    new Binary(BinaryOp.EQUAL, new Identifier("c1"), new IntegerLiteral(1)),
    new ProgramBlock([
      new QuantumGateCall(
        new Identifier("rz"),
        [new SubscriptedIdentifier("q", new IntegerLiteral(2))],
        new Parameters([
          new Arithmetic(
            ArithmeticOp.DIVISION,
            new Pi(),
            new IntegerLiteral(2),
          ),
        ]),
        [],
      ),
    ]),
    null,
  ),
  new QuantumGateCall(
    new Identifier("h"),
    [new SubscriptedIdentifier("q", new IntegerLiteral(2))],
    null,
    [],
  ),
  new QuantumMeasurementAssignment(
    new Identifier("c2"),
    new QuantumMeasurement([
      new SubscriptedIdentifier("q", new IntegerLiteral(2)),
    ]),
  ),
  new BranchingStatement(
    new Binary(BinaryOp.EQUAL, new Identifier("c0"), new IntegerLiteral(1)),
    new ProgramBlock([
      new QuantumGateCall(
        new Identifier("rz"),
        [new SubscriptedIdentifier("q", new IntegerLiteral(3))],
        new Parameters([
          new Arithmetic(
            ArithmeticOp.DIVISION,
            new Pi(),
            new IntegerLiteral(8),
          ),
        ]),
        [],
      ),
    ]),
    null,
  ),
  new BranchingStatement(
    new Binary(BinaryOp.EQUAL, new Identifier("c1"), new IntegerLiteral(1)),
    new ProgramBlock([
      new QuantumGateCall(
        new Identifier("rz"),
        [new SubscriptedIdentifier("q", new IntegerLiteral(3))],
        new Parameters([
          new Arithmetic(
            ArithmeticOp.DIVISION,
            new Pi(),
            new IntegerLiteral(4),
          ),
        ]),
        [],
      ),
    ]),
    null,
  ),
  new BranchingStatement(
    new Binary(BinaryOp.EQUAL, new Identifier("c2"), new IntegerLiteral(1)),
    new ProgramBlock([
      new QuantumGateCall(
        new Identifier("rz"),
        [new SubscriptedIdentifier("q", new IntegerLiteral(3))],
        new Parameters([
          new Arithmetic(
            ArithmeticOp.DIVISION,
            new Pi(),
            new IntegerLiteral(2),
          ),
        ]),
        [],
      ),
    ]),
    null,
  ),
  new QuantumGateCall(
    new Identifier("h"),
    [new SubscriptedIdentifier("q", new IntegerLiteral(3))],
    null,
    [],
  ),
  new QuantumMeasurementAssignment(
    new Identifier("c3"),
    new QuantumMeasurement([
      new SubscriptedIdentifier("q", new IntegerLiteral(3)),
    ]),
  ),
];
