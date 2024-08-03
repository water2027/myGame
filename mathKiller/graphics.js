var lost = 0;

class Background {
    totalScore = 0;
    static totalGraphics = 0;
    static graphics = [];
    game = null;
    generateInterval = null;
    max = 10;

    constructor(width = window.innerWidth, height = window.innerHeight) {
        this.canvas = document.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.addEventListener('click', (e) => {
            let x = e.offsetX;
            let y = e.offsetY;
            Background.graphics.forEach((item) => {
                if (item.isShooted(x, y, this.ctx)) {
                    this.totalScore += item.score;
                    Background.graphics.splice(Background.graphics.indexOf(item), 1);
                }
            });
        });
    }

    addNewGraphics() {

        let x = Math.random() * this.canvas.width;
        let y = 0;
        let speedX = Math.random() * 10 - 5;
        let speedY = Math.abs(Math.random() * 10 - 5);
        let score = Math.floor(Math.random() * 10);
        let color = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
        let recOrCir = Math.random();
        let newGraphics = null;
        if (recOrCir > 0.5) {
            let width = Math.random() * 50 + 50;
            let height = Math.random() * 50 + 50;
            if(x + width > this.canvas.width) {
                x = this.canvas.width - width;
            }
            newGraphics = new Rectangle(x, y, speedX, speedY, score, color, width, height);
        } else {
            let radius = Math.random() * 50 + 20;
            if(x + radius > this.canvas.width) {
                x = this.canvas.width - radius;
            }
            newGraphics = new circle(x, y, speedX, speedY, score, color, radius);
        }
        Background.graphics.push(newGraphics);
        Background.totalGraphics++;
    }

    gameStart() {
        this.game = setInterval(() => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            Background.graphics.forEach((item) => {
                item.draw(this.ctx, this.canvas);
            })
            this.ctx.font = '30px Arial';
            this.ctx.fillText(`分数：${this.totalScore}`, 10, 50);
            if (lost >= this.max) {
                clearInterval(this.game);
                clearInterval(this.generateInterval);
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                Background.graphics = [];
                this.ctx.fillText('游戏结束', this.canvas.width / 2 - 50, this.canvas.height / 2);
                this.ctx.fillText('再来一次', this.canvas.width / 2 - 50, this.canvas.height / 2 + 50);
                this.canvas.addEventListener('click', () => {
                    this.canvas.removeEventListener('click', () => { });
                    this.tryAgain();
                });
            }
        }, 1000 / 60);
        this.generateInterval = setInterval(() => {
            Background.totalGraphics < 10 && this.addNewGraphics();
        }, 1000);
    }

    tryAgain() {
        Background.totalGraphics = 0;
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

    constructor(x, y, speedX, speedY, score, color, width, height) {
        super(x, y, speedX, speedY, score, color);
        this.width = width;
        this.height = height;
    }

    draw(ctx, canvas) {
        this.x += this.speedX;
        this.y += this.speedY;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        if (this.x <= 0 || this.x >= canvas.width - this.width) {
            this.speedX = -this.speedX;
        }
        if (this.y <= 0 || this.y >= canvas.height - this.height) {
            clearInterval(this.innerval);
            ctx.clearRect(this.x - 5, this.y - 5, this.width + 5, this.height + 5);
            Background.graphics.splice(Background.graphics.indexOf(this), 1);
            lost++;
            Background.totalGraphics--;
        }
    }

    isShooted(x, y, ctx) {
        if (x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height) {
            Background.totalGraphics--;
            ctx.clearRect(this.x - 5, this.y - 5, this.width + 5, this.height + 5);
            return true;
        }
        return false;
    }
}

class circle extends BaseGraphics {
    constructor(x, y, speedX, speedY, score, color, radius) {
        super(x, y, speedX, speedY, score, color);
        this.radius = radius;
    }

    draw(ctx, canvas) {
        this.x += this.speedX;
        this.y += this.speedY;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        if (this.x <= 0 || this.x >= canvas.width) {
            this.speedX = -this.speedX;
        }
        if (this.y <= 0 || this.y >= canvas.height) {
            clearInterval(this.innerval);
            ctx.clearRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
            Background.graphics.splice(Background.graphics.indexOf(this), 1);
            lost++;
            Background.totalGraphics--;
        }
    }

    isShooted(x, y, ctx) {
        if (Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2) < this.radius) {
            Background.totalGraphics--;
            ctx.clearRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
            return true;
        }
        return false;
    }
}

function main() {
    let bg = new Background();
    bg.gameStart();
}

main();