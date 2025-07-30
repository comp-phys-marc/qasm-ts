---
author:
- "Sean Kim[^1]"
- "Marcus Edwards[^2]"
bibliography:
- main.bib
date: July 2025
title: Enabling the Verification and Formalization of Hybrid
  Quantum-Classical Computing with OpenQASM 3.0 compatible QASM-TS 2.0
---

# Abstract

The unique features of the hybrid quantum-classical computing model
implied by the specification of OpenQASM 3.0 motivate new approaches to
quantum program verification. We implement and thoroughly test a QASM 3.0 
parser in TypeScript to enable implementations of verification and validation
software, compilers and more. We also propose that a formal treatment of
OpenQASM 3.0's type system in type theory notation may further
facilitate formal verification. We highlight advancements in hybrid
quantum-classical computing since the Quantum Hoare Logic to this end
[@ying_floyd--hoare_2012].

# Introduction

For over ten years, researchers have thought about quantum programming
languages from a formal standpoint [@exman_verification_2024]. An
excellent example of the formalization of quantum programming was the
creation of the Floyd-Hoare logic for quantum programming by Ying in
2012 [@ying_floyd--hoare_2012] named the Quantum Hoare Logic (QHL).
Recent contributions such as OpenQASM 3.0's type system are documented,
[@noauthor_types_nodate] but not formally. The formal definition of
quantum programming models has therefore fallen behind in recent years.
We implement an up-to-date OpenQASM 3.0 parser in TypeScript, take steps
towards formalizing the type system and suggest extensions of the QHL to
account for QASM 3.0's additions to the quantum programming model with
its introduction of classical logic, functions, etc. This would aim to
extend the QHL model beyond its basis as a while-language with
variables, assignments, unitary operations and measurements. We aim to
help the community to formalize the logic of hybrid quantum-classical
computing by providing tools that may help with such efforts.

Hand-in-hand with formalization efforts are the development of community
standards for quantum programming, which are valubale in their own
right. The standardization of quantum computer programming is ongoing
[@di_matteo_abstraction_2024; @Cross_2022] and relies significantly on
open source software and frameworks including some released only this
year [@seidel2024qrispframeworkcompilablehighlevel; @qdmi]. Some
community standards such as the 2022 Open Quantum Assembly (OpenQASM)
3.0 specification boast typing as well as interoperability and
portability between quantum systems of different types such as
superconducting, nuclear magnetic resonance, photonic, spin-qubit, ion
trap, or neutral atom based setups. However, others such as the QUASAR
instruction set architecture assume some backend details such as a
classical co-processor to complement our Quantum Processing Unit (QPU)
[@shammah_open_2024]. To what extent the classical surrounds of a
quantum processing unit should be assumed or specified and at what part
of the stack is an open question. This "piping" can leverage many
classical programming paradigms including web technology. What we refer
to here is distinct from cloud quantum computing which simply offers a
web-accessible front-end to users of quantum computers. Instead, we are
interested in parts of the programming model itself, such as pieces of
the compile toolchain (compilers, transpilers, assemblers, noise
profilers, schedulers), which are implemented using web technology. An
example of this is Quantinuum's QEC decoder toolkit which uses a
WebAssembly (WASM) virtual machine (WAVM) as a real-time classical
compute environment for QEC decoding [@noauthor_qec_nodate]. They also
use QASM to implement QASM $extern$ calls. Other examples include our
ports of Quantum Assembly (QASM), Quantum Macro Assembler (QMASM) and
Blackbrid to TypeScript [@edwards_three_2023].

An important part of standardization is verification, since any
agreed-upon standard must specify a way to express programs which are
correct. By our typed implementation of an OpenQASM 3.0 parser, we
implement a system that infers types from QASM syntax. This opens the
door to the type based formal verification of QASM code. A body of work
exists regarding the verification of quantum software, which is
summarized in [@exman_verification_2024].

What one will immediately notice when reading [@exman_verification_2024]
is that 75% of the quantum software verification tools in existence are
either unavailable or unusable in 2024. This gives us a picture of the
quantum open source community that still very much needs to meet the
call of Zeng et. al. to become a community that "nurture\[s\] an
ecosystem of software" [@zeng_first_2017]. With the qasm-ts package,
which has been available on npm, downloaded by hundreds, and maintained
for the last 3 years, we commit to providing a key tool for web-stack
based quantum computing that is available and usable. We demonstrate
this commitment is real by our update to OpenQASM 3.0 and implementation
of a new test suite in 2024.

We believe this should set the stage for further work that takes
advantage of tokenization, parsing and typing such as compilers
implemented using type-dispatch. We also hope that efforts related to
the formal verification of hybrid quantum-classical programs may be
accelerated.

# Motivation

The OpenQASM 3.0 type system is distinct from Quantum Hoare Logic in
several ways. Most interestingly, the type system supports classical and
quantum types as well as functions which can be used to specify hybrid
quantum-classical programs. Consider the following example of a hybrid
program.

A quantum computer representing a node in a network of quantum computers
performs a simple calculation based on Grover's algorithm
[@edwards2023quantumhonestbyzantineagreement]. This allows the network
to perform a quantum consensus algorithm. The algorithm run on each
quantum node is parameterized classically. Essentially, we replace the
oracle of Grover's algorithm with a parameterized gate according to the
following algorithm (limited to two inputs and four qubits for the sake
of brevity).

    OPENQASM 3;
    include "stdgates.inc";

    const n = 4 // number of qubits in the input and output register combined
    qubit[n] q; // a register 'q' of n qubits
    bit[n] c; // a register 'c' of n classical bits

    float[32] b = 0.2  // the first param is the bias which weights the |0> state

    // the node receives a number of inputs, in theis example we define two

    // the first input in a triple (B0, ID0, w0)

    bool B0 = false;  // the classical parameter B with an example value
    array[bool, n/2] ID0 = [true, false];  // the classical parameter ID with an example value
    float[32] w0 = 0.8;  // the weight parameter with an example value

    // the second input in a triple (B1, ID1, w1)

    bool B1 = true;
    array[bool, n/2] ID1 = [false, true];
    float[32] w1 = 0.7;

    // we the Grover diffusion operator on two qubits
    gate D a, b
    {
        h a;
        h b;
        z a;
        z b;
        cz a, b;
        h a;
        h b;
    }


    // we put the output register in a superposition
    for i in [n/2:n-1] {
        h q[i];
    }


    // we calculate the number of times the oracle + diffusion should be applied for each input triple

    def repititons(float w0, float w1) -> float {
        return floor(b + ((w0 - (w0 + w1) / 2) / sqrt((1 / 2) (pow(w0 - ((w0 + w1) / 2), 2) + pow(w1 - ((w0 + w1) / 2), 2)))));
    }

    // oracle definition
    gate Oracle(B, ID) q
    {
      if(B == false) {
        for i in [0:n/2-1] {
            x q[i];
        }
      }

      if(ID == [true, false]) {
        cz q[0], q[n/2];
      }
      if(ID == [false, true]) {
        cz q[1], q[n/2 + 1];
      }
      if(ID == [true, true]) {
        ctrl @ ctrl @ z @ z q[0], q[1], q[n/2], q[n/2 + 1];
      }
    }

    // perofrm the competitive search

    for k in [0:repititions(w0, w1)] { 
        Oracle(B0, ID0) q;
        D q[n/2], q[n/2 + 1]; 
    }

    for k in [0:repititions(w1, w0)] { 
        Oracle(B1, ID1) q;
        D q[n/2], q[n/2 + 1]; 
    }

    c = measure q; // measure quantum register

This algorithm is an example of a hybrid algorithm with classical and
quantum contexts. For example, the context of the repetitions function
involves several classical type bindings and is also quantum-free in the
sense that the function can be executed efficiently on a classical
computer. The type theory for this is completely classical and
straightforward. Note that a more complete list of inference rules is
provided in the appendices.

$$\begin{aligned}
    &infer : (Context, Expr) \rightarrow Type \\
    &infer(\Gamma, e) = \textbf{match} \; \text{e} \;  \textbf{where} \\\end{aligned}$$
$$\begin{aligned}
    &\dots \\
    \;\; &x \rightarrow lookup(\Gamma, x) \\
    \;\; &(\lambda w0:\tau_1, w1:\tau_1.e') \rightarrow &\textbf{let} \Gamma' = extend(\Gamma, w0: \tau_1, w1: \tau_1); \\
    &&\textbf{let} \tau_2 = infer(\Gamma', e'); \\
    && \tau_1 \rightarrow \tau_2\end{aligned}$$

These inference rules express that when we encounter a function with two
type bindings of the same type, we create a new context with these type
bindings and infer the type of the function body using this extended
context. Our function in this case has a return type matching its
inputs' type, so $\tau_2$ will actually evaluate to $\tau_1$.

$$\begin{aligned}
    \frac{\Gamma, w0: \tau_1, w1: \tau_1 \vdash e: \tau_1}{\Gamma  \vdash (\lambda w0: \tau_1, w1: \tau_1.e): \tau_1 \rightarrow \tau_1}\end{aligned}$$

This follows from the combination of simple rules that we would
reference when evaluating the types of each intermediate result in the
computation

$$\begin{aligned}
    N_i = \frac{w_{ki} - \bar{w_k}}{\sqrt{\frac{1}{l} \sum_{j=1}^l (w_{kj} - \bar{w_k})^2}}\end{aligned}$$

such as the rule for the negation of two floats

$$\begin{aligned}
    &\Gamma \vdash e_1: \tau_1 \\
    &\Gamma \vdash e_2: \tau_1 \\
    &\overline{\Gamma \vdash e_1 - e_2: \tau_1}\end{aligned}$$

We will have a similar rule for each of the sqrt, floor, division and
pow operations as well, but we will not list them all here.

So, in the end, if we use float\[32\] (as we do in our example) for all
our input values, the repetition function will give us back a
float\[32\]. If we gave it some other type $\tau_3$ (maybe float\[8\]?),
it would return something of type $\tau_3$.

This is a very boring example, but it means that we can call functions
within our program. We therefore need a rule for function application.

$$\begin{aligned}
    &\Gamma \vdash e_1: \tau_1 \rightarrow \tau_2 \\
    &\Gamma \vdash e_2: \tau_1 \\
    &\overline{\Gamma \vdash e_1 e_2: \tau_2}\end{aligned}$$

The Floyd-Hoare syntax of quantum programs previously defined is
generated by the following grammar [@ying_floyd--hoare_2012].

$$\begin{aligned}
    S ::= \textbf{skip} | q:=0|\bar{q}=U\bar{q}|S_1;S_2|\textbf{measure} \; M[\bar{q}]: \bar{S} | \textbf{while} \; M[\bar{q}] = 1 \; \textbf{do} \; S\end{aligned}$$

Here, $M$ is a POVM such as $\{M_0, M_1\}$ where $M_0 =\begin{bmatrix}
    1 & 0 \\
    0 & 0
\end{bmatrix}$, $M_1 = \begin{bmatrix}
    0 & 0 \\
    0 & 1
\end{bmatrix}$ which would give a computational basis measurement.
$\textbf{measure} M[\bar{q}]: \bar{S}$ is a measurement in the state
space of the quantum register $\bar{q}$. The $\bar{S} = \{S_m\}$ where
each $S_m$ denotes the quantum circuit corresponding to a measurement.
Each $M_m$ will be inserted at the end of the corresponding $S_m$
accordingly. $U \bar{q}$ indicates a unitary operator acting on the
quantum register. $q$ without the bar denotes a quantum variable.

It is clear to see already that our simple program in QASM 3.0 does not
fit into this description of a quantum program, as there is no grammar
in QHL for classical variables or functions. Things will become even
more complicated as we look at the custom Oracle gate which involves
classical and quantum logic in the same context. It is basically a
function with classical and quantum parameters. Indeed, QHL only allows
for a direct conditional control from a classical measurement line and
no intermediate classical logic at all.

There is need for formal analysis and verification of hybrid quantum
classical programs and we argue that mathematical frameworks and
software frameworks are needed to address this gap.

A step towards this could be to extend the QHL grammar to include custom
gates (hybrid functions), classical variables and classical functions.

This proposed grammar would introduce extra complexity especially in
terms of the type theory required to maintain the consistency of
quantum-classical programs with quantum, classical and hybrid contexts.
Rather than dive into the details of all of this type theory in an
attempt to extend Ying's (already 49 page) investigation of quantum
programs here, we implement and open source a parser and type
verification tool for the community which automates much of this
analysis and we hope should enable future investigations that may be
longer form.

# Implementation

In exploring the fundamental features and concepts introduced to the
OpenQASM 3.0 specification, the first consideration was backwards
comparability with the OpenQASM 2.0 specification. Given the maturity of
the OpenQASM 2.0 specification ecosystem and separate implementations in
other prominent OpenQASM 2.0 tooling
[@noauthor_qiskit_openqasm2_nodate], backwards compatibility was deemed
essential.

OpenQASM 3.0 introduces a wide array of both classical computational
instructions and keywords as well as new quantum instructions. To
maximize code clarity and maintainability, the 2.0 and 3.0 token sets,
AST classes, lexing logic, and parsing logic were split into
version-specific modules. This modular structure ensures that the
distinct syntax and semantic rules of each specification version are
encapsulated within their respective modules while simultaneously
sharing reusable functionality at higher levels of abstraction and
hiding version specific implementations from the user. Given the
complexity of the OpenQASM 3.0 specification, we will mainly be
describing the implementation for the 3.0 specification.

### Top Level Abstractions

At the user facing level, three abstractions are provided, the
*OpenQasmVersion* class, the *lex* function, and the *parse* function.
The *OpenQasmVersion* class serves as the basis for specifying and
managing versioning information within the codebase. The *lex* and
*parse* functions take an *OpenQasmVersion* instance and pass the source
QASM and corresponding tokens to the version specific lexer and parser.

Users can simply invoke the entire parsing process by calling the two
main package entry points:

-   *parseFile* - can be called with the path to a specific QASM file

-   *parseString* - can be called with a string containing QASM code

### Lexer

The lexing process involves scanning the raw QASM code and converting it
into a list of tokens. Version specific tokens are implemented as
TypeScript *enum* enumerations. The QASM 2.0 implementation contains 37
unique token variants and QASM 3.0 contains 100 unique token variants.

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
      ...
    }

In order to support the full array of new features provided in the
OpenQASM 3.0 specification, such as compound arithmetic operators (i.e.
\<=, +=), binary operators (i.e. &&, $||$), compound binary operators
(i.e. \<\<=, \^=), look-ahead is employed for multi-symbol grammar.

    ...
    case "<":
        if (this.peekEq("=")) {
          this.readChar();
          return [Token.BinaryOp, "<="];
        } else if (
          this.input[this.cursor] == "<" &&
          this.input[this.cursor + 1] == "="
        ) {
          this.readChar(2);
          return [Token.CompoundBinaryOp, "<<="];
        } else if (this.peekEq("<")) {
          this.readChar();
          return [Token.BinaryOp, "<<"];
        } else {
          return [Token.BinaryOp, "<"];
        }
    ...

### Parser

The parser makes use of the resulting tokens and outputs an abstract
syntax tree. Each node in the tree inherits from *AstNode*, the parent
class for all AST elements. The 3.0 *Parser* class maintains several
attributes for tracking state and defaults during parsing:

-   *tokens*: an array of token-value pairs being parsed

-   *gates*: set of built-in quantum gates introduced in the OpenQASM
    3.0 spec

-   *standardGates*: a set of the standard library gates (loaded via the
    *stdGates()* method when *include \"stdgates.inc\";* is encountered)

-   *customGates*: set of user-defined gates

-   *subroutines*: set of custom user-defined subroutines

-   *customArrays*: set of user-defined array aliases

-   *aliases*: map of user-defined aliases

-   *index*: current position in the token stream

-   *machineFloatWidth*: default machine-precision float

-   *machineIntSize*: default machine-sized integer

The parser implements recursive descent parsing with support for
expression precedence and type checking. The core parsing method
processes the token stream sequentially, delegating to the *parseNode()*
method, which handles individual statements and declarations. At a high
level, the parsing can be split into three logical sections: expression
parsing, quantum-specific parsing, and classical parsing.

Expression parsing forms the foundation for both quantum and classical
parsing by breaking down expressions into their constituent parts and
rebuilding them according to the mathematical and operator syntax
defined in the OpenQASM 3.0 official grammar
[@noauthor_qasm_grammar_nodate]. Starting with basic elements like
numbers, variables, and operators, the parser constructs an abstract
syntax tree that reflects proper operator precedence and nesting. For
example, in an expression like *"sin(2 \* x + y)"*, the parser first
identifies the individual tokens, then builds the *Arithmetic* node
(using the *PLUS* *ArithmeticOp* variant), applies the multiplication
(using the *TIMES* *ArithmeticOp* variant) with proper precedence, and
finally wraps everything as a *TrigFunction* node (using the *SIN*
*TrigFunctionTypes* variant). This process handles not only mathematical
operations but also array accesses, function calls, and parameter lists,
creating a structured representation that maintains the logical
relationships between all parts of the expression.

Quantum operation parsing manages the core quantum computing elements of
QASM, ensuring that quantum operations are syntactically correct. The
parser maintains strict tracking of quantum resources through its
*gates*, *standardGates*, and *customGates* sets, validating that each
quantum operation references only properly defined gates and qubits. It
processes quantum register declarations, custom gate definitions, gate
applications (including gate modifiers), measurement operations, and
timing-critical operations like barriers and delays. Each quantum
operation is validated in its context - for example, when parsing a gate
application, the parser verifies that the gate exists, that it's being
applied to the correct number of qubits, and that any modifiers or
parameters are properly specified.

The classical parsing processes classical variable declarations with
strict type checking, function definitions with parameter and return
type validation, control flow structures like conditional statements and
loops, and array operations. These classical elements can interact with
quantum operations - for instance, measurement results can be stored in
classical variables, and classical computations can determine which
quantum operations to apply. The parser maintains separate tracking for
classical and quantum resources while ensuring they can interact in
well-defined ways, creating a bridge between classical and quantum
computation that respects the requirements of both domains. This enables
QASM programs to express complex quantum algorithms that require
classical processing while maintaining type safety and operational
validity.

To demonstrate the parser's expression handling and type checking
capabilities, we examine key aspects of parsing the inverse quantum
Fourier transform algorithm
[inverseqft1.qasm](https://github.com/openqasm/openqasm/blob/main/examples/inverseqft1.qasm).
Consider the following conditional statement from the algorithm:

    if(int[4](c) == 1) { 
        rz(pi/4) q[2]; 
    }

The parser generates the following abstract syntax tree structure:

    {
        "__className__": "BranchingStatement",
        "condition": {
          "__className__": "Binary",
          "op": "==",
          "left": {
            "__className__": "Cast",
            "type": {
              "__className__": "IntType",
              "size": {
                "__className__": "IntegerLiteral",
                "value": 4
              }
            },
            "operand": {
              "__className__": "Identifier",
              "name": "c"
            }
          },
          "right": {
            "__className__": "IntegerLiteral",
            "value": 1
          }
        },
        "trueBody": {
          "__className__": "ProgramBlock",
          "statements": [
            {
              "__className__": "QuantumGateCall",
              "quantumGateName": {
                "__className__": "Identifier",
                "name": "rz"
              },
              "qubits": [
                {
                  "__className__": "SubscriptedIdentifier",
                  "name": "q",
                  "subscript": {
                    "__className__": "IntegerLiteral",
                    "value": 2
                  }
                }
              ],
              "parameters": {
                "__className__": "Parameters",
                "args": [
                  {
                    "__className__": "Arithmetic",
                    "op": "/",
                    "left": {
                      "__className__": "Pi"
                    },
                    "right": {
                      "__className__": "IntegerLiteral",
                      "value": 4
                    }
                  }
                ]
              },
              "modifiers": []
            }
          ]
        },
        "falseBody": null
      }

The AST stucture illustrates several fundamental capabilities of the
parsing system:

1.  The parser implements comprehensive type handling, as demonstrated
    by the explicit type cast *int\[4\](c)*. This generates a *Cast*
    node containing complete type information including size
    specifications.

2.  The rotation angle expression *pi/4* demonstrates the nature of
    expression parsing. The parser constructs a hierarchical tree of
    *Arithmetic* nodes that preserves both operator precedence and
    mathematical relationships.

3.  The structure illustrates the parser's integration of classical
    control flow (*BranchingStatement*), quantum operations
    (*QuantumGateCall*), and mathematical expressions within gate
    parameters.

The implementation achieves this through recursive descent parsing with
principled operator precedence handling. The following simplified code
excerpt demonstrates the core parsing methodology:

    parseNode(tokens: Array<[Token, (number | string)?]>): [Array<AstNode>, number] {
      const token = tokens[0];
      switch (token[0]) {
        case Token.If: {
          const [ifNode, ifConsumed] = this.ifStatement(tokens);
          return [[ifNode], ifConsumed];
        }
        // Additional cases
      }
    }

Our parser produces a strongly-typed AST that captures the full
structure of QASM programs and is designed to enable subsequent semantic
analysis. The AST nodes contain type information through classes like
*ClassicalType*, *Cast*, and *Parameters*, as well as tracking quantum
resources via *QuantumDeclaration* and *QuantumGateCall*. This
structured representation would allow semantic analysis passes to
validate type correctness, scope rules, and quantum resource usage. For
example, the detailed expression trees generated for gate parameters, as
shown in the inverse QFT example above, would enable verification that
all parameters evaluate to valid types and values for the gates being
called.

# Outcomes

Our comparative analysis focused on two promiment OpenQASM 3.0 parsers:
Qiskit's Python ANLTR-based reference implementation and Qiskit's
experimental Rust parser. Each implementation presents distinct
trade-offs in terms of performance, portability, and integration
capabilities.

## Reference ANTLR Parser

The Qiskit ANTLR parser serves as the reference implementation, offering
several advantages:

-   Direct derivation from the official OpenQASM 3 grammar, ensuring
    specification compliance.

-   Integration with the broader Qiskit ecosystem.

-   Mature error handling and diagnostic capabilities.

However, the qiskit module's ANTLR approach introduces runtime overhead
due to:

-   The intermediate ANTLR runtime layer.

-   Python interpretation overhead.

-   Complex dependency chain (qiskit-qasm3-import, openqasm).

## Experimental Rust Parser

Qiskit's native Rust-based parser represents a performance-focused
alternative with:

-   Native execution speed through Rust release optimized compilation.

-   Memory safety guarantees from Rust's ownership model.

-   Option to use native Rust crates or through integration with
    Qiskit's PyO3 Python bindings.

-   Additional semantic analysis capabilities, with the ability to
    produce abstract semantic graphs.

-   More robust diagnostic and error reporting.

However, the Rust parser has several limitations:

-   Platform-specific binary artifacts requiring separate compilation
    for different architectures.

-   Experimental status with:

    -   Limited documentation on supported OpenQASM 3.0 features.

    -   Unclear specification compliance boundaries.

    -   Testing infrastructure tied to code generation, requiring
        non-standard test execution.

-   Relatively young code base with minimum Rust compiler version
    requirements (rustc 1.70+).

## Qasm-ts

Our native TypeScript implementation offers several unique advantages
for web-based quantum computing:

-   Direct integration with web technologies and frameworks.

-   No compilation requirements for deployment.

-   Platform independence through JavaScript runtime.

-   Lightweight dependency footprint.

-   Standalone usage independent of larger frameworks.

The potential limitations include:

-   Javascript runtime overhead compared to native implementations.

-   Web-specific deployment considerations.

-   Node.js dependency for non-browser implementations.

-   No semantic analysis capabilities.

## Performance Benchmarking

To compare general performance implications across the three OpenQASM
parsers, a comprehensive benchmarking suite was developed. The
benchmarking suite includes:

1.  Controls for non-timed initialization warm up runs (handles
    compilation for Rust crate and server initialization for TypeScript
    package).

2.  Focuses purely on parsing performance by isolating AST generation
    (does not include Rust semantic analysis or Qiskit circuit
    conversion).

3.  Uses representative OpenQASM 3.0 programs including quantum Fourier
    transforms, quantum error correction, and teleportation circuits.

  Benchmark Results                                             
  ------------------- -------------------- -------------------- --------------------
  Result              ANTLR Parser         Rust Parser          Qasm-ts
  Success Rate        100% (11/11 files)   18.2% (2/11 files)   100% (11/11 files)
  Average Time        8.53 ms              0.59 ms              0.90 ms
  Min Time            1.93 ms              0.55 ms              0.36 ms
  Max Time            30.54 ms             0.62 ms              3.68 ms

The benchmarking reveals that when just taking into account the AST
generation, the Rust implementation generally offers superior raw
performance, but suffers from only currently supporting a subset of the
full OpenQASM 3.0 specification. The QASM-TS parser provides competitive
performance for web deployment scenarios, while the ANTLR parser offers
a balance of features and performance suitable for development and
testing.

# Discussion

The primary future direction that we see is the development of
verification tools such as static analysis tools based on QASM-TS in the
vein of QChecker [@zhao_qchecker_2023]. This could be complemented by a
formal type theory of OpenQASM 3.0.

Virtually every quantum computing company that provides access to
quantum computers has provided access through a hybrid cloud. This
demands that parts of the quantum computing stack be implemented in web
technology, and we argue that it is optimal in a sense to use technology
that is designed for this environment when we find ourselves working in
a hybrid quantum / classical cloud. Companies including Amazon,
Microsoft, Rigetti, D-Wave, Xanadu, Google, IBM and more have developed
unique cloud quantum computing systems which are mostly proprietary.
Strong open source communities are starting to grow around each of these
stacks however, living mostly in the realms of Python and Rust. We
suggest that a closer marriage of these open source efforts to the
inherently web based stack supporting existing quantum computing
offerings is desirable.

Tokenization is also useful not only for parsing and compiling, but
machine learning applications as well. A future direction might be to
apply machine learning techniques such as training an autoregressive
model to learn about sequences of our tokens, and therefore about
quantum algorithms. Learning on these token sequences may be compared to
learning on sets of statevectors, for example, and the differences might
be interesting to explore.

# Appendices

A further work might formally define the type system for OpenQASM 3.0.
We provide a (very short) start in this direction below.

## Literals

Our implementation of the language supports seven literal types, which
are described by the following BNF notation.

$$\begin{aligned}
    Boolean &::= 0 \; | \; 1 \\
    Binary &::= Boolean \; | \; Boolean \; Binary \\
    BaseEightDigit &::= Boolean \; | \; 2 \; | \; 3 \; | \; 4 \; | \; 5 \; | \; 6 \; | \; 7 \\
    Octal &::= BaseEightDigit \; | \; Octal \; BaseEightDigit \\
    BaseTenDigit &::= BaseEightDigit \; | \; 8 \; | \; 9 \\
    HexDigit & ::= BaseTenDigit \; | \; A \; | \; B \; | \; C \; | \; D \; | \; E \; | \; F \\
    HexaDecimal &::= HexDigit \; | \; HexDigit \; HexaDecimal \\
    Num &::= BaseTenDigit \; | \; BaseTenDigit \; Num \\
    PosNegNum &::= Num \; | \; +Num \; | \; -Num \\
    Float &::= PosNegNum \; | \; PosNegNum.Num \\
    Scientific &::= Float \; | \; Float \; e \; PosNegNum \\
    Imaginary &::= Float \; | \; Float \; Im \; | \; Float \; + \; Float \; Im \\
    TimeUnit &::= ns \; | \; us \; | \; ms \; | \; s \; | \; dt \\
    Duration &::= PosNegNum \; TimeUnit \\\end{aligned}$$

$$\begin{aligned}
    l &::= Boolean \\
        &| \;\; PosNegNum \\
        &| \;\;  Scientific \\
        &| \;\;  Binary \\
        &| \;\;  Octal \\
        &| \;\;  HexaDecimal \\
        &| \;\;  Float \\
        &| \;\;  Imaginary \\
        &| \;\;  Duration \\\end{aligned}$$

with types:

$$\begin{aligned}
    \tau_l &::= BooleanLiteral \\
        &| \; IntegerLiteral \\
        &| \; NumericLiteral \\
        &| \; FloatLiteral \\
        &| \; ImaginaryLiteral \\
        &| \; BitstringLiteral \\
        &| \; DurationLiteral \\\end{aligned}$$

These are mapped by the following inference rules.

$$\begin{aligned}
    &infer : Expr \rightarrow Type \\
    &infer(e) = \textbf{match} \; \text{e} \;  \textbf{where} \\\end{aligned}$$
$$\begin{aligned}
    \;\; Boolean &\rightarrow BooleanLiteral \\
    \;\; PosNegNum &\rightarrow IntegerLiteral \\
    \;\; Scientific \; | \; Binary \; | \; Octal \; | \; HexaDecimal &\rightarrow NumericLiteral \\
    \;\; Float &\rightarrow FloatLiteral \\ 
    \;\; Imaginary &\rightarrow ImaginaryLiteral \\ 
    \;\; Duration &\rightarrow DurationLiteral\end{aligned}$$

[^1]: skim658\@gwu.edu

[^2]: msedward\@student.ubc.ca
