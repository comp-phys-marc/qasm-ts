import type { OpenQASMVersion, OpenQASMMajorVersion } from "../dist/version";
import type * as qasm2 from "../dist/qasm2/ast";
import type * as qasm3 from "../dist/qasm3/ast";

export type Qasm2QuantumInstruction =
  qasm2.Include |
  qasm2.Version |
  qasm2.QReg |
  qasm2.CReg |
  qasm2.Barrier |
  qasm2.Measure |
  qasm2.Gate |
  qasm2.Variable |
  qasm2.Opaque |
  qasm2.If |
  qasm2.Power |
  qasm2.Divide |
  qasm2.Times |
  qasm2.Plus |
  qasm2.Pi |
  qasm2.Sin |
  qasm2.Cos |
  qasm2.Exp |
  qasm2.Ln |
  qasm2.Sqrt |
  qasm2.Tan |
  qasm2.NNInteger |
  qasm2.Real |
  qasm2.ApplyGate[];


export type Qasm3QuantumInstruction =
  qasm3.Include |
  qasm3.Version |
  qasm3.ClassicalDeclaration |
  qasm3.IODeclaration |
  qasm3.QuantumDeclaration |
  qasm3.QuantumReset |
  qasm3.ContinueStatement |
  qasm3.AliasStatement |
  qasm3.QuantumGateDefinition |
  qasm3.ReturnStatement |
  qasm3.ExternSignature |
  qasm3.QuantumGateCall |
  qasm3.QuantumMeasurement |
  qasm3.QuantumMeasurementAssignment |
  qasm3.MathFunction |
  qasm3.TrigFunction |
  qasm3.DurationOf |
  qasm3.SizeOf |
  qasm3.QuantumBarrier |
  qasm3.QuantumDelay |
  qasm3.ForLoopStatement |
  qasm3.WhileLoopStatement |
  qasm3.SwitchStatement |
  qasm3.ArrayDeclaration |
  qasm3.BoxDefinition |
  qasm3.AssignmentStatement |
  qasm3.SubroutineDefinition |
  qasm3.SubroutineCall |
  qasm3.BoxDefinition |
  qasm3.BranchingStatement;

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

export var parseFile: typeof parseString;
