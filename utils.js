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
            } else if (name && name.startsWith("CONVERTER")) {
                chip = new ConverterChip(
                    mouseX,
                    mouseY,
                    name.split("-")[1],
                    name.split("-")[2]
                );
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
                savedChip.wires[i].toI,
                vectorsFromList(savedChip.wires[i].midPoints),
                savedChip.wires[i].stateCount
            )
        );
    }

    chip = new Chip(x, y, subGates, subWires, name);
    chips[name] = chip;
    return chip;
}

function vectorsFromList(list) {
    let vectors = [];
    for (let i = 0; i < list.length; i++) {
        vectors.push(createVector(list[i][0], list[i][1]));
    }
    return vectors;
}

function vectorsToList(vectors) {
    let list = [];
    for (let i = 0; i < vectors.length; i++) {
        list.push([vectors[i].x, vectors[i].y]);
    }
    return list;
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
                wires.push(
                    new Wire(
                        wire.from,
                        wire.fromI,
                        wire.to,
                        wire.toI,
                        vectorsFromList(vectorsToList(wire.midPoints)),
                        wire.stateCount
                    )
                );
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

    // INPUTS
    let buttonInput = document.getElementById("INPUT-creation-button");
    buttonInput.onclick = () =>
        selectedGateType.push(new Gate(mouseX, mouseY, "INPUT"));

    let buttonInput2 = document.getElementById("INPUT2-creation-button");
    buttonInput2.onclick = () =>
        selectedGateType.push(new Gate(mouseX, mouseY, "INPUT2"));

    let buttonInput4 = document.getElementById("INPUT4-creation-button");
    buttonInput4.onclick = () =>
        selectedGateType.push(new Gate(mouseX, mouseY, "INPUT4"));

    let buttonInput6 = document.getElementById("INPUT6-creation-button");
    buttonInput6.onclick = () =>
        selectedGateType.push(new Gate(mouseX, mouseY, "INPUT6"));

    let buttonInput8 = document.getElementById("INPUT8-creation-button");
    buttonInput8.onclick = () =>
        selectedGateType.push(new Gate(mouseX, mouseY, "INPUT8"));

    let buttonOutput = document.getElementById("OUTPUT-creation-button");
    buttonOutput.onclick = () =>
        selectedGateType.push(new Gate(mouseX, mouseY, "OUTPUT"));

    let buttonOutput2 = document.getElementById("OUTPUT2-creation-button");
    buttonOutput2.onclick = () =>
        selectedGateType.push(new Gate(mouseX, mouseY, "OUTPUT2"));

    let buttonOutput4 = document.getElementById("OUTPUT4-creation-button");
    buttonOutput4.onclick = () =>
        selectedGateType.push(new Gate(mouseX, mouseY, "OUTPUT4"));

    let buttonOutput6 = document.getElementById("OUTPUT6-creation-button");
    buttonOutput6.onclick = () =>
        selectedGateType.push(new Gate(mouseX, mouseY, "OUTPUT6"));

    let buttonOutput8 = document.getElementById("OUTPUT8-creation-button");
    buttonOutput8.onclick = () =>
        selectedGateType.push(new Gate(mouseX, mouseY, "OUTPUT8"));

    let SegmentedDisplayButton = document.getElementById(
        "SEGMENTED-DISPLAY-creation-button"
    );
    SegmentedDisplayButton.onclick = () =>
        selectedGateType.push(new SegmentedDisplay(mouseX, mouseY));

    let CONVERTERCHIP84Button = document.getElementById(
        "CONVERTER-8-4-creation-button"
    );
    CONVERTERCHIP84Button.onclick = () =>
        selectedGateType.push(new ConverterChip(mouseX, mouseY, 8, 4));

    let CONVERTERCHIP82Button = document.getElementById(
        "CONVERTER-8-2-creation-button"
    );
    CONVERTERCHIP82Button.onclick = () =>
        selectedGateType.push(new ConverterChip(mouseX, mouseY, 8, 2));

    let CONVERTERCHIP81Button = document.getElementById(
        "CONVERTER-8-1-creation-button"
    );
    CONVERTERCHIP81Button.onclick = () =>
        selectedGateType.push(new ConverterChip(mouseX, mouseY, 8, 1));

    let CONVERTERCHIP62Button = document.getElementById(
        "CONVERTER-6-2-creation-button"
    );
    CONVERTERCHIP62Button.onclick = () =>
        selectedGateType.push(new ConverterChip(mouseX, mouseY, 6, 2));

    let CONVERTERCHIP61Button = document.getElementById(
        "CONVERTER-6-1-creation-button"
    );
    CONVERTERCHIP61Button.onclick = () =>
        selectedGateType.push(new ConverterChip(mouseX, mouseY, 6, 1));

    let CONVERTERCHIP42Button = document.getElementById(
        "CONVERTER-4-2-creation-button"
    );
    CONVERTERCHIP42Button.onclick = () =>
        selectedGateType.push(new ConverterChip(mouseX, mouseY, 4, 2));

    let CONVERTERCHIP41Button = document.getElementById(
        "CONVERTER-4-1-creation-button"
    );
    CONVERTERCHIP41Button.onclick = () =>
        selectedGateType.push(new ConverterChip(mouseX, mouseY, 4, 1));

    let CONVERTERCHIP21Button = document.getElementById(
        "CONVERTER-2-1-creation-button"
    );
    CONVERTERCHIP21Button.onclick = () =>
        selectedGateType.push(new ConverterChip(mouseX, mouseY, 2, 1));

    let CONVERTERCHIP48Button = document.getElementById(
        "CONVERTER-4-8-creation-button"
    );
    CONVERTERCHIP48Button.onclick = () =>
        selectedGateType.push(new ConverterChip(mouseX, mouseY, 4, 8));

    let CONVERTERCHIP28Button = document.getElementById(
        "CONVERTER-2-8-creation-button"
    );
    CONVERTERCHIP28Button.onclick = () =>
        selectedGateType.push(new ConverterChip(mouseX, mouseY, 2, 8));

    let CONVERTERCHIP18Button = document.getElementById(
        "CONVERTER-1-8-creation-button"
    );
    CONVERTERCHIP18Button.onclick = () =>
        selectedGateType.push(new ConverterChip(mouseX, mouseY, 1, 8));

    let CONVERTERCHIP26Button = document.getElementById(
        "CONVERTER-2-6-creation-button"
    );
    CONVERTERCHIP26Button.onclick = () =>
        selectedGateType.push(new ConverterChip(mouseX, mouseY, 2, 6));

    let CONVERTERCHIP16Button = document.getElementById(
        "CONVERTER-1-6-creation-button"
    );
    CONVERTERCHIP16Button.onclick = () =>
        selectedGateType.push(new ConverterChip(mouseX, mouseY, 1, 6));

    let CONVERTERCHIP24Button = document.getElementById(
        "CONVERTER-2-4-creation-button"
    );
    CONVERTERCHIP24Button.onclick = () =>
        selectedGateType.push(new ConverterChip(mouseX, mouseY, 2, 4));

    let CONVERTERCHIP14Button = document.getElementById(
        "CONVERTER-1-4-creation-button"
    );
    CONVERTERCHIP14Button.onclick = () =>
        selectedGateType.push(new ConverterChip(mouseX, mouseY, 1, 4));

    let CONVERTERCHIP12Button = document.getElementById(
        "CONVERTER-1-2-creation-button"
    );
    CONVERTERCHIP12Button.onclick = () =>
        selectedGateType.push(new ConverterChip(mouseX, mouseY, 1, 2));

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
                x: gates[i].x,
                y: gates[i].y,
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
                midPoints: vectorsToList(wires[i].midPoints),
                stateCount: wires[i].stateCount,
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

function toggleInOut() {
    document.getElementById("inout-menu").style.display =
        document.getElementById("inout-menu").style.display == "none"
            ? "block"
            : "none";

    document.getElementById("inout-menu").style.left =
        document.getElementById("INOUT-creation-button").offsetLeft + "px";
    document.getElementById("inout-menu").style.bottom =
        windowHeight -
        document.getElementById("INOUT-creation-button").offsetTop +
        "px";
}

function toggleConverter() {
    document.getElementById("converter-menu").style.display =
        document.getElementById("converter-menu").style.display == "none"
            ? "block"
            : "none";

    document.getElementById("converter-menu").style.left =
        document.getElementById("CONVERTER-creation-button").offsetLeft + "px";
    document.getElementById("converter-menu").style.bottom =
        windowHeight -
        document.getElementById("CONVERTER-creation-button").offsetTop +
        "px";
}

function deleteGate(i) {
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
}

function deleteWire(i) {
    wires.splice(i, 1);
}
