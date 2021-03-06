/**
 * Created by Asiazdx on 2015/11/30.
 */
 window.onload=function(){
 	var canvasBox=document.querySelector(".canvas-box");
 	var canvasBoxW=canvasBox.offsetWidth;
 	var canvasBoxH=canvasBox.offsetHeight;
 	var canvas=document.querySelector("canvas");
 	var ctx=canvas.getContext("2d");
 	var copy=document.querySelector(".copy");
 	canvas.width=canvasBoxW;
 	canvas.height=canvasBoxH;
 	var img=document.querySelector(".img");
 /*菜单栏选项卡*/
 	var nav=$(".menu-list");
 	 nav.hover(function(){
 	 	$(this).find(".sonMenu").stop().slideToggle();
 	 	$(".xp").css("display","none");
 	 	drawObj.isshowxp=false;
 	 	$(".selectarea").css("display","none");
 	});
 	$(".main aside").hover(function(){
 		$(".xp").css("display","none");
 	 	drawObj.isshowxp=false;
 	 	$(".selectarea").css("display","none");
 	})
 	//创建画笔
 	var drawObj=new shape(canvas,copy,ctx);
 	/*菜单栏画图*/
 	$(".sonMenu:eq(1) li").click(function(){
 		var fn=$(this).attr("data-role");
 		if(fn=="polygon"){
 			drawObj.edgeNum=prompt("请输入边数");
 		}
 		if(fn=="pentagrams"){
 			drawObj.angleNum=prompt("请输入角数");
 		}
 		if(fn!="pen"){
 			drawObj.type=fn;
 			drawObj.draw();
 		}else{
 			drawObj.pen();
 		}
 	});
 	/*工具箱中的画图*/
 	$("aside .hua li").click(function(){
 		var fn=$(this).attr("data-role");
 		if(fn=="polygon"){
 			drawObj.edgeNum=prompt("请输入边数");
 		}
 		if(fn=="pentagrams"){
 			drawObj.angleNum=prompt("请输入角数");
 		}
 		if(fn=="pentagrams-5"){
 			drawObj.edgeNum=5;
 			fn="pentagrams";
 		}
 		drawObj.type=fn;
 		drawObj.draw();
 	})
 	//新建画布
 	var newCanvas=function(){
 		if(drawObj.history.length>0){
 			save();
 		}
 		ctx.clearRect(0,0,canvas.width,canvas.height);
 	}

 	//工具箱中的铅笔工具
 	$(".tool li:nth-child(2)").click(function(){
 		drawObj.pen();
 	})
 	/*设置画图方式和颜色设置*/
 	var setStyle=function(){
 		var fn=$(this).attr("data-role");//获取画图方式
 		var fn2=$(this).val();//获取颜色
 		drawObj.style=fn;
 		if(fn=="stroke"){
 				drawObj["strokeStyle"]=fn2;
 			}else{
 				drawObj["fillStyle"]=fn2;
 			}
 			drawObj.draw();
 	}
 	
 	/*设置线条粗细*/
 	var setLineWidthAuto=function(){
 		var num=$(this).attr("data-role");
 		if(num!=='null'){
 			drawObj.lineWidth=num;
 			drawObj.draw();
 		}
 	}
 	/*自定义线条的粗细*/
 	var setLineWidth=function(){
 		var num=$(this).val();
 		drawObj.lineWidth=num;
 		drawObj.draw();
 	}
 	/*文件操作*/
 	//保存
 	var save=function(){
 		if(drawObj.history.length>0){
 			var yes=confirm("确定保存？");
 			if(yes){
 				var url=canvas.toDataURL();
 				var newurl=url.replace("image/png","stream/octet");
 				location.href=newurl;
 			}
 		}
 		ctx.clearRect(0,0,canvas.width,canvas.height);
 		drawObj.history=[];
 	}
 	//打开图片
 	$(".sonMenu:eq(0) li:nth-child(2)").click(function(){
 		ctx.clearRect(0,0,canvas.width,canvas.height);
 		ctx.drawImage(img,0,0);
 	})
 	//撤销
 	var back=function(){
 		if(drawObj.history.length==0){
 			//已经是最后了无法再撤销了
 			ctx.clearRect(0,0,canvas.width,canvas.height);
 			setTimeout(function(){
 				alert("已经无法再后退了");
 			},10);
 		}else{
 			if(drawObj.isback){
 				if(drawObj.history.length==1){
 					drawObj.history.pop();
 					ctx.clearRect(0,0,canvas.width,canvas.height);

 				}else{
 					drawObj.history.pop();
 					ctx.putImageData(drawObj.history.pop(),0,0);
 				}
 			}else{
 					ctx.putImageData(drawObj.history.pop(),0,0);
 			}
 				drawObj.isback=false;
 		}
 	}

	/*橡皮擦*/
		var xp=function(){
			var xpobj=$(".xp");
			drawObj.xp(xpobj);
			drawObj.isshowxp=true;
		}
		var setXpsize=function(){
			var xpobj=$(".xp");
			drawObj.xpsize=$(".sonMenu:eq(5) li input").val();
			drawObj.xp(xpobj);
			//drawObj.isshowxp=true;
		}
	/*选择工具*/
	$(".xz").click(function(){
		var selectarea=$(".selectarea");
		drawObj.select(selectarea);
		selectarea.css("border","1px dotted #000");
	});
	/*滤镜操作*/
	//反相
	$(".sonMenu:eq(4) li:nth-child(1)").click(function(){
		//ctx.drawImage(img,0,0);
		var dataObj=ctx.getImageData(0,0,canvas.width,canvas.height);//此处存在兼容问题（在火狐浏览器中打开）
		drawObj.rp(dataObj,0,0);
	})
	//高斯模糊
	$(".sonMenu:eq(4) li:nth-child(3)").click(function(){
		var dataObj=ctx.getImageData(0,0,canvas.width,canvas.height);
		drawObj.mosaic(dataObj,120,0,0); 
	})
	//马赛克
	// $(".sonMenu:eq(4) li:nth-child(2)").click(function(){
	// 	var dataObj=ctx.getImageData(0,0,canvas.width,canvas.height);
	// 	drawObj.masic(dataObj,120,0,0,img.width,img.height); 
	// })
 	/*绑定事件*/

 	$(".sonMenu:eq(2) li input").change(setStyle);
 	$("aside .hua-style li input").change(setStyle);

 	$(".sonMenu:eq(3) li").click(setLineWidthAuto);
 	$(".sonMenu:eq(3) li input").change(setLineWidth);

 	$("aside .lineWidth li").click(setLineWidthAuto);

 	$(".sonMenu:eq(0) li:nth-child(4)").click(save);
 	$("aside .save").click(save);
 	$(".sonMenu:eq(0) li:nth-child(3)").click(back);
 	$("aside .back").click(back);
 	$(".tool li:nth-child(1)").click(xp);
 	$(".sonMenu:eq(5) li input").change(setXpsize);
 	//新建画布
 	$(".sonMenu:eq(0) li:nth-child(1)").click(newCanvas);
 	$("aside .newCanvas").click(newCanvas);
 }	
