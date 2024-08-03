var graphics = [];
var lost = 0;

class Background {
    totalScore = 0;
    
    game = null;
    max = 10;

    constructor(width = window.innerWidth, height = window.innerHeight) {
        this.canvas = document.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.addEventListener('click', (e) => {
            let x = e.offsetX;
            let y = e.offsetY;
            graphics.forEach((item) => {
                if (item.isShooted(x, y,this.ctx)) {
                    this.totalScore += item.score;
                    graphics.splice(graphics.indexOf(item), 1);
                }
            });
        });
    }

    addNewGraphics() {
        let x = Math.random() * this.canvas.width;
        let y = 0;
        let speedX = Math.random() * 10 - 5;
        let speedY = Math.random() * 10;
        let score = Math.floor(Math.random() * 10);
        let color = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
        let width = Math.random() * 50 + 50;
        let height = Math.random() * 50 + 50;
        let rectangle = new Rectangle(x, y, speedX, speedY, score, color, width, height);
        graphics.push(rectangle);
        rectangle.draw(this.ctx);
        rectangle.move(this.ctx, this.canvas);
    }

    gameStart() {
        this.game = setInterval(() => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.addNewGraphics();
            graphics.forEach((item) => {
                item.draw(this.ctx);
            });
            this.ctx.font = '30px Arial';
            this.ctx.fillText(`分数：${this.totalScore}`, 10, 50);
            if (lost >= this.max) {
                clearInterval(this.game);
                graphics.forEach((item) => {
                    item.stop();
                })
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                graphics = [];
                this.ctx.fillText('游戏结束', this.canvas.width / 2 - 50, this.canvas.height / 2);
                this.ctx.fillText('再来一次', this.canvas.width / 2 - 50, this.canvas.height / 2 + 50);
                this.canvas.addEventListener('click', (e) => {
                    let x = e.offsetX;
                    let y = e.offsetY;
                    if (x > this.canvas.width / 2 - 50 && x < this.canvas.width / 2 + 50 && y > this.canvas.height / 2 && y < this.canvas.height / 2 + 50) {
                        this.canvas.removeEventListener('click', () => { });
                        this.tryAgain();
                    }
                });
            }
        }, 1000);
    }

    tryAgain() {
        this.totalScore = 0;
        lost = 0;
        this.gameStart();
    }
}

class BaseGraphics {
    constructor(x, y, speedX, speedY, score, color) {
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.score = score;
        this.color = color;
    }
}

class Rectangle extends BaseGraphics {
    innerval = null;

    constructor(x, y, speedX, speedY, score, color, width, height) {
        super(x, y, speedX, speedY, score, color);
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(ctx, canvas) {
        this.innerval = setInterval(() => {
            ctx.clearRect(this.x, this.y, this.width, this.height);
            this.x += this.speedX;
            this.y += this.speedY;
            this.draw(ctx);
            if (this.x <= 0 || this.x >= canvas.width - this.width) {
                clearInterval(this.innerval);
                ctx.clearRect(this.x, this.y, this.width, this.height);
                graphics.splice(graphics.indexOf(this), 1);
                lost++;
            }
            if (this.y <= 0 || this.y >= canvas.height - this.height) {
                clearInterval(this.innerval);
                ctx.clearRect(this.x, this.y, this.width, this.height);
                graphics.splice(graphics.indexOf(this), 1);
                lost++;
            }

        }, 1000 / 100);
    }

    isShooted(x, y,ctx) {
        if (x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height) {
            //清除计时器并清除自己
            clearInterval(this.innerval);
            ctx.clearRect(this.x, this.y, this.width, this.height);
            return true;
        }
        return false;
    }

    stop() {
        clearInterval(this.innerval);
    }
}

function main() {
    let bg = new Background();
    bg.gameStart();
}

main();