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
  // TODO : right now the version declaration is lexed as an identifier token
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
  // 15; equality operator (=)
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
  // 29; classical register declaration
  CReg,
  // 30; barrier operation
  Barrier,
  // 31; gate declaration or application
  Gate,
  // 32; measurement operation
  Measure,
  // 33; qubit reset operation
  Reset,
  // 34; include statement
  Include,
  // 35; if statement conditional
  If,
  // 36; string literal
  String,
}

const lookupMap: object = {
  if: Token.If,
  sin: Token.Sin,
  cos: Token.Cos,
  tan: Token.Tan,
  exp: Token.Exp,
  ln: Token.Ln,
  sqrt: Token.Sqrt,
  pi: Token.Pi,
  "+": Token.Plus,
  "-": Token.Minus,
  "/": Token.Divide,
  "*": Token.Times,
  "^": Token.Power,
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
    this.inverseLookup(token)
  ) {
    return false;
  }
  return true;
}

export { Token, notParam, lookup, inverseLookup };
