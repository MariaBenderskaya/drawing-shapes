PDFAnnotate.prototype.enableRectangle = function () {
    var inst = this;
    var fabricObj = inst.fabricObjects[inst.active_canvas];
    inst.active_tool = 4;
    if (inst.fabricObjects.length > 0) {
        $.each(inst.fabricObjects, function (index, fabricObj) {
            fabricObj.isDrawingMode = false;
        });
    }

    var canvas = fabricObj;
    var rectangle, isDown = false, origX, origY;
    var drawingMode = true;

    function handleMouseDown(o) {
        if (inst.active_tool !== 4 || !drawingMode) return;
        if (isDown) return;
        isDown = true;
        var pointer = canvas.getPointer(o.e);
        origX = pointer.x;
        origY = pointer.y;
        rectangle = new fabric.Rect({
            left: origX,
            top: origY,
            originX: 'left',
            originY: 'top',
            width: pointer.x - origX,
            height: pointer.y - origY,
            angle: 0,
            fill: inst.color,
            stroke: inst.borderColor,
            strokeSize: inst.borderSize,
            selectable: true,
            strokeDashArray: [5, 2]
        });
        canvas.add(rectangle);
        inst.saveHistory();
    };

    function handleMouseMove(o) {
        if (!isDown || !drawingMode) return;
        var pointer = canvas.getPointer(o.e);
        if (origX > pointer.x) {
            rectangle.set({ left: Math.abs(pointer.x) });
        }
        if (origY > pointer.y) {
            rectangle.set({ top: Math.abs(pointer.y) });
        }
        rectangle.set({ width: Math.abs(origX - pointer.x) });
        rectangle.set({ height: Math.abs(origY - pointer.y) });
        canvas.renderAll();
    };

    function handleMouseUp(o) {
        if (!isDown) return;
        isDown = false;
        if (rectangle) {
            rectangle.setCoords();
        }
        drawingMode = false;
    }

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);

    canvas.on('selection:cleared', function () {
        drawingMode = true;
        canvas.off('mouse:down');
        canvas.off('mouse:move');
        canvas.off('mouse:up');
        canvas.on('mouse:down', handleMouseDown);
        canvas.on('mouse:move', handleMouseMove);
        canvas.on('mouse:up', handleMouseUp);
    });
};


PDFAnnotate.prototype.enableCircle = function () {
    var inst = this;
    var fabricObj = inst.fabricObjects[inst.active_canvas];
    inst.active_tool = 5;
    if (inst.fabricObjects.length > 0) {
        $.each(inst.fabricObjects, function (index, fabricObj) {
            fabricObj.isDrawingMode = false;
        });
    }
    var canvas = fabricObj;
    var shape, isDown, origX, origY;
    var drawingMode=true;

    function handleMouseDown(o) {
        if (inst.active_tool !== 5) return;
        if (isDown) return;

        isDown = true;

        canvas.selection = false;
        canvas.forEachObject(function(obj) {
            obj.selectable = false;
        });

        var pointer = canvas.getPointer(o.e);
        origX = pointer.x;
        origY = pointer.y;
        shape = new fabric.Ellipse({
            left: origX,
            top: origY,
            rx: 1,
            ry: 1,
            fill: inst.color,
            stroke: inst.borderColor,
            strokeWidth: inst.borderSize,
            selectable: true,
            originX: 'center',
            originY: 'center'
        });
        canvas.add(shape);
        inst.saveHistory();
    }

    function handleMouseMove(o) {
        if (!isDown || !shape) return;
        var pointer = canvas.getPointer(o.e);
        var rx = Math.abs(origX - pointer.x);
        var ry = Math.abs(origY - pointer.y);
        if (o.e.shiftKey) {
            var radius = Math.max(rx, ry);
            shape.set({ rx: radius, ry: radius });
        } else {
            shape.set({ rx: rx, ry: ry });
        }
        canvas.renderAll();
    }

    function handleMouseUp(o) {
        if (!isDown) return;
        isDown = false;

        canvas.selection = true;
        canvas.forEachObject(function(obj) {
            obj.selectable = true;
        });

        if (shape) {
            shape.setCoords();
            drawingMode = false;
        }
        canvas.off('mouse:down', handleMouseDown);
        canvas.off('mouse:move', handleMouseMove);
        canvas.off('mouse:up', handleMouseUp);
    }

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);

    canvas.on('selection:cleared', function () {
        drawingMode = true;
        canvas.off('mouse:down');
        canvas.off('mouse:move');
        canvas.off('mouse:up');
        canvas.on('mouse:down', handleMouseDown);
        canvas.on('mouse:move', handleMouseMove);
        canvas.on('mouse:up', handleMouseUp);
    });
};


PDFAnnotate.prototype.enableLine = function () {
    var inst = this;
    var fabricObj = inst.fabricObjects[inst.active_canvas];
    inst.active_tool = 7;
    if (inst.fabricObjects.length > 0) {
        $.each(inst.fabricObjects, function (index, fabricObj) {
            fabricObj.isDrawingMode = false;
        });
    }

    var canvas = fabricObj;
    var isDown = false, line;

    canvas.off('mouse:down');
    canvas.off('mouse:move');
    canvas.off('mouse:up');

    function handleMouseDown(o) {
        if (inst.active_tool !== 7 || o.target != null) return;
        isDown = true;
        var pointer = canvas.getPointer(o.e);
        var points = [pointer.x, pointer.y, pointer.x, pointer.y];

        line = new fabric.Line(points, {
            fill: inst.borderColor,
            stroke: inst.color,
            strokeWidth: 5,
            selectable: true,
            originX: 'center',
            originY: 'center'
        });
        canvas.add(line);
        inst.saveHistory();
    }

    function handleMouseMove(o) {
        if (!isDown) return;
        var pointer = canvas.getPointer(o.e);
        line.set({ x2: pointer.x, y2: pointer.y });
        canvas.renderAll();
    }

    function handleMouseUp(o) {
        if (!isDown) return;
        isDown = false;
        canvas.renderAll();
        inst.saveHistory();
    }

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);
}

PDFAnnotate.prototype.enableAddArrow = function () {
    var inst = this;
    inst.active_tool = 3;
    var fabricObj = inst.fabricObjects[inst.active_canvas];
    if (inst.fabricObjects.length > 0) {
        $.each(inst.fabricObjects, function (fabricObj) {
            fabricObj.isDrawingMode = false;
        });
    }

    var canvas = fabricObj;
    var isDown = false;
    var line, arrow;

    canvas.off('mouse:down');
    canvas.off('mouse:move');
    canvas.off('mouse:up');

    function handleMouseDown(o) {
        if (inst.active_tool !== 3 || o.target != null) return;
        isDown = true;
        var pointer = canvas.getPointer(o.e);
        var points = [pointer.x, pointer.y, pointer.x, pointer.y];

        line = new fabric.Line(points, {
            fill: inst.borderColor,
            stroke: inst.color,
            strokeWidth: 10,
            selectable: false
        });

        arrow = new fabric.Triangle({
            angle: 0,
            fill: inst.color,
            width: 60,
            height: 60,
            top: pointer.y,
            left: pointer.x,
            originX: 'center',
            originY: 'center',
            selectable: false
        });

        canvas.add(line);
        canvas.add(arrow);
        inst.saveHistory();
    }

    function handleMouseMove(o) {
        if (!isDown) return;
        var pointer = canvas.getPointer(o.e);
        line.set({ x2: pointer.x, y2: pointer.y });

        var dx = pointer.x - line.x1;
        var dy = pointer.y - line.y1;
        var angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

        arrow.set({
            left: pointer.x,
            top: pointer.y,
            angle: angle
        });
        canvas.renderAll();
    }

    function handleMouseUp(o) {
        if (!isDown) return;
        isDown = false;

        var group = new fabric.Group([line, arrow], {
            hasBorders: true,
            hasControls: true,
            selectable: true
        });

        canvas.add(group);
        canvas.remove(line);
        canvas.remove(arrow);
        inst.saveHistory();
    }

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);
};
