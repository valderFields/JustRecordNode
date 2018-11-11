//设置画布的宽度和高度
var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 768;
//设置小球的半径，包括显示时间的和滚落的小球
var RADIUS = 8;
//整个画布的起点
var MARGIN_TOP = 60;
var MARGIN_LEFT = 30;
//设置要倒计时的时间为常量
//const endTime = new Date(2015,8,27,20,47,52);
//因为每次都要设置时间
//var endTime=new Date();
//endTime.setTime(endTime.getTime()+3600*1000);
//当前时间段的毫秒数
var curShowTimeSeconds = 0
//这个数组存放各个滚落的小球的抽象化实例
var balls = [];
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"]

window.onload = function(){
//为了屏幕的自适应
WINDOW_WIDTH=document.body.clientWidth;
WINDOW_HEIGHT=document.body.clientHeight;
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext("2d");
	//让倒计时占屏幕的五分之四，所以两侧的空白占整个屏幕的十分之一
//得到画笔并且设置画布的长和宽
MARGIN_LEFT=Math.round(WINDOW_WIDTH/10);
RADIUS=Math.round(WINDOW_WIDTH*4/5/108)-1;
MARGIN_TOP=Math.round(WINDOW_HEIGHT/5);
    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;
	
//得到当年时间的毫秒数
    curShowTimeSeconds = getCurrentShowTimeSeconds()
    setInterval(
        function(){
			//画出表示时间的小球，以及要滚落的小球
            render( context );
			//图像的不断更新
            update();
        }
        ,
        50
    );
}

function getCurrentShowTimeSeconds() {
	//定义当前时间
    var curTime = new Date();
	//最终时间的毫秒数减去当前时间的毫秒数
    var ret = curTime.getHours()*3600+curTime.getMinutes()*60+curTime.getSeconds();
	//将毫秒转化为秒，round() 方法可把一个数字舍入为最接近的整数
    //ret = Math.round( ret/1000 )

    return ret;
}

function update(){
//当你画出当前时间的小球后，又要取到当前时间了，我们定义它为下一个时间
    var nextShowTimeSeconds = getCurrentShowTimeSeconds();

    var nextHours = parseInt( nextShowTimeSeconds / 3600);
    var nextMinutes = parseInt( (nextShowTimeSeconds - nextHours * 3600)/60 )
    var nextSeconds = nextShowTimeSeconds % 60

    var curHours = parseInt( curShowTimeSeconds / 3600);
    var curMinutes = parseInt( (curShowTimeSeconds - curHours * 3600)/60 )
    var curSeconds = curShowTimeSeconds % 60
//当没有倒计时到这个时间的时候
    if( nextSeconds != curSeconds ){
		//当变换到小时的十位数的时候，开始滚落小球
        if( parseInt(curHours/10) != parseInt(nextHours/10) ){
            addBalls( MARGIN_LEFT + 0 , MARGIN_TOP , parseInt(curHours/10) );
        }
        if( parseInt(curHours%10) != parseInt(nextHours%10) ){
            addBalls( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(curHours/10) );
        }

        if( parseInt(curMinutes/10) != parseInt(nextMinutes/10) ){
            addBalls( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes/10) );
        }
        if( parseInt(curMinutes%10) != parseInt(nextMinutes%10) ){
            addBalls( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes%10) );
        }

        if( parseInt(curSeconds/10) != parseInt(nextSeconds/10) ){
            addBalls( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(curSeconds/10) );
        }
        if( parseInt(curSeconds%10) != parseInt(nextSeconds%10) ){
            addBalls( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(nextSeconds%10) );
        }
//将下一个时间又作为了当前时间
        curShowTimeSeconds = nextShowTimeSeconds;
    }
//更新这个滚落小球的动画
    updateBalls();
}
//这个函数用来更新滚落的小球
function updateBalls(){

    for( var i = 0 ; i < balls.length ; i ++ ){

        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;
//当滚落的小球的高度大于画布的高的时候
        if( balls[i].y >= WINDOW_HEIGHT-RADIUS ){
            balls[i].y = WINDOW_HEIGHT-RADIUS;
			//将y'方向的速度设置为负值，并且设置一定的摩擦系数
            balls[i].vy = - balls[i].vy*0.75;
        }
	}
		//将已经滚落出画布的小球删掉
		
		//取得300和cnt的最小值
		//while(balls.length>Math.sin(300,cnt))
		//{
		//	balls.pop();
		//}
		
	
    	 var cnt = 0
    for( var i = 0 ; i < balls.length ; i ++ )
        if( balls[i].x + RADIUS > 0 && balls[i].x -RADIUS < WINDOW_WIDTH )
            balls[cnt++] = balls[i]

    while( balls.length > cnt ){
        balls.pop();
    }
}

function addBalls( x , y , num ){

    for( var i = 0  ; i < digit[num].length ; i ++ )
        for( var j = 0  ; j < digit[num][i].length ; j ++ )
            if( digit[num][i][j] == 1 ){
                var aBall = {
					//取出当前要画的这个数的横纵坐标
                    x:x+j*2*(RADIUS+1)+(RADIUS+1),
                    y:y+i*2*(RADIUS+1)+(RADIUS+1),
					//设置一个加速度
                    g:1.5+Math.random(),
					//ceil() 方法执行的是向上取整计算，它返回的是大于或等于函数参数，并且与之最接近的整数。
					//这里使得x方向的速度是正4或负4
                    vx:Math.pow( -1 , Math.ceil( Math.random()*1000 ) ) * 4,
                    vy:-5,
                    color: colors[ Math.floor( Math.random()*colors.length ) ]
                }
//将这个抽象画的对象放入数组
                balls.push( aBall )
            }
}

function render( cxt ){
//为了不出现每次画的图像出现重合的效果，所以要清空画布
    cxt.clearRect(0,0,WINDOW_WIDTH, WINDOW_HEIGHT);

    var hours = parseInt( curShowTimeSeconds / 3600);
    var minutes = parseInt( (curShowTimeSeconds - hours * 3600)/60 );
    var seconds = curShowTimeSeconds % 60;
//分别传入这个小球的坐标，要画 的数是几，还有画笔
    renderDigit( MARGIN_LEFT , MARGIN_TOP , parseInt(hours/10) , cxt );
    renderDigit( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(hours%10) , cxt );
    renderDigit( MARGIN_LEFT + 30*(RADIUS + 1) , MARGIN_TOP , 10 , cxt );
    renderDigit( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(minutes/10) , cxt);
    renderDigit( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(minutes%10) , cxt);
    renderDigit( MARGIN_LEFT + 69*(RADIUS+1) , MARGIN_TOP , 10 , cxt);
    renderDigit( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(seconds/10) , cxt);
    renderDigit( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(seconds%10) , cxt);
//画出滚落的小球
    for( var i = 0 ; i < balls.length ; i ++ ){
        cxt.fillStyle=balls[i].color;

        cxt.beginPath();
        cxt.arc( balls[i].x , balls[i].y , RADIUS , 0 , 2*Math.PI , true );
        cxt.closePath();

        cxt.fill();
    }
}

function renderDigit( x , y , num , cxt ){

    cxt.fillStyle = "rgb(0,102,153)";
//此处把每一个数当作是十行七列的表格
    for( var i = 0 ; i < digit[num].length ; i ++ )
        for(var j = 0 ; j < digit[num][i].length ; j ++ )
            if( digit[num][i][j] == 1 ){
                cxt.beginPath();
				//画园的时候一定是逆时针的，最后为2π
                cxt.arc( x+j*2*(RADIUS+1)+(RADIUS+1) , y+i*2*(RADIUS+1)+(RADIUS+1) , RADIUS , 0 , 2*Math.PI )
				//只要有了关闭路径则所画的图形自动闭合
                cxt.closePath()

                cxt.fill()
            }
}

