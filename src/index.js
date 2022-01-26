
/** PADDLE ***************************************************************************/

class Paddle {
    constructor(game){
        this.width=150;
        this.height=20;
        this.gameWidth=game.gameWidth;
        this.gameHeight=game.gameHeight;
        this.position={
            x : game.gameWidth/2 - this.width/2,
            y : game.gameHeight - this.height -10,
        };
        this.speed=0;
        this.maxSpeed=9;
        this.game=game;
    }

    moveleft (){
        this.speed=-this.maxSpeed;
    }

    moveright (){
        this.speed=this.maxSpeed;
    }

    stop () {
        this.speed=0;
    }

    draw(ctx){
        ctx.fillStyle="#0a0909";
        ctx.fillRect(this.position.x,this.position.y,this.width,this.height);
    }

    update(){
        this.position.x+=this.speed;
        /* Auto win : this.position.x=this.game.ball.position.x-1;*/
        if(this.position.x<=0  )
        this.position.x=1;
        if(this.position.x+this.width>=this.gameWidth)
        this.position.x=this.gameWidth-this.width-1;
        


    }
}

/** Ball ***************************************************************************/

class Ball {
    constructor(game){
        this.image=document.querySelector("#ball");
        this.width=20;
        this.height=18;
        this.gameWidth=game.gameWidth;
        this.gameHeight=game.gameHeight;
        this.position={
            x : game.gameWidth/2-this.width/2 ,
            y : game.gameHeight-game.paddle.height-10-10-this.height ,
        };
        this.speed={
            x:10,
            y:10,
        };
        this.game=game;

    }

    draw(ctx){
        ctx.drawImage(this.image,this.position.x,this.position.y,this.width,this.height);
    }

    update(){

        this.position.x+=this.speed.x;
        this.position.y+=this.speed.y;

        //wall
        if(this.position.x<=0 || this.position.x+this.width>=this.gameWidth )
        this.speed.x=-this.speed.x;
        if(this.position.y<=0  )
        this.speed.y=-this.speed.y;
        if(this.position.y+this.height>=this.gameHeight){
            this.game.lives--;
            if (this.game.lives!==0){
                this.game.paddle.position.x=this.game.gameWidth/2-this.game.paddle.width/2
                this.position.x=this.game.paddle.position.x+this.game.paddle.width/2-this.width/2;
                this.position.y= this.game.gameHeight-this.game.paddle.height-10-10-this.height;
                this.game.playing=false;
            }
            else this.position.y=this.game.gameHeight-this.height;


        }
        

        //paddle
        if (collisionDetection(this,this.game.paddle)){
            this.speed.y=-this.speed.y;
            this.position.y=this.game.paddle.position.y-this.height;
        }
        
        
        

    }
        


        

    
}

/**Bricks ***************************************************************************/

class Brick {
    constructor(game,position){
        this.image=document.querySelector("#brick");
        this.width=70;
        this.height=30;
        this.position=position;
        this.game=game;
        this.speed=5;
        this.markForDeletion=false;
    }

    draw (ctx){
        ctx.drawImage(this.image,this.position.x,this.position.y,this.width,this.height);
    }

    update (){
        if (collisionDetection(this.game.ball,this)){
            this.game.ball.speed.y=-this.game.ball.speed.y;
            this.markForDeletion=true;
        }

        if (this.game.currentLevel>=4 && this.game.object.length<13 ){
            this.position.x+=this.speed;
            //wall
            if(this.position.x<=0  ){
                this.speed=-this.speed;
                this.position.x=1;
            }  
            if( this.position.x+this.width>=this.game.gameWidth ){
                this.speed=-this.speed;
                this.position.x=this.game.gameWidth-this.width-1;
            }  
        }

    }

}

/**Levels ***************************************************************************/

const level1=[
    1,1,1,1,0,0,1,1,1,1,
    1,1,1,0,0,0,0,1,1,1,
    1,1,0,0,0,0,0,0,1,1,
];

const level2=[
    0,1,0,1,1,1,1,0,1,0,
    0,1,0,1,1,0,1,1,1,0,
    1,0,1,1,0,1,1,0,1,1,
    1,1,0,1,1,0,1,1,1,1
];

const level3=[
    0,1,0,1,1,0,1,0,1,0,
    1,1,1,1,0,0,1,1,1,1,
    1,1,1,0,0,0,0,1,1,1,
    1,1,0,0,0,0,0,0,1,1,
    1,1,0,1,1,0,1,1,1,1,
];

const level4=[
    1,1,1,0,0,0,0,1,1,1,
    1,1,0,0,0,0,0,0,1,1,
    1,1,0,1,1,0,1,1,1,1,
    1,0,1,1,0,1,1,0,1,1,
    1,1,0,1,1,0,1,1,1,1,
    1,1,0,0,0,0,0,0,1,1,
];

const level5=[
    1,1,0,0,0,0,0,0,1,1,
    1,1,0,1,1,0,1,1,1,1,
    1,0,1,1,0,1,1,0,1,1,
    1,0,1,1,0,1,1,0,1,1,
    1,1,0,1,1,0,1,1,1,1,
    1,1,1,0,0,0,0,1,1,1,
];

const level6=[
    1,1,0,1,1,0,1,1,1,1,
    1,1,1,0,0,0,0,1,1,1,
    1,0,1,1,0,1,1,0,1,1,
    1,1,0,1,1,0,1,1,1,1,
    1,1,1,0,0,0,0,1,1,1,
    1,1,0,1,1,0,1,1,1,1
];


function buildLevel (level){
    let bricks=[];
    let tempBrick=new Brick(game,{x:0,y:0});
    for (let i=0;i<level.length/10;i++){
        for (let j=0;j<10;j++){ 
            if (level[i*10+j]===1 ) 
            bricks.push(new Brick(game,{x:j*(tempBrick.width+10)+5 ,y:(tempBrick.height+5)*i+70 }));
        }
    }
    return bricks;
}

/**Events ***************************************************************************/

class inputHandler {
    constructor (game,paddle) {
        document.addEventListener("keydown" ,event => {
            switch(event.keyCode){
                case 37 :
                    paddle.moveleft();
                    if(game.gameState===gameState.GAME_RUNNING) game.playing=true;
                    break;
                case 39 :
                    paddle.moveright();
                    if(game.gameState===gameState.GAME_RUNNING) game.playing=true;
                    break;
                case 27 :
                    game.togglePause();
                    break;
                case 13 :
                    game.start();
                    break;


            }
        });
        document.addEventListener("keyup" ,event => {
            switch(event.keyCode){
                case 37 :
                    if (paddle.speed<0) paddle.stop();
                    break;
                case 39 :
                    if (paddle.speed>0) paddle.stop();
                    break;
            }
        });
    }
}

/**Collision detection *******************************************************/

function collisionDetection (ball,gameObject){
    
    let topOfObject=gameObject.position.y;
    let leftOfObject=gameObject.position.x;
    let rightOfObject=gameObject.position.x+gameObject.width;
    let bottomOfObject=gameObject.position.y+gameObject.height;

    let leftOfBall=ball.position.x;
    let rightOfBall=ball.position.x+ball.width;
    let bottomOfBall=ball.position.y+ball.height;
    let topOfBall=ball.position.y;


    if(topOfBall <= bottomOfObject && bottomOfBall >= topOfObject &&
         rightOfBall>=leftOfObject && leftOfBall<=rightOfObject ) return true;
    else return false;


}
/**GAME **********************************************************************/

const gameState ={
    GAME_PAUSED : 0,
    GAME_RUNNING :1,
    GAME_MENU :2,
    GAME_OVER :3,
    GAME_WIN : 4,
};

class Game {
    constructor(gameWidth,gameHeight){
        this.gameWidth=gameWidth;
        this.gameHeight=gameHeight;
        this.playing=false;
        this.lives=3;
        this.gameState=gameState.GAME_MENU;
        this.paddle=new Paddle(this);
        this.ball=new Ball(this);
        this.object=[this.paddle,this.ball];
        this.levels=[level1,level2,level3,level4,level5,level6];
        this.currentLevel=0;
        this.lastLevel=5;
        new inputHandler(this,this.paddle);
    }

    start(){
        if (game.gameState!==gameState.GAME_MENU ) return;
        let bricks=buildLevel(this.levels[this.currentLevel]);
        this.gameState=gameState.GAME_RUNNING;
        this.object=[this.paddle,this.ball,...bricks];
    }

    togglePause(){

        if(this.gameState===gameState.GAME_RUNNING){
            this.gameState=gameState.GAME_PAUSED;  
        }
        else if(this.gameState===gameState.GAME_PAUSED){
            this.gameState=gameState.GAME_RUNNING;
        }

    }



    draw(ctx) {
        ctx.clearRect(0,0,this.gameWidth,this.gameHeight);
        ctx.font="50px fantasy";
        ctx.fillStyle="rgba(0,0,0,0.5)";
        ctx.textAlign="center";
        ctx.fillText("LEVEL "+(this.currentLevel+1),this.gameWidth/2,50);

        this.object.forEach(object => object.draw(ctx));   

        for (let i=1;i<=this.lives;i++){
            ctx.drawImage(this.ball.image,i*20+5,10,20,20);

        } 

        if(this.gameState===gameState.GAME_PAUSED){
            ctx.fillStyle="rgba(0,0,0,0.5)";
            ctx.fillRect(0,0,this.gameWidth,this.gameHeight);
            ctx.font="30px Arial";
            ctx.fillStyle="Black";
            ctx.textAlign="center";
            ctx.fillText("Paused",this.gameWidth/2,this.gameHeight/2);
        }

        if(this.gameState===gameState.GAME_OVER){
            ctx.fillStyle="rgba(0,0,0,0.5)";
            ctx.fillRect(0,0,this.gameWidth,this.gameHeight);
            ctx.font="30px Arial";
            ctx.fillStyle="Black";
            ctx.textAlign="center";
            ctx.fillText("GAME OVER",this.gameWidth/2,this.gameHeight/2);
            ctx.fillText("YOU LOSE",this.gameWidth/2,this.gameHeight/2+50);
        }

        if(this.gameState===gameState.GAME_WIN){
            ctx.fillStyle="rgba(0,0,0,0.5)";
            ctx.fillRect(0,0,this.gameWidth,this.gameHeight);
            ctx.font="30px Arial";
            ctx.fillStyle="Black";
            ctx.textAlign="center";
            ctx.fillText("CONGRATULATIONS !!",this.gameWidth/2,this.gameHeight/2);
            ctx.fillText("YOU WIN",this.gameWidth/2,this.gameHeight/2+50);
        }

        if(this.gameState===gameState.GAME_MENU){
            ctx.fillStyle="Black";
            ctx.fillRect(0,0,this.gameWidth,this.gameHeight);
            ctx.font="30px Arial";
            ctx.fillStyle="White";
            ctx.textAlign="center";
            ctx.fillText("Press ENTER to start",this.gameWidth/2,this.gameHeight/2);
        }
        
    }

    update(){
        if (this.lives===0) this.gameState=gameState.GAME_OVER;
        if(this.gameState!==gameState.GAME_RUNNING ) return;
        if (this.playing===false) return;
        this.object.forEach(object => object.update());
        this.object=this.object.filter(object => !object.markForDeletion);
        if(this.object.length===2){
            if (this.currentLevel!==this.lastLevel){
                this.currentLevel++;
                this.lives++;
                let bricks=buildLevel(this.levels[this.currentLevel]);
                this.object=[this.paddle,this.ball,...bricks];
                this.paddle.position.x=this.gameWidth/2-this.paddle.width/2;
                this.ball.position.x=this.paddle.position.x+this.paddle.width/2-this.ball.width/2;
                this.ball.position.y= this.gameHeight-this.paddle.height-10-10-this.ball.height;     
                this.playing=false;  
            }
            else this.gameState=gameState.GAME_WIN;
            
        } 
    }
}

/*************************************************************************/

let canvas=document.querySelector("#gameScreen");
let ctx=canvas.getContext('2d');


const GAME_WIDTH=800;
const GAME_HEIGHT=600;

let game=new Game(GAME_WIDTH,GAME_HEIGHT);

function gameLoop (){
    game.draw(ctx);
    game.update();
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);


