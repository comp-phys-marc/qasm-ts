import 'jasmine';
import * as fs from 'fs';
import Lexer from '../src/lexer';
import Parser from '../src/parser';
import deutsch_tokens from './tokens/ibmqx2/Deutsch_Algorithm';
import deutsch_ast from './asts/ibmqx2/Deutsch_Algorithm';

const TOKENS = {
    'spec/qasm/generic/Deutsch_Algorithm': deutsch_tokens
};

const ASTS = {
    'spec/qasm/generic/Deutsch_Algorithm': deutsch_ast
};


/** This class manages token and AST snapshot used for specs. */
class Snapshots {

    /** The set of registered lexed tokens. */
    tokens: Object;

    /** The set of registered parsed ASTs. */
    asts: Object;
    
    /**
     * Creates a Snapshots instance.
     * @param tokens - Name-indexed token sets.
     * @param asts - Name-indexed asts.
     */
    constructor(tokens: Object, asts: Object) {
        this.tokens = tokens;
        this.asts = asts;
    }

    /** 
     * This update method lexes the script associated with each registered token set,
     * and compares the output to the existing token set. If there is any change,
     * an error is raised.
     */
    updateTokens() {
        Object.keys(this.tokens).forEach((scriptName) => {
            console.log(`lexing ${scriptName}...`);

            let qasm = fs.readFileSync(`${scriptName}.qasm`, 'utf8');

            let tokens = this.tokens[scriptName];
            let passingLexer = new Lexer(qasm);
            
            let out = passingLexer.lex();
            // console.log(out);

            if (tokens !== null) {
                expect(out.length).toEqual(tokens.length);
            
                for (let i = 0; i < out.length; i++) {
                    for (let j = 0; j < out[i].length; j++) {
                        expect(out[i][j]).toEqual(tokens[i][j]);
                    }
                }
            }
            else {
                let fileName = `${scriptName.replace('qasm', 'tokens')}.ts`;

                fs.stat(fileName, (err, stat) => {
                    if(err.code === 'ENOENT') {
                        fs.writeFileSync(fileName, `export default ${out};`);
                    }
                    console.log(`Please import ${fileName}.ts in snapshots.ts for snapshot tests!`);
                });
            }
        });
    }

    /** 
     * This update method parses the script associated with each registered AST,
     * and compares the output to the existing AST. If there is any change,
     * an error is raised.
     */
    updateAsts() {
        Object.keys(this.asts).forEach((scriptName) => {
            console.log(`parsing ${scriptName}...`);

            let lexed = this.tokens[scriptName];
            let ast = this.asts[scriptName];
            
            let passingParser = new Parser(lexed);
            let out = passingParser.parse();
            // console.log(out);

            if (ast !== null) {
                expect(out.length).toEqual(ast.length);

                for (let i = 0; i < out.length; i++) {
                    expect(out[i]).toEqual(ast[i]);
                }
            }
            else {
                let fileName = `${scriptName.replace('qasm', 'asts')}.ts`;

                fs.stat(fileName, (err, stat) => {
                    if(err.code === 'ENOENT') {
                        fs.writeFileSync(fileName, `export default ${out};`);
                    }
                    console.log(`Please import ${fileName}.ts in snapshots.ts for snapshot testing!`);
                });
            }
        });
    }
}