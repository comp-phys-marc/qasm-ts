enum Token {
  // 0; invalid or unrecognized token
  Illegal,
  // 1; end of file character
  EndOfFile,
  // 2; real number (floating point)
  Real,
  // 3; non-negative integer
  NNInteger,
  // 4; identifier (variables names, function names, etc.)
  Id,
  // 5; OPENQASM version declaration
  OpenQASM,
  // 6; semicolon to terminate statements
  Semicolon,
  // 7; comma
  Comma,
  // 8; left paren (
  LParen,
  // 9; left square bracket [
  LSParen,
  // 10; left curly brakcet {
  LCParen,
  // 11; right paren )
  RParen,
  // 12; right square paren ]
  RSParen,
  // 13; right curly bracket }
  RCParen,
  // 14; arrow (->) used in measurement operations
  Arrow,
  // 15; equality operator (==)
  Equals,
  // 16; addition operator (+)
  Plus,
  // 17; subtraction operator (-)
  Minus,
  // 18; multiplication operator (*)
  Times,
  // 19; division operator (/)
  Divide,
  // 20; exponentiation operator (^)
  Power,
  // 21; sine function
  Sin,
  // 22; cosine function
  Cos,
  // 23; tangent function
  Tan,
  // 24; exponential function
  Exp,
  // 25; natural logarithm function
  Ln,
  // 26; square root function
  Sqrt,
  // 27; mathematical constant pi
  Pi,
  // 28; quantum register declaration
  QReg,
  // 29; quantum register declaration (functionally equivalent to QReg but for OpenQASM version 3)
  Qubit,
  // 30; classical register declaration
  CReg,
  // 31; classical register declaration (functionally equivalent to Creg but for OpenQASM version 3)
  Bit,
  // 32; barrier operation
  Barrier,
  // 33; gate declaration or application
  Gate,
  // 34; measurement operation
  Measure,
  // 35; qubit reset operation
  Reset,
  // 36; include statement
  Include,
  // 37; if statement conditional
  If,
  // 38; string literal
  String,
  // 39; opaque keyword
  Opaque,
  // 40; assignment operator (=)
  EqualsAssmt,
  // 41; defcalgrammar keyword
  DefcalGrammar,
  // 42; float type keyword
  Float,
  // 43; bool type keyword,
  Bool,
  // 44; int type keyword
  Int,
  // 45; uint type keyword
  UInt,
  // 46; colon
  Colon,
  // 47; euler constant
  Euler,
  // 48; tau constant
  Tau,
  // 49; boolean literal value
  BoolLiteral,
  // 50; duration keyword
  Duration,
  // 52; duration value
  DurationLiteral,
  // 52; unary operator
  UnaryOp,
  // 53; binary operator
  BinaryOp,
  // 54; let keyword for aliasing
  Let,
  // 55; quantum gate modifier
  QuantumModifier,
  // 56; delay keyword
  Delay,
  // 57; return keyword
  Return,
  // 58; def keyword for subroutines
  Def,
  // 59; for loop keyword
  For,
  // 60; in keyword
  In,
  // 61; while loop keyword
  While,
  // 62; break keyword
  Break,
  // 63; continue keyword
  Continue,
  // 64; input keyword
  Input,
  // 65; output keyword
  Output,
  // 66; switch statement keyword
  Switch,
  // 67; switch case keyword
  Case,
  // 68; switch default keyword
  Default,
  // 69; defcal keyword
  Defcal,
  // 70; constant keywork
  Const,
  // 71; else keyword
  Else,
  // 72; end keyword
  End,
  // 73; binary literal
  BinaryLiteral,
}

const lookupMap: object = {
  "+": Token.Plus,
  "-": Token.Minus,
  "*": Token.Times,
  "/": Token.Divide,
  "^": Token.Power,
  sin: Token.Sin,
  cos: Token.Cos,
  tan: Token.Tan,
  exp: Token.Exp,
  ln: Token.Ln,
  sqrt: Token.Sqrt,
  pi: Token.Pi,
  "π": Token.Pi,
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
  defcalcalgrammar: Token.DefcalGrammar,
  float: Token.Float,
  bool: Token.Bool,
  int: Token.Int,
  uint: Token.UInt,
  euler: Token.Euler,
  "ℇ": Token.Euler,
  tau: Token.Tau,
  "τ": Token.Tau,
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
