var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage, backgroundImg;
var obstaclesGroup, obstacle1, obstacle2;
var jumpSound, collidedSound;
var score=0;

var gameOver, restart;
var randomNumber = (10,30,60,80);

function preload(){
  jumpSound = loadSound("jump.mp3");
  collidedSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
  
  backgroundImg = loadImage("Background.png");
  sunAnimation = loadAnimation("Scary_Sun.png", "Scary_Sun.png", "Scary_Sun.png", "Scary_Sun.png", "Scary_Sun.png", "Purple_Sun.png");
  
  trex_running = loadAnimation("Dino_run_1.png", "Dino_run_2.png", "Dino_run_3.png");
  trex_collided = loadAnimation("Trex_Dead.png");
  
  groundImage = loadImage("Ground.png");
  
  cloudImage = loadImage("Cloud.png");
  
  obstacle1 = loadImage("cactus.png");
  obstacle2 = loadImage("cactus.png");
  obstacle3 = loadImage("cactus.png");
  obstacle4 = loadImage("cactus.png");
  
  gameOverImg = loadImage("gAme_Over.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(displayWidth, displayHeight)
  sun = createSprite(width-75,height-350,10,10);
  sun.addAnimation("sun", sunAnimation);
  sun.scale = 0.4;
  
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.setCollider('circle',0,0,175);
  trex.scale = 0.15;
  //trex.debug=true
  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  ground = createSprite(width/2, 1000 ,width, 2);
  ground.addImage("ground",groundImage);
  ground.scale = 4;
  ground.x = width/2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  restart = createSprite(width/2,height/1.5);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.075;
  restart.scale = 0.75;

  gameOver.visible = false;
  restart.visible = false;
  invisibleGround.visible = false

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  background(backgroundImg);
  textSize(20);
  fill("black")
  text("Score: "+ score,30,550);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    trex.velocityX = 2;
    camera.position.x = displayWidth/2;
    camera.position.y = trex.y;

    if((keyDown("SPACE")) && trex.y  >= height-120) {
      jumpSound.play();
      trex.velocityY = -10;
    }
    if(score>0 && score%100 == 0) {
        checkPointSound.play();
    }
    trex.velocityY = trex.velocityY + 0.8
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        collidedSound.play()
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    ground.velocityX = 0;
    trex.velocityY = 0;
    trex.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);
    trex.changeAnimation("collided",trex_collided);
    
    fill("Gold");
    text("Click on Restart to Play Again!",width/2.5,height-325);
    
    fill(125,25,0);
    text("RIP Mr.Rex",width/2.15,height-150);
    
    if(mousePressedOver(restart)) {      
      reset();
    }}
  drawSprites();
}

function spawnClouds() {
  if (frameCount % 120 === 0) {
    cloud = createSprite(width+20,height-400,40,10);
    cloud.y = Math.round(random(100,420));
    cloud.addImage(cloudImage);
    cloud.scale = 0.03;
    cloud.velocityX = -3;
    
    cloud.lifetime = 900;
    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
    cloudsGroup.add(cloud);
  }}

function spawnObstacles() {
  if(frameCount % randomNumber === 0) {
    var obstacle = createSprite(1600,height-80,20,30);
    obstacle.setCollider('rectangle',0,0,40,50);
    
    obstacle.velocityX = -(8 + 6*score/100);
    
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }
    
    obstacle.scale = 1;
    obstacle.lifetime = 300;
    obstacle.depth = trex.depth;
    trex.depth +=1;
    obstaclesGroup.add(obstacle);
  }
}
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  trex.x = 20;
  
  score = 0;
}
