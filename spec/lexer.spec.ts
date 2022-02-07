import 'jasmine';
import * as fs from 'fs';
import Lexer from '../src/lexer';
import deutsch_tokens from './tokens/ibmqx2/Deutsch_Algorithm';
import { BadGateError, MissingSemicolonError } from '../src/errors';

const tokenSets = {
    'Deutsch_Algorithm.qasm': deutsch_tokens
};

describe('lexer', () => {
    describe('lex', () => {
        it('should lex generic QASM code correctly', () => {
            fs.readdir('spec/qasm/generic', (error, fileNames) => {
                if (!error) {
                    fileNames.forEach((scriptName) => {
                        console.log(`lexing ${scriptName}...`);

                        let qasm = fs.readFileSync(`spec/qasm/generic/${scriptName}`, 'utf8');
                        
                        if (Object.keys(tokenSets).includes(scriptName)) {
                            let tokens = tokenSets[scriptName];

                            let passingLexer = new Lexer(qasm);
                            let out = passingLexer.lex();

                            console.log(out);

                            expect(out.length).toEqual(tokens.length);
                            
                            for (let i = 0; i < out.length; i++) {
                                for (let j = 0; j < out[i].length; j++) {
                                    expect(out[i][j]).toEqual(tokens[i][j]);
                                }
                            }
                        } else {
                            console.log(`tests incomplete for ${scriptName}!`);
                        }
                    });
                }
            });
        });
        it('should lex ibmqx2 code correctly', () => {
            fs.readdir('spec/qasm/ibmqx2', (error, fileNames) => {
                if (!error) {
                    fileNames.forEach((scriptName) => {
                        console.log(`lexing ${scriptName}...`);

                        let qasm = fs.readFileSync(`spec/qasm/ibmqx2/${scriptName}`, 'utf8');
                        
                        if (Object.keys(tokenSets).includes(scriptName)) {
                            let tokens = tokenSets[scriptName];

                            let passingLexer = new Lexer(qasm);
                            let out = passingLexer.lex();

                            expect(out.length).toEqual(tokens.length);
                            
                            for (let i = 0; i < out.length; i++) {
                                for (let j = 0; j < out[i].length; j++) {
                                    expect(out[i][j]).toEqual(tokens[i][j]);
                                }
                            }
                        } else {
                            console.log(`tests incomplete for ${scriptName}!`);
                        }
                    });
                }
            });
        });
        it('should raise missing semicolon error when a semicolon is missing', () => {
            let qasm = fs.readFileSync(`spec/qasm/invalid/missing_semicolon.qasm`, 'utf8');

            let failingLexer = new Lexer(qasm);
            expect(failingLexer.lex).toThrow(MissingSemicolonError);
        });
    });
});