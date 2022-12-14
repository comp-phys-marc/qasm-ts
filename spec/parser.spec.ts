import 'jasmine';
import * as fs from 'fs';
import Parser from '../src/parser';
import deutsch_tokens from './tokens/ibmqx2/Deutsch_Algorithm';
import deutsch_ast from './asts/ibmqx2/Deutsch_Algorithm';

const tokens = {
    'Deutsch_Algorithm.ts': deutsch_tokens
};

const asts = {
    'Deutsch_Algorithm.ts': deutsch_ast
};

describe('parser', () => {
    describe('parse', () => {
        it('should parse generic tokens correctly', () => {
            fs.readdir('spec/tokens/generic', (error, fileNames) => {
                if (!error) {
                    fileNames.forEach((scriptName) => {
                        console.log(`parsing ${scriptName}...`);

                        if (Object.keys(asts).includes(scriptName)) {
                            let lexed = tokens[scriptName];
                            let ast = asts[scriptName];

                            let passingParser = new Parser(lexed);
                            let out = passingParser.parse();

                            expect(out.length).toEqual(ast.length);
                            
                            for (let i = 0; i < out.length; i++) {
                                expect(out[i]).toEqual(ast[i]);
                            }
                        } else {
                            console.log(`tests incomplete for ${scriptName}!`);
                        }
                    });
                }
            });
        });
        it('should parse ibmqx2 tokens correctly', () => {
            fs.readdir('spec/tokens/ibmqx2', (error, fileNames) => {
                if (!error) {
                    fileNames.forEach((scriptName) => {
                        console.log(`parsing ${scriptName}...`);

                        if (Object.keys(asts).includes(scriptName)) {
                            let lexed = tokens[scriptName];
                            let ast = asts[scriptName];

                            let passingParser = new Parser(lexed);
                            let out = passingParser.parse();

                            expect(out.length).toEqual(ast.length);
                            
                            for (let i = 0; i < out.length; i++) {
                                expect(out[i]).toEqual(ast[i]);
                            }
                        } else {
                            console.log(`tests incomplete for ${scriptName}!`);
                        }
                    });
                }
            });
        });
    });
});