import {
  Include,
  Version,
  BitType,
  Identifier,
  SubscriptedIdentifier,
  FloatLiteral,
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
  QuantumGateDefinition,
  BranchingStatement,
  IntegerLiteral,
  Parameters,
} from "../../../src/qasm3/ast";
import { OpenQASMVersion, OpenQASMMajorVersion } from "../../../src/version";

export const teleportAst = [
  new Version(new OpenQASMVersion(OpenQASMMajorVersion.Version3, 0)),
  new Include('"stdgates.inc"'),
  new QuantumDeclaration(new Identifier("q"), new IntegerLiteral(3)),
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
  new QuantumGateDefinition(
    new Identifier("post"),
    new Parameters([]),
    [new Identifier("q")],
    new ProgramBlock([]),
  ),
  new QuantumReset(new Identifier("q")),
  new QuantumGateCall(
    new Identifier("U"),
    [new SubscriptedIdentifier("q", new IntegerLiteral(0))],
    new Parameters([
      new FloatLiteral(0.3),
      new FloatLiteral(0.2),
      new FloatLiteral(0.1),
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
    new Identifier("cx"),
    [
      new SubscriptedIdentifier("q", new IntegerLiteral(1)),
      new SubscriptedIdentifier("q", new IntegerLiteral(2)),
    ],
    null,
    [],
  ),
  new QuantumBarrier([new Identifier("q")]),
  new QuantumGateCall(
    new Identifier("cx"),
    [
      new SubscriptedIdentifier("q", new IntegerLiteral(0)),
      new SubscriptedIdentifier("q", new IntegerLiteral(1)),
    ],
    null,
    [],
  ),
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
        new Identifier("z"),
        [new SubscriptedIdentifier("q", new IntegerLiteral(2))],
        null,
        [],
      ),
    ]),
    null,
  ),
  new BranchingStatement(
    new Binary(BinaryOp.EQUAL, new Identifier("c1"), new IntegerLiteral(1)),
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
  new QuantumGateCall(
    new Identifier("post"),
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
];
