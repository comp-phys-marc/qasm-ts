import {
  Include,
  IntType,
  UIntType,
  BitType,
  Range,
  Identifier,
  SubscriptedIdentifier,
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
  ExternSignature,
  SubroutineDefinition,
  SubroutineCall,
  BranchingStatement,
  ForLoopStatement,
  IntegerLiteral,
  Parameters,
} from "../../../src/qasm3/ast";

export const scqecAst = [
  new Include('"stdgates.inc"'),
  new ClassicalDeclaration(
    new IntType(new IntegerLiteral(32)),
    new Identifier("d"),
    new IntegerLiteral(3),
    true,
  ),
  new ClassicalDeclaration(
    new IntType(new IntegerLiteral(32)),
    new Identifier("m"),
    new IntegerLiteral(10),
    true,
  ),
  new ClassicalDeclaration(
    new IntType(new IntegerLiteral(32)),
    new Identifier("shots"),
    new IntegerLiteral(1000),
    true,
  ),
  new ClassicalDeclaration(
    new IntType(new IntegerLiteral(32)),
    new Identifier("n"),
    new Arithmetic(
      ArithmeticOp.POWER,
      new Identifier("d"),
      new IntegerLiteral(2),
    ),
    true,
  ),
  new ClassicalDeclaration(
    new UIntType(new IntegerLiteral(32)),
    new Identifier("failures"),
    null,
    false,
  ),
  new ExternSignature(
    new Identifier("zfirst"),
    new Parameters([
      [
        new ClassicalDeclaration(
          new BitType(
            new Arithmetic(
              ArithmeticOp.MINUS,
              new Identifier("n"),
              new IntegerLiteral(1),
            ),
          ),
          null,
          null,
          false,
        ),
      ],
      new ClassicalDeclaration(
        new IntType(new IntegerLiteral(32)),
        null,
        null,
        false,
      ),
      new ClassicalDeclaration(
        new IntType(new IntegerLiteral(32)),
        null,
        null,
        false,
      ),
    ]),
    null,
  ),
  new ExternSignature(
    new Identifier("send"),
    new Parameters([
      [
        new ClassicalDeclaration(
          new BitType(
            new Arithmetic(
              ArithmeticOp.MINUS,
              new Identifier("n"),
              new IntegerLiteral(1),
            ),
          ),
          null,
          null,
          false,
        ),
      ],
      new ClassicalDeclaration(
        new IntType(new IntegerLiteral(32)),
        null,
        null,
        false,
      ),
      new ClassicalDeclaration(
        new IntType(new IntegerLiteral(32)),
        null,
        null,
        false,
      ),
      new ClassicalDeclaration(
        new IntType(new IntegerLiteral(32)),
        null,
        null,
        false,
      ),
    ]),
    null,
  ),
  new ExternSignature(
    new Identifier("zlast"),
    new Parameters([
      [
        new ClassicalDeclaration(
          new BitType(new Identifier("n")),
          null,
          null,
          false,
        ),
      ],
      new ClassicalDeclaration(
        new IntType(new IntegerLiteral(32)),
        null,
        null,
        false,
      ),
      new ClassicalDeclaration(
        new IntType(new IntegerLiteral(32)),
        null,
        null,
        false,
      ),
    ]),
    new BitType(null),
  ),
  new QuantumDeclaration(new Identifier("data"), new Identifier("n")),
  new QuantumDeclaration(
    new Identifier("ancilla"),
    new Arithmetic(
      ArithmeticOp.MINUS,
      new Identifier("n"),
      new IntegerLiteral(1),
    ),
  ),
  new ClassicalDeclaration(
    new BitType(
      new Arithmetic(
        ArithmeticOp.MINUS,
        new Identifier("n"),
        new IntegerLiteral(1),
      ),
    ),
    new Identifier("layer"),
    null,
    false,
  ),
  new ClassicalDeclaration(
    new BitType(new Identifier("n")),
    new Identifier("data_outcomes"),
    null,
    false,
  ),
  new ClassicalDeclaration(
    new BitType(null),
    new Identifier("outcome"),
    null,
    false,
  ),
  new SubroutineDefinition(
    new Identifier("hadamard_layer"),
    new ProgramBlock([
      new ForLoopStatement(
        new Range(
          new IntegerLiteral(0),
          new Arithmetic(
            ArithmeticOp.MINUS,
            new Identifier("d"),
            new IntegerLiteral(2),
          ),
          new IntegerLiteral(1),
        ),
        new UIntType(new IntegerLiteral(32)),
        new Identifier("row"),
        new ProgramBlock([
          new ForLoopStatement(
            new Range(
              new IntegerLiteral(0),
              new Arithmetic(
                ArithmeticOp.MINUS,
                new Identifier("d"),
                new IntegerLiteral(2),
              ),
              new IntegerLiteral(1),
            ),
            new UIntType(new IntegerLiteral(32)),
            new Identifier("col"),
            new ProgramBlock([
              new ClassicalDeclaration(
                new BitType(new IntegerLiteral(32)),
                new Identifier("sum"),
                new Cast(
                  new BitType(new IntegerLiteral(32)),
                  new Arithmetic(
                    ArithmeticOp.PLUS,
                    new Identifier("row"),
                    new Identifier("col"),
                  ),
                ),
                false,
              ),
              new BranchingStatement(
                new Binary(
                  BinaryOp.EQUAL,
                  new SubscriptedIdentifier("sum", new IntegerLiteral(0)),
                  new IntegerLiteral(1),
                ),
                new ProgramBlock([
                  new QuantumGateCall(
                    new Identifier("h"),
                    [
                      new SubscriptedIdentifier(
                        "ancilla",
                        new Arithmetic(
                          ArithmeticOp.PLUS,
                          new Arithmetic(
                            ArithmeticOp.TIMES,
                            new Identifier("row"),
                            new Arithmetic(
                              ArithmeticOp.MINUS,
                              new Identifier("d"),
                              new IntegerLiteral(1),
                            ),
                          ),
                          new Identifier("col"),
                        ),
                      ),
                    ],
                    null,
                    [],
                  ),
                ]),
                null,
              ),
            ]),
          ),
        ]),
      ),
      new ForLoopStatement(
        new Range(
          new IntegerLiteral(0),
          new Arithmetic(
            ArithmeticOp.MINUS,
            new Identifier("d"),
            new IntegerLiteral(2),
          ),
          new IntegerLiteral(1),
        ),
        new UIntType(new IntegerLiteral(32)),
        new Identifier("i"),
        new ProgramBlock([
          new QuantumGateCall(
            new Identifier("h"),
            [
              new SubscriptedIdentifier(
                "ancilla",
                new Arithmetic(
                  ArithmeticOp.PLUS,
                  new Arithmetic(
                    ArithmeticOp.PLUS,
                    new Arithmetic(
                      ArithmeticOp.POWER,
                      new Arithmetic(
                        ArithmeticOp.MINUS,
                        new Identifier("d"),
                        new IntegerLiteral(1),
                      ),
                      new IntegerLiteral(2),
                    ),
                    new Arithmetic(
                      ArithmeticOp.MINUS,
                      new Identifier("d"),
                      new IntegerLiteral(1),
                    ),
                  ),
                  new Identifier("i"),
                ),
              ),
            ],
            null,
            [],
          ),
        ]),
      ),
    ]),
    new Parameters([
      [
        new QuantumDeclaration(
          new Identifier("ancilla"),
          new Arithmetic(
            ArithmeticOp.MINUS,
            new Identifier("n"),
            new IntegerLiteral(1),
          ),
        ),
      ],
    ]),
    null,
  ),
  new SubroutineDefinition(
    new Identifier("cycle"),
    new ProgramBlock([
      new QuantumReset(new Identifier("ancilla")),
      new SubroutineCall(new Identifier("hadamard_layer"), null),
      new Identifier("ancilla"),
      new ForLoopStatement(
        new Range(
          new IntegerLiteral(0),
          new Arithmetic(
            ArithmeticOp.MINUS,
            new Identifier("d"),
            new IntegerLiteral(2),
          ),
          new IntegerLiteral(1),
        ),
        new UIntType(new IntegerLiteral(32)),
        new Identifier("row"),
        new ProgramBlock([
          new ForLoopStatement(
            new Range(
              new IntegerLiteral(0),
              new Arithmetic(
                ArithmeticOp.MINUS,
                new Identifier("d"),
                new IntegerLiteral(2),
              ),
              new IntegerLiteral(1),
            ),
            new UIntType(new IntegerLiteral(32)),
            new Identifier("col"),
            new ProgramBlock([
              new ClassicalDeclaration(
                new BitType(new IntegerLiteral(32)),
                new Identifier("sum"),
                new Cast(
                  new BitType(new IntegerLiteral(32)),
                  new Arithmetic(
                    ArithmeticOp.PLUS,
                    new Identifier("row"),
                    new Identifier("col"),
                  ),
                ),
                false,
              ),
              new BranchingStatement(
                new Binary(
                  BinaryOp.EQUAL,
                  new SubscriptedIdentifier("sum", new IntegerLiteral(0)),
                  new IntegerLiteral(0),
                ),
                new ProgramBlock([
                  new QuantumGateCall(
                    new Identifier("cx"),
                    [
                      new SubscriptedIdentifier(
                        "data",
                        new Arithmetic(
                          ArithmeticOp.PLUS,
                          new Arithmetic(
                            ArithmeticOp.TIMES,
                            new Identifier("row"),
                            new Identifier("d"),
                          ),
                          new Identifier("col"),
                        ),
                      ),
                      new SubscriptedIdentifier(
                        "ancilla",
                        new Arithmetic(
                          ArithmeticOp.PLUS,
                          new Arithmetic(
                            ArithmeticOp.TIMES,
                            new Identifier("row"),
                            new Arithmetic(
                              ArithmeticOp.MINUS,
                              new Identifier("d"),
                              new IntegerLiteral(1),
                            ),
                          ),
                          new Identifier("col"),
                        ),
                      ),
                    ],
                    null,
                    [],
                  ),
                ]),
                null,
              ),
              new BranchingStatement(
                new Binary(
                  BinaryOp.EQUAL,
                  new SubscriptedIdentifier("sum", new IntegerLiteral(0)),
                  new IntegerLiteral(1),
                ),
                new ProgramBlock([
                  new QuantumGateCall(
                    new Identifier("cx"),
                    [
                      new SubscriptedIdentifier(
                        "ancilla",
                        new Arithmetic(
                          ArithmeticOp.PLUS,
                          new Arithmetic(
                            ArithmeticOp.TIMES,
                            new Identifier("row"),
                            new Arithmetic(
                              ArithmeticOp.MINUS,
                              new Identifier("d"),
                              new IntegerLiteral(1),
                            ),
                          ),
                          new Identifier("col"),
                        ),
                      ),
                      new SubscriptedIdentifier(
                        "data",
                        new Arithmetic(
                          ArithmeticOp.PLUS,
                          new Arithmetic(
                            ArithmeticOp.TIMES,
                            new Identifier("row"),
                            new Identifier("d"),
                          ),
                          new Identifier("col"),
                        ),
                      ),
                    ],
                    null,
                    [],
                  ),
                ]),
                null,
              ),
            ]),
          ),
        ]),
      ),
      new ForLoopStatement(
        new Range(
          new IntegerLiteral(0),
          new Arithmetic(
            ArithmeticOp.DIVISION,
            new Arithmetic(
              ArithmeticOp.MINUS,
              new Identifier("d"),
              new IntegerLiteral(3),
            ),
            new IntegerLiteral(2),
          ),
          new IntegerLiteral(1),
        ),
        new UIntType(new IntegerLiteral(32)),
        new Identifier("i"),
        new ProgramBlock([
          new QuantumGateCall(
            new Identifier("cx"),
            [
              new SubscriptedIdentifier(
                "data",
                new Arithmetic(
                  ArithmeticOp.TIMES,
                  new Arithmetic(
                    ArithmeticOp.PLUS,
                    new Arithmetic(
                      ArithmeticOp.TIMES,
                      new Identifier("d"),
                      new Arithmetic(
                        ArithmeticOp.MINUS,
                        new Identifier("d"),
                        new IntegerLiteral(1),
                      ),
                    ),
                    new IntegerLiteral(2),
                  ),
                  new Identifier("i"),
                ),
              ),
              new SubscriptedIdentifier(
                "ancilla",
                new Arithmetic(
                  ArithmeticOp.PLUS,
                  new Arithmetic(
                    ArithmeticOp.DIVISION,
                    new Arithmetic(
                      ArithmeticOp.PLUS,
                      new Arithmetic(
                        ArithmeticOp.POWER,
                        new Arithmetic(
                          ArithmeticOp.MINUS,
                          new Identifier("d"),
                          new IntegerLiteral(1),
                        ),
                        new IntegerLiteral(2),
                      ),
                      new Arithmetic(
                        ArithmeticOp.MINUS,
                        new Identifier("d"),
                        new IntegerLiteral(1),
                      ),
                    ),
                    new IntegerLiteral(2),
                  ),
                  new Identifier("i"),
                ),
              ),
            ],
            null,
            [],
          ),
        ]),
      ),
      new ForLoopStatement(
        new Range(
          new IntegerLiteral(0),
          new Arithmetic(
            ArithmeticOp.DIVISION,
            new Arithmetic(
              ArithmeticOp.MINUS,
              new Identifier("d"),
              new IntegerLiteral(3),
            ),
            new IntegerLiteral(2),
          ),
          new IntegerLiteral(1),
        ),
        new UIntType(new IntegerLiteral(32)),
        new Identifier("i"),
        new ProgramBlock([
          new QuantumGateCall(
            new Identifier("cx"),
            [
              new SubscriptedIdentifier(
                "ancilla",
                new Arithmetic(
                  ArithmeticOp.PLUS,
                  new Arithmetic(
                    ArithmeticOp.DIVISION,
                    new Arithmetic(
                      ArithmeticOp.TIMES,
                      new Arithmetic(
                        ArithmeticOp.PLUS,
                        new Arithmetic(
                          ArithmeticOp.POWER,
                          new Arithmetic(
                            ArithmeticOp.MINUS,
                            new Identifier("d"),
                            new IntegerLiteral(1),
                          ),
                          new IntegerLiteral(2),
                        ),
                        new IntegerLiteral(3),
                      ),
                      new Arithmetic(
                        ArithmeticOp.MINUS,
                        new Identifier("d"),
                        new IntegerLiteral(1),
                      ),
                    ),
                    new IntegerLiteral(2),
                  ),
                  new Identifier("i"),
                ),
              ),
              new SubscriptedIdentifier(
                "data",
                new Arithmetic(
                  ArithmeticOp.TIMES,
                  new Arithmetic(
                    ArithmeticOp.TIMES,
                    new Arithmetic(
                      ArithmeticOp.PLUS,
                      new Arithmetic(
                        ArithmeticOp.MINUS,
                        new Arithmetic(
                          ArithmeticOp.TIMES,
                          new IntegerLiteral(2),
                          new Identifier("d"),
                        ),
                        new IntegerLiteral(1),
                      ),
                      new IntegerLiteral(2),
                    ),
                    new Identifier("d"),
                  ),
                  new Identifier("i"),
                ),
              ),
            ],
            null,
            [],
          ),
        ]),
      ),
      new SubroutineCall(new Identifier("hadamard_layer"), null),
      new Identifier("ancilla"),
      new ReturnStatement([
        new QuantumMeasurement([new Identifier("ancilla")]),
      ]),
    ]),
    new Parameters([
      [new QuantumDeclaration(new Identifier("data"), new Identifier("n"))],
      [
        new QuantumDeclaration(
          new Identifier("ancilla"),
          new Arithmetic(
            ArithmeticOp.MINUS,
            new Identifier("n"),
            new IntegerLiteral(1),
          ),
        ),
      ],
    ]),
    new BitType(
      new Arithmetic(
        ArithmeticOp.MINUS,
        new Identifier("n"),
        new IntegerLiteral(1),
      ),
    ),
  ),
  new ForLoopStatement(
    new Range(
      new IntegerLiteral(1),
      new Identifier("shots"),
      new IntegerLiteral(1),
    ),
    new UIntType(new IntegerLiteral(32)),
    new Identifier("shot"),
    new ProgramBlock([
      new QuantumReset(new Identifier("data")),
      new AssignmentStatement(
        new Identifier("layer"),
        new SubroutineCall(
          new Identifier("cycle"),
          new Parameters([new Identifier("data"), new Identifier("ancilla")]),
        ),
      ),
      new SubroutineCall(
        new Identifier("zfirst"),
        new Parameters([
          new Identifier("layer"),
          new Identifier("shot"),
          new Identifier("d"),
        ]),
      ),
      new ForLoopStatement(
        new Range(
          new IntegerLiteral(1),
          new Identifier("m"),
          new IntegerLiteral(1),
        ),
        new IntType(new IntegerLiteral(32)),
        new Identifier("i"),
        new ProgramBlock([
          new AssignmentStatement(
            new Identifier("layer"),
            new SubroutineCall(
              new Identifier("cycle"),
              new Parameters([
                new Identifier("data"),
                new Identifier("ancilla"),
              ]),
            ),
          ),
          new SubroutineCall(
            new Identifier("send"),
            new Parameters([
              new Identifier("layer"),
              new Identifier("shot"),
              new Identifier("i"),
              new Identifier("d"),
            ]),
          ),
        ]),
      ),
      new QuantumMeasurementAssignment(
        new Identifier("data_outcomes"),
        new QuantumMeasurement([new Identifier("data")]),
      ),
      new AssignmentStatement(
        new Identifier("outcome"),
        new SubroutineCall(
          new Identifier("zlast"),
          new Parameters([
            new Identifier("data_outcomes"),
            new Identifier("shot"),
            new Identifier("d"),
          ]),
        ),
      ),
      new AssignmentStatement(
        new Identifier("failures"),
        new Arithmetic(
          ArithmeticOp.PLUS,
          new Identifier("failures"),
          new Cast(
            new IntType(new IntegerLiteral(1)),
            new Identifier("outcome"),
          ),
        ),
      ),
    ]),
  ),
];
