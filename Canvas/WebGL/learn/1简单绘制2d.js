let canvas2d = document.getElementById("webgl2d");

let context = canvas2d.getContext("2d");

context.moveTo(0,0);//直线起点坐标
context.lineTo(50,50);//直线第2个点坐标
context.lineTo(0,100);//直线第3个点坐标
context.lineTo(100,200);
context.stroke();//把点连成直线绘制出来