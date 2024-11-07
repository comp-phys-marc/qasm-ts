import {
  Include,
  IntType,
  BitType,
  Identifier,
  Pi,
  BinaryOp,
  ArithmeticOp,
  Arithmetic,
  Binary,
  QuantumMeasurement,
  QuantumMeasurementAssignment,
  ClassicalDeclaration,
  AssignmentStatement,
  QuantumDeclaration,
  QuantumGateCall,
  ReturnStatement,
  ProgramBlock,
  ExternSignature,
  SubroutineDefinition,
  SubroutineCall,
  BranchingStatement,
  IntegerLiteral,
  Parameters,
} from "../../../src/qasm3/ast";

export const gateteleportAst = [
  new Include('"stdgates.inc"'),
  new ClassicalDeclaration(
    new IntType(new IntegerLiteral(32)),
    new Identifier("n"),
    new IntegerLiteral(3),
    true,
  ),
  new ExternSignature(
    new Identifier("vote"),
    new Parameters([
      [
        new ClassicalDeclaration(
          new BitType(new Identifier("n")),
          null,
          null,
          false,
        ),
      ],
    ]),
    new BitType(null),
  ),
  new SubroutineDefinition(
    new Identifier("logical_meas"),
    new ProgramBlock([
      new ClassicalDeclaration(
        new BitType(new IntegerLiteral(3)),
        new Identifier("c"),
        null,
        false,
      ),
      new ClassicalDeclaration(
        new BitType(null),
        new Identifier("r"),
        null,
        false,
      ),
      new QuantumMeasurementAssignment(
        new Identifier("c"),
        new QuantumMeasurement([new Identifier("d")]),
      ),
      new AssignmentStatement(
        new Identifier("r"),
        new SubroutineCall(
          new Identifier("vote"),
          new Parameters([new Identifier("c")]),
        ),
      ),
      new ReturnStatement([new Identifier("r")]),
    ]),
    new Parameters([
      [new QuantumDeclaration(new Identifier("d"), new IntegerLiteral(3))],
    ]),
    new BitType(null),
  ),
  new QuantumDeclaration(new Identifier("q"), new IntegerLiteral(3)),
  new QuantumDeclaration(new Identifier("a"), new IntegerLiteral(3)),
  new ClassicalDeclaration(new BitType(null), new Identifier("r"), null, false),
  new QuantumGateCall(
    new Identifier("rz"),
    [new Identifier("a")],
    new Parameters([
      new Arithmetic(ArithmeticOp.DIVISION, new Pi(), new IntegerLiteral(4)),
    ]),
    [],
  ),
  new QuantumGateCall(
    new Identifier("cx"),
    [new Identifier("q"), new Identifier("a")],
    null,
    [],
  ),
  new AssignmentStatement(
    new Identifier("r"),
    new SubroutineCall(
      new Identifier("logical_meas"),
      new Parameters([new Identifier("a")]),
    ),
  ),
  new BranchingStatement(
    new Binary(BinaryOp.EQUAL, new Identifier("r"), new IntegerLiteral(1)),
    new ProgramBlock([
      new QuantumGateCall(new Identifier("z"), [new Identifier("q")], null, []),
    ]),
    null,
  ),
];
