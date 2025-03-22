class Chip {
    constructor(x, y, subGates, subWires, name = "Chip", customName = "") {
        this.x = x;
        this.y = y;

        this.subGates = subGates;
        this.subWires = subWires;
        this.reorderSubGates();
        // console.log(this.subGates);

        this.inputCount = 0;
        this.outputCount = 0;
        this.inputIndices = [];
        this.outputIndices = [];
        for (let i = 0; i < subGates.length; i++) {
            let gate = subGates[i];
            if (gate.type == "INPUT") {
                this.inputCount++;
                this.inputIndices.push(i);
            } else if (gate.type == "OUTPUT") {
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

        this.currentInputs = Array(this.inputCount).fill(false);
        this.currentOutputs = Array(this.outputCount).fill(false);
        this.compute();

        this.connectorDiameter = 15;
        this.connectorSpacing = 5;
        this.color = [38, 122, 178];
        this.width = textWidth(name) + 15 + 20;
        this.height =
            this.connectorSpacing +
            (this.connectorSpacing + this.connectorDiameter) *
                max(this.inputCount, this.outputCount);
        x;
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
                    updatedWires[i].toI
                )
            );
        }
    }

    compute() {
        setTimeout(() => {
            // Assign inputs to first sub-gates
            for (let i = 0; i < this.inputCount; i++) {
                let index = this.inputIndices[i];
                this.subGates[index].currentInputs[0] =
                    this.currentInputs[index];
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
                this.currentOutputs.push(
                    this.subGates[index].currentOutputs[0]
                );
            }
        }, random() * 50 * this.subGates.length);
    }

    inputPos(i) {
        return createVector(
            this.x - this.width / 2,
            (this.connectorSpacing + this.connectorDiameter) / 2 +
                this.y +
                (this.connectorSpacing + this.connectorDiameter) *
                    (i - this.inputCount / 2)
        );
    }

    outputPos(i) {
        return createVector(
            this.x + this.width / 2,
            (this.connectorSpacing + this.connectorDiameter) / 2 +
                this.y +
                (this.connectorSpacing + this.connectorDiameter) *
                    (i - this.outputCount / 2)
        );
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
            fill(this.currentInputs[i] ? onColour : offColour);
            let pos = this.inputPos(i);
            ellipse(pos.x, pos.y, this.connectorDiameter);

            if (
                dist(pos.x, pos.y, mouseX, mouseY) <
                    this.connectorDiameter / 2 &&
                this.subGates[this.inputIndices[i]].customName != ""
            ) {
                push();
                stroke(0);
                strokeWeight(1);
                fill(55, 235);
                rectMode(CENTER);
                rect(
                    mouseX,
                    mouseY,
                    textWidth(this.subGates[this.inputIndices[i]].customName) +
                        20,
                    20
                );

                noStroke();
                fill(255);
                textAlign(CENTER, CENTER);
                text(
                    this.subGates[this.inputIndices[i]].customName,
                    mouseX,
                    mouseY
                );
                pop();
            }
        }

        for (let i = 0; i < this.outputCount; i++) {
            fill(this.currentOutputs[i] ? onColour : offColour);
            let pos = this.outputPos(i);
            ellipse(pos.x, pos.y, this.connectorDiameter);

            if (
                dist(pos.x, pos.y, mouseX, mouseY) <
                    this.connectorDiameter / 2 &&
                this.subGates[this.outputIndices[i]].customName != ""
            ) {
                push();
                stroke(0);
                strokeWeight(1);
                fill(55, 235);
                rectMode(CENTER);
                rect(
                    mouseX,
                    mouseY,
                    textWidth(this.subGates[this.outputIndices[i]].customName) +
                        20,
                    20
                );

                noStroke();
                fill(255);
                textAlign(CENTER, CENTER);
                text(
                    this.subGates[this.outputIndices[i]].customName,
                    mouseX,
                    mouseY
                );
                pop();
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
                currentWire.toI
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
