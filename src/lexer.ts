import { Token, lookup } from './token';
import { BadEqualsError, MissingSemicolonError } from './errors';

/**
 * Returns whether a given character could be an element of a numeric value.
 * @param c - The character.
 * @return Whether the character is numeric.
 */
function isNumeric(c:string): boolean {
    return (c == '.') || !isNaN(parseInt(c));
}

/**
 * Returns whether a given character is a letter.
 * @param c - The character.
 * @return Whether the character is a letter.
 */
function isLetter(c:string): boolean {
    if (c.match(/[a-z]/i)) {
       return true;
    }

    return false;
}

/**
 * Returns whether a given character is alphanumeric.
 * @param c - The character.
 * @return Whether the character is alphanumeric.
 */
function isAlpha(c:string): boolean {
    if (c.match(/[0-9a-zA-Z]+$/)) {
       return true;
    }
    return false;
}

function isUnicode(c:string): boolean {
    if (c.match(/^\u0000-\u00ff/)) {
        return true;
    }
    return false;
}

/**
 * Returns whether a given character is a newline character.
 * @param c - The character.
 * @return Whether the character is a newline.
 */
function isNewline(c:string): boolean {
    if (c.match(/\n|\r(?!\n)|\u2028|\u2029|\r\n/g)) {
       return true;
    }
    return false;
}

/** Class representing a lexer. */
class Lexer {
    /** The string to lex. */
    input:string;
    /** The lexer's current cursor location. */
    cursor:number;
    /**
     * Creates a lexer.
     * @param input - The string to lex.
     * @param cursor - The starting cursor position.
     */
    constructor(input:string, cursor:number = 0) {
       this.input = input;
       this.cursor = cursor;
    }
    verifyInput = (): boolean => {
       const lines = this.input.split(/\n|\r(?!\n)|\u2028|\u2029|\r\n/g);
       for(let i = 0; i < lines.length; i++) {
           if (
                !lines[i].startsWith('//')
                && !(lines[i].length == 0)
                && !(lines[i].includes('gate'))
                && !(lines[i].trim() == '{' || lines[i].trim() == '}') 
                && !lines[i].includes(';')
            ){
                return false;
            }
        }
        return true;
    }

    /**
     * Calling this method lexes the code represented by the provided string.
     * @return An array of tokens and their corresponding values.
     */
    lex = (): Array<[Token, (number | String)?]> => {
        let tokens:Array<[Token, (number | String)?]> = [];
        let token:[Token, (number | String)?];
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
    }
    
    /**
    * Reads a character and advances the cursor.
    * @param num - Optional cursor position modifier.
    */
    readChar = (num:number=1): string => {
        this.cursor += num;
        return this.input[this.cursor - num];
    }

    /**
     * Advances the cusor past the next comment.
     */
    skipComment = () => {
        let char = '';
        while(!isNewline(char)) {
          char = this.readChar();
        } 
    }

    /**
     * Determines whether the next character to process equals a given character.
     * @param c - The given character.
     * @return Whether the next character equals the given character.
     */
    peekEq = (c:string): boolean => (this.peek() == c);

    /**
     * Reads a character without advancing the cursor.
     * @param index - Optional peek position offset.
     */
    peek = (): string => this.input[this.cursor]
        
    /**
     * Reads a numeric value.
     * @return The numeric value as a string.
     */
    readNumeric = (): string => {
        let num = '';
        while (isNumeric(this.peek())) {
            num += this.readChar();
        }
        return num;
    }

    /**
     * Reads an identifier.
     * @return The identifier as a string.
     */
    readIdentifier = (): string => {
        let id = '';
        let next = this.peek();
        while (isAlpha(next) || next == "_" || isUnicode(next)) {
            id += this.readChar();
            next = this.peek();
        }
        return id;
    }

    /**
     * Reads a string literal.
     * @param terminator - The literal's termination character.
     * @return The literal as a string.
     */
    readStringLiteral = (terminator:string): string => {
        let lit = '';
        let char = '';
        while (!(terminator == char)) {
            char = this.readChar();
            lit += char; 
        }
        return lit; 
    }

    /**
     * Advances the cusor past the next block of whitespace.
     */
    skipWhitespace = (): null => {
        while (' \t\n\r\v'.indexOf(this.peek()) > -1) {
            this.cursor += 1;
        }
        return null;
    }

    /**
     * Lexes the next token.
     * @return The next token and its corresponding value.
     */
     nextToken = (): [Token, (number | String)?] => {
        this.skipWhitespace();

        if (this.cursor == this.input.length) {
           return [Token.EndOfFile];
        }

        let char = this.peek();
        this.readChar();

        switch(char) {
            case '=':
               if (this.peekEq('=')) {
                  this.readChar();
                  return [Token.Equals];
                } else {
                  throw BadEqualsError;
                } 
            case '-':
               if (this.peekEq('>')) {
                  this.readChar();
                  return [Token.Arrow];
                } else {
                  return [Token.Minus];
                } 
            case '+':
               return [Token.Plus];
            case '*':
                return [Token.Times];
            case '^':
                return [Token.Power];
            case ';':
                return [Token.Semicolon];
            case ',':
                return [Token.Comma];
            case '(':
                return [Token.LParen];
            case '[':
                return [Token.LSParen];
            case '{':
                return [Token.LCParen];
            case ')':
                return [Token.RParen];
            case ']':
                return [Token.RSParen];
            case '}':
                return [Token.RCParen];
            case '/':
                if (this.peekEq('/')) {
                    this.skipComment();
                    return;
                } else {
                    return [Token.Divide];
                } 
            case 'g':
                if ((this.input[this.cursor] == 'a')
                    && (this.input[this.cursor + 1] == 't') 
                    && (this.input[this.cursor + 2] == 'e') 
                ){
                        this.readChar(3);
                        return [Token.Gate];
                }
                let literal = char + this.readIdentifier();
                return [lookup(literal), new String(literal)];
            case 'q':
                if ((this.input[this.cursor] == 'r')
                    && (this.input[this.cursor + 1] == 'e') 
                    && (this.input[this.cursor + 2] == 'g') 
                ){
                    this.readChar(3);
                    return [Token.QReg];
                 }
                 let qregLit = char + this.readIdentifier();
                 return [lookup(qregLit), new String(qregLit)];
            case 'c':
                if ((this.input[this.cursor] == 'r')
                    && (this.input[this.cursor + 1] == 'e') 
                    && (this.input[this.cursor + 2] == 'g') 
                ){
                    this.readChar(3);
                    return [Token.QReg];
                 }
                 let cregLit = char + this.readIdentifier();
                 return [lookup(cregLit), new String(cregLit)];
            case 'b':
                if ((this.input[this.cursor] == 'a')
                    && (this.input[this.cursor + 1] == 'r') 
                    && (this.input[this.cursor + 2] == 'r') 
                    && (this.input[this.cursor + 3] == 'i') 
                    && (this.input[this.cursor + 4] == 'e') 
                    && (this.input[this.cursor + 5] == 'r') 
                ){
                    this.readChar(6);
                    return [Token.Barrier];
                }
                let barLit = char + this.readIdentifier();
                return [lookup(barLit), new String(barLit)];
            case 'm':
                if ((this.input[this.cursor] == 'e')
                    && (this.input[this.cursor + 1] == 'a') 
                    && (this.input[this.cursor + 2] == 's') 
                    && (this.input[this.cursor + 3] == 'u') 
                    && (this.input[this.cursor + 4] == 'r') 
                    && (this.input[this.cursor + 5] == 'e') 
                ){
                    this.readChar(6);
                    return [Token.Measure];
                }
                let measureLit = char + this.readIdentifier();
                return [lookup(measureLit), new String(measureLit)];
            case '\"':
                let stringLiteral = char + this.readStringLiteral('\"');
                return [Token.String, new String(stringLiteral)];
            case '\’':
                let singleStringLiteral = char + this.readStringLiteral('\’');
                return [Token.String, new String(singleStringLiteral)];
            default:
                if (isLetter(char)) {
                    let literal = char + this.readIdentifier();
                    return [lookup(literal), new String(literal)];
                } else if (isNumeric(char)) {
                    let num = char + this.readNumeric();
                    if (num.indexOf('.') != -1) {
                        return [Token.Real, parseFloat(num)];
                    } else {
                        return [Token.NNInteger, parseFloat(num)];
                    }
                } else {
                    return [Token.Illegal];
                } 
        }
    }
}
export default Lexer;
     