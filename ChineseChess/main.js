class chess {
    realColor;
    x;
    y;
    htmlElement;
    code;
    constructor(color, x, y, code) {
        this.realColor = color;
        this.x = x;
        this.y = y;
        this.code = code;
        this.init();
    }
    get position() {
        let x = (this.x - 40) / 80;
        let y = (this.y - 40) / 80;
        return [x, y];
    }
    /**
     * @description 获取棋子颜色
     * @returns {Number} 1为红色，0为黑色
     */
    get color() {
        return Number(this.code < 16);
    }

    init() {
        let chessCircle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );
        chessCircle.setAttribute("cx", this.x);
        chessCircle.setAttribute("cy", this.y);
        chessCircle.setAttribute("r", 40);
        chessCircle.setAttribute("fill", this.realColor);
        chessCircle.setAttribute("stroke", "black");
        chessCircle.setAttribute("stroke-width", 1);
        chessCircle.setAttribute("class", "chess");
        let chessText = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );
        chessText.setAttribute("x", this.x);
        chessText.setAttribute("y", this.y);
        chessText.setAttribute("fill", "black");
        chessText.setAttribute("font-size", 40);
        chessText.setAttribute("text-anchor", "middle");
        chessText.setAttribute("dominant-baseline", "middle");
        chessText.innerHTML = this.name;
        this.htmlElement = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
        );
        this.htmlElement.appendChild(chessCircle);
        this.htmlElement.appendChild(chessText);
        this.htmlElement.setAttribute("color", this.color);
        this.htmlElement.setAttribute("id", this.code);
        chessBoard.svg.appendChild(this.htmlElement);
    }

    /**
     * @description 检查是否可以移动到目标位置
     * @param {Number} x
     * @param {Number} y
     * @return {Boolean} 是否可以移动
     *
     */
    examineMove(x, y) {
        const color = this.color;
        if (
            chessBoard.board[x][y] >= 7 - color * 7 &&
            chessBoard.board[x][y] <= 13 - color * 7
        ) {
            console.log("不能移动到自己的位置");
            return false;
        }
    }
    /**
     * @description 将数字转为对应整数
     * @param {Number} x
     */
    transform(x) {
        if (Math.abs(x - 40) < 40) {
            return 40;
        } else if (Math.abs(x - 120) < 40) {
            return 120;
        } else if (Math.abs(x - 200) < 40) {
            return 200;
        } else if (Math.abs(x - 280) < 40) {
            return 280;
        } else if (Math.abs(x - 360) < 40) {
            return 360;
        } else if (Math.abs(x - 440) < 40) {
            return 440;
        } else if (Math.abs(x - 520) < 40) {
            return 520;
        } else if (Math.abs(x - 600) < 40) {
            return 600;
        } else if (Math.abs(x - 680) < 40) {
            return 680;
        } else if (Math.abs(x - 760) < 40) {
            return 760;
        }
    }
    /**
     * @description 移动棋子，x和y为目标位置，鼠标点击坐标，需要转为整数
     * @param {Number} x 目标x坐标
     * @param {Number} y 目标y坐标
     *
     */
    move(x, y) {
        // console.log(x, y);
        x = this.transform(x);
        y = this.transform(y);
        // console.log(x, y);
        // console.log(this.x, this.y);
        if (x == this.x && y == this.y) {
            return;
        }
        if (this.examineMove(x, y)) {
            // 获取 circle 和 text 元素
            const circle = this.htmlElement.children[0];
            const text = this.htmlElement.children[1];

            // 检查元素是否存在
            if (circle && text) {
                // // 动画 circle 元素
                // circle.animate(
                //     [
                //         { cx: this.x, cy: this.y },
                //         { cx: x, cy: y },
                //     ],
                //     {
                //         duration: 1000,
                //         fill: "forwards",
                //     }
                // );

                // // 动画 text 元素
                // let curX = this.x;
                // let curY = this.y;
                // let speedX = x == this.x ? 0 : 0.5;
                // let speedY = y == this.y ? 0 : 0.5;
                // let animate = setInterval(() => {
                //     if(curX == x){
                //         speedX = 0;
                //     }
                //     if(curY == y){
                //         speedY = 0;
                //     }
                //     if(curX == x && curY == y) {
                //         clearInterval(animate);
                //     }
                //     curX += speedX;
                //     curY += speedY;
                //     text.setAttribute("x", curX);
                //     text.setAttribute("y", curY);
                // },1)
                circle.setAttribute("cx", x);
                circle.setAttribute("cy", y);
                text.setAttribute("x", x);
                text.setAttribute("y", y);
            } else {
                console.error("Circle or text element not found.");
            }
            chessBoard.board[this.position[0]][this.position[1]] = -1;
            this.x = x;
            this.y = y;
            x = (x - 40) / 80;
            y = (y - 40) / 80;
            if (chessBoard.board[x][y] != -1) {
                this.eat(x, y);
            }
            chessBoard.board[this.position[0]][this.position[1]] = this.code;
            chessBoard.selectedChess = null;
        } else {
            chessBoard.selectedChess = null;
            console.log("不能移动到该位置");
        }
    }

    eat(x, y) {
        let target = chessBoard.board[x][y];
        let targetChess = chessBoard.chesses[target];
        targetChess.htmlElement.remove();
        chessBoard.chesses[target] = null;
    }
}
class car extends chess {
    constructor(color, x, y, code) {
        super(color, x, y, code);
    }
    get name() {
        return this.code < 16 ? "俥" : "車";
    }
    examineMove(x, y) {
        console.log("examineMove");
        x = (x - 40) / 80;
        y = (y - 40) / 80;
        super.examineMove(x, y);
        //车走直线
        const [x0, y0] = this.position;
        if (x == x0) {
            //横向移动
            let min = Math.min(y, y0);
            let max = Math.max(y, y0);
            for (let i = min + 1; i < max; i++) {
                if (chessBoard.board[x][i] != -1) {
                    return false;
                }
            }
            return true;
        } else if (y == y0) {
            //纵向移动
            let min = Math.min(x, x0);
            let max = Math.max(x, x0);
            for (let i = min + 1; i < max; i++) {
                if (chessBoard.board[i][y] != -1) {
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }
    }
}

class horse extends chess {
    constructor(color, x, y, code) {
        super(color, x, y, code);
    }
    get name() {
        return this.code < 16 ? "傌" : "馬";
    }
    /**
     * @description 检查是否可以移动到目标位置
     * @param {Number} x 目标x坐标
     * @param {Number} y 目标y坐标
     * @returns {Boolean} 是否可以移动
     */
    examineMove(x, y) {
        x = (x - 40) / 80;
        y = (y - 40) / 80;
        super.examineMove(x, y);
        //马走日
        const [x0, y0] = this.position;
        if (Math.pow(x - x0, 2) + Math.pow(y - y0, 2) != 5) {
            return false;
        }
        //蹩马腿
        if (x > x0) {
            //往右移动
            if (y - y0 == 2) {
                if (chessBoard.board[x0][y0 + 1] == -1) {
                    return true;
                } else {
                    return false;
                }
            } else if (y - y0 == -2) {
                if (chessBoard.board[x0][y0 - 1] == -1) {
                    return true;
                } else {
                    return false;
                }
            } else if (y - y0 == 1 || y - y0 == -1) {
                if (chessBoard.board[x0 + 1][y0] == -1) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else if (x < x0) {
            //往左移动
            if (y - y0 == 2) {
                if (chessBoard.board[x0][y0 + 1] == -1) {
                    return true;
                } else {
                    return false;
                }
            } else if (y - y0 == -2) {
                if (chessBoard.board[x0][y0 - 1] == -1) {
                    return true;
                } else {
                    return false;
                }
            } else if (y - y0 == 1 || y - y0 == -1) {
                if (chessBoard.board[x0 - 1][y0] == -1) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}

class elephant extends chess {
    constructor(color, x, y, code) {
        super(color, x, y, code);
    }
    get name() {
        return this.code < 16 ? "相" : "象";
    }
    /**
     * @description 检查是否可以移动到目标位置
     * @param {Number} x 目标x坐标
     * @param {Number} y 目标y坐标
     * @returns {Boolean} 是否可以移动
     */
    examineMove(x, y) {
        x = (x - 40) / 80;
        y = (y - 40) / 80;
        super.examineMove(x, y);
        const state = this.color^chessBoard.user;
        if (y > 5 && state == 1) {
            return false;
        }
        if (y <= 4 && state == 0) {
            return false;
        }
        //象走田
        const [x0, y0] = this.position;
        if (x > x0 && y > y0) {
            //往右下移动
            if (chessBoard.board[x0 + 1][y0 + 1] == -1) {
                return true;
            } else {
                return false;
            }
        } else if (x > x0 && y < y0) {
            //往左下移动
            if (chessBoard.board[x0 + 1][y0 - 1] == -1) {
                return true;
            } else {
                return false;
            }
        } else if (x < x0 && y > y0) {
            //往右上移动
            if (chessBoard.board[x0 - 1][y0 + 1] == -1) {
                return true;
            } else {
                return false;
            }
        } else if (x < x0 && y < y0) {
            //往左上移动
            if (chessBoard.board[x0 - 1][y0 - 1] == -1) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}

class advisor extends chess {
    constructor(color, x, y, code) {
        super(color, x, y, code);
    }
    get name() {
        return this.code < 16 ? "仕" : "士";
    }
    /**
     * @description 检查是否可以移动到目标位置
     * @param {Number} x 目标x坐标
     * @param {Number} y 目标y坐标
     * @returns {Boolean} 是否可以移动
     */
    examineMove(x, y) {
        x = (x - 40) / 80;
        y = (y - 40) / 80;
        super.examineMove(x, y);
        //士走斜线
        const [x0, y0] = this.position;
        const state = this.color^chessBoard.user;
        if (
            x >= 6 ||
            x < 3 ||
            y > 9 - 7 * state ||
            y < 7 - 7 * state
        ) {
            console.log("超出范围");
            return false;
        }
        console.log(x, y);
        console.log(x0, y0);
        if (Math.abs(x - x0) == 1 && Math.abs(y - y0) == 1) {
            return true;
        } else {
            return false;
        }
    }
}

class king extends chess {
    constructor(color, x, y, code) {
        super(color, x, y, code);
    }

    get name() {
        return this.code < 16 ? "帥" : "将";
    }
    examineMove(x, y) {
        x = (x - 40) / 80;
        y = (y - 40) / 80;
        super.examineMove(x, y);
        //帅走直线
        const [x0, y0] = this.position;
        console.log(x, y);
        if (x > 6 || x < 3||Math.abs(x - x0) + Math.abs(y - y0) !== 1) {
            console.log("超出范围");
            return false;
        }
        const state = this.color^chessBoard.user;
        if(y > 9 - 7 * state || y < 7 - 7 * state){
            console.log("超出范围了");
            return false;
        }
        return true;
    }
}

class cannon extends chess {
    constructor(color, x, y, code) {
        super(color, x, y, code);
    }
    get name() {
        return this.code < 16 ? "炮" : "砲";
    }

    examineMove(x, y) {
        x = (x - 40) / 80;
        y = (y - 40) / 80;
        super.examineMove(x, y);
        //炮走直线
        const [x0, y0] = this.position;
        if (x == x0) {
            //纵向移动
            let min = Math.min(y, y0);
            let max = Math.max(y, y0);
            let count = 0;
            for (let i = min + 1; i < max; i++) {
                if (chessBoard.board[x][i] != -1) {
                    count++;
                }
            }
            if (chessBoard.board[x][y] == -1) {
                if (count == 0) {
                    return true;
                } else {
                    console.log("挡住了");
                    return false;
                }
            } else {
                if (count == 1) {
                    return true;
                } else {
                    console.log("中间至少有两个子");
                    return false;
                }
            }
        } else if (y == y0) {
            //横向移动
            let min = Math.min(x, x0);
            let max = Math.max(x, x0);
            let count = 0;
            for (let i = min + 1; i < max; i++) {
                if (chessBoard.board[i][y] != -1) {
                    count++;
                }
            }
            if (chessBoard.board[x][y] == -1) {
                if (count == 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                if (count == 1) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }
    }
}

class soldier extends chess {
    constructor(color, x, y, code) {
        super(color, x, y, code);
    }
    get name() {
        return this.code < 16 ? "兵" : "卒";
    }
    examineMove(x, y) {
        x = (x - 40) / 80;
        y = (y - 40) / 80;
        super.examineMove(x, y);
        //兵走直线
        const [x0, y0] = this.position;
        if (this.color == 1) {
            //红色
            if (chessBoard.user == 0) {
                if (y0 > 4 && Math.abs(x - x0) == 1 && y - y0 == 0) {
                    return true;
                } else if (x - x0 == 0 && y - y0 == 1) {
                    return true;
                } else {
                    return false;
                }
            } else {
                if (y0 <= 4 && Math.abs(x - x0) == 1 && y - y0 == 0) {
                    return true;
                } else if (x - x0 == 0 && y - y0 == -1) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            //黑色
            if (chessBoard.user == 0) {
                if (y0 <= 4 && Math.abs(x - x0) == 1 && y - y0 == 0) {
                    return true;
                } else if (x - x0 == 0 && y - y0 == -1) {
                    return true;
                } else {
                    return false;
                }
            } else {
                if (y0 > 4 && Math.abs(x - x0) == 1 && y - y0 == 0) {
                    return true;
                } else if (x - x0 == 0 && y - y0 == 1) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }
}

class chessBoard {
    //开一个数组存放棋子
    //-1为空
    //0为帅，1为仕，2为相，3为傌，4为車，5为炮，6为兵
    //7为将，8为士，9为象，10为馬，11为車，12为砲，13为卒
    /**
     * @description 选中的棋子
     * @type {chess}
     */
    static selectedChess = null;
    static chesses = [];
    static board = [
        [0, -1, -1, 11, -1, -1, 27, -1, -1, 16],
        [2, -1, 9, -1, -1, -1, -1, 25, -1, 18],
        [4, -1, -1, 12, -1, -1, 28, -1, -1, 20],
        [6, -1, -1, -1, -1, -1, -1, -1, -1, 22],
        [8, -1, -1, 13, -1, -1, 29, -1, -1, 24],
        [7, -1, -1, -1, -1, -1, -1, -1, -1, 23],
        [5, -1, -1, 14, -1, -1, 30, -1, -1, 21],
        [3, -1, 10, -1, -1, -1, -1, 26, -1, 19],
        [1, -1, -1, 15, -1, -1, 31, -1, -1, 17],
    ];
    static svg = document.getElementById("svg");
    static user = 0;
    static changeUser() {
        chessBoard.user = 1 - chessBoard.user;
    }
    init() {
        for (let i = 0; i < 2; i++) {
            let initChess = new car(
                "red",
                40 + 640 * i,
                40 + chessBoard.user * 720,
                i
            );
            chessBoard.chesses.push(initChess);
        }
        for (let i = 0; i < 2; i++) {
            let initChess = new horse(
                "red",
                120 + 480 * i,
                40 + chessBoard.user * 720,
                2 + i
            );
            chessBoard.chesses.push(initChess);
        }
        for (let i = 0; i < 2; i++) {
            let initChess = new elephant(
                "red",
                200 + 320 * i,
                40 + chessBoard.user * 720,
                4 + i
            );
            chessBoard.chesses.push(initChess);
        }
        for (let i = 0; i < 2; i++) {
            let initChess = new advisor(
                "red",
                280 + 160 * i,
                40 + chessBoard.user * 720,
                6 + i
            );
            chessBoard.chesses.push(initChess);
        }
        for (let i = 0; i < 1; i++) {
            let initChess = new king("red", 360, 40 + chessBoard.user * 720, 8);
            chessBoard.chesses.push(initChess);
        }
        for (let i = 0; i < 2; i++) {
            let initChess = new cannon(
                "red",
                120 + 480 * i,
                200 + chessBoard.user * 400,
                9 + i
            );
            chessBoard.chesses.push(initChess);
        }
        for (let i = 0; i < 5; i++) {
            let initChess = new soldier(
                "red",
                40 + 160 * i,
                280 + chessBoard.user * 240,
                11 + i
            );
            chessBoard.chesses.push(initChess);
        }
        for (let i = 0; i < 2; i++) {
            let initChess = new car(
                "#5a5a5a",
                40 + 640 * i,
                760 - chessBoard.user * 720,
                16 + i
            );
            chessBoard.chesses.push(initChess);
        }
        for (let i = 0; i < 2; i++) {
            let initChess = new horse(
                "#5a5a5a",
                120 + 480 * i,
                760 - chessBoard.user * 720,
                18 + i
            );
            chessBoard.chesses.push(initChess);
        }
        for (let i = 0; i < 2; i++) {
            let initChess = new elephant(
                "#5a5a5a",
                200 + 320 * i,
                760 - chessBoard.user * 720,
                20 + i
            );
            chessBoard.chesses.push(initChess);
        }
        for (let i = 0; i < 2; i++) {
            let initChess = new advisor(
                "#5a5a5a",
                280 + 160 * i,
                760 - chessBoard.user * 720,
                22 + i
            );
            chessBoard.chesses.push(initChess);
        }
        for (let i = 0; i < 1; i++) {
            let initChess = new king(
                "#5a5a5a",
                360,
                760 - chessBoard.user * 720,
                24
            );
            chessBoard.chesses.push(initChess);
        }
        for (let i = 0; i < 2; i++) {
            let initChess = new cannon(
                "#5a5a5a",
                120 + 480 * i,
                600 - chessBoard.user * 400,
                25 + i
            );
            chessBoard.chesses.push(initChess);
        }
        for (let i = 0; i < 5; i++) {
            let initChess = new soldier(
                "#5a5a5a",
                40 + 160 * i,
                520 - chessBoard.user * 240,
                27 + i
            );
            chessBoard.chesses.push(initChess);
        }

        chessBoard.user === 1 &&
            chessBoard.board.forEach((row) => {
                row.reverse();
            });
        chessBoard.svg.addEventListener("click", (e) => {
            const point = chessBoard.svg.createSVGPoint();
            point.x = e.clientX;
            point.y = e.clientY;
            const svgPoint = point.matrixTransform(
                chessBoard.svg.getScreenCTM().inverse()
            );
            let target = e.target;
            if (target.tagName === "circle" || target.tagName === "text") {
                target = target.parentNode;
            }
            if (chessBoard.selectedChess) {
                if (
                    chessBoard.selectedChess.color ==
                    target.getAttribute("color")
                ) {
                    chessBoard.selectedChess =
                        chessBoard.chesses[Number(target.getAttribute("id"))];
                    console.log(chessBoard.selectedChess);
                    return;
                }
                try {
                    chessBoard.selectedChess.move(svgPoint.x, svgPoint.y);
                    console.log("try to move");
                } catch (err) {
                    console.log(err);
                    if (
                        Math.abs(svgPoint.x - chessBoard.selectedChess.x) <
                            40 &&
                        Math.abs(svgPoint.y - chessBoard.selectedChess.y) < 40
                    ) {
                        console.log("click on the same position");
                    } else {
                        console.log(svgPoint.x, svgPoint.y);
                        console.log(
                            chessBoard.selectedChess.x,
                            chessBoard.selectedChess.y
                        );
                        console.log("move error");
                    }
                    chessBoard.selectedChess = null;
                }
            } else {
                //TODO:根据用户颜色判断
                chessBoard.selectedChess =
                    chessBoard.chesses[Number(target.getAttribute("id"))];
            }
        });
    }
}

let board = new chessBoard();
chessBoard.changeUser();
board.init();
