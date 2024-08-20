const gravity = 0.5;
const jumpHeight = 100;
class Game {
    static canvas
    static ctx
    static players = []
    static bullets = []
    gameInterval = null
    constructor() {
        this.canvasInit();
        this.scene = new scene();
    }
    canvasInit() {
        Game.canvas = document.getElementById("game");
        Game.ctx = Game.canvas.getContext("2d");
        Game.canvas.width = 800;
        Game.canvas.height = 600;
        //将坐标轴移至画布左下角，y轴正方向向上
        Game.ctx.translate(0, Game.canvas.height);
        Game.ctx.scale(1, -1);
    }
    gameStart() {
        const player1Info = document.getElementById("player1");
        const player2Info = document.getElementById("player2");
        const player1 = new player();
        Game.players.push(player1);
        const player2 = new player();
        Game.players.push(player2);
        document.addEventListener("keydown", player1.keydownHandler.bind(player1));
        document.addEventListener("keyup", player1.keyupHandler.bind(player1));
        this.gameInterval = setInterval(() => {
            Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
            player1Info.innerHTML = `<h2>player1</h2><span>${player1.health}</span>`;
            player2Info.innerHTML = `<h2>player2</h2><span>${player2.health}</span>`;
            this.scene.draw();
            Game.players.forEach(player => {
                player.updatePlayerPosition();
                player.draw();
            })
            Game.bullets.forEach(bullet => {
                bullet.draw();
            })
        }, 1000 / 60)
    }
    static gameEnd() {
        clearInterval(this.gameInterval);
        Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
        document.removeEventListener("keydown", Game.players[0].keydownHandler);
        document.removeEventListener("keyup", Game.players[0].keyupHandler);
        Game.players.forEach(player => {
            player.destroy();
        })
        Game.bullets.forEach(bullet => {
            bullet.destroy();
        })
    }

}

class player {
    health = 100
    power
    speed
    isJumping = false
    isFalling = false
    moveLeft = false
    moveRight = false
    constructor(height = 50, radius = 10, bodyLength = 25) {
        this.x = 20;
        this.y = 0;
        this.speed = 5;
        this.height = height;
        this.radius = radius;
        this.bodyLength = bodyLength
        this.direction = 0;
        this.power = 5;
        this.speed = 10;
        this.maxBullet = 5;
        this.currentBullet = 0;
    }
    updatePlayerPosition() {
        // 左右移动
        if (this.moveLeft) {
            this.x -= this.speed;
            this.direction = 0;

        }
        if (this.moveRight) {
            this.x += this.speed;
            this.direction = 1;
        }
        if (this.x < 0) {
            this.x = 0;
        }
        else if (this.x > 800) {
            this.x = 800;
        }
        else if (this.y > 0 && (this.x < 100 || this.x > 700 || (this.x > 350 && this.x < 450))) {
            this.isFalling = true;
        }
        // 跳跃和下落
        if (this.isJumping) {
            this.y += this.speed;
            this.speed -= gravity;
            if (this.speed < -gravity) {
                this.isJumping = false;
                this.isFalling = true;
            }
        } else if (this.isFalling) {
            this.y -= this.speed;
            this.speed += gravity;
            if (this.x < 100 || this.x > 700 || (this.x > 350 && this.x < 450)) {
                if (this.y <= 0) {
                    this.y = 0;
                    this.isFalling = false;
                    this.speed = 10;
                }
            } else {
                if (this.y <= 120) {
                    console.log(this.y)
                    this.y = 120;
                    this.isFalling = false;
                    this.speed = 10;
                } else if (this.y <= 240) {
                    this.y = 240;
                    this.isFalling = false;
                    this.speed = 10;
                } else if (this.y <= 360) {
                    this.y = 360;
                    this.isFalling = false;
                    this.speed = 10;
                }
            }
        }
    }
    draw() {
        if (this.health <= 0) {
            Game.gameEnd();
            return;
        }
        //身体与脖子的交点
        const neckHeight = this.height - this.radius;
        //身体与双腿的交点
        const bodyLegsX = this.height - this.radius - this.bodyLength;
        Game.ctx.fillStyle = "red";
        //头部
        Game.ctx.beginPath();
        Game.ctx.arc(this.x, this.y + this.height, this.radius, 0, 2 * Math.PI);
        Game.ctx.stroke();
        //身体
        Game.ctx.moveTo(this.x, this.y + neckHeight);
        Game.ctx.lineTo(this.x, this.y + bodyLegsX);
        Game.ctx.stroke();
        //双腿
        Game.ctx.moveTo(this.x, this.y + bodyLegsX);
        Game.ctx.lineTo(this.x - this.radius, this.y);
        Game.ctx.stroke();
        Game.ctx.moveTo(this.x, this.y + bodyLegsX);
        Game.ctx.lineTo(this.x + this.radius, this.y);
        Game.ctx.stroke();
        //双臂
        Game.ctx.moveTo(this.x, this.y + neckHeight - this.radius);
        Game.ctx.lineTo(this.x - this.radius * 2 * (-1) ** this.direction, this.y + neckHeight - this.radius / 1.2);
        Game.ctx.stroke();
        Game.ctx.moveTo(this.x, this.y + neckHeight - this.radius);
        Game.ctx.lineTo(this.x + this.radius * 1.5 * (-1) ** this.direction, this.y + neckHeight - this.radius * 3);
        Game.ctx.stroke();
    }
    shoot() {
        if (this.currentBullet >= this.maxBullet) {
            return;
        }
        console.log("shoot")
        this.currentBullet++;
        const bullet = new Bullet(this.x + this.radius * (-1) ** (this.direction + 1), this.y + this.height - this.radius * 2, this.direction, this.power, 50, 10, 25, this);
        Game.bullets.push(bullet);
    }
    destroy() {
        Game.players.splice(Game.players.indexOf(this), 1);
    }
    keydownHandler(e) {
        switch (e.key) {
            case "a":
                this.moveLeft = true;
                break;
            case "d":
                this.moveRight = true;
                break;
            case "k":
                if (!this.isJumping && !this.isFalling) {
                    this.isJumping = true;
                }
                break;
            case "j":
                this.shoot();
                break;
        }
    }
    keyupHandler(e) {
        switch (e.key) {
            case "a":
                this.moveLeft = false;
                break;
            case "d":
                this.moveRight = false;
                break;
        }
    }

}

class Bullet {
    interval = null
    constructor(x, y, direction, speed, height = 50, radius = 10, bodyLength = 25, player) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = speed;
        this.height = height;
        this.radius = radius;
        this.bodyLength = bodyLength;
        this.from = player;
    }
    draw() {
        //身体与脖子的交点
        const neckHeight = this.height - this.radius;
        Game.ctx.fillStyle = "blue";
        Game.ctx.beginPath();
        Game.ctx.arc(this.x - this.radius * 2 * (-1) ** this.direction, this.y, 5, 0, 2 * Math.PI);
        Game.ctx.fill();
        if (!this.interval) {
            this.interval = setInterval(() => {
                this.x += this.speed * (-1) ** (this.direction + 1);
                if (this.x < 0 || this.x > Game.canvas.width) {
                    console.log("out of range")
                    this.destroy();
                }
                Game.players.forEach(player => {
                    this.makeHurt(player);
                })
            }, 1000 / 120)
        }

    }
    destroy() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null
        }
        const index = Game.bullets.indexOf(this);
        index > -1 && Game.bullets.splice(Game.bullets.indexOf(this), 1);
        if (this.from) {
            this.from.currentBullet--;
            this.from = null;
        }
    }
    makeHurt(player) {
        var disabledBullet = false;
        //命中头部
        if ((this.x - player.x) ** 2 + (this.y - player.y - player.height) ** 2 < player.radius ** 2) {
            player.health -= 50;
            disabledBullet = true;
        }
        //命中身体
        else if (Math.abs(this.x - player.x) < 1 && this.y - player.y < player.height - player.radius / 2 && this.y - player.y > player.height - player.radius - player.bodyLength) {
            player.health -= 20;
            disabledBullet = true;
        }
        //命中腿部
        //子弹在双腿所成直线之间
        else if (Math.abs(this.x - player.x) < player.radius && this.y > player.y && this.y - player.y < player.height - player.radius - player.bodyLength - Math.abs((player.height - player.radius - player.bodyLength) / player.radius) * Math.abs(this.x - player.x)) {
            player.health -= 10;
            disabledBullet = true;
        }
        //清除子弹
        if (disabledBullet) {
            console.log("clear")
            this.destroy();
            disabledBullet = false;
        }
    }
}

class scene {
    draw() {
        //八条横线，作为可站立的平台
        Game.ctx.beginPath();
        Game.ctx.moveTo(100, 120);
        Game.ctx.lineTo(350, 120);
        Game.ctx.stroke();
        Game.ctx.moveTo(450, 120);
        Game.ctx.lineTo(700, 120);
        Game.ctx.stroke();

        Game.ctx.moveTo(100, 240);
        Game.ctx.lineTo(350, 240);
        Game.ctx.stroke();
        Game.ctx.moveTo(450, 240);
        Game.ctx.lineTo(700, 240);
        Game.ctx.stroke();

        Game.ctx.moveTo(100, 360);
        Game.ctx.lineTo(350, 360);
        Game.ctx.stroke();
        Game.ctx.moveTo(450, 360);
        Game.ctx.lineTo(700, 360);
        Game.ctx.stroke();
    }
}

const game = new Game();
game.gameStart();

