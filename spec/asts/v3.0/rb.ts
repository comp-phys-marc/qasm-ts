import {
  Include,
  BitType,
  Identifier,
  SubscriptedIdentifier,
  QuantumMeasurement,
  QuantumMeasurementAssignment,
  ClassicalDeclaration,
  QuantumDeclaration,
  QuantumGateCall,
  QuantumBarrier,
  QuantumReset,
  IntegerLiteral,
} from "../../../src/qasm3/ast";

export const rbAst = [
  new Include('"stdgates.inc"'),
  new QuantumDeclaration(new Identifier("q"), new IntegerLiteral(2)),
  new ClassicalDeclaration(
    new BitType(new IntegerLiteral(2)),
    new Identifier("c"),
    null,
    false,
  ),
  new QuantumReset(new Identifier("q")),
  new QuantumGateCall(
    new Identifier("h"),
    [new SubscriptedIdentifier("q", new IntegerLiteral(0))],
    null,
    [],
  ),
  new QuantumBarrier([new Identifier("q")]),
  new QuantumGateCall(
    new Identifier("cz"),
    [
      new SubscriptedIdentifier("q", new IntegerLiteral(0)),
      new SubscriptedIdentifier("q", new IntegerLiteral(1)),
    ],
    null,
    [],
  ),
  new QuantumBarrier([new Identifier("q")]),
  new QuantumGateCall(
    new Identifier("s"),
    [new SubscriptedIdentifier("q", new IntegerLiteral(0))],
    null,
    [],
  ),
  new QuantumGateCall(
    new Identifier("cz"),
    [
      new SubscriptedIdentifier("q", new IntegerLiteral(0)),
      new SubscriptedIdentifier("q", new IntegerLiteral(1)),
    ],
    null,
    [],
  ),
  new QuantumBarrier([new Identifier("q")]),
  new QuantumGateCall(
    new Identifier("s"),
    [new SubscriptedIdentifier("q", new IntegerLiteral(0))],
    null,
    [],
  ),
  new QuantumGateCall(
    new Identifier("z"),
    [new SubscriptedIdentifier("q", new IntegerLiteral(0))],
    null,
    [],
  ),
  new QuantumGateCall(
    new Identifier("h"),
    [new SubscriptedIdentifier("q", new IntegerLiteral(0))],
    null,
    [],
  ),
  new QuantumBarrier([new Identifier("q")]),
  new QuantumMeasurementAssignment(
    new Identifier("c"),
    new QuantumMeasurement([new Identifier("q")]),
  ),
];
