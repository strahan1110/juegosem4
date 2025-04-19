
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const collisionSound = document.getElementById('collisionSound');
const sonidoama= document.getElementById('sonidoama');
const felicidades= document.getElementById('felicidades');

const fullName = "Jemima Jange"; 

//teclas
let keys = {};
document.addEventListener('keydown',(e) => keys[e.key]=true);
document.addEventListener('keyup',(e) => keys[e.key]=false);

// jugador
const player = {x:50, y:50, w:30, h:30, color: 'red', speed:3};

//NIVELES
const levels = [
	{
		//NIVEL 1
		obstacles:[
			{x:100, y:150, w:400, h:20},
			{x:300, y:250, w:20, h:100}
		],
		coins:[
			{x:500, y:50, collected:false},
			{x:50, y:300, collected:false}
		]
	},
	{
		//NIVEL 2
		obstacles:[
			{x:200, y:100, w:200, h:20},
			{x:200, y:200, w:20, h:100},
			{x:400, y:200, w:20, h:100}
		],
		coins:[
			{x:50, y:50, collected:false},
			{x:550, y:350, collected:false},
			{x:300, y:180, collected:false}
		]
	},
	    // NIVEL 3
	{
		obstacles:[
			{x:150, y:100, w:300, h:20},
			{x:150, y:200, w:20, h:100},
			{x:430, y:200, w:20, h:100},
			{x:250, y:300, w:100, h:20}
		],
		coins:[
			{x:550, y:50, collected:false},
			{x:50, y:350, collected:false},
			{x:300, y:50, collected:false},
			{x:300, y:350, collected:false}
		]
	}
];

let currentLevel = 0;

// Función para detectar colisiones entre rectángulos
function rectsCollide(a,b){
	return (a.x < b.x + b.w &&
			a.x + a.w > b.x &&
			a.y < b.y + b.h &&
			a.y + a.h > b.y);
}

//DIBUJO RECTÁNGULOS
function drawRect(obj){
	ctx.fillStyle = obj.color || 'white';
	ctx.fillRect(obj.x, obj.y , obj.w, obj.h);
}

function update(){
	const level = levels[currentLevel];

	//Actualizar la posición del jugador
	if(keys['ArrowUp']) player.y -= player.speed;
	if(keys['ArrowDown']) player.y += player.speed;
	if(keys['ArrowLeft']) player.x -= player.speed;
	if(keys['ArrowRight']) player.x += player.speed;

	// Límites del escenario
	if(player.x < 0) player.x = 0;
	if(player.y < 0) player.y = 0;
	if(player.x + player.w > canvas.width) player.x = canvas.width - player.w;
	if(player.y + player.h > canvas.height) player.y = canvas.height - player.h;

	//Colisión con los obstáculos
	for(let obs of level.obstacles){
		if(rectsCollide(player,obs)){
			// Invertir movimiento si colisiona
			if(keys['ArrowUp']) player.y += player.speed;
			if(keys['ArrowDown']) player.y -= player.speed;
			if(keys['ArrowLeft']) player.x += player.speed;
			if(keys['ArrowRight']) player.x -= player.speed;

			// Reproducir sonido
			collisionSound.currentTime = 0;
			collisionSound.play();
		}
	}

	//Colisión con las monedas
	for(let coin of level.coins){
		if(!coin.collected){
			if(
				player.x < coin.x + 15 &&
				player.x + player.w > coin.x &&
				player.y < coin.y + 15 &&
				player.y + player.h > coin.y
			){
				coin.collected = true;
				// Reproducir sonido
				sonidoama.currentTime = 0;
				sonidoama.play();
			}
		}
	}

	const allCollected = level.coins.every(c => c.collected);
	if(allCollected){
		if(currentLevel < levels.length - 1){
			currentLevel++;
			resetLevel();
		} else {
			setTimeout(() => {
				// Reproducir sonido
				felicidades.currentTime = 10;
				felicidades.play();
				alert(`¡Felicitaciones! ${fullName}`);
				currentLevel = 0;
				resetLevel();
			}, 200); 
		}
	}
}

function resetLevel(){
	player.x = 50;
	player.y = 50;
	levels[currentLevel].coins.forEach(c => c.collected = false);
}

//Dibujar todo el juego
function draw(){
	ctx.clearRect(0,0, canvas.width, canvas.height);
	drawRect(player);

	const level = levels[currentLevel];

	for(let obs of level.obstacles){
		drawRect({...obs, color:'gray'});
	}

	for(let coin of level.coins){
		if(!coin.collected){
			ctx.fillStyle='gold';
			ctx.beginPath();
			ctx.arc(coin.x + 7.5, coin.y + 7.5,7.5,0,Math.PI*2);
			ctx.fill();
		}
	}

	ctx.fillStyle = 'white';
	ctx.font = "16px Arial";
	ctx.fillText(`Nivel: ${currentLevel + 1}`, 10, 20);
	ctx.fillText(`${fullName}`, 10, 40);
}

// Bucle principal
function gameLoop(){
	update();
	draw();
	requestAnimationFrame(gameLoop);
}

resetLevel();
gameLoop();