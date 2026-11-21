
export class Player {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = 100;
        this.height = 40;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - 58;
        this.speed = 7;
    }

    move(direction) {
        this.x += direction * this.speed;

        this.x = Math.max(
            0,
            Math.min(this.canvas.width - this.width, this.x)
        );
    }

    draw(ctx) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + 23;

        ctx.save();

        // Plate shadow
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + 5, 49, 15, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(67, 37, 20, 0.25)";
        ctx.fill();

        // Outer ceramic plate
        const plateGradient = ctx.createLinearGradient(
            this.x, this.y, this.x + this.width, this.y + 40
        );

        plateGradient.addColorStop(0, "#fffdf0");
        plateGradient.addColorStop(0.5, "#d9c6a5");
        plateGradient.addColorStop(1, "#fff5dc");

        ctx.beginPath();
        ctx.ellipse(centerX, centerY, 49, 15, 0, 0, Math.PI * 2);
        ctx.fillStyle = plateGradient;
        ctx.fill();

        ctx.strokeStyle = "#a87c48";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Decorative inner rim
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, 40, 10, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "#b88b53";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Plate highlight
        ctx.beginPath();
        ctx.ellipse(centerX - 9, centerY - 3, 22, 4, 0, 0, Math.PI);
        ctx.strokeStyle = "rgba(255,255,255,0.8)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }
}
