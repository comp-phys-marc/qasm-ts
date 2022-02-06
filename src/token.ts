enum Token {
    Illegal,
    EndOfFile,
    Real,
    NNInteger,
    Id,
    OpenQASM,
    Semicolon,
    Comma,
    LParen,
    LSParen,
    LCParen,
    RParen,
    RSParen,
    RCParen,
    Arrow,
    Equals,
    Plus,
    Minus,
    Times,
    Divide,
    Power,
    Sin,
    Cos,
    Tan,
    Exp,
    Ln,
    Sqrt,
    Pi,
    QReg,
    CReg,
    Barrier,
    Gate,
    Measure,
    Reset,
    Include,
    If,
    String
}

const lookupMap:object = {
    'if': Token.If,
    'sin': Token.Sin,
    'cos': Token.Cos,
    'tan': Token.Tan,
    'exp': Token.Exp,
    'ln': Token.Ln,
    'sqrt': Token.Sqrt,
    'pi': Token.Pi,
    '+': Token.Plus,
    '-': Token.Minus,
    '/': Token.Divide,
    '*': Token.Times,
    '^': Token.Power
}

/**
 * Returns the token that represents a given string.
 * @param ident - The string.
 * @return The corresponding token.
 */
function lookup(ident: string): Token {
    return ident in lookupMap ? lookupMap[ident]: Token.Id;
}

/**
 * Returns the string representation of a token.
 * @param tokens - The token.
 * @return The string representation of the token.
 */
function inverseLookup(token:Token): string {
    return Object.keys(lookupMap).find((ident) => lookupMap[ident] == token);
}

/**
 * Determines whether a token denotes a parameter.
 * @param tokens - The token.
 * @return Whether the token does NOT denote a parameter.
 */
function notParam(token:Token): boolean {
    if (token == Token.NNInteger || token == Token.Real || token == Token.Id || this.inverseLookup(token)) {
        return false;
    }
    return true;
}

export {
     Token,
     notParam,
     lookup,
     inverseLookup
 };