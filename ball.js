var canvas;
var context;
var w;
var h;

var x, y;
var prevx, prevy;
var R = new Array();
var X = new Array();
var Y = new Array();
var VX = new Array();
var VY = new Array();
var K;
var B;
var N;
var G;
var DT;
var grabbed;

function init() {

		canvas = document.getElementById("canvas");
		canvas.style.cursor = "pointer";

		if( canvas.getContext ) {

				context = canvas.getContext("2d");
				//context.font = "20px";				
				w = canvas.width;
				h = canvas.height;
				x = 400; y = 200;
				N = 0; G = 9.8; K = 15; B = 0.75;
				DT = 0.25;
				grabbed = -1;


				for( var i=0; i<100; i++ ) {
						R[i] = 45*Math.random()+5;
						X[i] = 400*Math.random()+200; 
						Y[i] = 200*Math.random()+100;
						VX[i] = 20*Math.random(); 
						VY[i] = 20*Math.random();
				}
						
				
				setInterval(draw,50);
				
		}
}

function Ball(x,y,vx,vy,r,k,b) {

		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.r = r;
		this.k = k;
		this.b = b;

		this.nudge = function(objects) {

				var L = objects.length;
				var nudged = 0;
				var dx, dy;

				for( var i=0; i<L; i++ ) {

						X = objects[i].closest_point(x,y);
						dx = x-X[0]; dy = y-X[1];

						if( Math.sqrt(dx*dx+dy*dy) < r ) {
								vx += k*dx*DT;
								vy += (k*dy + G)*DT;
								nudged = 1;
						}

				}

				if( nudged == 1 ) {
						vx -= b*vx*DT;
						vy -= b*vy*DT;
				}
				
		}

		this.updatePosition = function() {
				x += vx*DT;
				y += vy*DT;
		}

		this.closest_point = function(x1,y1) {

				var dx = x1-x, dy = y1-y;
				var dist = Math.sqrt(dx*dx+dy*dy);

				X = [x+r*dx/dist,y+r*dy/dist];

				return X;

		}

		this.draw() = function(objects) {

				var L = objects.length;
				var theta = new Array();
				var X = new Array(); var Y = new Array();
				var selected = new Array();
				var tmp_theta, tmp_X;
				
				theta.length = L;
				X.length = L; Y.length = L;
				selected.length = L;

				for( var i=0; i<L; i++ ) {
						selected[i] = 0;
				}

				context.save();

				context.beginPath();
				for( var i=0; i<L; i++ ) {
						
				}
				context.closePath();

				context.restore();
				
		}

}

function draw() {
		
		erase();

		context.fillText("x="+x+", y="+y+", grabbed="+grabbed,610,395);

		update_circles();
		draw_circles();
		draw_controls();

}

function update_circles() {

		// update velocities
		for( var i=0; i<N; i++ ) {
				if( i == grabbed && m_d == 1 ) {
						dx = X[i]-x;
						dy = Y[i]-y;
						dist = Math.sqrt(dx*dx+dy*dy);
						if( dist < 2*R[i] ) {
								VX[i] = 10*(x-prevx);
								VY[i] = 10*(y-prevy);
								continue;
						}
				}
				VY[i] += G*DT;
				if( X[i] < R[i] )
						VX[i] += K*(R[i]-X[i])*DT - B*VX[i]*DT;
				if( X[i] > 800-R[i] )
						VX[i] += K*(800-R[i]-X[i])*DT - B*VX[i]*DT;
				if( Y[i] < R[i] )
						VY[i] += K*(R[i]-Y[i])*DT - B*VY[i]*DT;
				if( Y[i] > 350-R[i] )
						VY[i] += K*(350-R[i]-Y[i])*DT - B*VY[i]*DT;
				for( var j=0; j<N; j++ ) {
						if( j == i ) continue;
						dx = X[i]-X[j];
						dy = Y[i]-Y[j];
						dist = Math.sqrt(dx*dx+dy*dy);
						if( dist < R[i]+R[j] ) {
								VX[i] += 0.5*K*dx/dist*(R[i]+R[j]-dist)*DT - B*VX[i]*DT;
								VY[i] += 0.5*K*dy/dist*(R[i]+R[j]-dist)*DT - B*VY[i]*DT;
						}
				}
		}

		// update positions
		for( var i=0; i<N; i++ ) {
				if( i == grabbed && m_d == 1 ) {
						dx = X[i]-x;
						dy = Y[i]-y;
						dist = Math.sqrt(dx*dx+dy*dy);
						if( dist < 2*R[i] ) {
								X[i] = x;
								Y[i] = y;
								continue;
						}
				}
				X[i] += VX[i]*DT;
				Y[i] += VY[i]*DT;
		}
		
}

function draw_circles() {

		for( var i=0; i<N; i++ ) {

				context.save();
				
				context.translate(X[i],Y[i]);
				
				context.save();
				
				if( X[i] < R[i] )
						context.scale(X[i]/R[i],1);
				if( X[i] > 800-R[i] )
						context.scale((800-X[i])/R[i],1);
				if( Y[i] < R[i] )
						context.scale(1,Y[i]/R[i]);
				if( Y[i] > 350-R[i] )
						context.scale(1,(350-Y[i])/R[i]);

				for( var j=0; j<N; j++ ) {
						if( i == j ) continue;
						dx = X[j]-X[i];
						dy = Y[j]-Y[i];
						dist = Math.sqrt(dx*dx+dy*dy);
						if( dist < R[i]+R[j] ) {
								theta = Math.atan2(-dy,dx);
								context.rotate(-theta);
								context.scale(dist/(R[i]+R[j]),1);
								context.rotate(theta);
						}
				}
				
				context.beginPath();
				context.arc(0,0,R[i],0,2*Math.PI,true);
				context.closePath();
				
				context.restore();
				
				context.fillStyle = "rgb(127,127,127)";
				context.lineWidth = 1;
				if( i == grabbed ) {
						context.fillStyle = "rgb(200,127,127)";
						context.lineWidth = 1;
				}
				context.fill();
				context.stroke();

				context.restore();

		}

}

function draw_controls() {

		context.save();

		context.fillStyle = "rgba(255,255,255,0.75)";
		context.fillRect(4,4,150,133);
		context.strokeRect(4,4,150,133);
		context.fillStyle = "rgb(0,0,0)";
		context.strokeStyle = "rgb(0,0,0)";

		context.fillText("Number: ",8,27);
		context.strokeRect(88,8,40,26);
		context.fillText(N,98,27);

		context.fillText("+",136,18);
		context.strokeRect(132,8,18,13);
		context.fillText("-",138,32);
		context.strokeRect(132,21,18,13);

		context.fillText("Gravity: ",8,60);
		context.strokeRect(88,41,40,26);
		context.fillText(G.toPrecision(3),95,60);

		context.fillText("+",136,51);
		context.strokeRect(132,41,18,13);
		context.fillText("-",138,65);
		context.strokeRect(132,54,18,13);

		context.fillText("Spring: ",8,93);
		context.strokeRect(88,74,40,26);
		context.fillText(K.toPrecision(3),93,93);

		context.fillText("+",136,84);
		context.strokeRect(132,74,18,13);
		context.fillText("-",138,98);
		context.strokeRect(132,87,18,13);

		context.fillText("Friction: ",8,126);
		context.strokeRect(88,107,40,26);
		context.fillText(B.toPrecision(2),93,126);

		context.fillText("+",136,117);
		context.strokeRect(132,107,18,13);
		context.fillText("-",138,131);
		context.strokeRect(132,120,18,13);

		context.fillStyle = "rgba(0,0,0,0.1)";
		context.fillRect(0,350,800,50);

		context.fillStyle = "rgba(0,0,0,1)";
		context.fillText("Number: "+N,10,365);
		drawSlider(N,0,50,90,365);
		context.fillText("Gravity: "+G.toPrecision(3),10,390);
		drawSlider(G,-20,20,90,390);
		context.fillText("Spring: "+K.toPrecision(3),210,365);
		drawSlider(K,0.1,20,290,365);
		context.fillText("Friction: "+B.toPrecision(3),210,390);
		drawSlider(B,-3,3,290,390);

		context.restore();

}

function drawSlider(val,a,b,xpos,ypos) {
		
		context.save();

		context.strokeStyle = "rgba(0,0,0,0.75)";
		context.lineWidth = 4;
		context.lineCap = "round";
		context.lineJoin = "round";

		context.beginPath();
		context.moveTo(xpos,ypos);
		context.lineTo(xpos+100,ypos);
		context.closePath();
		context.stroke();

		context.strokeStyle = "rgba(0,0,0,1)";
		context.fillStyle = "rgba(200,200,200,1)";
		context.lineWidth = 1;

		context.beginPath();
		context.arc(xpos+(val-a)/(b-a)*100,ypos,5,0,2*Math.PI,true);
		context.closePath();
		context.stroke();
		context.fill();

		context.fillStyle = "rgba(0,0,0,1)";

		context.font = "8px sans-serif";
		context.fillText(a,xpos-5,ypos-7);
		context.fillText(b,xpos+95,ypos-7);

		context.restore();
		
}

function erase() {		
		context.clearRect(0,0,canvas.width,canvas.height);		
}

function mouse_move(event) {
		prevx = x;
		prevy = y;
		x = event.clientX-8;
		y = event.clientY-8;
}

function mouse_click(event) {

		if( x > 4 && x < 154 && y > 4 && y < 137 ) {

				if( x > 132 && x < 150 && y > 8 && y < 21 ) {
						N++;
						if( N>100 ) N=100;
				}
				if( x > 132 && x < 150 && y > 21 && y < 33 ) {
						N--;
						if( N<0 ) N=1;
				}
				if( x > 132 && x < 150 && y > 41 && y < 54 ) {
						G += 0.1;
						if( G>20 ) G = 20;
				}
				if( x > 132 && x < 150 && y > 54 && y < 67 ) {
						G -= 0.1;
						if( G < -20 ) G = -20; 				
				}
				if( x > 132 && x < 150 && y > 74 && y < 87 ) {
						K += 0.5;
						if( K>50 ) K = 50;
				}
				if( x > 132 && x < 150 && y > 87 && y < 100 ) {
						K -= 0.5;
						if( K<0.5 ) K = 0.5; 
				}
				if( x > 132 && x < 150 && y > 107 && y < 120 ) {
						B += 0.05;
						if( B>5 ) B = 5;
				}
				if( x > 132 && x < 150 && y > 120 && y < 133 ) {
						B -= 0.05;
						if( B<-1 ) B = -1;
				}

		} 

}

function mouse_down(event) {
		m_d = 1;
		if( (x < 4 || x > 154 || y < 4 || y > 137) && y < 350 ) {
				found = 0;
				for( var i=N-1; i>=0; i-- ) {
						dx = X[i]-x; dy = Y[i]-y;
						dist = Math.sqrt(dx*dx+dy*dy);
						if( dist < R[i] ) {
								found = 1;
								grabbed = i;
								break;
						}
				}
				if( !found ) grabbed = -1;
		}
}

function mouse_up(event) {
		m_d = 0;
}

function key_press(event) {
		var code = event.keyCode?event.keyCode:event.which;
		if( grabbed != -1 ) {
				if( code == 38 )
						R[grabbed] += 5;
				if( code == 40 )
						R[grabbed] -= 5;
		}
		if( code == 103 )
				G = (G!=0?0:9.8);
}
