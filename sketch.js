// camera vars
let zoom = 1;
let panX = 0;
let panY = 0;
let startPanX, startPanY;

let worldMouseX = 0;
let worldMouseY = 0;

let gates = [];
let wires = [];

let chips = {};

let selectedGateType = [];
let draggingGate = null;
let draggedTooFar = false;
let dragStartX, dragStartY;
let offsetX, offsetY;

let selectedWire = null;

let onColour, offColour;

let previousX, previousY;

let nameInput;

let savedChips;

let menu = document.getElementById("menu");
let currentMenuButton = null;

function windowResized() {
    resizeCanvas(
        document.getElementsByTagName("main")[0].offsetWidth,
        document.getElementsByTagName("main")[0].offsetHeight
    );
}

function setup() {
    document.getElementById("inout-menu").style.display = "none";
    createCanvas(
        document.getElementById("canvas-container").offsetWidth,
        document.getElementById("canvas-container").offsetHeight,
        document.getElementById("p5-canvas")
    );
    document.getElementById("p5-canvas").oncontextmenu = () => false;
    document.getElementById("p5-canvas").onwheel = () => false;
    document.getElementById("gate-edit-menu").oncontextmenu = () => false;

    chips["SEGMENTED-DISPLAY"] = new SegmentedDisplay(100, 100);
    chips["CONVERTER 8-4"] = new ConverterChip(100, 100, 8, 4);
    chips["CONVERTER 8-2"] = new ConverterChip(100, 100, 8, 2);
    chips["CONVERTER 8-1"] = new ConverterChip(100, 100, 8, 1);
    chips["CONVERTER 6-2"] = new ConverterChip(100, 100, 6, 2);
    chips["CONVERTER 6-1"] = new ConverterChip(100, 100, 6, 1);
    chips["CONVERTER 4-2"] = new ConverterChip(100, 100, 4, 2);
    chips["CONVERTER 4-1"] = new ConverterChip(100, 100, 4, 1);
    chips["CONVERTER 2-1"] = new ConverterChip(100, 100, 2, 1);

    chips["CONVERTER 4-8"] = new ConverterChip(100, 100, 4, 8);
    chips["CONVERTER 2-8"] = new ConverterChip(100, 100, 2, 8);
    chips["CONVERTER 1-8"] = new ConverterChip(100, 100, 1, 8);
    chips["CONVERTER 2-6"] = new ConverterChip(100, 100, 2, 6);
    chips["CONVERTER 1-6"] = new ConverterChip(100, 100, 1, 6);
    chips["CONVERTER 2-4"] = new ConverterChip(100, 100, 2, 4);
    chips["CONVERTER 1-4"] = new ConverterChip(100, 100, 1, 4);
    chips["CONVERTER 1-2"] = new ConverterChip(100, 100, 1, 2);

    console.log(chips);

    onColour = color(233, 50, 69);
    offColour = color(51, 24, 25);

    loadSavedChips();

    createButtons();

    gates.push(new Gate(width / 2 - 200, height / 2, "INPUT4"));
    gates.push(new ConverterChip(width / 2, height / 2, 4, 1));
    gates.push(new ConverterChip(width / 2 + 200, height / 2, 1, 4));
    gates.push(new SegmentedDisplay(width / 2 + 400, height / 2));

    wires.push(new Wire(0, 0, 1, 0, [], 4));

    wires.push(new Wire(1, 0, 2, 0, [], 1));
    wires.push(new Wire(1, 1, 2, 1, [], 1));
    wires.push(new Wire(1, 2, 2, 2, [], 1));
    wires.push(new Wire(1, 3, 2, 3, [], 1));

    wires.push(new Wire(2, 0, 3, 0, [], 4));

    // gates.push(new Gate(width / 2 - 100, height / 2, "INPUT"));
    // gates.push(new Gate(width / 2 + 100, height / 2 + 100, "OUTPUT"));
    // gates.push(new Gate(width / 2, height / 2, "SEGMENT"));
    // gates.push(chips["SEGMENTED-DISPLAY"]);

    // wires.push(new Wire(0, 0, 1, 0, []));
    // wires.push(new Wire(0, 1, 1, 1, []));
    // wires.push(new Wire(0, 2, 1, 2, []));
    // wires.push(new Wire(0, 3, 1, 3, []));
    // wires.push(new Wire(0, 4, 1, 4, []));
    // wires.push(new Wire(0, 5, 1, 5, []));
    // wires.push(new Wire(0, 6, 1, 6, []));

    // wires.push(new Wire(0, 0, 1, 0, [createVector(width / 2, height / 2)]));
}

function draw() {
    background(53);

    worldMouseX = (mouseX - panX) / zoom;
    worldMouseY = (mouseY - panY) / zoom;

    translate(panX, panY);
    scale(zoom);

    // frameRate(1);

    if (selectedWire) {
        selectedWire.x = worldMouseX;
        selectedWire.y = worldMouseY;

        let previousPoint =
            selectedWire.midPoints.length == 0
                ? gates[selectedWire.from].outputPos(selectedWire.fromI)
                : selectedWire.midPoints[selectedWire.midPoints.length - 1];
        if (keyIsPressed && keyCode == SHIFT) {
            if (
                abs(previousPoint.x - selectedWire.x) <
                abs(previousPoint.y - selectedWire.y)
            ) {
                selectedWire.x = previousPoint.x;
                selectedWire.y = worldMouseY;
            } else {
                selectedWire.x = worldMouseX;
                selectedWire.y = previousPoint.y;
            }
        }

        gates.push(
            new Gate(
                selectedWire.x + textWidth("OUTPUT") / 2 + 7.5 + 10,
                selectedWire.y,
                "OUTPUT"
            )
        );

        let wire = new Wire(
            selectedWire.from,
            selectedWire.fromI,
            gates.length - 1,
            0,
            selectedWire.midPoints,
            selectedWire.stateCount
        );

        wire.show(gates);

        gates.pop();
    }

    if (selectedGateType.length > 0) {
        let currentHeight = 0;
        for (let i = 0; i < selectedGateType.length; i++) {
            let chip = selectedGateType[i];
            let y = worldMouseY + currentHeight;
            chip.x = worldMouseX;
            chip.y = y;
            chip.y += chip.height / 2;
            currentHeight += chip.height;
            currentHeight += 10;
            chip.show(onColour, offColour);
        }
    }

    for (let wire of wires) {
        wire.update(gates);
        wire.show(gates, onColour, offColour);
    }

    for (let gate of gates) {
        gate.compute();
        gate.show(onColour, offColour);
    }
}

function keyPressed() {
    if (keyCode === ESCAPE) {
        selectedGateType = [];
        selectedWire = null;
    }
    if (keyCode === CONTROL) {
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
    if (name == "SEGMENTED-DISPLAY" || chip.name == "SEGMENTED-DISPLAY") {
        return new SegmentedDisplay(x ? x : chip.x, y ? y : chip.y);
    } else if (
        (name && name.startsWith("CONVERTER")) ||
        chip.name.startsWith("CONVERTER")
    ) {
        return new ConverterChip(
            x ? x : chip.x,
            y ? y : chip.y,
            chip.fromConverter,
            chip.toConverter
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

/*

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
 */
