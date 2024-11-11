import {
  Include,
  BitType,
  Identifier,
  SubscriptedIdentifier,
  Pi,
  ArithmeticOp,
  Arithmetic,
  QuantumMeasurement,
  QuantumMeasurementAssignment,
  ClassicalDeclaration,
  QuantumDeclaration,
  QuantumGateCall,
  QuantumBarrier,
  QuantumReset,
  IntegerLiteral,
  Parameters,
} from "../../../src/qasm3/ast";

export const qftAst = [
  new Include('"stdgates.inc"'),
  new QuantumDeclaration(new Identifier("q"), new IntegerLiteral(4)),
  new ClassicalDeclaration(
    new BitType(new IntegerLiteral(4)),
    new Identifier("c"),
    null,
    false,
  ),
  new QuantumReset(new Identifier("q")),
  new QuantumGateCall(
    new Identifier("x"),
    [new SubscriptedIdentifier("q", new IntegerLiteral(0))],
    null,
    [],
  ),
  new QuantumGateCall(
    new Identifier("x"),
    [new SubscriptedIdentifier("q", new IntegerLiteral(2))],
    null,
    [],
  ),
  new QuantumBarrier([new Identifier("q")]),
  new QuantumGateCall(
    new Identifier("h"),
    [new SubscriptedIdentifier("q", new IntegerLiteral(0))],
    null,
    [],
  ),
  new QuantumGateCall(
    new Identifier("cphase"),
    [
      new SubscriptedIdentifier("q", new IntegerLiteral(1)),
      new SubscriptedIdentifier("q", new IntegerLiteral(0)),
    ],
    new Parameters([
      new Arithmetic(ArithmeticOp.DIVISION, new Pi(), new IntegerLiteral(2)),
    ]),
    [],
  ),
  new QuantumGateCall(
    new Identifier("h"),
    [new SubscriptedIdentifier("q", new IntegerLiteral(1))],
    null,
    [],
  ),
  new QuantumGateCall(
    new Identifier("cphase"),
    [
      new SubscriptedIdentifier("q", new IntegerLiteral(2)),
      new SubscriptedIdentifier("q", new IntegerLiteral(0)),
    ],
    new Parameters([
      new Arithmetic(ArithmeticOp.DIVISION, new Pi(), new IntegerLiteral(4)),
    ]),
    [],
  ),
  new QuantumGateCall(
    new Identifier("cphase"),
    [
      new SubscriptedIdentifier("q", new IntegerLiteral(2)),
      new SubscriptedIdentifier("q", new IntegerLiteral(1)),
    ],
    new Parameters([
      new Arithmetic(ArithmeticOp.DIVISION, new Pi(), new IntegerLiteral(2)),
    ]),
    [],
  ),
  new QuantumGateCall(
    new Identifier("h"),
    [new SubscriptedIdentifier("q", new IntegerLiteral(2))],
    null,
    [],
  ),
  new QuantumGateCall(
    new Identifier("cphase"),
    [
      new SubscriptedIdentifier("q", new IntegerLiteral(3)),
      new SubscriptedIdentifier("q", new IntegerLiteral(0)),
    ],
    new Parameters([
      new Arithmetic(ArithmeticOp.DIVISION, new Pi(), new IntegerLiteral(8)),
    ]),
    [],
  ),
  new QuantumGateCall(
    new Identifier("cphase"),
    [
      new SubscriptedIdentifier("q", new IntegerLiteral(3)),
      new SubscriptedIdentifier("q", new IntegerLiteral(1)),
    ],
    new Parameters([
      new Arithmetic(ArithmeticOp.DIVISION, new Pi(), new IntegerLiteral(4)),
    ]),
    [],
  ),
  new QuantumGateCall(
    new Identifier("cphase"),
    [
      new SubscriptedIdentifier("q", new IntegerLiteral(3)),
      new SubscriptedIdentifier("q", new IntegerLiteral(2)),
    ],
    new Parameters([
      new Arithmetic(ArithmeticOp.DIVISION, new Pi(), new IntegerLiteral(2)),
    ]),
    [],
  ),
  new QuantumGateCall(
    new Identifier("h"),
    [new SubscriptedIdentifier("q", new IntegerLiteral(3))],
    null,
    [],
  ),
  new QuantumMeasurementAssignment(
    new Identifier("c"),
    new QuantumMeasurement([new Identifier("q")]),
  ),
];
