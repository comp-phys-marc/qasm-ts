import {
  Include,
  StretchType,
  Identifier,
  SubscriptedIdentifier,
  Pi,
  ArithmeticOp,
  Arithmetic,
  ClassicalDeclaration,
  QuantumDeclaration,
  QuantumGateCall,
  QuantumBarrier,
  QuantumDelay,
  IntegerLiteral,
  Parameters,
} from "../../../src/qasm3/ast";

export const alignmentAst = [
  new Include("\"stdgates.inc\""),
  new ClassicalDeclaration(new StretchType(), new Identifier("g"), null, false),
  new QuantumDeclaration(new Identifier("q"), new IntegerLiteral(3)),
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
  new QuantumDelay(new Identifier("g"), [
    new SubscriptedIdentifier("q", new IntegerLiteral(2)),
  ]),
  new QuantumGateCall(
    new Identifier("U"),
    [new SubscriptedIdentifier("q", new IntegerLiteral(2))],
    new Parameters([
      new Arithmetic(ArithmeticOp.DIVISION, new Pi(), new IntegerLiteral(4)),
      new IntegerLiteral(0),
      new Arithmetic(ArithmeticOp.DIVISION, new Pi(), new IntegerLiteral(2)),
    ]),
    [],
  ),
  new QuantumDelay(
    new Arithmetic(
      ArithmeticOp.TIMES,
      new IntegerLiteral(2),
      new Identifier("g"),
    ),
    [new SubscriptedIdentifier("q", new IntegerLiteral(2))],
  ),
  new QuantumBarrier([new Identifier("q")]),
];
