const element = document.getElementById("p5-canvas");

element.addEventListener("mousedown", (e) => {
    document.getElementById("inout-menu").style.display = "none";
    if (mouseY > height - 60) return;

    if (e.button === 0) {
        // Left mouse
        if (selectedGateType.length > 0) {
            for (let i = 0; i < selectedGateType.length; i++) {
                console.log(selectedGateType[i].x, selectedGateType[i].y);
                gates.push(getChipCopy(selectedGateType[i]));
            }
            selectedGateType = [];
        } else {
            draggingGate = null;
            for (let gate of gates) {
                if (
                    worldMouseX > gate.x - gate.width / 2 + 7.5 &&
                    worldMouseX < gate.x + gate.width / 2 - 7.5 &&
                    worldMouseY > gate.y - gate.height / 2 &&
                    worldMouseY < gate.y + gate.height / 2
                ) {
                    draggingGate = gate;
                    offsetX = worldMouseX - gate.x;
                    offsetY = worldMouseY - gate.y;
                    dragStartX = worldMouseX;
                    dragStartY = worldMouseY;
                    break;
                }
            }

            let f = false;
            if (!draggingGate && selectedWire) {
                for (let i = 0; i < gates.length; i++) {
                    let gate = gates[i];
                    for (let j = 0; j < gate.inputCount; j++) {
                        if (
                            dist(
                                worldMouseX,
                                worldMouseY,
                                gate.inputPos(j).x,
                                gate.inputPos(j).y
                            ) <
                                gate.connectorDiameter / 2 &&
                            gate.currentInputs[j].length ===
                                selectedWire.stateCount &&
                            !(gate.type && gate.type.startsWith("INPUT"))
                        ) {
                            selectedWire.to = i;
                            selectedWire.toI = j;
                            wires.push(
                                new Wire(
                                    selectedWire.from,
                                    selectedWire.fromI,
                                    selectedWire.to,
                                    selectedWire.toI,
                                    selectedWire.midPoints.splice(0),
                                    selectedWire.stateCount
                                )
                            );
                            selectedWire = null;
                            f = true;
                            clickedInputsOutputs = true;
                            break;
                        }
                    }
                }
            }
            if (!f && !draggingGate) {
                startPanX = mouseX - panX;
                startPanY = mouseY - panY;
            }
        }
    } else if (e.button === 2) {
        // Right mouse
        previousX = worldMouseX;
        previousY = worldMouseY;
        onRightClick();
    }
});

element.addEventListener("mousemove", (e) => {
    // Update mouseX and mouseY for canvas if needed (e.g., using getBoundingClientRect)
    if (document.getElementById("gate-edit-menu").style.display === "block")
        return;

    if (e.buttons === 1) {
        // Left mouse is being held
        if (draggingGate) {
            draggingGate.x = worldMouseX - offsetX;
            draggingGate.y = worldMouseY - offsetY;
        } else if (startPanX != null && startPanY != null) {
            panX = mouseX - startPanX;
            panY = mouseY - startPanY;
        }
    } else if (e.buttons === 2) {
        // Right button being held
        onRightClick();
        previousX = worldMouseX;
        previousY = worldMouseY;
    }
});

element.addEventListener("mouseup", (e) => {
    if (document.getElementById("gate-edit-menu").style.display === "block")
        return;

    if (e.button === 0) {
        // Left mouse
        for (let i = 0; i < gates.length; i++) {
            let gate = gates[i];
            let clickedInputsOutputs = false;

            if (!selectedWire) {
                for (let j = 0; j < gate.outputCount; j++) {
                    if (
                        dist(
                            worldMouseX,
                            worldMouseY,
                            gate.outputPos(j).x,
                            gate.outputPos(j).y
                        ) <
                            gate.connectorDiameter / 2 &&
                        !(gate.type && gate.type.startsWith("OUTPUT"))
                    ) {
                        selectedWire = {
                            from: i,
                            fromI: j,
                            stateCount: gate.currentOutputs[j].length,
                            to: null,
                            toI: null,
                            midPoints: [],
                        };
                        clickedInputsOutputs = true;
                    }
                }
                if (gate.type && gate.type.startsWith("INPUT")) {
                    for (let j = 0; j < gate.currentInputs[0].length; j++) {
                        if (
                            dist(
                                worldMouseX,
                                worldMouseY,
                                gate.inputPos(j).x,
                                gate.inputPos(j).y
                            ) <
                            gate.connectorDiameter / 2
                        ) {
                            gate.currentInputs[0][j] =
                                !gate.currentInputs[0][j];
                            break;
                        }
                    }
                } else {
                    for (let j = 0; j < gate.inputCount; j++) {
                        if (
                            dist(
                                worldMouseX,
                                worldMouseY,
                                gate.inputPos(j).x,
                                gate.inputPos(j).y
                            ) <
                            gate.connectorDiameter / 2
                        ) {
                            if (gate.currentInputs[j].length === 1)
                                gate.currentInputs[j][0] =
                                    !gate.currentInputs[j][0];
                        }
                    }
                }
            } else {
                if (
                    selectedWire &&
                    selectedWire.x &&
                    selectedWire.y &&
                    (selectedWire.midPoints.length === 0 ||
                        !(
                            selectedWire.x ===
                                selectedWire.midPoints.at(-1)?.x &&
                            selectedWire.y === selectedWire.midPoints.at(-1)?.y
                        ))
                ) {
                    selectedWire.midPoints.push(
                        createVector(selectedWire.x, selectedWire.y)
                    );
                }
            }
        }

        draggingGate = null;
        draggedTooFar = false;
    }

    startPanX = null;
    startPanY = null;
});

function mouseWheel(event) {
    let zoomAmount = 0.05;
    let zoomFactor = event.delta > 0 ? 1 - zoomAmount : 1 + zoomAmount;

    let wx = (mouseX - panX) / zoom;
    let wy = (mouseY - panY) / zoom;

    zoom *= zoomFactor;

    panX = mouseX - wx * zoom;
    panY = mouseY - wy * zoom;

    return false;
}

function onRightClick() {
    for (let i = gates.length - 1; i >= 0; i--) {
        let gate = gates[i];
        if (
            worldMouseX > gate.x - gate.width / 2 &&
            worldMouseX < gate.x + gate.width / 2 &&
            worldMouseY > gate.y - gate.height / 2 &&
            worldMouseY < gate.y + gate.height / 2
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

            let del = document.getElementById("gate-delete-button");
            del.onclick = () => {
                deleteGate(i);
                document.getElementById("gate-edit-menu").style.display =
                    "none";
            };
            break;
        }
    }
}
