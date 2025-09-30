import { Version as Version2, Include as Include2, Gate, QReg, CReg, ApplyGate, Measure, Barrier, If, NNInteger, Cos, Divide, Exp, Ln, Opaque, Pi, Plus, Power, Real, Sin, Sqrt, Tan, Times, Variable } from "../dist/qasm2/ast";
import { AliasStatement, ArrayDeclaration, AssignmentStatement, BoxDefinition, BranchingStatement, ClassicalDeclaration, ContinueStatement, DurationOf, ExternSignature, ForLoopStatement, Include as Include3, IODeclaration, MathFunction, QuantumBarrier, QuantumDeclaration, QuantumDelay, QuantumGateCall, QuantumGateDefinition, QuantumMeasurement, QuantumMeasurementAssignment, QuantumReset, ReturnStatement, SizeOf, SubroutineCall, SubroutineDefinition, SwitchStatement, TrigFunction, Version as Version3, WhileLoopStatement } from "../dist/qasm3/ast";
import { OpenQASMVersion, OpenQASMMajorVersion } from "../dist/version";

export type Qasm2QuantumInstruction =
    Include2 |
    Version2 |
    QReg |
    CReg |
    Barrier |
    Measure |
    Gate |
    Variable |
    Opaque |
    If |
    Power |
    Divide |
    Times |
    Plus |
    Pi |
    Sin |
    Cos |
    Exp |
    Ln |
    Sqrt |
    Tan |
    NNInteger|
    Real |
    ApplyGate[];


export type Qasm3QuantumInstruction =
  Include3 |
  Version3 |
  ClassicalDeclaration |
  IODeclaration |
  QuantumDeclaration |
  QuantumReset |
  ContinueStatement |
  AliasStatement |
  QuantumGateDefinition |
  ReturnStatement |
  ExternSignature |
  QuantumGateCall |
  QuantumMeasurement |
  QuantumMeasurementAssignment |
  MathFunction |
  TrigFunction |
  DurationOf |
  SizeOf |
  QuantumBarrier |
  QuantumDelay |
  ForLoopStatement |
  WhileLoopStatement |
  SwitchStatement |
  ArrayDeclaration |
  BoxDefinition |
  AssignmentStatement |
  SubroutineDefinition |
  SubroutineCall |
  BoxDefinition |
  BranchingStatement
  ;

export function parseString(
    qasm: string,
    version: number | OpenQASMVersion | OpenQASMMajorVersion,
    verbose: boolean,
    stringify: true
): string;

export function parseString(
    qasm: string,
    version:
        2 |
        OpenQASMVersion & { major: OpenQASMMajorVersion.Version2 } |
        OpenQASMMajorVersion.Version2
): Qasm2QuantumInstruction[];

export function parseString(
    qasm: string,
    version:
        3 |
        OpenQASMVersion & { major: OpenQASMMajorVersion.Version3 } |
        OpenQASMMajorVersion.Version3
): Qasm3QuantumInstruction[];

export function parseString(
  qasm: string,
  version?: number | OpenQASMVersion | OpenQASMMajorVersion,
  verbose?: boolean,
  stringify?: boolean,
): Qasm3QuantumInstruction[] | string;
