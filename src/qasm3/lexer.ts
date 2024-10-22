import { Token, lookup } from "./token";
import {
  MissingSemicolonError,
  UnsupportedOpenQASMVersionError,
  ReturnErrorConstructor,
} from "../errors";

/**
 * Handles throwing lexer errors with basic stack trace.
 * @param error - The error to throw.
 * @param number - The line number in the source code.
 * @param code - The source code that the error is about.
 */
function throwLexerError(
  error: ReturnErrorConstructor,
  line: number,
  code: string,
) {
  throw new error(`Line ${line}: ${code}`);
}

/**
 * Returns whether a given character could be an element of a numeric value.
 * @param c - The character.
 * @return Whether the character is numeric.
 */
function isNumeric(c: string): boolean {
  return c == "." || c == "_" || !isNaN(parseInt(c));
}

/**
 * Returns whether a given character is a letter.
 * @param c - The character.
 * @param matchCase - Whether to check for a letter that is upper case, lower case, or either. (optional)
 * @return Whether the character is a letter.
 */
function isLetter(c: string, matchCase?: "upper" | "lower"): boolean {
  switch (matchCase) {
    case "upper":
      return /^[A-Z]$/.test(c);
    case "lower":
      return /^[a-z]$/.test(c);
    default:
      return /^[A-Za-z]$/.test(c);
  }
}

/**
 * Returns whether a given character is unicode.
 * @param c - The character.
 * @param excludePi - Whether to exclude the Pi symbol from consideration.
 * @return - Whether the given character is valid unicode.
 */
function isUnicode(c: string, excludePi?: boolean): boolean {
  const isBasicUnicode = /^\u0000-\u00ff/.test(c);
  switch (excludePi) {
    case true:
      return isBasicUnicode && c !== "\u03C0";
    case false:
      return isBasicUnicode;
    default:
      return isBasicUnicode;
  }
}

/**
 * Returns whether a given character is alphanumeric.
 * @param c - The character.
 * @return Whether the character is alphanumeric.
 */
function isAlpha(c: string): boolean {
  return /^[0-9a-zA-Z]+$/.test(c);
}

/**
 * Returns whether a given character is a newline character.
 * @param c - The character.
 * @return Whether the character is a newline.
 */
function isNewline(c: string): boolean {
  return /\n|\r(?!\n)|\u2028|\u2029|\r\n/.test(c);
}

/** Class representing a lexer. */
class Lexer {
  /** The string to lex. */
  input: string;
  /** The lexer's current cursor location. */
  cursor: number;
  /**
   * Creates a lexer.
   * @param input - The string to lex.
   * @param cursor - The starting cursor position.
   */
  constructor(input: string, cursor: number = 0) {
    this.input = input;
    this.cursor = cursor;
  }

  /**
   * Verifies that all appropriate lines end with a semicolon.
   * @return A tuple of the status and if False, returns the problematic line.
   */
  verifyInput = (): [boolean, number | null, string | null] => {
    const lines = this.input.split(/\n|\r(?!\n)|\u2028|\u2029|\r\n/g);
    for (let i = 0; i < lines.length; i++) {
      const trimmedLine = lines[i].trim();
      if (
        !trimmedLine.startsWith("//") &&
        !trimmedLine.startsWith("/*") &&
        !trimmedLine.startsWith("*") &&
        !trimmedLine.startsWith("*/") &&
        trimmedLine.length > 0 &&
        !trimmedLine.startsWith("gate") &&
        trimmedLine !== "{" &&
        trimmedLine !== "}" &&
        !trimmedLine.includes(";") &&
        !trimmedLine.startsWith("def") &&
        !trimmedLine.startsWith("if") &&
        !trimmedLine.startsWith("else") &&
        !trimmedLine.startsWith("for") &&
        !trimmedLine.startsWith("while") &&
        !trimmedLine.startsWith("switch") &&
        !trimmedLine.startsWith("case") &&
        !trimmedLine.startsWith("box") &&
        !trimmedLine.startsWith("default")
      ) {
        return [false, i + 1, lines[i]];
      }
    }
    return [true, null, null];
  };

  /**
   * Calling this method lexes the code represented by the provided string.
   * @return An array of tokens and their corresponding values.
   */
  lex = (): Array<[Token, (number | string)?]> => {
    const tokens: Array<[Token, (number | string)?]> = [];
    let token: [Token, (number | string)?];
    const verifyInputResult = this.verifyInput();
    if (!verifyInputResult[0]) {
      throwLexerError(
        MissingSemicolonError,
        verifyInputResult[1],
        verifyInputResult[2],
      );
    }
    while (this.cursor < this.input.length) {
      token = this.nextToken();
      if (token) {
        tokens.push(token);
      }
    }
    return tokens;
  };

  /**
   * Reads a character and advances the cursor.
   * @param num - Optional cursor position modifier.
   */
  readChar = (num: number = 1): string => {
    this.cursor += num;
    return this.input[this.cursor - num];
  };

  /**
   * Advances the cusor past the next comment.
   */
  skipComment = () => {
    let char = "";
    while (!isNewline(char)) {
      char = this.readChar();
    }
  };

  /**
   * Advances the cursor past a multiline comment.
   */
  skipMultiLineComment = () => {
    let char = "";
    let nextChar = "";
    const multiLineCommentTerminator = "*/";
    while (`${char}${nextChar}` !== multiLineCommentTerminator) {
      char = this.readChar();
      nextChar = this.peek();
    }
    this.readChar();
  };

  /**
   * Determines whether the next character to process equals a given character.
   * @param c - The given character.
   * @return Whether the next character equals the given character.
   */
  peekEq = (c: string): boolean => this.peek() == c;

  /**
   * Reads a character without advancing the cursor.
   * @param index - Optional peek position offset.
   */
  peek = (): string => this.input[this.cursor];

  /**
   * Reads a numeric value.
   * @return The numeric value as a string.
   */
  readNumeric = (): string => {
    let num = "";
    while (isNumeric(this.peek())) {
      num += this.readChar();
    }
    return num;
  };

  /**
   * Reads an identifier.
   * @return The identifier as a string.
   */
  readIdentifier = (): string => {
    let id = "";
    let next = this.peek();
    while (isAlpha(next) || next == "_" || isUnicode(next)) {
      id += this.readChar();
      next = this.peek();
    }
    return id;
  };

  /**
   * Reds a keyword or identifier.
   * If the character sequence matches a keyword, returns the corresponding token.
   * Otherwise, treats the sequence as an identifier.
   * @param char - The first character of the keyword or identifier.
   * @return The corresponding token or identifier.
   */
  readKeywordOrIdentifier = (char: string): [Token, string] => {
    const identifier = char + this.readIdentifier();
    return [lookup(identifier), identifier];
  };

  /**
   * Reads a string literal.
   * @param terminator - The literal's termination character.
   * @return The literal as a string.
   */
  readStringLiteral = (terminator: string): string => {
    let lit = "";
    let char = "";
    while (!(terminator == char)) {
      char = this.readChar();
      lit += char;
    }
    return lit;
  };

  /**
   * Advances the cusor past the next block of whitespace.
   */
  skipWhitespace = (): null => {
    while (" \t\n\r\v".indexOf(this.peek()) > -1) {
      this.cursor += 1;
    }
    return null;
  };

  /**
   * Lexes the next token.
   * @return The next token and its corresponding value.
   */
  nextToken = (): [Token, (number | string)?] => {
    this.skipWhitespace();

    if (this.cursor == this.input.length) {
      return [Token.EndOfFile];
    }

    const char = this.peek();
    this.readChar();

    switch (char) {
      case "π":
        return [Token.Pi];
      case "ℇ":
        return [Token.Euler];
      case "τ":
        return [Token.Tau];
      case "@":
        return [Token.At];
      case "θ":
        return this.readKeywordOrIdentifier(char);
      case "!":
        if (this.peekEq("=")) {
          this.readChar();
          return [Token.BinaryOp, "!="];
        } else {
          return [Token.UnaryOp, "!"];
        }
      case "~":
        return [Token.UnaryOp, "~"];
      case "*":
        if (this.peekEq("*")) {
          this.readChar();
          if (this.peekEq("=")) {
            this.readChar();
            return [Token.CompoundArithmeticOp, "**="];
          } else {
            return [Token.ArithmeticOp, "**"];
          }
        } else if (this.peekEq("=")) {
          this.readChar();
          return [Token.CompoundArithmeticOp, "*="];
        } else {
          return [Token.ArithmeticOp, "*"];
        }
      case "/":
        if (this.peekEq("/")) {
          this.skipComment();
          return;
        } else if (this.peekEq("*")) {
          this.skipMultiLineComment();
          return;
        } else if (this.peekEq("=")) {
          this.readChar();
          return [Token.CompoundArithmeticOp, "/="];
        } else {
          return [Token.ArithmeticOp, "/"];
        }
      case "%":
        if (this.peekEq("=")) {
          this.readChar();
          return [Token.CompoundArithmeticOp, "%="];
        } else {
          return [Token.ArithmeticOp, "%"];
        }
      case "+":
        if (this.peekEq("=")) {
          this.readChar();
          return [Token.CompoundArithmeticOp, "+="];
        } else if (this.peekEq("+")) {
          this.readChar();
          return [Token.ArithmeticOp, "++"];
        }
        return [Token.ArithmeticOp, "+"];
      case "-": {
        if (this.peekEq(">")) {
          this.readChar();
          return [Token.Arrow];
        } else if (this.peekEq("=")) {
          this.readChar();
          return [Token.CompoundArithmeticOp, "-="];
        } else if (isNumeric(this.input[this.cursor])) {
          const num = char + this.readNumeric();
          if (num.indexOf(".") != -1) {
            return [Token.Real, parseFloat(num)];
          } else if (num.indexOf("_") != -1) {
            return [Token.Integer, num];
          } else {
            return [Token.Real, parseFloat(num)];
          }
        } else {
          return [Token.ArithmeticOp, "-"];
        }
      }
      case "&":
        if (this.peekEq("&")) {
          this.readChar();
          return [Token.BinaryOp, "&&"];
        } else {
          return [Token.BinaryOp, "&"];
        }
      case "|":
        if (this.peekEq("|")) {
          this.readChar();
          return [Token.BinaryOp, "||"];
        } else {
          return [Token.BinaryOp, "|"];
        }
      case "^":
        if (this.peekEq("=")) {
          this.readChar();
          return [Token.CompoundArithmeticOp, "^="];
        }
        return [Token.BinaryOp, "^"];
      case "<":
        if (this.peekEq("=")) {
          this.readChar();
          return [Token.BinaryOp, "<="];
        } else if (this.peekEq("<")) {
          this.readChar();
          return [Token.BinaryOp, "<<"];
        } else {
          return [Token.BinaryOp, "<"];
        }
      case ">":
        if (this.peekEq("=")) {
          this.readChar();
          return [Token.BinaryOp, ">="];
        } else if (this.peekEq(">")) {
          this.readChar();
          return [Token.BinaryOp, ">>"];
        } else {
          return [Token.BinaryOp, ">"];
        }
      case "=":
        if (this.peekEq("=")) {
          this.readChar();
          return [Token.BinaryOp, "=="];
        } else {
          return [Token.EqualsAssmt];
        }
      case ";":
        return [Token.Semicolon];
      case ",":
        return [Token.Comma];
      case ":":
        return [Token.Colon];
      case "(":
        return [Token.LParen];
      case "[":
        return [Token.LSParen];
      case "{":
        return [Token.LCParen];
      case ")":
        return [Token.RParen];
      case "]":
        return [Token.RSParen];
      case "}":
        return [Token.RCParen];
      case "$":
        return [Token.Dollar];
      case "c":
        if (
          this.input[this.cursor] == "t" &&
          this.input[this.cursor + 1] == "r" &&
          this.input[this.cursor + 2] == "l"
        ) {
          this.readChar(3);
          return this.lexGateModifier("ctrl");
        }
        return this.readKeywordOrIdentifier(char);
      case "n":
        if (
          this.input[this.cursor] == "e" &&
          this.input[this.cursor + 1] == "g" &&
          this.input[this.cursor + 2] == "c" &&
          this.input[this.cursor + 3] == "t" &&
          this.input[this.cursor + 4] == "r" &&
          this.input[this.cursor + 5] == "l"
        ) {
          this.readChar(6);
          return this.lexGateModifier("negctrl");
        }
        return this.readKeywordOrIdentifier(char);
      case "i":
        if (
          this.input[this.cursor] == "n" &&
          this.input[this.cursor + 1] == "v"
        ) {
          this.readChar(2);
          return this.lexGateModifier("inv");
        }
        return this.readKeywordOrIdentifier(char);
      case "p":
        if (
          this.input[this.cursor] == "o" &&
          this.input[this.cursor + 1] == "w"
        ) {
          this.readChar(2);
          return this.lexGateModifier("pow");
        }
        return this.readKeywordOrIdentifier(char);
      case "0":
        if (this.peekEq("b") || this.peekEq("B")) {
          const char = this.readChar(1);
          const binaryLit = this.readIdentifier();
          return [Token.BinaryLiteral, `0${char}${binaryLit}`];
        } else if (this.peekEq("o") || this.peekEq("O")) {
          const char = this.readChar(1);
          const octalLit = this.readIdentifier();
          return [Token.OctalLiteral, `0${char}${octalLit}`];
        } else if (this.peekEq("x") || this.peekEq("X")) {
          const char = this.readChar(1);
          const hexLit = this.readIdentifier();
          return [Token.HexLiteral, `0${char}${hexLit}`];
        } else {
          const num = char + this.readNumeric();
          if (num.indexOf(".") != -1) {
            return [Token.Real, parseFloat(num)];
          } else if (num.indexOf("_") != -1) {
            return [Token.Integer, num];
          } else {
            return [Token.NNInteger, parseInt(num)];
          }
        }
        return this.readKeywordOrIdentifier(char);
      case "O":
        if (
          this.input[this.cursor].toLowerCase() == "p" &&
          this.input[this.cursor + 1].toLowerCase() == "e" &&
          this.input[this.cursor + 2].toLowerCase() == "n" &&
          this.input[this.cursor + 3] == "Q" &&
          this.input[this.cursor + 4] == "A" &&
          this.input[this.cursor + 5] == "S" &&
          this.input[this.cursor + 6] == "M"
        ) {
          this.readChar(7);
          let offset = 0;
          while (
            this.cursor + offset < this.input.length &&
            " \t".indexOf(this.input[this.cursor + offset]) > -1
          ) {
            offset++;
          }

          // Read the major version
          let majorVersion = "";
          while (
            this.cursor + offset < this.input.length &&
            !isNaN(parseInt(this.input[this.cursor + offset], 10))
          ) {
            majorVersion += this.input[this.cursor + offset];
            offset++;
          }

          // Attempt to read the minor version
          let minorVersion: string | undefined = undefined;
          if (this.input[this.cursor + offset] == ".") {
            offset++;
            minorVersion = "";
            while (
              this.cursor + offset < this.input.length &&
              !isNaN(parseInt(this.input[this.cursor + offset], 10))
            ) {
              minorVersion += this.input[this.cursor + offset];
              offset++;
            }
          }

          // Parse major and minor versions
          const major = parseInt(majorVersion, 10);
          const minor = minorVersion ? parseInt(minorVersion, 10) : undefined;

          if (major !== 3) {
            throw new UnsupportedOpenQASMVersionError(
              `Unsupported OpenQASM version detected: ${majorVersion}.${minor ?? 0}`,
            );
          }

          return [Token.OpenQASM];
        }
        return this.readKeywordOrIdentifier(char);
      case '"': {
        const stringLiteral = char + this.readStringLiteral('"');
        return [Token.String, stringLiteral];
      }
      case "’": {
        const singleStringLiteral = char + this.readStringLiteral("’");
        return [Token.String, singleStringLiteral];
      }
      default:
        if (isLetter(char)) {
          return this.readKeywordOrIdentifier(char);
        } else if (isNumeric(char)) {
          const num = char + this.readNumeric();
          if (num.indexOf(".") != -1) {
            return [Token.Real, parseFloat(num)];
          } else if (num.indexOf("_") != -1) {
            return [Token.Integer, num];
          } else {
            return [Token.NNInteger, parseInt(num)];
          }
        } else {
          return [Token.Illegal];
        }
    }
  };

  /**
   * Returns the line number where the current cursor is located.
   * @param cursor - The current cursor position in the input string.
   * @return The line number.
   */
  getLineNumber = (cursor: number): number => {
    return this.input
      .substring(0, cursor)
      .split(/\n|\r(?!\n)|\u2028|\u2029|\r\n/).length;
  };

  /**
   * Returns the current line of code where the cursor is located.
   * @param cursor - The current cursor position in the input string.
   * @return The specific line where the cursor is located.
   */
  getCurrentLine = (cursor: number): string => {
    const lines = this.input.split(/\n|\r(?!\n)|\u2028|\u2029|\r\n/);
    const lineNumber = this.getLineNumber(cursor);
    return lines[lineNumber - 1];
  };

  /**
   * Retruns an identifier or gate modifier.
   */
  lexGateModifier = (keyword: string): [Token, (number | string)?] => {
    let offset = 1;
    let currChar = "";
    while (
      this.cursor + offset < this.input.length &&
      this.input[this.cursor + offset] !== ";"
    ) {
      currChar = this.input[this.cursor + offset];
      if (currChar === "@") {
        break;
      }
      offset++;
    }
    if (currChar === "@") {
      switch (keyword) {
        case "ctrl":
          return [Token.Ctrl];
        case "negctrl":
          return [Token.NegCtrl];
        case "inv":
          return [Token.Inv];
        case "pow":
          return [Token.PowM];
      }
    }
    return this.readKeywordOrIdentifier(keyword);
  };
}
export default Lexer;
