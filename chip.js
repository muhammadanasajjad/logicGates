// class Chip {
//   constructor(x, y, subGates, subWires, name = "Chip", customName = "") {
//     this.x = x;
//     this.y = y;

//     this.subGates = subGates;
//     this.subWires = subWires;

//     this.expressionTree = this.buildTree(subGates, subWires);
//     console.log(this.expressionTree);

//     // new Gate(0, 0, "computedChip", "", subGates, subWires);

//     // this.reorderSubGates(); TO DO: FIX BUG IN GATEORDERER TO OPTIMISE
//     // console.log(this.subGates);

//     this.inputCount = 0;
//     this.outputCount = 0;
//     this.inputIndices = [];
//     this.outputIndices = [];
//     for (let i = 0; i < subGates.length; i++) {
//       let gate = subGates[i];
//       if (gate.type && gate.type.startsWith("INPUT")) {
//         this.inputCount++;
//         this.inputIndices.push(i);
//       } else if (gate.type && gate.type.startsWith("OUTPUT")) {
//         this.outputCount++;
//         this.outputIndices.push(i);
//       }
//     }
//     this.inputIndices.sort((a, b) => subGates[a].y - subGates[b].y);
//     this.outputIndices.sort((a, b) => subGates[a].y - subGates[b].y);

//     this.name = name;
//     this.customName = customName;

//     for (let i = 0; i < subWires.length; i++) {
//       subWires[i].travelSpeed = 1.0;
//     }

//     this.currentInputs = Array(this.inputCount);
//     for (let i = 0; i < this.inputCount; i++) {
//       let inputGate = subGates[this.inputIndices[i]];
//       this.currentInputs[i] = Array(inputGate.currentInputs[0].length).fill(
//         false
//       );
//     }

//     this.currentOutputs = Array(this.outputCount);
//     for (let i = 0; i < this.outputCount; i++) {
//       let outputGate = subGates[this.outputIndices[i]];
//       this.currentOutputs[i] = outputGate.currentInputs[0];
//     }
//     this.compute();

//     this.connectorDiameter = 12.5;
//     this.connectorSpacing = 5;
//     this.color = [38, 122, 178];
//     this.width = textWidth(name) + 15 + 20;
//     this.height = 0;
//     for (let i = 0; i < this.inputCount; i++) {
//       this.height += this.inputSize(i) + this.connectorSpacing;
//     }
//     let possibleHeight = 0;
//     for (let i = 0; i < this.outputCount; i++) {
//       possibleHeight += this.outputSize(i) + this.connectorSpacing;
//     }
//     this.height = max(this.height, possibleHeight) + this.connectorSpacing;
//   }

//   buildTree(nodes, edges) {
//     const inputMap = {};
//     for (const { from, fromI, to, toI } of edges) {
//       if (!inputMap[to]) inputMap[to] = [];
//       inputMap[to][toI] = { from, fromI };
//     }

//     function buildSubtree(nodeIndex, visited = new Set()) {
//       if (visited.has(nodeIndex)) {
//         return {
//           handler: nodes[nodeIndex].handler,
//           y: nodes[nodeIndex].y,
//           index: nodeIndex,
//           circular: true,
//           currentInputs: [...nodes[nodeIndex].currentInputs],
//         };
//       }

//       visited.add(nodeIndex);
//       const node = {
//         handler: nodes[nodeIndex].handler,
//         y: nodes[nodeIndex].y,
//         index: nodeIndex,
//         currentInputs: [...nodes[nodeIndex].currentInputs],
//       };
//       const inputs = inputMap[nodeIndex] || [];

//       // store child subtree + fromI so we know which output of the child to use
//       node.inputs = inputs.map((conn) =>
//         conn
//           ? {
//               child: buildSubtree(conn.from, new Set(visited)),
//               fromI: conn.fromI,
//             }
//           : null
//       );

//       return node;
//     }

//     const roots = nodes
//       .map((n, i) => ({ ...n, i }))
//       .filter((n) => n.type === "OUTPUT")
//       .map((n) => buildSubtree(n.i));

//     return roots;
//   }

//   reorderNodes(nodes, wires) {
//     let nodeMap = new Map(); // Map node index to its data
//     let inDegree = new Map(); // Track in-degree (number of incoming edges)

//     // Initialize nodes
//     nodes.forEach((node, index) => {
//       nodeMap.set(index, { ...node, index, children: [] });
//       inDegree.set(index, 0);
//     });

//     // Build adjacency list and track in-degrees
//     wires.forEach(({ from, to }) => {
//       nodeMap.get(from).children.push(to);
//       inDegree.set(to, inDegree.get(to) + 1);
//     });

//     // Find root nodes (nodes with no incoming edges)
//     let queue = [];
//     inDegree.forEach((deg, index) => {
//       if (deg === 0) queue.push(index);
//     });

//     let orderedNodes = [];
//     let visited = new Set();

//     // Process nodes in topological order
//     while (queue.length > 0) {
//       let nodeIndex = queue.shift();
//       let node = nodeMap.get(nodeIndex);

//       if (!visited.has(nodeIndex)) {
//         orderedNodes.push(node);
//         visited.add(nodeIndex);
//       }

//       node.children.forEach((child) => {
//         inDegree.set(child, inDegree.get(child) - 1);
//         if (inDegree.get(child) === 0) queue.push(child);
//       });
//     }

//     // Include disconnected nodes (if any were missed)
//     nodes.forEach((_, index) => {
//       if (!visited.has(index)) {
//         orderedNodes.push(nodeMap.get(index));
//       }
//     });

//     // Create a mapping from old index → new index
//     let indexMapping = new Map();
//     orderedNodes.forEach((node, newIndex) => {
//       indexMapping.set(node.index, newIndex);
//     });

//     // Update wires to match the new indices
//     let updatedWires = wires.map(({ from, fromI, to, toI, ...rest }) => ({
//       from: indexMapping.get(from),
//       fromI,
//       to: indexMapping.get(to),
//       toI,
//       ...rest,
//     }));

//     // Update node indices to match the new order
//     orderedNodes = orderedNodes.map((node, newIndex) => ({
//       ...node,
//       index: newIndex,
//       children: node.children.map((child) => indexMapping.get(child)),
//     }));

//     return { orderedNodes, updatedWires };
//   }

//   reorderSubGates() {
//     let gatesIndices = {};
//     let { orderedNodes, updatedWires } = this.reorderNodes(
//       this.subGates,
//       this.subWires
//     );

//     this.subGates = [];
//     for (let i = 0; i < orderedNodes.length; i++) {
//       if (orderedNodes[i].type) {
//         this.subGates.push(
//           new Gate(
//             orderedNodes[i].x,
//             orderedNodes[i].y,
//             orderedNodes[i].type,
//             orderedNodes[i].customName
//           )
//         );
//       } else {
//         this.subGates.push(
//           getChipCopy(
//             orderedNodes[i],
//             orderedNodes[i].x,
//             orderedNodes[i].y,
//             orderedNodes[i].name
//           )
//         );
//       }
//     }

//     this.subWires = [];
//     for (let i = 0; i < updatedWires.length; i++) {
//       this.subWires.push(
//         new Wire(
//           updatedWires[i].from,
//           updatedWires[i].fromI,
//           updatedWires[i].to,
//           updatedWires[i].toI,
//           updatedWires[i].midPonts,
//           updatedWires[i].stateCount
//         )
//       );
//     }
//   }

//   findInTree(index) {
//     function findInTreeRec(node) {
//       if (node.index === index) return node;
//       if (node.inputs) {
//         for (let inp of node.inputs) {
//           const found = findInTreeRec(inp.child);
//           if (found) return found;
//         }
//       }
//       return null;
//     }

//     for (let root of this.expressionTree) {
//       const found = findInTreeRec(root);
//       if (found) return found;
//     }

//     return null;
//   }

//   compute() {
//     const computed = new Map();

//     function normalizeOutputs(outs) {
//       if (!Array.isArray(outs)) {
//         return [[outs]];
//       }

//       if (outs.every((v) => !Array.isArray(v))) {
//         return [outs];
//       }

//       if (
//         outs.every((v) => Array.isArray(v) && v.every((x) => !Array.isArray(x)))
//       ) {
//         return outs;
//       }

//       return outs.flat();
//     }

//     const computeNode = (node) => {
//       // cache by gate index
//       if (computed.has(node.index)) return computed.get(node.index);

//       const gate = node;

//       // INPUT gates: assume gate.currentOutputs already set (by external wiring)
//       if (gate.type?.startsWith("INPUT")) {
//         const index = gate.index;
//         const indexFrom = this.inputIndices.indexOf(index);
//         const inputs = [this.currentInputs[indexFrom]];
//         console.log("--------------------INPUTS:", inputs);

//         return inputs;
//       }

//       // For other gates: build an array of inputs, picking the correct child output index
//       const gateInputs = []; // each element should be an array (a bus) for that input pin

//       for (let inp of node.inputs || []) {
//         if (!inp) {
//           // no wire connected to this input pin -> default bus of falses (match handler expectations)
//           gateInputs.push([false]);
//           continue;
//         }

//         // compute the child's outputs (normalized)
//         const childOuts = computeNode(inp.child); // returns array-of-arrays

//         // pick the correct output index from the child (fromI)
//         let sel;
//         if (typeof inp.fromI === "number") {
//           sel = childOuts[inp.fromI];
//         } else {
//           // fallback: use first output bus of the child if fromI missing
//           sel = childOuts[0];
//         }

//         // ensure sel is an array (a bus)
//         if (!Array.isArray(sel)) sel = [sel];

//         gateInputs.push(sel);
//       }

//       // assign currentInputs exactly as gate handlers expect:
//       // an array where each element is the bus array for that pin
//       console.log(gate.currentInputs);
//       gate.currentInputs = gateInputs;
//       console.log(gate.currentInputs);

//       // call handler (synchronous handlers in your code)
//       const rawOuts = gate.handler(gate.currentInputs);
//       const outs = normalizeOutputs(rawOuts);
//       gate.currentOutputs = outs;

//       computed.set(node.index, outs);
//       return outs;
//     };

//     // compute all output roots and set chip currentOutputs
//     this.currentOutputs = normalizeOutputs(
//       this.expressionTree.map((root) => computeNode(root))
//     );
//     console.log(this.currentOutputs.length > 0 && this.currentOutputs[0][0]);
//   }

//   inputPos(i) {
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
//     if (this.currentInputs.length <= i) return this.connectorDiameter;
//     if (this.currentInputs[i].length > 1)
//       return 4.5 * this.currentInputs[i].length + 5;
//     return this.connectorDiameter;
//   }

//   outputPos(i) {
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
//     if (this.currentOutputs.length <= i) return this.connectorDiameter;
//     if (this.currentOutputs[i].length > 1)
//       return 4.5 * this.currentOutputs[i].length + 5;
//     return this.connectorDiameter;
//   }

//   show(onColour, offColour) {
//     // if (this.name == "D Latch") {
//     //     for (let i = 0; i < this.subGates.length; i++) {
//     //         this.subGates[i].show(onColour, offColour);
//     //     }
//     //     for (let i = 0; i < this.subWires.length; i++) {
//     //         this.subWires[i].show(this.subGates, onColour, offColour);
//     //     }
//     // }
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
//     text(this.name, this.x, this.y);

//     for (let i = 0; i < this.inputCount; i++) {
//       let pos = this.inputPos(i);
//       if (this.currentInputs[i].length > 1) {
//         push();
//         fill(0);
//         rectMode(CENTER);
//         rect(this.inputPos(i).x, this.inputPos(i).y, 10, this.inputSize(i));
//         pop();
//       } else {
//         push();
//         stroke(0);
//         strokeWeight(this.connectorSpacing / 2);
//         fill(this.currentInputs[i][0] ? onColour : offColour);
//         ellipse(pos.x, pos.y, this.inputSize(i));
//         pop();
//       }

//       if (
//         dist(pos.x, pos.y, worldMouseX, worldMouseY) < this.inputSize(i) / 2 &&
//         this.subGates[this.inputIndices[i]].customName != ""
//       ) {
//         push();
//         stroke(0);
//         strokeWeight(1);
//         fill(55, 235);
//         rectMode(CENTER);
//         rect(
//           worldMouseX,
//           worldMouseY,
//           textWidth(this.subGates[this.inputIndices[i]].customName) + 20,
//           20
//         );

//         noStroke();
//         fill(255);
//         textAlign(CENTER, CENTER);
//         text(
//           this.subGates[this.inputIndices[i]].customName,
//           worldMouseX,
//           worldMouseY
//         );
//         pop();
//       }
//     }

//     for (let i = 0; i < this.outputCount; i++) {
//       let pos = this.outputPos(i);
//       if (this.currentOutputs[i].length > 1) {
//         push();
//         fill(0);
//         rectMode(CENTER);
//         rect(this.outputPos(i).x, this.outputPos(i).y, 10, this.outputSize(i));
//         pop();
//       } else {
//         push();
//         stroke(0);
//         strokeWeight(this.connectorSpacing / 2);
//         fill(this.currentOutputs[i][0] ? onColour : offColour);
//         ellipse(pos.x, pos.y, this.outputSize(i));
//       }

//       if (
//         dist(pos.x, pos.y, worldMouseX, worldMouseY) <
//           max(this.connectorDiameter, 4.5 * this.currentOutputs[i].length) /
//             2 &&
//         this.subGates[this.outputIndices[i]].customName != ""
//       ) {
//         push();
//         stroke(0);
//         strokeWeight(1);
//         fill(55, 235);
//         rectMode(CENTER);
//         rect(
//           worldMouseX,
//           worldMouseY,
//           textWidth(this.subGates[this.outputIndices[i]].customName) + 20,
//           20
//         );

//         noStroke();
//         fill(255);
//         textAlign(CENTER, CENTER);
//         text(
//           this.subGates[this.outputIndices[i]].customName,
//           worldMouseX,
//           worldMouseY
//         );
//         pop();
//       }
//     }
//     pop();

//     this.showLabel();
//   }

//   showLabel() {
//     if (
//       this.customName != "" &&
//       worldMouseX > this.x - this.width / 2 + 7.5 &&
//       worldMouseX < this.x + this.width / 2 - 7.5 &&
//       worldMouseY > this.y - this.height / 2 &&
//       worldMouseY < this.y + this.height / 2
//     ) {
//       push();
//       fill(55, 235);
//       rectMode(CENTER);
//       rect(worldMouseX, worldMouseY, textWidth(this.customName) + 20, 20);

//       fill(255);
//       textAlign(CENTER, CENTER);
//       text(this.customName, worldMouseX, worldMouseY);
//       pop();
//     }
//   }

//   static fromGates(x, y, gates, wires) {
//     return new Chip(x, y, gates.length, wires.length, gates, wires);
//   }
// }

// function getChipCopy(chip, x, y, name, customName) {
//   if (!customName) customName = "";
//   if (!chip.name)
//     return new Gate(
//       x ? x : chip.x,
//       y ? y : chip.y,
//       chip.type,
//       customName != "" ? customName : chip.customName
//     );
//   if (name == "SEGMENTED-DISPLAY") {
//     return new SegmentedDisplay(x, y);
//   } else if (
//     name.startsWith("CONVERTER") ||
//     chip.name.startsWith("CONVERTER")
//   ) {
//     return new ConverterChip(
//       x ? x : chip.x,
//       y ? y : chip.y,
//       chip.fromConverter,
//       chip.to
//     );
//   }
//   let tempGates = [];
//   for (let i = 0; i < chip.subGates.length; i++) {
//     let currentGate = chip.subGates[i];
//     if (currentGate.type) {
//       tempGates.push(
//         new Gate(
//           currentGate.x,
//           currentGate.y,
//           currentGate.type,
//           currentGate.customName
//         )
//       );
//     } else {
//       tempGates.push(getChipCopy(currentGate));
//     }
//   }
//   let tempWires = [];
//   for (let i = 0; i < chip.subWires.length; i++) {
//     let currentWire = chip.subWires[i];
//     tempWires.push(
//       new Wire(
//         currentWire.from,
//         currentWire.fromI,
//         currentWire.to,
//         currentWire.toI,
//         vectorsFromList(vectorsToList(currentWire.midPoints)),
//         currentWire.stateCount
//       )
//     );
//   }
//   return new Chip(
//     x ? x : chip.x,
//     y ? y : chip.y,
//     tempGates,
//     tempWires,
//     name ? name : chip.name,
//     customName != "" ? customName : chip.customName
//   );
// }

class Chip {
  constructor(x, y, subGates, subWires, name = "Chip", customName = "") {
    this.x = x;
    this.y = y;

    this.subGates = subGates;
    this.subWires = subWires;
    // this.reorderSubGates(); TO DO: FIX BUG IN GATEORDERER TO OPTIMISE
    // console.log(this.subGates);

    this.inputCount = 0;
    this.outputCount = 0;
    this.inputIndices = [];
    this.outputIndices = [];
    for (let i = 0; i < subGates.length; i++) {
      let gate = subGates[i];
      if (gate.type && gate.type.startsWith("INPUT")) {
        this.inputCount++;
        this.inputIndices.push(i);
      } else if (gate.type && gate.type.startsWith("OUTPUT")) {
        this.outputCount++;
        this.outputIndices.push(i);
      }
    }
    this.inputIndices.sort((a, b) => subGates[a].y - subGates[b].y);
    this.outputIndices.sort((a, b) => subGates[a].y - subGates[b].y);

    this.name = name;
    this.customName = customName;

    for (let i = 0; i < subWires.length; i++) {
      this.subWires[i].travelSpeed = 1.0;
    }

    this.currentInputs = Array(this.inputCount);
    for (let i = 0; i < this.inputCount; i++) {
      let inputGate = this.subGates[this.inputIndices[i]];
      this.currentInputs[i] = Array(inputGate.currentInputs[0].length).fill(
        false
      );
    }

    this.currentOutputs = Array(this.outputCount);
    for (let i = 0; i < this.outputCount; i++) {
      let outputGate = this.subGates[this.outputIndices[i]];
      this.currentOutputs[i] = outputGate.currentInputs[0];
    }
    this.compute();

    this.connectorDiameter = 12.5;
    this.connectorSpacing = 5;
    this.color = [38, 122, 178];
    this.width = textWidth(name) + 15 + 20;
    this.height = 0;
    for (let i = 0; i < this.inputCount; i++) {
      this.height += this.inputSize(i) + this.connectorSpacing;
    }
    let possibleHeight = 0;
    for (let i = 0; i < this.outputCount; i++) {
      possibleHeight += this.outputSize(i) + this.connectorSpacing;
    }
    this.height = max(this.height, possibleHeight) + this.connectorSpacing;
  }

  reorderNodes(nodes, wires) {
    let nodeMap = new Map(); // Map node index to its data
    let inDegree = new Map(); // Track in-degree (number of incoming edges)

    // Initialize nodes
    nodes.forEach((node, index) => {
      nodeMap.set(index, { ...node, index, children: [] });
      inDegree.set(index, 0);
    });

    // Build adjacency list and track in-degrees
    wires.forEach(({ from, to }) => {
      nodeMap.get(from).children.push(to);
      inDegree.set(to, inDegree.get(to) + 1);
    });

    // Find root nodes (nodes with no incoming edges)
    let queue = [];
    inDegree.forEach((deg, index) => {
      if (deg === 0) queue.push(index);
    });

    let orderedNodes = [];
    let visited = new Set();

    // Process nodes in topological order
    while (queue.length > 0) {
      let nodeIndex = queue.shift();
      let node = nodeMap.get(nodeIndex);

      if (!visited.has(nodeIndex)) {
        orderedNodes.push(node);
        visited.add(nodeIndex);
      }

      node.children.forEach((child) => {
        inDegree.set(child, inDegree.get(child) - 1);
        if (inDegree.get(child) === 0) queue.push(child);
      });
    }

    // Include disconnected nodes (if any were missed)
    nodes.forEach((_, index) => {
      if (!visited.has(index)) {
        orderedNodes.push(nodeMap.get(index));
      }
    });

    // Create a mapping from old index → new index
    let indexMapping = new Map();
    orderedNodes.forEach((node, newIndex) => {
      indexMapping.set(node.index, newIndex);
    });

    // Update wires to match the new indices
    let updatedWires = wires.map(({ from, fromI, to, toI, ...rest }) => ({
      from: indexMapping.get(from),
      fromI,
      to: indexMapping.get(to),
      toI,
      ...rest,
    }));

    // Update node indices to match the new order
    orderedNodes = orderedNodes.map((node, newIndex) => ({
      ...node,
      index: newIndex,
      children: node.children.map((child) => indexMapping.get(child)),
    }));

    return { orderedNodes, updatedWires };
  }

  reorderSubGates() {
    let gatesIndices = {};
    let { orderedNodes, updatedWires } = this.reorderNodes(
      this.subGates,
      this.subWires
    );

    this.subGates = [];
    for (let i = 0; i < orderedNodes.length; i++) {
      if (orderedNodes[i].type) {
        this.subGates.push(
          new Gate(
            orderedNodes[i].x,
            orderedNodes[i].y,
            orderedNodes[i].type,
            orderedNodes[i].customName
          )
        );
      } else {
        this.subGates.push(
          getChipCopy(
            orderedNodes[i],
            orderedNodes[i].x,
            orderedNodes[i].y,
            orderedNodes[i].name
          )
        );
      }
    }

    this.subWires = [];
    for (let i = 0; i < updatedWires.length; i++) {
      this.subWires.push(
        new Wire(
          updatedWires[i].from,
          updatedWires[i].fromI,
          updatedWires[i].to,
          updatedWires[i].toI,
          updatedWires[i].midPonts,
          updatedWires[i].stateCount
        )
      );
    }
  }

  compute() {
    setTimeout(() => {
      // Assign inputs to first sub-gates
      for (let i = 0; i < this.inputCount; i++) {
        let index = this.inputIndices[i];
        this.subGates[index].currentInputs = [this.currentInputs[i]];
      }

      // Update wires inside the chip
      for (let wire of this.subWires) {
        wire.update(this.subGates);
      }

      // Compute all internal gates
      for (let gate of this.subGates) {
        gate.compute();
      }

      // Assign outputs from last gates
      this.currentOutputs = [];
      for (let i = 0; i < this.outputCount; i++) {
        let index = this.outputIndices[i];
        this.currentOutputs.push(this.subGates[index].currentOutputs[0]);
      }
    }, random() * 50 * this.subGates.length);
  }

  inputPos(i) {
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
    if (this.currentInputs.length <= i) return this.connectorDiameter;
    if (this.currentInputs[i].length > 1)
      return 4.5 * this.currentInputs[i].length + 5;
    return this.connectorDiameter;
  }

  outputPos(i) {
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
    if (this.currentOutputs.length <= i) return this.connectorDiameter;
    if (this.currentOutputs[i].length > 1)
      return 4.5 * this.currentOutputs[i].length + 5;
    return this.connectorDiameter;
  }

  show(onColour, offColour) {
    // if (this.name == "D Latch") {
    //     for (let i = 0; i < this.subGates.length; i++) {
    //         this.subGates[i].show(onColour, offColour);
    //     }
    //     for (let i = 0; i < this.subWires.length; i++) {
    //         this.subWires[i].show(this.subGates, onColour, offColour);
    //     }
    // }
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
    text(this.name, this.x, this.y);

    for (let i = 0; i < this.inputCount; i++) {
      let pos = this.inputPos(i);
      if (this.currentInputs[i].length > 1) {
        push();
        fill(0);
        rectMode(CENTER);
        rect(this.inputPos(i).x, this.inputPos(i).y, 10, this.inputSize(i));
        pop();
      } else {
        push();
        stroke(0);
        strokeWeight(this.connectorSpacing / 2);
        fill(this.currentInputs[i][0] ? onColour : offColour);
        ellipse(pos.x, pos.y, this.inputSize(i));
        pop();
      }

      if (
        dist(pos.x, pos.y, worldMouseX, worldMouseY) < this.inputSize(i) / 2 &&
        this.subGates[this.inputIndices[i]].customName != ""
      ) {
        push();
        stroke(0);
        strokeWeight(1);
        fill(55, 235);
        rectMode(CENTER);
        rect(
          worldMouseX,
          worldMouseY,
          textWidth(this.subGates[this.inputIndices[i]].customName) + 20,
          20
        );

        noStroke();
        fill(255);
        textAlign(CENTER, CENTER);
        text(
          this.subGates[this.inputIndices[i]].customName,
          worldMouseX,
          worldMouseY
        );
        pop();
      }
    }

    for (let i = 0; i < this.outputCount; i++) {
      let pos = this.outputPos(i);
      if (this.currentOutputs[i].length > 1) {
        push();
        fill(0);
        rectMode(CENTER);
        rect(this.outputPos(i).x, this.outputPos(i).y, 10, this.outputSize(i));
        pop();
      } else {
        push();
        stroke(0);
        strokeWeight(this.connectorSpacing / 2);
        fill(this.currentOutputs[i][0] ? onColour : offColour);
        ellipse(pos.x, pos.y, this.outputSize(i));
      }

      if (
        dist(pos.x, pos.y, worldMouseX, worldMouseY) <
          max(this.connectorDiameter, 4.5 * this.currentOutputs[i].length) /
            2 &&
        this.subGates[this.outputIndices[i]].customName != ""
      ) {
        push();
        stroke(0);
        strokeWeight(1);
        fill(55, 235);
        rectMode(CENTER);
        rect(
          worldMouseX,
          worldMouseY,
          textWidth(this.subGates[this.outputIndices[i]].customName) + 20,
          20
        );

        noStroke();
        fill(255);
        textAlign(CENTER, CENTER);
        text(
          this.subGates[this.outputIndices[i]].customName,
          worldMouseX,
          worldMouseY
        );
        pop();
      }
    }
    pop();

    this.showLabel();
  }

  showLabel() {
    if (
      this.customName != "" &&
      worldMouseX > this.x - this.width / 2 + 7.5 &&
      worldMouseX < this.x + this.width / 2 - 7.5 &&
      worldMouseY > this.y - this.height / 2 &&
      worldMouseY < this.y + this.height / 2
    ) {
      push();
      fill(55, 235);
      rectMode(CENTER);
      rect(worldMouseX, worldMouseY, textWidth(this.customName) + 20, 20);

      fill(255);
      textAlign(CENTER, CENTER);
      text(this.customName, worldMouseX, worldMouseY);
      pop();
    }
  }

  static fromGates(x, y, gates, wires) {
    return new Chip(x, y, gates.length, wires.length, gates, wires);
  }
}

function getChipCopy(chip, x, y, name, customName) {
  if (!customName) customName = "";
  if (!chip.name)
    return new Gate(
      x ? x : chip.x,
      y ? y : chip.y,
      chip.type,
      customName != "" ? customName : chip.customName
    );
  if (name == "SEGMENTED-DISPLAY") {
    return new SegmentedDisplay(x, y);
  } else if (
    name.startsWith("CONVERTER") ||
    chip.name.startsWith("CONVERTER")
  ) {
    return new ConverterChip(
      x ? x : chip.x,
      y ? y : chip.y,
      chip.fromConverter,
      chip.to
    );
  }
  let tempGates = [];
  for (let i = 0; i < chip.subGates.length; i++) {
    let currentGate = chip.subGates[i];
    if (currentGate.type) {
      tempGates.push(
        new Gate(
          currentGate.x,
          currentGate.y,
          currentGate.type,
          currentGate.customName
        )
      );
    } else {
      tempGates.push(getChipCopy(currentGate));
    }
  }
  let tempWires = [];
  for (let i = 0; i < chip.subWires.length; i++) {
    let currentWire = chip.subWires[i];
    tempWires.push(
      new Wire(
        currentWire.from,
        currentWire.fromI,
        currentWire.to,
        currentWire.toI,
        vectorsFromList(vectorsToList(currentWire.midPoints)),
        currentWire.stateCount
      )
    );
  }
  return new Chip(
    x ? x : chip.x,
    y ? y : chip.y,
    tempGates,
    tempWires,
    name ? name : chip.name,
    customName != "" ? customName : chip.customName
  );
}
