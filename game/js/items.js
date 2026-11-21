
function drawKhinkali(ctx, x, y, size, golden = false) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 48, size / 48);

    // Soft shadow underneath the dumpling
    ctx.fillStyle = "rgba(70, 45, 20, 0.18)";
    ctx.beginPath();
    ctx.ellipse(24, 44, 19, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dough gradient
    const dough = ctx.createLinearGradient(8, 5, 40, 43);

    if (golden) {
        dough.addColorStop(0, "#fff2a8");
        dough.addColorStop(0.45, "#f6c744");
        dough.addColorStop(1, "#bd8120");
    } else {
        dough.addColorStop(0, "#fffdf0");
        dough.addColorStop(0.35, "#f4e7c9");
        dough.addColorStop(0.75, "#ddc49c");
        dough.addColorStop(1, "#b89568");
    }

    // Main khinkali body
    ctx.beginPath();
    ctx.moveTo(19, 10);

    ctx.bezierCurveTo(14, 13, 7, 17, 5, 26);
    ctx.bezierCurveTo(2, 36, 10, 43, 24, 44);
    ctx.bezierCurveTo(38, 43, 46, 36, 43, 26);
    ctx.bezierCurveTo(41, 17, 34, 13, 29, 10);

    ctx.bezierCurveTo(29, 6, 29, 3, 27, 2);
    ctx.bezierCurveTo(25, 0, 21, 0, 19, 2);
    ctx.bezierCurveTo(17, 4, 18, 7, 19, 10);

    ctx.closePath();

    ctx.fillStyle = dough;
    ctx.shadowColor = "rgba(70, 40, 15, 0.25)";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetY = 2;
    ctx.fill();

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Outer edge
    ctx.strokeStyle = golden ? "#c18a29" : "#b99c72";
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Characteristic khinkali pleats
    const folds = [
        [20, 9, 5, 22, 13, 40],
        [21, 10, 12, 24, 18, 43],
        [22, 9, 18, 25, 22, 44],
        [24, 9, 30, 24, 26, 44],
        [26, 9, 37, 23, 31, 42],
        [28, 10, 43, 22, 36, 39]
    ];

    folds.forEach(([x1, y1, cx, cy, x2, y2], index) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(cx, cy, x2, y2);

        ctx.strokeStyle = golden
            ? "rgba(155, 101, 20, 0.35)"
            : "rgba(151, 117, 77, 0.38)";

        ctx.lineWidth = index % 2 === 0 ? 1.3 : 0.9;
        ctx.stroke();
    });

    // Soft highlight on the dough
    ctx.beginPath();
    ctx.ellipse(14, 25, 5, 10, -0.4, 0, Math.PI * 2);

    ctx.fillStyle = golden
        ? "rgba(255, 255, 210, 0.35)"
        : "rgba(255, 255, 255, 0.55)";

    ctx.fill();

    // Twisted top / knot
    ctx.beginPath();
    ctx.moveTo(19, 10);
    ctx.quadraticCurveTo(16, 5, 19, 2);
    ctx.quadraticCurveTo(22, -1, 26, 1);
    ctx.quadraticCurveTo(30, 4, 28, 10);
    ctx.quadraticCurveTo(24, 13, 19, 10);

    ctx.fillStyle = golden ? "#e5ae37" : "#e9d7b7";
    ctx.fill();

    ctx.strokeStyle = golden ? "#bd8424" : "#c2a77f";
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Knot highlight
    ctx.beginPath();
    ctx.moveTo(21, 3);
    ctx.quadraticCurveTo(24, 1, 26, 4);

    ctx.strokeStyle = "rgba(255,255,255,0.65)";
    ctx.lineWidth = 1.3;
    ctx.stroke();

    ctx.restore();
}

export class Item {
    constructor(canvas, level) {
        this.canvas = canvas;

        this.x = Math.random() * (canvas.width - 48);
        this.y = -50;

        this.size = 48;
        this.speed = 2 + level * 0.5;

        const random = Math.random();

        if (random < 0.65) {
            this.type = "khinkali";
            this.emoji = null;
        } else if (random < 0.80) {
            this.type = "golden";
            this.emoji = null;
        } else {
            this.type = "pepper";
            this.emoji = "🌶️";
        }
    }

    update() {
        this.y += this.speed;
    }

    draw(ctx) {
        if (this.type === "khinkali") {
            drawKhinkali(ctx, this.x, this.y, this.size);
        } else if (this.type === "golden") {
            drawKhinkali(ctx, this.x, this.y, this.size, true);
        } else {
            ctx.font = "34px Arial";
            ctx.textAlign = "left";
            ctx.fillText(this.emoji, this.x, this.y + 35);
        }
    }

    collides(player) {
        return (
            this.x < player.x + player.width &&
            this.x + this.size > player.x &&
            this.y < player.y + player.height &&
            this.y + this.size > player.y
        );
    }
}
