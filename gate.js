// const handlers = {
//   AND: (inputs) => [[inputs[0][0] && inputs[1][0]]],
//   OR: (inputs) => [[inputs[0][0] || inputs[1][0]]],
//   NOT: (inputs) => [[!inputs[0][0]]],
//   INPUT: (inputs) => [[inputs[0][0]]],
//   INPUT1: (inputs) => [[inputs[0][0]]],
//   INPUT2: (inputs) => [[inputs[0][0], inputs[0][1]]],
//   INPUT4: (inputs) => [
//     [inputs[0][0], inputs[0][1], inputs[0][2], inputs[0][3]],
//   ],
//   INPUT6: (inputs) => [
//     [
//       inputs[0][0],
//       inputs[0][1],
//       inputs[0][2],
//       inputs[0][3],
//       inputs[0][4],
//       inputs[0][5],
//     ],
//   ],
//   INPUT8: (inputs) => [
//     [
//       inputs[0][0],
//       inputs[0][1],
//       inputs[0][2],
//       inputs[0][3],
//       inputs[0][4],
//       inputs[0][5],
//       inputs[0][6],
//       inputs[0][7],
//     ],
//   ],
//   OUTPUT: (inputs) => [[inputs[0][0]]],
//   OUTPUT1: (inputs) => [[inputs[0][0]]],
//   OUTPUT2: (inputs) => [[inputs[0][0], inputs[0][1]]],
//   OUTPUT4: (inputs) => [
//     [inputs[0][0], inputs[0][1], inputs[0][2], inputs[0][3]],
//   ],
//   OUTPUT6: (inputs) => [
//     [
//       inputs[0][0],
//       inputs[0][1],
//       inputs[0][2],
//       inputs[0][3],
//       inputs[0][4],
//       inputs[0][5],
//     ],
//   ],
//   OUTPUT8: (inputs) => [
//     [
//       inputs[0][0],
//       inputs[0][1],
//       inputs[0][2],
//       inputs[0][3],
//       inputs[0][4],
//       inputs[0][5],
//       inputs[0][6],
//       inputs[0][7],
//     ],
//   ],
// };

// const inputCounts = {
//   AND: [1, 1],
//   OR: [1, 1],
//   NOT: [1],
//   INPUT: [1],
//   INPUT1: [1],
//   INPUT2: [2],
//   INPUT4: [4],
//   INPUT6: [6],
//   INPUT8: [8],
//   OUTPUT: [1],
//   OUTPUT1: [1],
//   OUTPUT2: [2],
//   OUTPUT4: [4],
//   OUTPUT6: [6],
//   OUTPUT8: [8],
//   HANDLER: [1, 1, 1, 1],
// };

// const outputCounts = {
//   AND: [1],
//   OR: [1],
//   NOT: [1],
//   INPUT: [1],
//   INPUT1: [1],
//   INPUT2: [2],
//   INPUT4: [4],
//   INPUT6: [6],
//   INPUT8: [8],
//   OUTPUT: [1],
//   OUTPUT1: [1],
//   OUTPUT2: [2],
//   OUTPUT4: [4],
//   OUTPUT6: [6],
//   OUTPUT8: [8],
//   HANDLER: [1, 1, 1, 1, 1, 1, 1],
// };

// function evaluateExpression(inputs) {}

// class Gate {
//   // expression = "(i1[0] && i2[0]) || (i3[0] && i4[0])"
//   // expressions = [[e0_0, e0_1], [e1_0, e1_1]]

//   constructor(x, y, type, customName = "", subGates = [], subWires = []) {
//     // if (type == "computedChip")
//     //   return this.initComputedChip(
//     //     x,
//     //     y,
//     //     customName,
//     //     this.getExpressions(subGates, subWires),
//     //     subGates,
//     //     subWires
//     //   );
//     this.x = x;
//     this.y = y;
//     this.inputCount = inputCounts[type].length;
//     this.outputCount = outputCounts[type].length;
//     this.currentInputs = Array.from(
//       { length: inputCounts[type].length },
//       (_, i) => Array(inputCounts[type][i]).fill(false)
//     );
//     this.type = type;
//     this.customName = customName;
//     this.handler = handlers[type];
//     this.currentOutputs = this.handler(this.currentInputs);

//     this.connectorDiameter = 12.5;
//     this.connectorSpacing = 5;
//     let maxLength = 0;
//     for (let i = 0; i < this.inputCount; i++) {
//       maxLength = max(maxLength, this.currentInputs[i].length);
//     }
//     for (let i = 0; i < this.outputCount; i++) {
//       maxLength = max(maxLength, this.currentOutputs[i].length);
//     }
//     this.width =
//       textWidth(type) +
//       max(this.connectorDiameter, 4.5 * maxLength) * 2 +
//       this.connectorSpacing;

//     this.height = 0;
//     for (let i = 0; i < this.inputCount; i++) {
//       this.height += this.inputSize(i) + this.connectorSpacing;
//     }
//     let possibleHeight = 0;
//     for (let i = 0; i < this.outputCount; i++) {
//       possibleHeight += this.outputSize(i) + this.connectorSpacing;
//     }
//     this.height = max(this.height, possibleHeight) + this.connectorSpacing;

//     this.color = [144, 31, 26];
//   }

//   compute() {
//     setTimeout(() => {
//       // let outputs = this.currentOutputs;
//       this.currentOutputs = this.handler(this.currentInputs);
//       // let same = true;
//       // for (let i = 0; i < outputs.length; i++) {
//       //     if (outputs[i] != this.currentOutputs[i]) {
//       //         same = false;
//       //         break;
//       //     }
//       // }
//       // if (!same) {
//       //     console.log(this.currentOutputs);
//       // }
//     }, random() * 50);
//   }

//   inputPos(i) {
//     if (this.type.startsWith("INPUT")) {
//       let perRow = max(min(4, this.currentInputs[0].length / 2), 2);
//       let rows = ceil(this.currentInputs[0].length / perRow);

//       return createVector(
//         this.x - this.width / 2 + (i % perRow) * this.connectorDiameter,
//         this.y +
//           this.connectorDiameter * floor(i / perRow) -
//           ((rows - 1) * this.connectorDiameter) / 2
//       );
//     }
//     let inputX = this.x - this.width / 2;
//     let inputY = 0;

//     for (let j = 0; j < i; j++) {
//       inputY += this.inputSize(j) + this.connectorSpacing;
//     }

//     let totalHeight = 0;
//     for (let j = 0; j < this.inputCount; j++) {
//       totalHeight += this.inputSize(j) + this.connectorSpacing;
//     }
//     totalHeight -= this.connectorSpacing;

//     inputY += this.y;
//     inputY -= totalHeight / 2;
//     inputY += this.inputSize(i) / 2;

//     return createVector(inputX, inputY);
//   }

//   inputSize(i) {
//     if (this.type.startsWith("INPUT")) return this.connectorDiameter;
//     if (this.currentInputs.length <= i) return this.connectorDiameter;
//     if (this.currentInputs[i].length > 1)
//       return 4.5 * this.currentInputs[i].length + 5;
//     return this.connectorDiameter;
//   }

//   outputPos(i) {
//     if (this.type.startsWith("OUTPUT")) {
//       let perRow = max(min(4, this.currentOutputs[0].length / 2), 2);
//       let rows = ceil(this.currentOutputs[0].length / perRow);

//       return createVector(
//         this.x +
//           this.width / 2 -
//           (perRow - (i % perRow)) * this.connectorDiameter +
//           this.connectorSpacing / 2,
//         this.y +
//           this.connectorDiameter * floor(i / perRow) -
//           ((rows - 1) * this.connectorDiameter) / 2
//       );
//     }
//     let outputX = this.x + this.width / 2;
//     let outputY = 0;

//     for (let j = 0; j < i; j++) {
//       outputY += this.outputSize(j) + this.connectorSpacing;
//     }
//     let totalHeight = 0;
//     for (let j = 0; j < this.outputCount; j++) {
//       totalHeight += this.outputSize(j) + this.connectorSpacing;
//     }
//     totalHeight -= this.connectorSpacing;
//     outputY += this.y;
//     outputY -= totalHeight / 2;
//     outputY += this.outputSize(i) / 2;

//     return createVector(outputX, outputY);
//   }

//   outputSize(i) {
//     if (this.type.startsWith("OUTPUT")) return this.connectorDiameter;
//     if (this.currentOutputs.length <= i) return this.connectorDiameter;
//     if (this.currentOutputs[i].length > 1)
//       return 4.5 * this.currentOutputs[i].length + 5;
//     return this.connectorDiameter;
//   }

//   showInput(onColour, offColour) {
//     let perRow = max(min(4, this.currentInputs[0].length / 2), 2);
//     let rows = ceil(this.currentInputs[0].length / perRow);

//     let x =
//       this.inputPos(0).x -
//       this.connectorDiameter / 2 -
//       this.connectorSpacing / 2;
//     let y =
//       this.inputPos(0).y -
//       this.connectorDiameter / 2 -
//       this.connectorSpacing / 2;
//     let w =
//       (this.currentInputs[0].length > 2
//         ? min(4, this.currentInputs[0].length / 2)
//         : this.currentInputs[0].length) *
//         this.connectorDiameter +
//       this.connectorSpacing;
//     let h = rows * this.connectorDiameter + this.connectorSpacing;

//     push();
//     rectMode(CORNER);
//     noStroke();
//     fill(0);
//     rect(x, y, w, h);
//     pop();

//     push();
//     stroke(0);
//     strokeWeight(5);
//     line(x + w / 2, y + h / 2, this.outputPos(0).x, this.outputPos(0).y);
//     pop();

//     push();
//     fill(0);
//     if (this.currentOutputs[0].length == 1) {
//       ellipse(
//         this.outputPos(0).x,
//         this.outputPos(0).y,
//         this.outputSize(0) + this.connectorSpacing / 2
//       );
//     }
//     pop();

//     for (let i = 0; i < this.currentInputs[0].length; i++) {
//       push();
//       noStroke();
//       if (this.currentInputs[0][i] == true) {
//         fill(onColour);
//       } else {
//         fill(offColour);
//       }
//       ellipse(this.inputPos(i).x, this.inputPos(i).y, this.connectorDiameter);
//       pop();
//     }

//     let i = 0;

//     push();
//     noStroke();
//     if (this.currentOutputs[i].length > 1) {
//       fill(0);
//     } else if (this.currentOutputs[i][0] == true) {
//       fill(onColour);
//     } else {
//       fill(offColour);
//     }

//     if (this.currentOutputs[i].length > 1) {
//       rectMode(CENTER);
//       rect(this.outputPos(i).x, this.outputPos(i).y, 10, this.outputSize(i));
//     } else {
//       ellipse(this.outputPos(i).x, this.outputPos(i).y, this.outputSize(i));
//     }
//     pop();
//   }

//   showOutput(onColour, offColour) {
//     let perRow = max(min(4, this.currentOutputs[0].length / 2), 2);
//     let rows = ceil(this.currentOutputs[0].length / perRow);

//     let x =
//       this.outputPos(0).x -
//       this.connectorDiameter / 2 -
//       this.connectorSpacing / 2;
//     let y =
//       this.outputPos(0).y -
//       this.connectorDiameter / 2 -
//       this.connectorSpacing / 2;
//     let w =
//       (this.currentOutputs[0].length > 2
//         ? min(4, this.currentOutputs[0].length / 2)
//         : this.currentOutputs[0].length) *
//         this.connectorDiameter +
//       this.connectorSpacing;
//     let h = rows * this.connectorDiameter + this.connectorSpacing;

//     push();
//     rectMode(CORNER);
//     noStroke();
//     fill(0);
//     rect(x, y, w, h);
//     pop();

//     push();
//     stroke(0);
//     strokeWeight(5);
//     line(x + w / 2, y + h / 2, this.inputPos(0).x, this.inputPos(0).y);
//     pop();

//     push();
//     fill(0);
//     if (this.currentInputs[0].length == 1) {
//       ellipse(
//         this.inputPos(0).x,
//         this.inputPos(0).y,
//         this.inputSize(0) + this.connectorSpacing / 2
//       );
//     }
//     pop();

//     for (let i = 0; i < this.currentOutputs[0].length; i++) {
//       push();
//       noStroke();
//       if (this.currentOutputs[0][i] == true) {
//         fill(onColour);
//       } else {
//         fill(offColour);
//       }
//       ellipse(this.outputPos(i).x, this.outputPos(i).y, this.connectorDiameter);
//       pop();
//     }

//     let i = 0;
//     push();
//     noStroke();
//     if (this.currentInputs[i].length > 1) {
//       fill(0);
//     } else if (this.currentInputs[i][0] == true) {
//       fill(onColour);
//     } else {
//       fill(offColour);
//     }
//     if (this.currentInputs[i].length > 1) {
//       rectMode(CENTER);
//       rect(this.inputPos(i).x, this.inputPos(i).y, 10, this.inputSize(i));
//     } else {
//       ellipse(this.inputPos(i).x, this.inputPos(i).y, this.inputSize(i));
//     }
//     pop();
//   }

//   showBoundingBox() {
//     push();
//     rectMode(CENTER);
//     stroke(0);
//     strokeWeight(5);
//     noFill();
//     rect(this.x, this.y, this.width, this.height);
//     pop();
//   }

//   show(onColour, offColour) {
//     if (this.type.startsWith("INPUT"))
//       return this.showInput(onColour, offColour);
//     if (this.type.startsWith("OUTPUT"))
//       return this.showOutput(onColour, offColour);
//     push();
//     let p = 0.75;
//     stroke(this.color[0] * p, this.color[1] * p, this.color[2] * p);
//     strokeWeight(3);
//     fill(...this.color);
//     rectMode(CENTER);
//     rect(this.x, this.y, this.width, this.height);
//     noStroke();

//     fill(255);
//     textAlign(CENTER, CENTER);
//     text(this.type, this.x, this.y);

//     for (let i = 0; i < this.inputCount; i++) {
//       let pos = this.inputPos(i);
//       fill(0);
//       if (this.currentInputs[i].length > 1) {
//         rectMode(CENTER);
//         rect(pos.x, pos.y, 10, this.inputSize(i));
//       } else {
//         ellipse(pos.x, pos.y, this.inputSize(i) + this.connectorSpacing / 2);
//         if (this.currentInputs[i][0]) {
//           fill(onColour);
//         } else {
//           fill(offColour);
//         }
//         ellipse(pos.x, pos.y, this.inputSize(i));
//       }
//     }

//     for (let i = 0; i < this.outputCount; i++) {
//       let pos = this.outputPos(i);
//       fill(0);
//       if (this.currentOutputs[i].length > 1) {
//         rectMode(CENTER);
//         rect(pos.x, pos.y, 10, this.outputSize(i));
//       } else {
//         ellipse(pos.x, pos.y, this.outputSize(i) + this.connectorSpacing / 2);
//         if (this.currentOutputs[i][0]) {
//           fill(onColour);
//         } else {
//           fill(offColour);
//         }
//         ellipse(pos.x, pos.y, this.outputSize(i));
//       }
//     }
//     pop();

//     if (
//       this.customName != "" &&
//       mouseX > this.x - this.width / 2 + 7.5 &&
//       mouseX < this.x + this.width / 2 - 7.5 &&
//       mouseY > this.y - this.height / 2 &&
//       mouseY < this.y + this.height / 2
//     ) {
//       push();
//       fill(55, 235);
//       rectMode(CENTER);
//       rect(mouseX, mouseY, textWidth(this.customName) + 20, 20);

//       fill(255);
//       textAlign(CENTER, CENTER);
//       text(this.customName, mouseX, mouseY);
//       pop();
//     }
//   }
// }

const handlers = {
  AND: (inputs) => [[inputs[0][0] && inputs[1][0]]],
  OR: (inputs) => [[inputs[0][0] || inputs[1][0]]],
  NOT: (inputs) => [[!inputs[0][0]]],
  INPUT: (inputs) => [[inputs[0][0]]],
  INPUT1: (inputs) => [[inputs[0][0]]],
  INPUT2: (inputs) => [[inputs[0][0], inputs[0][1]]],
  INPUT4: (inputs) => [
    [inputs[0][0], inputs[0][1], inputs[0][2], inputs[0][3]],
  ],
  INPUT6: (inputs) => [
    [
      inputs[0][0],
      inputs[0][1],
      inputs[0][2],
      inputs[0][3],
      inputs[0][4],
      inputs[0][5],
    ],
  ],
  INPUT8: (inputs) => [
    [
      inputs[0][0],
      inputs[0][1],
      inputs[0][2],
      inputs[0][3],
      inputs[0][4],
      inputs[0][5],
      inputs[0][6],
      inputs[0][7],
    ],
  ],
  OUTPUT: (inputs) => [[inputs[0][0]]],
  OUTPUT1: (inputs) => [[inputs[0][0]]],
  OUTPUT2: (inputs) => [[inputs[0][0], inputs[0][1]]],
  OUTPUT4: (inputs) => [
    [inputs[0][0], inputs[0][1], inputs[0][2], inputs[0][3]],
  ],
  OUTPUT6: (inputs) => [
    [
      inputs[0][0],
      inputs[0][1],
      inputs[0][2],
      inputs[0][3],
      inputs[0][4],
      inputs[0][5],
    ],
  ],
  OUTPUT8: (inputs) => [
    [
      inputs[0][0],
      inputs[0][1],
      inputs[0][2],
      inputs[0][3],
      inputs[0][4],
      inputs[0][5],
      inputs[0][6],
      inputs[0][7],
    ],
  ],
};

const inputCounts = {
  AND: [1, 1],
  OR: [1, 1],
  NOT: [1],
  INPUT: [1],
  INPUT1: [1],
  INPUT2: [2],
  INPUT4: [4],
  INPUT6: [6],
  INPUT8: [8],
  OUTPUT: [1],
  OUTPUT1: [1],
  OUTPUT2: [2],
  OUTPUT4: [4],
  OUTPUT6: [6],
  OUTPUT8: [8],
  HANDLER: [1, 1, 1, 1],
};

const outputCounts = {
  AND: [1],
  OR: [1],
  NOT: [1],
  INPUT: [1],
  INPUT1: [1],
  INPUT2: [2],
  INPUT4: [4],
  INPUT6: [6],
  INPUT8: [8],
  OUTPUT: [1],
  OUTPUT1: [1],
  OUTPUT2: [2],
  OUTPUT4: [4],
  OUTPUT6: [6],
  OUTPUT8: [8],
  HANDLER: [1, 1, 1, 1, 1, 1, 1],
};

function evaluateExpression(expression, inputs) {
  const replaced = expression.replace(/i(\d+)/g, (_, index) => {
    const value = inputs[Number(index)];
    return `[${value}]`;
  });

  return eval(replaced);
}

class Gate {
  // expression = "(i1[0] && i2[0]) || (i3[0] && i4[0])"
  // expressions = [[e0_0, e0_1], [e1_0, e1_1]]
  initComputedChip(x, y, customName, expressions, subGates, subWires) {
    this.type = "computedChip";
    this.customName = customName;

    this.x = x;
    this.y = y;

    this.inputCount = 0;
    this.currentInputs = [];
    for (let i = 0; i < subGates.length; i++) {
      if (subGates[i].type && subGates[i].type.startsWith("INPUT")) {
        this.inputCount++;
        this.currentInputs.push([]);
        for (let j = 0; j < subGates[i].currentInputs.length; j++) {
          this.currentInputs[i].push(subGates[i].currentInputs[j][0] ?? false);
        }
      }
    }
    this.outputCount = 0;
    this.currentOutputs = [];
    for (let i = 0; i < subGates.length; i++) {
      if (subGates[i].type && subGates[i].type.startsWith("OUTPUT")) {
        this.outputCount++;
        this.currentOutputs.push([]);
        for (let j = 0; j < subGates[i].currentOutputs.length; j++) {
          this.currentOutputs[this.outputCount - 1].push(
            subGates[i].currentOutputs[j][0] ?? false
          );
        }
      }
    }

    this.expressions = expressions;
    console.log(this.expressions);
    this.handler = (inputs) => {
      let outputs = [];
      for (let i = 0; i < this.expressions.length; i++) {
        let expression = this.expressions[i];
        outputs.push([]);
        for (let j = 0; j < expression.length; j++) {
          // console.log(expression[j]);
          let bit = evaluateExpression(expression[j], inputs);
          outputs[i].push(bit);
        }
      }
      return outputs;
    };
    this.currentOutputs = this.handler(this.currentInputs);
    console.log(this.currentOutputs);

    this.connectorDiameter = 12.5;
    this.connectorSpacing = 5;
    let maxLength = 0;
    for (let i = 0; i < this.inputCount; i++) {
      maxLength = max(maxLength, this.currentInputs[i].length);
    }
    for (let i = 0; i < this.outputCount; i++) {
      maxLength = max(maxLength, this.currentOutputs[i].length);
    }
    this.width =
      textWidth(this.type) +
      max(this.connectorDiameter, 4.5 * maxLength) * 2 +
      this.connectorSpacing;

    this.height = 0;
    for (let i = 0; i < this.inputCount; i++) {
      this.height += this.inputSize(i) + this.connectorSpacing;
    }
    let possibleHeight = 0;
    for (let i = 0; i < this.outputCount; i++) {
      possibleHeight += this.outputSize(i) + this.connectorSpacing;
    }
    this.height = max(this.height, possibleHeight) + this.connectorSpacing;

    this.color = [144, 31, 26];
  }

  getExpressions(subGates, subWires) {
    const knownExpressions = {
      AND: [["i0[0] && i1[0]"]],
      OR: [["i0[0] || i1[0]"]],
      NOT: [["!i0[0]"]],
      INPUT: [["i0[0]"]],
      INPUT1: [["i0[0]"]],
      INPUT2: [["i0[0]", "i1[0]"]],
      INPUT4: [["i0[0]", "i1[0]", "i2[0]", "i3[0]"]],
      INPUT6: [["i0[0]", "i1[0]", "i2[0]", "i3[0]", "i4[0]", "i5[0]"]],
      INPUT8: [
        [
          "i0[0]",
          "i1[0]",
          "i2[0]",
          "i3[0]",
          "i4[0]",
          "i5[0]",
          "i6[0]",
          "i7[0]",
        ],
      ],
      OUTPUT: [["i0[0]"]],
      OUTPUT1: [["i0[0]"]],
      OUTPUT2: [["i0[0]", "i1[0]"]],
      OUTPUT4: [["i0[0]", "i1[0]", "i2[0]", "i3[0]"]],
      OUTPUT6: [["i0[0]", "i1[0]", "i2[0]", "i3[0]", "i4[0]", "i5[0]"]],
      OUTPUT8: [
        [
          "i0[0]",
          "i1[0]",
          "i2[0]",
          "i3[0]",
          "i4[0]",
          "i5[0]",
          "i6[0]",
          "i7[0]",
        ],
      ],
    };

    const gateExprCache = new Map();

    // Extract the input gates from subGates
    const inputGates = subGates.filter(
      (gate) => gate.type && gate.type.startsWith("INPUT")
    );

    // Log input gates
    console.log("Input Gates: ", JSON.stringify(inputGates));

    // Resolve the expression for a specific gate and pin index.
    const resolve = (gateIndex, pinIndex) => {
      const key = `${gateIndex}_${pinIndex}`;
      if (gateExprCache.has(key)) return gateExprCache.get(key);

      const gate = subGates[gateIndex];

      let rawExprs;
      if (gate.name && knownExpressions[gate.name]) {
        rawExprs = knownExpressions[gate.name];
      } else if (!gate.type) {
        // Composite gate, resolve recursively.
        const nested = this.getExpressions(gate.subGates, gate.subWires);
        return nested[0][pinIndex]; // assuming single output
      } else {
        rawExprs = knownExpressions[gate.type];
      }

      if (!rawExprs || !rawExprs[0]) {
        gateExprCache.set(key, "false");
        return "false";
      }

      let expr = rawExprs[0][pinIndex];
      if (!expr) {
        gateExprCache.set(key, "false");
        return "false";
      }

      // Replace input variables (i0, i1, ...) with the actual connected expressions from the wires.
      expr = expr.replace(/i(\d+)\[0\]/g, (_, inputPinIndex) => {
        // Log to check the wire we are replacing
        console.log(
          `Looking for wire connection for input i${inputPinIndex}[0]`
        );

        // Find the wire connected to this input (i.e., i0, i1, etc.)
        const wire = subWires.find(
          (w) => w.to === gateIndex && w.toI === Number(inputPinIndex)
        );
        if (!wire) {
          console.log(
            `No wire found for input i${inputPinIndex}[0], returning false`
          );
          return "false";
        }

        // Log wire details
        console.log("Wire found: ", JSON.stringify(wire));

        // Resolve the expression for the source gate of this wire.
        const inputGateIndex = wire.from;
        const inputGate = subGates[inputGateIndex];

        // Check if the gate is an Input gate
        if (inputGate.type && inputGate.type.startsWith("INPUT")) {
          // Find the corresponding input gate by its position in the inputGates array
          const inputIndex = inputGates.findIndex((g) => g === inputGate);
          console.log(`Resolved to i${inputIndex}[0]`);
          return `i${inputIndex}[0]`; // Replace with the correct input expression based on index
        }

        // If it's not an Input gate, resolve recursively
        return `(${resolve(inputGateIndex, wire.fromI)})`;
      });

      gateExprCache.set(key, expr);
      return expr;
    };

    // Look for gates that are OUTPUTs
    const outputIndices = subGates
      .map((g, i) => ({ gate: g, index: i }))
      .filter(({ gate }) => gate.type && gate.type.startsWith("OUTPUT"));

    // Log output indices
    console.log("Output Indices: ", JSON.stringify(outputIndices));

    // Generate the expressions for the output gates.
    const expressions = outputIndices.map(({ index }) => {
      const outputExprs = [];
      const gate = subGates[index];
      const raw = knownExpressions[gate.type] || [["i0[0]"]];
      for (let i = 0; i < raw[0].length; i++) {
        outputExprs.push(resolve(index, i));
      }
      return outputExprs;
    });

    // Log final expressions
    console.log("Final Expressions: ", JSON.stringify(expressions));

    return expressions;
  }

  constructor(x, y, type, customName = "", subGates = [], subWires = []) {
    if (type == "computedChip")
      return this.initComputedChip(
        x,
        y,
        customName,
        this.getExpressions(subGates, subWires),
        subGates,
        subWires
      );
    this.x = x;
    this.y = y;
    this.inputCount = inputCounts[type].length;
    this.outputCount = outputCounts[type].length;
    this.currentInputs = Array.from(
      { length: inputCounts[type].length },
      (_, i) => Array(inputCounts[type][i]).fill(false)
    );
    this.type = type;
    this.customName = customName;
    this.handler = handlers[type];
    this.currentOutputs = this.handler(this.currentInputs);

    this.connectorDiameter = 12.5;
    this.connectorSpacing = 5;
    let maxLength = 0;
    for (let i = 0; i < this.inputCount; i++) {
      maxLength = max(maxLength, this.currentInputs[i].length);
    }
    for (let i = 0; i < this.outputCount; i++) {
      maxLength = max(maxLength, this.currentOutputs[i].length);
    }
    this.width =
      textWidth(type) +
      max(this.connectorDiameter, 4.5 * maxLength) * 2 +
      this.connectorSpacing;

    this.height = 0;
    for (let i = 0; i < this.inputCount; i++) {
      this.height += this.inputSize(i) + this.connectorSpacing;
    }
    let possibleHeight = 0;
    for (let i = 0; i < this.outputCount; i++) {
      possibleHeight += this.outputSize(i) + this.connectorSpacing;
    }
    this.height = max(this.height, possibleHeight) + this.connectorSpacing;

    this.color = [144, 31, 26];
  }

  compute() {
    setTimeout(() => {
      // let outputs = this.currentOutputs;
      this.currentOutputs = this.handler(this.currentInputs);
      // let same = true;
      // for (let i = 0; i < outputs.length; i++) {
      //     if (outputs[i] != this.currentOutputs[i]) {
      //         same = false;
      //         break;
      //     }
      // }
      // if (!same) {
      //     console.log(this.currentOutputs);
      // }
    }, random() * 50);
  }

  inputPos(i) {
    if (this.type.startsWith("INPUT")) {
      let perRow = max(min(4, this.currentInputs[0].length / 2), 2);
      let rows = ceil(this.currentInputs[0].length / perRow);

      return createVector(
        this.x - this.width / 2 + (i % perRow) * this.connectorDiameter,
        this.y +
          this.connectorDiameter * floor(i / perRow) -
          ((rows - 1) * this.connectorDiameter) / 2
      );
    }
    let inputX = this.x - this.width / 2;
    let inputY = 0;

    for (let j = 0; j < i; j++) {
      inputY += this.inputSize(j) + this.connectorSpacing;
    }

    let totalHeight = 0;
    for (let j = 0; j < this.inputCount; j++) {
      totalHeight += this.inputSize(j) + this.connectorSpacing;
    }
    totalHeight -= this.connectorSpacing;

    inputY += this.y;
    inputY -= totalHeight / 2;
    inputY += this.inputSize(i) / 2;

    return createVector(inputX, inputY);
  }

  inputSize(i) {
    if (this.type.startsWith("INPUT")) return this.connectorDiameter;
    if (this.currentInputs.length <= i) return this.connectorDiameter;
    if (this.currentInputs[i].length > 1)
      return 4.5 * this.currentInputs[i].length + 5;
    return this.connectorDiameter;
  }

  outputPos(i) {
    if (this.type.startsWith("OUTPUT")) {
      let perRow = max(min(4, this.currentOutputs[0].length / 2), 2);
      let rows = ceil(this.currentOutputs[0].length / perRow);

      return createVector(
        this.x +
          this.width / 2 -
          (perRow - (i % perRow)) * this.connectorDiameter +
          this.connectorSpacing / 2,
        this.y +
          this.connectorDiameter * floor(i / perRow) -
          ((rows - 1) * this.connectorDiameter) / 2
      );
    }
    let outputX = this.x + this.width / 2;
    let outputY = 0;

    for (let j = 0; j < i; j++) {
      outputY += this.outputSize(j) + this.connectorSpacing;
    }
    let totalHeight = 0;
    for (let j = 0; j < this.outputCount; j++) {
      totalHeight += this.outputSize(j) + this.connectorSpacing;
    }
    totalHeight -= this.connectorSpacing;
    outputY += this.y;
    outputY -= totalHeight / 2;
    outputY += this.outputSize(i) / 2;

    return createVector(outputX, outputY);
  }

  outputSize(i) {
    if (this.type.startsWith("OUTPUT")) return this.connectorDiameter;
    if (this.currentOutputs.length <= i) return this.connectorDiameter;
    if (this.currentOutputs[i].length > 1)
      return 4.5 * this.currentOutputs[i].length + 5;
    return this.connectorDiameter;
  }

  showInput(onColour, offColour) {
    let perRow = max(min(4, this.currentInputs[0].length / 2), 2);
    let rows = ceil(this.currentInputs[0].length / perRow);

    let x =
      this.inputPos(0).x -
      this.connectorDiameter / 2 -
      this.connectorSpacing / 2;
    let y =
      this.inputPos(0).y -
      this.connectorDiameter / 2 -
      this.connectorSpacing / 2;
    let w =
      (this.currentInputs[0].length > 2
        ? min(4, this.currentInputs[0].length / 2)
        : this.currentInputs[0].length) *
        this.connectorDiameter +
      this.connectorSpacing;
    let h = rows * this.connectorDiameter + this.connectorSpacing;

    push();
    rectMode(CORNER);
    noStroke();
    fill(0);
    rect(x, y, w, h);
    pop();

    push();
    stroke(0);
    strokeWeight(5);
    line(x + w / 2, y + h / 2, this.outputPos(0).x, this.outputPos(0).y);
    pop();

    push();
    fill(0);
    if (this.currentOutputs[0].length == 1) {
      ellipse(
        this.outputPos(0).x,
        this.outputPos(0).y,
        this.outputSize(0) + this.connectorSpacing / 2
      );
    }
    pop();

    for (let i = 0; i < this.currentInputs[0].length; i++) {
      push();
      noStroke();
      if (this.currentInputs[0][i] == true) {
        fill(onColour);
      } else {
        fill(offColour);
      }
      ellipse(this.inputPos(i).x, this.inputPos(i).y, this.connectorDiameter);
      pop();
    }

    let i = 0;

    push();
    noStroke();
    if (this.currentOutputs[i].length > 1) {
      fill(0);
    } else if (this.currentOutputs[i][0] == true) {
      fill(onColour);
    } else {
      fill(offColour);
    }

    if (this.currentOutputs[i].length > 1) {
      rectMode(CENTER);
      rect(this.outputPos(i).x, this.outputPos(i).y, 10, this.outputSize(i));
    } else {
      ellipse(this.outputPos(i).x, this.outputPos(i).y, this.outputSize(i));
    }
    pop();
  }

  showOutput(onColour, offColour) {
    let perRow = max(min(4, this.currentOutputs[0].length / 2), 2);
    let rows = ceil(this.currentOutputs[0].length / perRow);

    let x =
      this.outputPos(0).x -
      this.connectorDiameter / 2 -
      this.connectorSpacing / 2;
    let y =
      this.outputPos(0).y -
      this.connectorDiameter / 2 -
      this.connectorSpacing / 2;
    let w =
      (this.currentOutputs[0].length > 2
        ? min(4, this.currentOutputs[0].length / 2)
        : this.currentOutputs[0].length) *
        this.connectorDiameter +
      this.connectorSpacing;
    let h = rows * this.connectorDiameter + this.connectorSpacing;

    push();
    rectMode(CORNER);
    noStroke();
    fill(0);
    rect(x, y, w, h);
    pop();

    push();
    stroke(0);
    strokeWeight(5);
    line(x + w / 2, y + h / 2, this.inputPos(0).x, this.inputPos(0).y);
    pop();

    push();
    fill(0);
    if (this.currentInputs[0].length == 1) {
      ellipse(
        this.inputPos(0).x,
        this.inputPos(0).y,
        this.inputSize(0) + this.connectorSpacing / 2
      );
    }
    pop();

    for (let i = 0; i < this.currentOutputs[0].length; i++) {
      push();
      noStroke();
      if (this.currentOutputs[0][i] == true) {
        fill(onColour);
      } else {
        fill(offColour);
      }
      ellipse(this.outputPos(i).x, this.outputPos(i).y, this.connectorDiameter);
      pop();
    }

    let i = 0;
    push();
    noStroke();
    if (this.currentInputs[i].length > 1) {
      fill(0);
    } else if (this.currentInputs[i][0] == true) {
      fill(onColour);
    } else {
      fill(offColour);
    }
    if (this.currentInputs[i].length > 1) {
      rectMode(CENTER);
      rect(this.inputPos(i).x, this.inputPos(i).y, 10, this.inputSize(i));
    } else {
      ellipse(this.inputPos(i).x, this.inputPos(i).y, this.inputSize(i));
    }
    pop();
  }

  showBoundingBox() {
    push();
    rectMode(CENTER);
    stroke(0);
    strokeWeight(5);
    noFill();
    rect(this.x, this.y, this.width, this.height);
    pop();
  }

  show(onColour, offColour) {
    if (this.type.startsWith("INPUT"))
      return this.showInput(onColour, offColour);
    if (this.type.startsWith("OUTPUT"))
      return this.showOutput(onColour, offColour);
    push();
    let p = 0.75;
    stroke(this.color[0] * p, this.color[1] * p, this.color[2] * p);
    strokeWeight(3);
    fill(...this.color);
    rectMode(CENTER);
    rect(this.x, this.y, this.width, this.height);
    noStroke();

    fill(255);
    textAlign(CENTER, CENTER);
    text(this.type, this.x, this.y);

    for (let i = 0; i < this.inputCount; i++) {
      let pos = this.inputPos(i);
      fill(0);
      if (this.currentInputs[i].length > 1) {
        rectMode(CENTER);
        rect(pos.x, pos.y, 10, this.inputSize(i));
      } else {
        ellipse(pos.x, pos.y, this.inputSize(i) + this.connectorSpacing / 2);
        if (this.currentInputs[i][0]) {
          fill(onColour);
        } else {
          fill(offColour);
        }
        ellipse(pos.x, pos.y, this.inputSize(i));
      }
    }

    for (let i = 0; i < this.outputCount; i++) {
      let pos = this.outputPos(i);
      fill(0);
      if (this.currentOutputs[i].length > 1) {
        rectMode(CENTER);
        rect(pos.x, pos.y, 10, this.outputSize(i));
      } else {
        ellipse(pos.x, pos.y, this.outputSize(i) + this.connectorSpacing / 2);
        if (this.currentOutputs[i][0]) {
          fill(onColour);
        } else {
          fill(offColour);
        }
        ellipse(pos.x, pos.y, this.outputSize(i));
      }
    }
    pop();

    if (
      this.customName != "" &&
      mouseX > this.x - this.width / 2 + 7.5 &&
      mouseX < this.x + this.width / 2 - 7.5 &&
      mouseY > this.y - this.height / 2 &&
      mouseY < this.y + this.height / 2
    ) {
      push();
      fill(55, 235);
      rectMode(CENTER);
      rect(mouseX, mouseY, textWidth(this.customName) + 20, 20);

      fill(255);
      textAlign(CENTER, CENTER);
      text(this.customName, mouseX, mouseY);
      pop();
    }
  }
}
