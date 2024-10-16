enum Token {
  // 0; invalid or unrecognized token
  Illegal,
  // 1; end of file character
  EndOfFile,
  // 2; real number (floating point)
  Real,
  // 3; non-negative integer
  NNInteger,
  // 4; integer that supports underscores and negatives
  Integer,
  // 5; identifier (variables names, function names, etc.)
  Id,
  // 6; OPENQASM version declaration
  OpenQASM,
  // 7; include statement
  Include,
  // 8; semicolon to terminate statements
  Semicolon,
  // 9; colon
  Colon,
  // 10; comma
  Comma,
  // 11; left paren (
  LParen,
  // 12; left square bracket [
  LSParen,
  // 13; left curly brakcet {
  LCParen,
  // 14; right paren )
  RParen,
  // 15; right square paren ]
  RSParen,
  // 16; right curly bracket }
  RCParen,
  // 17; assignment operator (=)
  EqualsAssmt,
  // 18; arrow (->) used in measurement operations
  Arrow,
  // 19; quantum register declaration
  QReg,
  // 20; quantum register declaration (functionally equivalent to QReg but for OpenQASM version 3)
  Qubit,
  // 21; classical register declaration
  CReg,
  // 22; classical register declaration (functionally equivalent to Creg but for OpenQASM version 3)
  Bit,
  // 23; barrier operation
  Barrier,
  // 24; gate declaration or application
  Gate,
  // 25; measurement operation
  Measure,
  // 26; qubit reset operation
  Reset,
  // 27; string literal
  String,
  // 28; opaque keyword
  Opaque,
  // 29; defcalgrammar keyword
  DefcalGrammar,
  // 30; float type keyword
  Float,
  // 31; bool type keyword,
  Bool,
  // 32; int type keyword
  Int,
  // 33; uint type keyword
  UInt,
  // 34; mathematical constant pi
  Pi,
  // 35; euler constant
  Euler,
  // 36; tau constant
  Tau,
  // 37; binary literal
  BinaryLiteral,
  // 38; octal literal
  OctalLiteral,
  // 39; hex literal
  HexLiteral,
  // 40; arithmetic operators
  ArithmeticOp,
  // 41; compound arithmetic operators
  CompoundArithmeticOp,
  // 42; boolean literal value
  BoolLiteral,
  // 43; duration keyword
  Duration,
  // 44; unary operator
  UnaryOp,
  // 45; binary operator
  BinaryOp,
  // 46; let keyword for aliasing
  Let,
  // 47; quantum gate modifier
  QuantumModifier,
  // 48; delay keyword
  Delay,
  // 49; return keyword
  Return,
  // 50; def keyword for subroutines
  Def,
  // 51; for loop keyword
  For,
  // 52; in keyword
  In,
  // 53; while loop keyword
  While,
  // 54; break keyword
  Break,
  // 55; continue keyword
  Continue,
  // 56; input keyword
  Input,
  // 57; output keyword
  Output,
  // 58; switch statement keyword
  Switch,
  // 59; switch case keyword
  Case,
  // 60; switch default keyword
  Default,
  // 61; defcal keyword
  Defcal,
  // 62; constant keywork
  Const,
  // 63; if statement conditional
  If,
  // 64; else keyword
  Else,
  // 65; end keyword
  End,
  // 66; inverse cosine
  Arccos,
  // 67; inverse sine
  Arcsin,
  // 68; inverse tangent
  Arctan,
  // 69; ceiling function
  Ceiling,
  // 70; cosine function
  Cos,
  // 71; exp keyword
  Exp,
  // 72; floor function
  Floor,
  // 73; logarithm base e
  Log,
  // 74; modulus
  Mod,
  // 75; popcount function
  Popcount,
  // 76; power function
  Pow,
  // 77; rotate bits left function
  Rotl,
  // 78; rotate bits right function
  Rotr,
  // 79; sine
  Sin,
  // 80; sqaure root
  Sqrt,
  // 81; tangent
  Tan,
}

const lookupMap: object = {
  pi: Token.Pi,
  π: Token.Pi,
  qreg: Token.QReg,
  qubit: Token.Qubit,
  creg: Token.CReg,
  bit: Token.Bit,
  barrier: Token.Barrier,
  gate: Token.Gate,
  measure: Token.Measure,
  reset: Token.Reset,
  include: Token.Include,
  if: Token.If,
  opaque: Token.Opaque,
  defcalgrammar: Token.DefcalGrammar,
  float: Token.Float,
  bool: Token.Bool,
  true: Token.BoolLiteral,
  false: Token.BoolLiteral,
  int: Token.Int,
  uint: Token.UInt,
  euler: Token.Euler,
  ℇ: Token.Euler,
  tau: Token.Tau,
  τ: Token.Tau,
  duration: Token.Duration,
  let: Token.Let,
  delay: Token.Delay,
  return: Token.Return,
  def: Token.Def,
  for: Token.For,
  in: Token.In,
  while: Token.While,
  break: Token.Break,
  continue: Token.Continue,
  input: Token.Input,
  output: Token.Output,
  switch: Token.Switch,
  case: Token.Case,
  default: Token.Default,
  defcal: Token.Defcal,
  const: Token.Const,
  else: Token.Else,
  end: Token.End,
  "!": Token.UnaryOp,
  "~": Token.UnaryOp,
  "**": Token.ArithmeticOp,
  "*": Token.ArithmeticOp,
  "/": Token.ArithmeticOp,
  "%": Token.ArithmeticOp,
  "+": Token.ArithmeticOp,
  "-": Token.ArithmeticOp,
  "&": Token.BinaryOp,
  "|": Token.BinaryOp,
  "^": Token.BinaryOp,
  "&&": Token.BinaryOp,
  "||": Token.BinaryOp,
  "<": Token.BinaryOp,
  "<=": Token.BinaryOp,
  ">": Token.BinaryOp,
  ">=": Token.BinaryOp,
  "==": Token.BinaryOp,
  "!=": Token.BinaryOp,
  "<<": Token.BinaryOp,
  ">>": Token.BinaryOp,
  "**=": Token.CompoundArithmeticOp,
  "/=": Token.CompoundArithmeticOp,
  "%=": Token.CompoundArithmeticOp,
  "+=": Token.CompoundArithmeticOp,
  "-=": Token.CompoundArithmeticOp,
  "*=": Token.CompoundArithmeticOp,
  arccos: Token.Arccos,
  arcsin: Token.Arcsin,
  arctan: Token.Arctan,
  ceiling: Token.Ceiling,
  cos: Token.Cos,
  exp: Token.Exp,
  floor: Token.Floor,
  log: Token.Log,
  mod: Token.Mod,
  popcount: Token.Popcount,
  pow: Token.Pow,
  rotl: Token.Rotl,
  rotr: Token.Rotr,
  sin: Token.Sin,
  sqrt: Token.Sqrt,
  tan: Token.Tan,
};

/**
 * Returns the token that represents a given string.
 * @param ident - The string.
 * @return The corresponding token.
 */
function lookup(ident: string): Token {
  return ident in lookupMap ? lookupMap[ident] : Token.Id;
}

/**
 * Returns the string representation of a token.
 * @param tokens - The token.
 * @return The string representation of the token.
 */
function inverseLookup(token: Token): string {
  return Object.keys(lookupMap).find((ident) => lookupMap[ident] == token);
}

/**
 * Determines whether a token denotes a parameter.
 * @param tokens - The token.
 * @return Whether the token does NOT denote a parameter.
 */
function notParam(token: Token): boolean {
  if (
    token == Token.NNInteger ||
    token == Token.Real ||
    token == Token.Id ||
    inverseLookup(token)
  ) {
    return false;
  }
  return true;
}

export { Token, notParam, lookup, inverseLookup };
