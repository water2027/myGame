class chess {
    name;
    color;
    x;
    y;
    htmlElement;
    code;
    constructor(name, color, x, y) {
        this.name = name;
        this.color = color;
        this.x = x;
        this.y = y;
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
        return Number(this.code < 7);
    }

    init() {
        let chessCircle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );
        chessCircle.setAttribute("cx", this.x);
        chessCircle.setAttribute("cy", this.y);
        chessCircle.setAttribute("r", 40);
        chessCircle.setAttribute("fill", this.color);
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
            return false;
        }
    }
    move(x, y) {
        if (this.examineMove(x, y)) {
            console.log(this.x, this.y);
            console.log(x, y);
            // 获取 circle 和 text 元素
            const circle = this.htmlElement.children[0];
            const text = this.htmlElement.children[1];

            // 检查元素是否存在
            if (circle && text) {
                // 动画 circle 元素
                circle.animate(
                    [
                        { cx: this.x, cy: this.y },
                        { cx: x, cy: y },
                    ],
                    {
                        duration: 1000,
                        fill: "forwards",
                    }
                );

                // 动画 text 元素
                text.animate(
                    [
                        { x: this.x, y: this.y },
                        { x: x, y: y },
                    ],
                    {
                        duration: 1000,
                        fill: "forwards",
                    }
                );
                text.setAttribute('x', x);
                text.setAttribute('y', y);
            } else {
                console.error("Circle or text element not found.");
            }
            console.log(this.position);

            chessBoard.board[this.position[0]][this.position[1]] = -1;
            this.x = x;
            this.y = y;
            chessBoard.board[this.position[0]][this.position[1]] = this.code;
        } else {
            alert("不能移动到该位置");
        }
    }
}

class car extends chess {
    constructor(name, color, x, y, code) {
        super(name, color, x, y, code);
    }
    examineMove(x, y) {
        x = (x - 40) / 80;
        y = (y - 40) / 80;
        super.examineMove(x, y);
        //车走直线
        console.log(x, y);
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
    constructor(name, color, x, y, code) {
        super(name, color, x, y, code);
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
        //蹩马腿
        const [x0, y0] = this.position;
        if (x > x0) {
            //往右移动
            if (y - y0 == 2 || y - y0 == -2) {
                if (chessBoard.board[x0 + 1][y0] == -1) {
                    return true;
                } else {
                    return false;
                }
            } else if (y - y0 == 1 || y - y0 == -1) {
                if (chessBoard.board[x0][y0 + 1] == -1) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else if (x < x0) {
            //往左移动
            if (y - y0 == 2 || y - y0 == -2) {
                if (chessBoard.board[x0 - 1][y0] == -1) {
                    return true;
                } else {
                    return false;
                }
            } else if (y - y0 == 1 || y - y0 == -1) {
                if (chessBoard.board[x0][y0 + 1] == -1) {
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
    constructor(name, color, x, y, code) {
        super(name, color, x, y, code);
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
    constructor(name, color, x, y, code) {
        super(name, color, x, y, code);
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
        if (chessBoard.board[x][y] >= 0 && chessBoard.board[x][y] <= 6) {
            return false;
        }
        if (x > 6 || x < 3 || y > 2 || y < 0) {
            return false;
        }
        if (x - x0 == 1 && Math.abs(y - y0) == 0) {
            return true;
        } else if (x - x0 == -1 && Math.abs(y - y0) == 0) {
            return true;
        } else if (x - x0 == 0 && y - y0 == 1) {
            return true;
        } else if (x - x0 == 0 && y - y0 == -1) {
            return true;
        } else {
            return false;
        }
    }
}

class king extends chess {
    constructor(name, color, x, y, code) {
        super(name, color, x, y, code);
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
        //帅走直线
        const [x0, y0] = this.position;
        if (x > 6 || x < 3 || y > 2 || y < 0) {
            return false;
        }
        if (Math.abs(x - x0) + Math.abs(y - y0) == 1) {
            return true;
        } else {
            return false;
        }
    }
}

class cannon extends chess {
    constructor(name, color, x, y, code) {
        super(name, color, x, y, code);
    }

    examineMove(x, y) {
        x = (x - 40) / 80;
        y = (y - 40) / 80;
        super.examineMove(x, y);
        //炮走直线
        const [x0, y0] = this.position;
        if (x == x0) {
            //横向移动
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
                    return false;
                }
            } else {
                if (count == 1) {
                    return true;
                } else {
                    return false;
                }
            }
        } else if (y == y0) {
            //纵向移动
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
    constructor(name, color, x, y, code) {
        super(name, color, x, y, code);
    }
    examineMove(x, y) {
        x = (x - 40) / 80;
        y = (y - 40) / 80;
        super.examineMove(x, y);
        //兵走直线
        const [x0, y0] = this.position;
        if (this.color == 1) {
            //红色
            if (x - x0 == 1 && y - y0 == 0) {
                return true;
            } else if (x - x0 == 0 && Math.abs(y - y0) == 1) {
                return true;
            } else {
                return false;
            }
        } else {
            //黑色
            if (x - x0 == -1 && y - y0 == 0) {
                return true;
            } else if (x - x0 == 0 && Math.abs(y - y0) == 1) {
                return true;
            } else {
                return false;
            }
        }
    }
}

class chessBoard {
    //开一个数组存放棋子
    //-1为空
    //0为帅，1为仕，2为相，3为傌，4为車，5为炮，6为兵
    //7为将，8为士，9为象，10为馬，11为車，12为砲，13为卒
    chesses = [];
    static board = [
        [4, 3, 2, 1, 0, 1, 2, 3, 4],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, 5, -1, -1, -1, -1, -1, 5, -1],
        [6, -1, 6, -1, 6, -1, 6, -1, 6],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1],
        [13, -1, 13, -1, 13, -1, 13, -1, 13],
        [-1, 12, -1, -1, -1, -1, -1, 12, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1],
        [11, 10, 9, 8, 5, 8, 9, 10, 11],
    ];
    static svg = document.getElementById("svg");
    init() {
        for (let i = 0; i < 2; i++) {
            let initChess = new car("車", "red", 40 + 640 * i, 40, 4);
            this.chesses.push(initChess);
        }
        for (let i = 0; i < 2; i++) {
            let initChess = new horse("傌", "red", 120 + 480 * i, 40, 3);
            this.chesses.push(initChess);
        }
        for (let i = 0; i < 2; i++) {
            let initChess = new elephant("相", "red", 200 + 320 * i, 40, 2);
            this.chesses.push(initChess);
        }
        for (let i = 0; i < 2; i++) {
            let initChess = new advisor("仕", "red", 280 + 160 * i, 40, 1);
            this.chesses.push(initChess);
        }
        for (let i = 0; i < 2; i++) {
            let initChess = new king("帥", "red", 360, 40, 0);
            this.chesses.push(initChess);
        }
        for (let i = 0; i < 2; i++) {
            let initChess = new cannon("炮", "red", 120 + 480 * i, 200, 5);
            this.chesses.push(initChess);
        }
        for (let i = 0; i < 5; i++) {
            let initChess = new soldier("兵", "red", 40 + 160 * i, 280, 6);
            this.chesses.push(initChess);
        }
        for (let i = 0; i < 2; i++) {
            let initChess = new car("車", "#5a5a5a", 40 + 640 * i, 760, 11);
            this.chesses.push(initChess);
        }
        for (let i = 0; i < 2; i++) {
            let initChess = new horse("馬", "#5a5a5a", 120 + 480 * i, 760, 10);
            this.chesses.push(initChess);
        }
        for (let i = 0; i < 2; i++) {
            let initChess = new elephant(
                "象",
                "#5a5a5a",
                200 + 320 * i,
                760,
                9
            );
            this.chesses.push(initChess);
        }
        for (let i = 0; i < 2; i++) {
            let initChess = new advisor("士", "#5a5a5a", 280 + 160 * i, 760, 8);
            this.chesses.push(initChess);
        }
        for (let i = 0; i < 2; i++) {
            let initChess = new king("将", "#5a5a5a", 360, 760, 7);
            this.chesses.push(initChess);
        }
        for (let i = 0; i < 2; i++) {
            let initChess = new cannon("砲", "#5a5a5a", 120 + 480 * i, 600, 12);
            this.chesses.push(initChess);
        }
        for (let i = 0; i < 5; i++) {
            let initChess = new soldier("卒", "#5a5a5a", 40 + 160 * i, 520, 13);
            this.chesses.push(initChess);
        }
        this.chesses.forEach((chess) => {
            chess.htmlElement.addEventListener("click", () => {
                console.log(chess);
            });
        });
    }
    eat() {}
}

let board = new chessBoard();
board.init();
