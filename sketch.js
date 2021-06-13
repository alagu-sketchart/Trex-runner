var PLAY = 1;
var END = 0;
var gameState = PLAY;

var ninja, ninja_running, ninja_dead, ninja_jump;
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
  
  ninja_running = loadAnimation("ninja_1.png", "ninja_2.png");
  ninja_dead = loadAnimation("dead_.png");
  ninja_jump = loadAnimation("ninja_jump.png");
  
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
   
  invisibleGround = createSprite(width/2,height+10,width,125);  
  ground = createSprite(width/2, 1000 ,width, 2);
  ground.addImage("ground",groundImage);
  ground.scale = 4;
  ground.x = width/2;
  ground.velocityX = +(6 + 3*score/100);
  invisibleGround.debug = true

  ninja = createSprite(50,height-90,20,50);
  ninja.addAnimation("running", ninja_running);
  ninja.addAnimation("collided", ninja_dead);
  ninja.addAnimation("jump", ninja_jump);
  ninja.setCollider('circle',0,50,150);
  ninja.scale = 0.15;
  //ninja.debug=true
  
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
  text("Score: "+ score,width/2,550);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    ninja.velocityX = 2;
    camera.position.x = ninja.x;
    camera.position.y = ninja.y;

    if((keyDown("SPACE")) && ninja.y  >= height-90) {
      jumpSound.play();
      ninja.velocityY = -10;
      ninja.changeAnimation("jump", ninja_jump)
    }else {
      ninja.changeAnimation("running",ninja_running);
    }

    if(score>0 && score%100 == 0) {
        checkPointSound.play();
    }
    ninja.velocityY = ninja.velocityY + 0.8
    if (ground.x < 0){
      ground.x = ground.width;
    }
  
    ninja.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(ninja)){
        collidedSound.play()
        gameState = END;
    }
  }
    else if (gameState === END) {
        gameOver.visible = true;
        restart.visible = true;
        
        ground.velocityX = 0;
        ninja.velocityY = 0;
        ninja.velocityX = 0;
        obstaclesGroup.setVelocityXEach(0);
        obstaclesGroup.setLifetimeEach(-1);
        cloudsGroup.setVelocityXEach(0);
        cloudsGroup.setLifetimeEach(-1);
        ninja.changeAnimation("collided",ninja_dead);
        
        fill("Gold");
        text("Click on Restart to Play Again!", width/2 ,height-325);
        
        fill(125,25,0);
        text("RIP Master Ninja", ninja.x, height-150);
        
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
    cloud.depth = ninja.depth;
    ninja.depth = ninja.depth+1;
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
    obstacle.depth = ninja.depth;
    ninja.depth +=1;
    obstaclesGroup.add(obstacle);
  }
}
function reset(){
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
    
    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
    
    ninja.changeAnimation("running",ninja_running);
    ninja.x = 20;
    
    score = 0;
}