class Game {
    static canvas
    static ctx
    static players = []
    static bullets = []
    gameInterval = null
    constructor() {
        this.canvasInit();
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
        this.player = new player();
        Game.players.push(this.player);
        let jumpInterval = null;
        let fallInterval = null;
        document.addEventListener("keydown", e => {
            if (e.key === "k") {
                if (jumpInterval) {
                    return
                }
                let currentY = this.player.y;
                jumpInterval = setInterval(() => {
                    this.player.y += this.player.speed;
                    if (this.player.y - currentY >= 100) {
                        clearInterval(jumpInterval);
                        jumpInterval = null;
                        fallInterval = setInterval(() => {
                            this.player.y -= this.player.speed;
                            if (this.player.y <= currentY) {
                                clearInterval(fallInterval);
                                fallInterval = null;
                            }
                        }, 1000 / 60)
                    }
                }, 1000 / 60)
            }
            else if (e.key === "a") {
                this.player.x -= this.player.speed;
                this.player.direction = 0;
            }
            else if (e.key === "d") {
                this.player.x += this.player.speed;
                this.player.direction = 1;
            }
            else if (e.key === "j") {
                this.player.shoot();
            }
        })
        this.gameInterval = setInterval(() => {
            Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
            Game.players.forEach(player => {
                player.draw();
            })
            Game.bullets.forEach(bullet => {
                bullet.draw();
                Game.players.forEach(player => {
                    player.isShooted(bullet.x, bullet.y);
                })
            })
        }, 1000 / 60)
    }
    static gameEnd() {
        clearInterval(this.gameInterval);

    }
}

class player {
    health = 100
    power
    speed
    constructor(height = 50, raduis = 10, bodyLength = 25) {
        this.x = 20;
        this.y = 0;
        this.speed = 5;
        this.height = height;
        this.raduis = raduis;
        this.bodyLength = bodyLength
        this.direction = 0;
        this.power = 10;
        this.speed = 10;
        this.maxBullet = 5;
        this.currentBullet = 0;
    }
    draw() {
        if (this.health <= 0) {
            Game.gameEnd();
            return;
        }
        //身体与脖子的交点
        const neckHeight = this.height - this.raduis;
        //身体与双腿的交点
        const bodyLegsX = this.height - this.raduis - this.bodyLength;
        Game.ctx.fillStyle = "red";
        //头部
        Game.ctx.beginPath();
        Game.ctx.arc(this.x, this.y + this.height, this.raduis, 0, 2 * Math.PI);
        Game.ctx.stroke();
        //身体
        Game.ctx.moveTo(this.x, this.y + neckHeight);
        Game.ctx.lineTo(this.x, this.y + bodyLegsX);
        Game.ctx.stroke();
        //双腿
        Game.ctx.moveTo(this.x, this.y + bodyLegsX);
        Game.ctx.lineTo(this.x - this.raduis, this.y);
        Game.ctx.stroke();
        Game.ctx.moveTo(this.x, this.y + bodyLegsX);
        Game.ctx.lineTo(this.x + this.raduis, this.y);
        Game.ctx.stroke();
        //双臂
        Game.ctx.moveTo(this.x, this.y + neckHeight - this.raduis);
        Game.ctx.lineTo(this.x - this.raduis * 2 * (-1) ** this.direction, this.y + neckHeight - this.raduis / 1.2);
        Game.ctx.stroke();
        Game.ctx.moveTo(this.x, this.y + neckHeight - this.raduis);
        Game.ctx.lineTo(this.x + this.raduis * 1.5 * (-1) ** this.direction, this.y + neckHeight - this.raduis * 3);
        Game.ctx.stroke();
    }

    shoot() {
        if (this.currentBullet >= this.maxBullet) {
            return;
        }
        this.currentBullet++;
        console.log(this.x)
        const bullet = new Bullet(this.x + this.raduis, this.y + this.height - this.raduis * 2, this.direction, this.power);
        Game.bullets.push(bullet);
    }

    isShooted(x, y) {
        //命中头部
        if ((x - this.x) ** 2 + (y - this.y - this.height) ** 2 < this.raduis ** 2) {
            this.health -= 50;
        }
        //命中身体
        else if (Math.abs(x - this.x) < this.raduis && Math.abs(y - this.y - this.height) < this.height) {
            this.health -= 20;
        }
        //命中腿部
        else if (Math.abs((x - this.x) + (y - this.y - this.height)) < this.raduis) {
            this.health -= 10;
        }
        //清除子弹
        Game.bullets.forEach(bullet => {
            if (Math.abs(bullet.x - x) < bullet.raduis && Math.abs(bullet.y - y) < bullet.raduis) {
                clearInterval(bullet.interval);
                Game.bullets.splice(Game.bullets.indexOf(bullet), 1);
            }
        })
    }
}

class Bullet {
    interval
    constructor(x, y, direction, speed, height = 50, raduis = 10, bodyLength = 25) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = speed;
        this.height = height;
        this.raduis = raduis;
        this.bodyLength = bodyLength;
    }
    draw() {
        //身体与脖子的交点
        const neckHeight = this.height - this.raduis;
        //身体与双腿的交点
        const bodyLegsX = this.height - this.raduis - this.bodyLength;
        Game.ctx.fillStyle = "blue";
        Game.ctx.beginPath();
        Game.ctx.arc(this.x - this.raduis * 2 * (-1) ** this.direction, this.y + neckHeight - this.raduis / 1.2, 5, 0, 2 * Math.PI);
        Game.ctx.fill();
        this.interval = setInterval(() => {
            this.x += this.speed * (-1) ** (this.direction + 1);
            if (this.x < 0 || this.x > Game.canvas.width) {

                clearInterval(this.interval);
                Game.bullets.splice(Game.bullets.indexOf(this), 1);
            }
        }, 1000 / 60)
    }
}

const game = new Game();
game.gameStart();

