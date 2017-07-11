/**
 * Created by Asiazdx on 2015/11/30.
 */
 //制造图形
 function shape(canvas,copy,obj){
 	this.canvas=canvas;
 	this.ctx=obj;
 	this.copy=copy;
 	this.width=this.canvas.width;
 	this.height=this.canvas.height;
 	this.type="line";
 	this.style="stroke";
 	this.strokeStyle="#000";//线的颜色
 	this.fillStyle="#000";//填充颜色
 	this.lineWidth=1;
 	this.edgeNum=5;//多边形的边数
 	this.angleNum=5;//多角形的角数
 	this.history=[];
 	this.isback=true;
 	this.xpsize=10;//橡皮擦的大小
 	this.isshowxp=true
 }
//构造形状
shape.prototype={
	init:function(){
		this.ctx.lineWidth=this.lineWidth;//定义线条粗细
		this.ctx.strokeStyle=this.strokeStyle;//描边样式
		this.ctx.fillStyle=this.fillStyle;//填充样式
	},
	//画
	draw:function(){
		var that=this;
		this.copy.onmousedown=function(e){
			var startx=e.offsetX;
			var starty=e.offsetY;
			that.copy.onmousemove=function(e){
				that.isback=true;
				that.init();
				var endx=e.offsetX;
				var endy=e.offsetY;
				that.ctx.clearRect(0,0,that.width,that.height);
				if(that.history.length){
					that.ctx.putImageData(that.history[that.history.length-1],0,0);
				}
				that[that.type](startx,starty,endx,endy);
			};
			that.copy.onmouseup=function(e){
				that.copy.onmousemove=null;
				that.copy.onmouseup=null;
				that.history.push(that.ctx.getImageData(0,0,that.width,that.height));

			};
			return false;
		}
	},
	//画线
	line:function(x,y,x1,y1){
		this.ctx.beginPath();
		this.ctx.moveTo(x,y);
		this.ctx.lineTo(x1,y1);
		this.ctx.stroke();
	},
	//画矩形
	rect:function(x,y,x1,y1){
		this.ctx.beginPath();
		this.ctx.rect(x,y,x1-x,y1-y);
		this.ctx[this.style]();
	},
	//画圆
	arc:function(x,y,x1,y1){
		this.ctx.beginPath();
		var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
		this.ctx.arc(x,y,r,0,Math.PI*2);
		this.ctx[this.style]();
	},
	//画三角(这里是等腰三角型)
	triangle:function(x,y,x1,y1){
		this.ctx.beginPath();
		this.ctx.moveTo(x,y);
		this.ctx.lineTo(x1,y1);
		this.ctx.lineTo(2*x-x1,y1);
		this.ctx.lineTo(x,y);
		this.ctx.closePath();
		this.ctx[this.style]();
	},
	//多边形
	polygon:function(x,y,x1,y1){
		this.ctx.beginPath();
		var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
		var deg=Math.PI*2/this.edgeNum;//角度
		for(var i=0;i<this.edgeNum;i++){
			this.ctx.lineTo(r*Math.cos(i*deg)+x,r*Math.sin(i*deg)+y);
		}
		this.ctx.closePath();
		this.ctx[this.style]();
	},
	//多角形
	pentagrams:function(x,y,x1,y1){
		this.ctx.beginPath();
		var R=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
		var r=R/3;
		var deg=Math.PI*2/(this.angleNum*2);
		for(var i=0;i<this.angleNum*2;i++){
			if(i%2==0){
				this.ctx.lineTo(R*Math.cos(i*deg)+x,R*Math.sin(i*deg)+y);
			}else{
				this.ctx.lineTo(r*Math.cos(i*deg)+x,r*Math.sin(i*deg)+y);
			}
		}
		this.ctx.closePath();
		this.ctx[this.style]();
	},
	//铅笔工具
	pen:function(){
		var that=this;
		this.copy.onmousedown=function(e){
			var startx=e.offsetX;
			var starty=e.offsetY;
			that.ctx.beginPath();
			that.ctx.moveTo(startx,starty);
			that.copy.onmousemove=function(e){
				that.init();
				var endx=e.offsetX;
				var endy=e.offsetY;
				that.ctx.clearRect(0,0,that.width,that.height);
				if(that.history.length>0){
					that.ctx.putImageData(that.history[that.history.length-1],0,0);

				}
				that.ctx.lineTo(endx,endy);
				that.ctx.stroke();
			};
			that.copy.onmouseup=function(){
				that.copy.onmouseup=null;
				that.copy.onmousemove=null;
				that.history.push(that.ctx.getImageData(0,0,that.width,that.height));
			};
			return false;
		}
	},
	xp:function(xpobj){
		var that=this;
		that.copy.onmousemove=function(e){
			if(!that.isshowxp){
				return false;
			}
			var movex=e.offsetX;
			var movey=e.offsetY;
			var lefts=movex-that.xpsize/2;
			var tops=movey-that.xpsize/2;
			if(lefts<0){
				lefts=0;
			}
			if(lefts>that.canvas.width-that.xpsize){
				lefts=that.canvas.width-that.xpsize;
			}
			if(tops<0){
				tops=0;
			}
			if(tops>that.canvas.height-that.xpsize){
				tops=that.canvas.height-that.xpsize;
			}
			xpobj.css({
				display:"block",
				left:lefts,
				top:tops,
				width:that.xpsize+"px",
				height:that.xpsize+"px"
			});
		};
		that.copy.onmousedown=function(e){
			that.copy.onmousemove=function(e){
				var movex=e.offsetX;
                var movey=e.offsetY;
                var lefts=movex-that.xpsize/2;
                var tops=movey-that.xpsize/2;
                if(lefts<0){
                    lefts=0;
                }
                if(lefts>that.canvas.width-that.xpsize){
                    lefts=that.canvas.width-that.xpsize;
                }
                if(tops<0){
                    tops=0;
                }
                if(tops>that.canvas.height-that.xpsize){
                    tops=that.canvas.height-that.xpsize;
                }
                xpobj.css({
                    display:"block",
                    left:lefts,
                    top:tops,
                    width:that.xpsize+"px",
                    height:that.xpsize+"px"
                });
                that.ctx.clearRect(lefts,tops,that.xpsize,that.xpsize);
			};
			that.copy.onmouseup=function(){
				that.copy.onmousemove=null;
                that.copy.onmouseup=null;
                that.xp(xpobj);
                that.history.push(that.ctx.getImageData(0,0,that.canvas.width,that.canvas.height));
			}
			return false;
		}
	},

}	