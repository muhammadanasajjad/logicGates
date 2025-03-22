let gates = [];
let wires = [];

let chips = {};

let selectedGateType = [];
let draggingGate = null;
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
    createCanvas(
        document.getElementsByTagName("main")[0].offsetWidth,
        document.getElementsByTagName("main")[0].offsetHeight
    );
    document.getElementsByTagName("main")[0].oncontextmenu = () => false;

    chips["SEGMENTED-DISPLAY"] = new SegmentedDisplay(100, 100);
    console.log(chips);

    onColour = color(233, 50, 69);
    offColour = color(51, 24, 25);

    loadSavedChips();

    createButtons();

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

function loadSavedChips() {
    savedChips = JSON.parse(localStorage.getItem("chips")) || {};

    for (let i = 0; i < Object.keys(savedChips).length; i++) {
        let name = Object.keys(savedChips)[i];
        if (!chips[name]) loadSavedChip(name);
        const container = document.getElementById("gates-container");
        const button = document.createElement("button");

        const buttonId = name + "-creation-button";
        button.id = buttonId;
        button.textContent = name;

        if (!chips[name]) {
            let gate = new Gate(mouseX, mouseY, name);
            button.onclick = () => selectedGateType.push(getChipCopy(gate));
        } else {
            let chip;
            chip = new Chip(
                mouseX,
                mouseY,
                chips[name].subGates,
                chips[name].subWires,
                name
            );
            if (name == "SEGMENTED-DISPLAY") {
                chip = new SegmentedDisplay(mouseX, y);
            }
            button.onclick = () => selectedGateType.push(getChipCopy(chip));
        }
        button.addEventListener("contextmenu", function (event) {
            console.log(event);
            event.preventDefault(); // Prevent default menu

            currentMenuButton = name;
            menu.style.left = `${event.pageX}px`;
            menu.style.bottom = `${windowHeight - event.pageY}px`;
            menu.style.display = "block";
            menu.style.zIndex = 100;
        });
        container.appendChild(button);
    }
}

function loadSavedChip(name, x = 0, y = 0) {
    let savedChip = savedChips[name];
    console.log("--------------", name, "--------------");
    console.log(savedChip);
    let chip;
    let subGates = [];
    for (let i = 0; i < savedChip.gates.length; i++) {
        if (savedChip.gates[i].type) {
            console.log(savedChip.gates[i]);
            subGates.push(
                new Gate(
                    savedChip.gates[i].x < 1 &&
                    savedChip.gates[i].x > 0 &&
                    savedChip.gates[i].x % 0.5 != 0
                        ? savedChip.gates[i].x * width
                        : savedChip.gates[i].x,
                    savedChip.gates[i].y < 1 &&
                    savedChip.gates[i].y > 0 &&
                    savedChip.gates[i].y % 0.5 != 0
                        ? savedChip.gates[i].y * height
                        : savedChip.gates[i].y,
                    savedChip.gates[i].type,
                    savedChip.gates[i].customName
                )
            );
        } else if (chips[savedChip.gates[i].name]) {
            let currentChip = chips[savedChip.gates[i].name];

            let chipCopy = getChipCopy(
                currentChip,
                savedChip.gates[i].x < 1
                    ? savedChip.gates[i].x * width
                    : savedChip.gates[i].x,
                savedChip.gates[i].y < 1
                    ? savedChip.gates[i].y * height
                    : savedChip.gates[i].y,
                savedChip.gates[i].name,
                savedChip.gates[i].customName
            );
            subGates.push(chipCopy);
        } else {
            let chipCopy = loadSavedChip(
                savedChip.gates[i].name,
                savedChip.gates[i].x < 1
                    ? savedChip.gates[i].x * width
                    : savedChip.gates[i].x,
                savedChip.gates[i].y < 1
                    ? savedChip.gates[i].y * height
                    : savedChip.gates[i].y,
                savedChip.gates[i].customName
            );

            subGates.push(chipCopy);
        }
    }

    let subWires = [];
    for (let i = 0; i < savedChip.wires.length; i++) {
        subWires.push(
            new Wire(
                savedChip.wires[i].from,
                savedChip.wires[i].fromI,
                savedChip.wires[i].to,
                savedChip.wires[i].toI
            )
        );
    }

    chip = new Chip(x, y, subGates, subWires, name);
    chips[name] = chip;
    return chip;
}

function createButtons() {
    document.addEventListener("click", function () {
        menu.style.display = "none"; // Hide menu when clicking elsewhere
        currentMenuButton = null;
    });

    document.getElementById("view-menu-button").onclick = () => {
        menu.style.display = "none";

        let chip = chips[currentMenuButton];
        gates = [];
        wires = [];
        if (chip) {
            for (let gate of chip.subGates) {
                gates.push(getChipCopy(gate));
            }
            for (let wire of chip.subWires) {
                wires.push(new Wire(wire.from, wire.fromI, wire.to, wire.toI));
            }
        }

        nameInput.value = currentMenuButton;

        currentMenuButton = null;
    };

    document.getElementById("delete-menu-button").onclick = () => {
        menu.style.display = "none";
        delete savedChips[currentMenuButton];
        delete chips[currentMenuButton];

        localStorage.setItem("chips", JSON.stringify(savedChips));

        let buttonId = currentMenuButton + "-creation-button";
        let button = document.getElementById(buttonId);
        button.remove();

        currentMenuButton = null;
    };

    let buttonAnd = document.getElementById("AND-creation-button");
    buttonAnd.onclick = () =>
        selectedGateType.push(new Gate(mouseX, mouseY, "AND"));

    let buttonOr = document.getElementById("OR-creation-button");
    buttonOr.onclick = () =>
        selectedGateType.push(new Gate(mouseX, mouseY, "OR"));

    let buttonNot = document.getElementById("NOT-creation-button");
    buttonNot.onclick = () =>
        selectedGateType.push(new Gate(mouseX, mouseY, "NOT"));

    let buttonInput = document.getElementById("INPUT-creation-button");
    buttonInput.onclick = () =>
        selectedGateType.push(new Gate(mouseX, mouseY, "INPUT"));

    let buttonOutput = document.getElementById("OUTPUT-creation-button");
    buttonOutput.onclick = () =>
        selectedGateType.push(new Gate(mouseX, mouseY, "OUTPUT"));

    let SegmentedDisplayButton = document.getElementById(
        "SEGMENTED-DISPLAY-creation-button"
    );
    SegmentedDisplayButton.onclick = () =>
        selectedGateType.push(new SegmentedDisplay(mouseX, mouseY));

    let segmentedHandler = document.getElementById(
        "SEGMENTED-HANDLER-creation-button"
    );
    segmentedHandler.onclick = () =>
        selectedGateType.push(new Gate(mouseX, mouseY, "HANDLER"));

    let buttonSave = document.getElementById("save-menu-button");

    buttonSave.onclick = () => {
        chips[nameInput.value] = new Chip(
            height / 2,
            width / 2,
            gates,
            wires,
            nameInput.value
        );

        const container = document.getElementById("gates-container");
        const button = document.createElement("button");

        const buttonId = nameInput.value + "-creation-button";
        button.id = buttonId;
        button.textContent = nameInput.value;

        button.onclick = () =>
            selectedGateType.push(getChipCopy(chip[nameInput.value]));
        button.addEventListener("contextmenu", function (event) {
            console.log(event);
            event.preventDefault(); // Prevent default menu

            currentMenuButton = nameInput.value;
            menu.style.left = `${event.pageX}px`;
            menu.style.bottom = `${windowHeight - event.pageY}px`;
            menu.style.display = "block";
            menu.style.zIndex = 100;
        });

        container.appendChild(button);

        let saveFile = { gates: [], wires: [] };
        for (let i = 0; i < gates.length; i++) {
            console.log(gates[i].x, gates[i].y);
            saveFile.gates.push({
                x: gates[i].x / width,
                y: gates[i].y / height,
                type: gates[i].type,
                name: gates[i].name,
                customName: gates[i].customName,
            });
        }
        for (let i = 0; i < wires.length; i++) {
            saveFile.wires.push({
                from: wires[i].from,
                fromI: wires[i].fromI,
                to: wires[i].to,
                toI: wires[i].toI,
            });
        }
        savedChips[nameInput.value] = saveFile;
        console.log(JSON.stringify(savedChips));

        // Save to localStorage
        localStorage.setItem("chips", JSON.stringify(savedChips));

        gates = [];
        wires = [];
    };

    nameInput = document.getElementById("current-chip-name-field");
}

function draw() {
    background(53);

    if (selectedWire) {
        selectedWire.x = mouseX;
        selectedWire.y = mouseY;

        let previousPoint =
            selectedWire.midPoints.length == 0
                ? gates[selectedWire.from].outputPos(selectedWire.fromI)
                : selectedWire.midPoints[selectedWire.midPoints.length - 1];
        if (keyIsPressed && keyCode == SHIFT) {
            console.log(selectedWire);
            if (
                abs(previousPoint.x - selectedWire.x) <
                abs(previousPoint.y - selectedWire.y)
            ) {
                selectedWire.x = previousPoint.x;
                selectedWire.y = mouseY;
            } else {
                selectedWire.x = mouseX;
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
            selectedWire.midPoints
        );

        wire.show(gates, onColour, offColour);

        gates.pop();
    }

    if (selectedGateType.length > 0) {
        let currentHeight = 0;
        for (let i = 0; i < selectedGateType.length; i++) {
            let chip = selectedGateType[i];
            let y = mouseY + currentHeight;
            chip.x = mouseX;
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

function doLinesIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    // Helper function to calculate the orientation of three points
    function orientation(a, b, c) {
        const val = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
        if (val === 0) return 0; // Collinear
        return val > 0 ? 1 : 2; // Clockwise or counterclockwise
    }

    // Helper function to check if point q lies on segment pr
    function onSegment(p, q, r) {
        return (
            q.x <= Math.max(p.x, r.x) &&
            q.x >= Math.min(p.x, r.x) &&
            q.y <= Math.max(p.y, r.y) &&
            q.y >= Math.min(p.y, r.y)
        );
    }

    // Convert input points to objects for easier handling
    const p1 = { x: x1, y: y1 };
    const p2 = { x: x2, y: y2 };
    const p3 = { x: x3, y: y3 };
    const p4 = { x: x4, y: y4 };

    // Calculate orientations
    const o1 = orientation(p1, p2, p3);
    const o2 = orientation(p1, p2, p4);
    const o3 = orientation(p3, p4, p1);
    const o4 = orientation(p3, p4, p2);

    // General case: Lines intersect if orientations are different
    if (o1 !== o2 && o3 !== o4) return true;

    // Special cases: Collinear points
    if (o1 === 0 && onSegment(p1, p3, p2)) return true;
    if (o2 === 0 && onSegment(p1, p4, p2)) return true;
    if (o3 === 0 && onSegment(p3, p1, p4)) return true;
    if (o4 === 0 && onSegment(p3, p2, p4)) return true;

    // If none of the above, lines do not intersect
    return false;
}

function isPointInRotatedRectangle(
    x,
    y,
    rectCenterX,
    rectCenterY,
    rectWidth,
    rectHeight,
    rectRotation
) {
    // Translate the point so the rectangle's center is at the origin
    const translatedX = x - rectCenterX;
    const translatedY = y - rectCenterY;

    // Calculate the sine and cosine of the negative rotation angle
    const angle = -rectRotation;
    const cosA = cos(angle);
    const sinA = sin(angle);

    // Rotate the translated point
    const rotatedX = translatedX * cosA - translatedY * sinA;
    const rotatedY = translatedX * sinA + translatedY * cosA;

    // Check if the rotated point is within the bounds of the unrotated rectangle
    const halfWidth = rectWidth / 2;
    const halfHeight = rectHeight / 2;

    return (
        rotatedX >= -halfWidth &&
        rotatedX <= halfWidth &&
        rotatedY >= -halfHeight &&
        rotatedY <= halfHeight
    );
}

function del() {
    for (let i = gates.length - 1; i >= 0; i--) {
        let gate = gates[i];
        if (
            mouseX > gate.x - gate.width / 2 &&
            mouseX < gate.x + gate.width / 2 &&
            mouseY > gate.y - gate.height / 2 &&
            mouseY < gate.y + gate.height / 2
        ) {
            for (let j = wires.length - 1; j >= 0; j--) {
                if (wires[j].from == i || wires[j].to == i) {
                    wires.splice(j, 1);
                } else {
                    if (wires[j].from > i) {
                        wires[j].from--;
                    }
                    if (wires[j].to >= i) {
                        wires[j].to--;
                    }
                }
            }

            gates.splice(i, 1);
            break;
        }
    }

    for (let i = wires.length - 1; i >= 0; i--) {
        let wire = wires[i];
        console.log(wire.to, gates.length);
        let fromPos = gates[wire.from].outputPos(wire.fromI);
        let toPos = gates[wire.to].inputPos(wire.toI);

        let points = [fromPos, ...wire.midPoints, toPos];
        for (let j = 0; j < points.length - 1; j++) {
            let p1x = points[j].x;
            let p1y = points[j].y;
            let p2x = points[j + 1].x;
            let p2y = points[j + 1].y;
            if (
                doLinesIntersect(
                    p1x,
                    p1y,
                    p2x,
                    p2y,
                    mouseX,
                    mouseY,
                    previousX,
                    previousY
                )
            ) {
                wires.splice(i, 1);
            }
        }
    }
}

function mousePressed() {
    if (document.getElementById("gate-edit-menu").style.display == "block")
        return;
    if (mouseY > height - 60) return; // Prevent clicking buttons

    if (mouseButton == LEFT) {
        // Place new gate if a type is selected
        if (selectedGateType.length > 0) {
            for (let i = 0; i < selectedGateType.length; i++) {
                console.log(selectedGateType[i].x, selectedGateType[i].y);
                gates.push(getChipCopy(selectedGateType[i]));
            }
            selectedGateType = [];
        } else {
            // Check if user is clicking on a gate to drag
            for (let gate of gates) {
                if (
                    mouseX > gate.x - gate.width / 2 + 7.5 &&
                    mouseX < gate.x + gate.width / 2 - 7.5 &&
                    mouseY > gate.y - gate.height / 2 &&
                    mouseY < gate.y + gate.height / 2
                ) {
                    draggingGate = gate;
                    offsetX = mouseX - gate.x;
                    offsetY = mouseY - gate.y;
                    dragStartX = mouseX;
                    dragStartY = mouseY;
                    break;
                }
            }
        }
    } else if (mouseButton == RIGHT) {
        previousX = mouseX;
        previousY = mouseY;
        del();
    }
}

function mouseDragged() {
    if (document.getElementById("gate-edit-menu").style.display == "block")
        return;
    if (mouseButton == LEFT) {
        if (draggingGate && dist(mouseX, mouseY, dragStartX, dragStartY) > 20) {
            draggingGate.x = mouseX - offsetX;
            draggingGate.y = mouseY - offsetY;
        }
    } else if (mouseButton == RIGHT) {
        del();
        previousX = mouseX;
        previousY = mouseY;
    }
}

function mouseReleased() {
    if (document.getElementById("gate-edit-menu").style.display == "block")
        return;
    if (mouseButton == LEFT) {
        for (let i = 0; i < gates.length; i++) {
            let gate = gates[i];
            let clickedInputsOutputs = false;

            if (!selectedWire) {
                for (let j = 0; j < gate.outputCount; j++) {
                    if (
                        dist(
                            mouseX,
                            mouseY,
                            gate.outputPos(j).x,
                            gate.outputPos(j).y
                        ) < 10 &&
                        gate.type != "OUTPUT"
                    ) {
                        selectedWire = {
                            from: i,
                            fromI: j,
                            to: null,
                            toI: null,
                            midPoints: [],
                        };
                        clickedInputsOutputs = true;
                    }
                }
                for (let j = 0; j < gate.inputCount; j++) {
                    if (
                        dist(
                            mouseX,
                            mouseY,
                            gate.inputPos(j).x,
                            gate.inputPos(j).y
                        ) < 10
                    ) {
                        gate.currentInputs[j] = !gate.currentInputs[j];
                    }
                }
            } else {
                let f = false;
                for (let j = 0; j < gate.inputCount; j++) {
                    if (
                        dist(
                            mouseX,
                            mouseY,
                            gate.inputPos(j).x,
                            gate.inputPos(j).y
                        ) < 10 &&
                        gate.type != "INPUT"
                    ) {
                        selectedWire.to = i;
                        selectedWire.toI = j;
                        wires.push(
                            new Wire(
                                selectedWire.from,
                                selectedWire.fromI,
                                selectedWire.to,
                                selectedWire.toI,
                                selectedWire.midPoints.splice(
                                    0,
                                    selectedWire.midPoints.length - 1
                                )
                            )
                        );
                        selectedWire = null;
                        f = true;

                        clickedInputsOutputs = true;
                        break;
                    }
                }
                if (
                    !f &&
                    selectedWire &&
                    selectedWire.x &&
                    selectedWire.y &&
                    (selectedWire.midPoints.length == 0 ||
                        selectedWire.x !=
                            selectedWire.midPoints[
                                selectedWire.midPoints.length - 1
                            ].x) &&
                    (selectedWire.midPoints.length == 0 ||
                        selectedWire.y !=
                            selectedWire.midPoints[
                                selectedWire.midPoints.length - 1
                            ].y)
                ) {
                    console.log(f);
                    selectedWire.midPoints.push(
                        createVector(selectedWire.x, selectedWire.y)
                    );
                }
            }

            if (
                !clickedInputsOutputs &&
                mouseX > gate.x - gate.width / 2 + 7.5 &&
                mouseX < gate.x + gate.width / 2 - 7.5 &&
                mouseY > gate.y - gate.height / 2 &&
                mouseY < gate.y + gate.height / 2 &&
                !(
                    draggingGate &&
                    dist(mouseX, mouseY, dragStartX, dragStartY) > 20
                )
            ) {
                let editMenu = document.getElementById("gate-edit-menu");

                editMenu.style.left = `${mouseX}px`;
                editMenu.style.top = `calc(${mouseY}px + 2rem)`;
                editMenu.style.display = "block";
                editMenu.style.zIndex = 100;

                let inp = document.getElementById("gate-custom-name-field");
                inp.value = gate.customName;
                inp.oninput = () => {
                    gate.customName = document.getElementById(
                        "gate-custom-name-field"
                    ).value;
                };
                inp.addEventListener("keydown", (event) => {
                    if (event.key === "Enter") {
                        editMenu.style.display = "none";
                    }
                });
            }
        }
    }
    if (mouseButton == LEFT) {
        draggingGate = null;
    }

    // if (selectedWire) {
    //     for (let i = 0; i < gates.length; i++) {
    //         let gate = gates[i];
    //         for (let j = 0; j < gate.inputCount; j++) {}
    //     }
    //     selectedWire = null;
    // }
}
