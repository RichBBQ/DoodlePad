    var canvas;
    var widgets;
    var sizePreviewCanvas;
    var ctx ;
    var sPctx;
    var frameRate = 1000/100;
    borderX = 670;
    borderY = 490;
    
    var drawActive = true;
    
    var strokeStyle = "black";
    
    var maxSize = 30;
    var ballSize = 1;
    var lineSize = 2;
    
    var oldX;
    var oldY;
    var curX;
    var curY;
    
    var moveObjOffsetX;
    var moveObjOffsetY;
    
    var isMouseDown = false;
    var eventLoop = 0;
    
    var sliderBase;
    var sliderNob;
    var sliderMouseDown = false;
    var sliderBaseWidth = 144;
    
    var widgetMouseDown = false;
    var canvasOffsetLeft;
    var canvasOffsetTop;

    var socket;
    var socketSite = 'http://rshentestnode.cloudfoundry.com';
    
    function init() {
        //setUpSocket();
        canvas = document.getElementById("canvas");  
        widgets = document.getElementById("div_widgets");
        sliderBase = document.getElementById("slider_base");
        sliderNob = document.getElementById("slider_nob");
        sizePreviewCanvas = document.getElementById("size_preview_canvas");
        
        ctx= canvas.getContext("2d");
        sPctx = sizePreviewCanvas.getContext("2d");
        
        setUpMouseHandlers();
        setUpDocHandlers();
        
        canvasOffsetLeft = canvas.offsetLeft;
        canvasOffsetTop = canvas.offsetTop;
        
        clearCanvas(ctx, borderX, borderY, "white");
        resetSizePreview();
    }

    function setUpSocket() {
        socket = io.connect(socketSite);
        socket.on('peer draw event', function (d){
            drawLine(ctx, d.startX, d.startY, d.endX, d.endY, d.strokeStyle, d.lineSize, d.ballSize);
        });
    }
    
    function resetSizePreview(){
        clearCanvas(sPctx, 60, 60, "white");
        drawDot(sPctx, 30, 30, strokeStyle, ballSize);
    }
    
    function genericEventLoop(){
        if (isMouseDown){
            drawingLoopHandler();
        }
        else if (widgetMouseDown){
            moveWidgetHandler();
        }
        else if(sliderMouseDown) {
            moveNobHandler();
        }
    }
    
    function canvasMouseDownHandler(e) {
        if(eventLoop != 0) clearInterval(eventLoop);
        
        oldX = (e.clientX-canvasOffsetLeft);
        oldY = (e.clientY-canvasOffsetTop);
        isMouseDown = true;
        eventLoop = setInterval(genericEventLoop, frameRate);
    }
    
    function canvasMouseUpHandler(e){
        isMouseDown = false;
        widgetMouseDown = false;
        sliderMouseDown = false;
        clearInterval(eventLoop);
    }
    
    function drawingLoopHandler() {
        var canvX = curX - canvasOffsetLeft;
        var canvY = curY - canvasOffsetTop;
        drawLine(ctx, oldX, oldY, canvX, canvY, strokeStyle, lineSize, ballSize);
        if (socket) {
            socket.emit('draw event', {
                startX: oldX,
                startY: oldY,
                endX: canvX, 
                endY: canvY, 
                strokeStyle: strokeStyle, 
                lineSize: lineSize,
                ballSize: ballSize, 
            });
        }
        oldX = canvX;
        oldY = canvY;
    }
    
    function widgetMouseDownHandler(e) {
        if(sliderMouseDown) return;
        if(eventLoop != 0) clearInterval(eventLoop);
        widgetMouseDown = true;
        moveObjOffsetX = curX - widgets.offsetLeft;
        moveObjOffsetY = curY - widgets.offsetTop;
        eventLoop = setInterval(genericEventLoop, frameRate);
    }
    
    function widgetMouseUpHandler(e) {
        clearInterval(eventLoop);
        widgetMouseDown = false;
    }
    
    function moveWidgetHandler(e) {
        if (!widgetMouseDown) return;
        moveObj(widgets, (curX-moveObjOffsetX), (curY-moveObjOffsetY));
    }
    
    function sliderNobDownHandler(e) {
        if(eventLoop != 0) clearInterval(eventLoop);
        sliderMouseDown = true;
        eventLoop = setInterval(genericEventLoop, frameRate);
    }
    
    function sliderNobUpHandler(e){
        clearInterval(eventLoop);
        sliderMouseDown = false;
    }
    
    function moveNobHandler() {
        if(!sliderMouseDown) return;
        var nobOffset = (curX - widgets.offsetLeft - sliderBase.offsetLeft);
        if( nobOffset>=3 && nobOffset<=sliderBaseWidth ){
            sliderNob.style.left = nobOffset+"px";
            var newSize = maxSize * (nobOffset/sliderBaseWidth);
            ballSize = newSize;
            lineSize = newSize*2;
            resetSizePreview();
        }
    }
    
    function setUpMouseHandlers() {
        canvas.onmousedown = canvasMouseDownHandler;
        canvas.onmouseup = canvasMouseUpHandler;
        canvas.ondbclick = canvasMouseUpHandler;
        widgets.onmousedown = widgetMouseDownHandler;
        widgets.onmouseup = widgetMouseUpHandler;
        widgets.onmouseover = function () {widgets.style.opacity = 1; }
        widgets.onmouseout = function () {widgets.style.opacity = 0.4; }
        sliderBase.onmousedown = sliderNobDownHandler;
        sliderBase.onmouseup = sliderNobUpHandler;
    }
    
    function docMouseMoveHandler(e) {
        curX = e.pageX;
        curY = e.pageY;
    }
    
    function setUpDocHandlers(e) {
        document.onmouseup = canvasMouseUpHandler;
        document.onmousemove = docMouseMoveHandler;
    }
    
    function drawLine(dctx, sx, sy, ex, ey, ss, ls, bs) {
        dctx.beginPath();
        dctx.strokeStyle = ss;
        dctx.lineWidth = ls;
        dctx.moveTo(sx, sy);
        dctx.lineTo(ex, ey);
        dctx.closePath();
        dctx.stroke();
        
        // Finishing touch for the line to prevent ugly line 
        drawDot(dctx, sx, sy, ss, bs);
        drawDot(dctx, ex, ey, ss, bs);
    }
    
    function drawDot(dctx, x, y, ss, bs) {
        dctx.fillStyle = ss;
        dctx.beginPath();
        dctx.arc(x, y, bs, 0, Math.PI*2, true);
        dctx.closePath();
        dctx.fill();
    }
    
    function clearCanvas(cctx, Xbound, Ybound, color) {
        cctx.fillStyle = color;
        cctx.fillRect(0,0,Xbound, Ybound);
    }
    
    function moveObj(obj, mvLeft, mvTop) {
        obj.style.position = "absolute";
        obj.style.left = mvLeft;
        obj.style.top = mvTop;
    }
    
    function changeColor(newColor) {
        strokeStyle = newColor;
        resetSizePreview();
    }