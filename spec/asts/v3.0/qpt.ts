import {
  Include,
  BitType,
  Identifier,
  QuantumMeasurement,
  QuantumMeasurementAssignment,
  ClassicalDeclaration,
  QuantumDeclaration,
  QuantumGateCall,
  QuantumBarrier,
  QuantumReset,
  ProgramBlock,
  QuantumGateDefinition,
  Parameters,
} from "../../../src/qasm3/ast";

export const qptAst = [
  new Include('"stdgates.inc"'),
  new QuantumGateDefinition(
    new Identifier("pre"),
    new Parameters([]),
    [new Identifier("q")],
    new ProgramBlock([]),
  ),
  new QuantumGateDefinition(
    new Identifier("post"),
    new Parameters([]),
    [new Identifier("q")],
    new ProgramBlock([]),
  ),
  new QuantumDeclaration(new Identifier("q"), null),
  new ClassicalDeclaration(new BitType(null), new Identifier("c"), null, false),
  new QuantumReset(new Identifier("q")),
  new QuantumGateCall(new Identifier("pre"), [new Identifier("q")], null, []),
  new QuantumBarrier([new Identifier("q")]),
  new QuantumGateCall(new Identifier("h"), [new Identifier("q")], null, []),
  new QuantumBarrier([new Identifier("q")]),
  new QuantumGateCall(new Identifier("post"), [new Identifier("q")], null, []),
  new QuantumMeasurementAssignment(
    new Identifier("c"),
    new QuantumMeasurement([new Identifier("q")]),
  ),
];
