import { Token, lookup } from "./token";
import {
  BadEqualsError,
  MissingSemicolonError,
  UnsupportedOpenQASMVersionError,
} from "./errors";
import { OpenQASMMajorVersion, OpenQASMVersion } from "./version";

/**
 * Returns whether a given character could be an element of a numeric value.
 * @param c - The character.
 * @return Whether the character is numeric.
 */
function isNumeric(c: string): boolean {
  return c == "." || !isNaN(parseInt(c));
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
  /** The OpenQASM version. */
  version: OpenQASMVersion;
  /**
   * Creates a lexer.
   * @param input - The string to lex.
   * @param cursor - The starting cursor position.
   */
  constructor(input: string, cursor: number = 0) {
    this.input = input;
    this.cursor = cursor;
    // Default to OpenQASM 3.0.
    this.version = new OpenQASMVersion(OpenQASMMajorVersion.Version3);
  }
  verifyInput = (): boolean => {
    const lines = this.input.split(/\n|\r(?!\n)|\u2028|\u2029|\r\n/g);
    for (let i = 0; i < lines.length; i++) {
      if (
        !lines[i].startsWith("//") &&
        !(lines[i].length == 0) &&
        !lines[i].includes("gate") &&
        !(lines[i].trim() == "{" || lines[i].trim() == "}") &&
        !lines[i].includes(";")
      ) {
        return false;
      }
    }
    return true;
  };

  /**
   * Calling this method lexes the code represented by the provided string.
   * @return An array of tokens and their corresponding values.
   */
  lex = (): Array<[Token, (number | string)?]> => {
    const tokens: Array<[Token, (number | string)?]> = [];
    let token: [Token, (number | string)?];
    if (!this.verifyInput()) {
      throw MissingSemicolonError;
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

  // TODO : Should this method check if its reached the end of the file?
  // In that case would return a boolean value. Prevents users of the method
  // to have to do their own checking on the cursor.
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
      case "=":
        if (this.peekEq("=")) {
          this.readChar();
          return [Token.Equals];
        } else {
          throw BadEqualsError;
        }
      case "-":
        if (this.peekEq(">")) {
          this.readChar();
          return [Token.Arrow];
        } else {
          return [Token.Minus];
        }
      case "+":
        return [Token.Plus];
      case "*":
        return [Token.Times];
      case "^":
        return [Token.Power];
      case ";":
        return [Token.Semicolon];
      case ",":
        return [Token.Comma];
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
      case "/":
        if (this.peekEq("/")) {
          this.skipComment();
          return;
        } else {
          return [Token.Divide];
        }
      case "g":
        if (
          this.input[this.cursor] == "a" &&
          this.input[this.cursor + 1] == "t" &&
          this.input[this.cursor + 2] == "e"
        ) {
          this.readChar(3);
          return [Token.Gate];
        }
        {
          const literal = char + this.readIdentifier();
          return [lookup(literal), literal];
        }
      case "q":
        if (
          this.input[this.cursor] == "r" &&
          this.input[this.cursor + 1] == "e" &&
          this.input[this.cursor + 2] == "g"
        ) {
          this.readChar(3);
          return [Token.QReg];
        } else if (
          this.version.isVersion3() &&
          this.input[this.cursor] == "u" &&
          this.input[this.cursor + 1] == "b" &&
          this.input[this.cursor + 2] == "i" &&
          this.input[this.cursor + 3] == "t"
        ) {
          this.readChar(4);
          return [Token.Qubit];
        }
        {
          const qregLit = char + this.readIdentifier();
          return [lookup(qregLit), qregLit];
        }
      case "c":
        if (
          this.input[this.cursor] == "r" &&
          this.input[this.cursor + 1] == "e" &&
          this.input[this.cursor + 2] == "g"
        ) {
          this.readChar(3);
          return [Token.CReg];
        }
        {
          const cregLit = char + this.readIdentifier();
          return [lookup(cregLit), cregLit];
        }
      case "b":
        if (
          this.input[this.cursor] == "a" &&
          this.input[this.cursor + 1] == "r" &&
          this.input[this.cursor + 2] == "r" &&
          this.input[this.cursor + 3] == "i" &&
          this.input[this.cursor + 4] == "e" &&
          this.input[this.cursor + 5] == "r"
        ) {
          this.readChar(6);
          return [Token.Barrier];
        } else if (
          this.version.isVersion3() &&
          this.input[this.cursor] == "i" &&
          this.input[this.cursor + 1] == "t"
        ) {
          this.readChar(2);
          return [Token.Bit];
        }
        {
          const barLit = char + this.readIdentifier();
          return [lookup(barLit), barLit];
        }
      case "m":
        if (
          this.input[this.cursor] == "e" &&
          this.input[this.cursor + 1] == "a" &&
          this.input[this.cursor + 2] == "s" &&
          this.input[this.cursor + 3] == "u" &&
          this.input[this.cursor + 4] == "r" &&
          this.input[this.cursor + 5] == "e"
        ) {
          this.readChar(6);
          return [Token.Measure];
        }
        {
          const measureLit = char + this.readIdentifier();
          return [lookup(measureLit), measureLit];
        }
      // Both version string formats like `OPENQASM` and `OpenQASM` are supported.
      // This is because the OpenQASM 3.0 documentation shows an example of a version
      // string as `OPENQASM x.x;` whereas the `Circuit Header` section on page 8 of
      // the OpenQASM 3.0 paper gives an example of `OpenQASM x.x;`.
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
          let offset = 7;
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
            isNumeric(this.input[this.cursor + offset])
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
              isNumeric(this.input[this.cursor + offset])
            ) {
              minorVersion += this.input[this.cursor + offset];
              offset++;
            }
          }

          // Parse major and minor versions
          const major = parseInt(majorVersion, 10);
          const minor = minorVersion ? parseInt(minorVersion, 10) : undefined;

          if (major == 2) {
            this.version = new OpenQASMVersion(
              OpenQASMMajorVersion.Version2,
              minor,
            );
          } else if (major == 3) {
            this.version = new OpenQASMVersion(
              OpenQASMMajorVersion.Version3,
              minor,
            );
          } else {
            throw new UnsupportedOpenQASMVersionError(
              `Unsupported OpenQASM version: ${majorVersion}.${minor ?? 0}`,
            );
          }

          this.readChar(offset);
          return [Token.OpenQASM];
        }
        {
          const openQasmLit = char + this.readIdentifier();
          return [lookup[openQasmLit], openQasmLit];
        }
      case "i":
        if (
          this.input[this.cursor] == "n" &&
          this.input[this.cursor + 1] == "c" &&
          this.input[this.cursor + 2] == "l" &&
          this.input[this.cursor + 3] == "u" &&
          this.input[this.cursor + 4] == "d" &&
          this.input[this.cursor + 5] == "e"
        ) {
          this.readChar(6);
          return [Token.Include];
        }
        {
          const includeLit = char + this.readIdentifier();
          return [lookup(includeLit), includeLit];
        }
      case "o":
        if (
          this.input[this.cursor] == "p" &&
          this.input[this.cursor + 1] == "a" &&
          this.input[this.cursor + 2] == "q" &&
          this.input[this.cursor + 3] == "u" &&
          this.input[this.cursor + 4] == "e"
        ) {
          this.readChar(5);
          return [Token.Opaque];
        }
        {
          const opaqueLit = char + this.readIdentifier();
          return [lookup(opaqueLit), opaqueLit];
        }
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
          const literal = char + this.readIdentifier();
          return [lookup(literal), literal];
        } else if (isNumeric(char)) {
          const num = char + this.readNumeric();
          if (num.indexOf(".") != -1) {
            return [Token.Real, parseFloat(num)];
          } else {
            return [Token.NNInteger, parseFloat(num)];
          }
        } else {
          return [Token.Illegal];
        }
    }
  };
}
export default Lexer;
