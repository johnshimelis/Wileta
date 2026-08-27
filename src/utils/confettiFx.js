// Lightweight zero-dependency canvas confetti particle burst
export function triggerConfetti(options = {}) {
    try {
        const count = options.count || 65;
        const colors = options.colors || ['#059669', '#10B981', '#F59E0B', '#E5A91E', '#0072CE', '#EC4899', '#8B5CF6'];
        
        let canvas = document.getElementById('gurshapay-confetti-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'gurshapay-confetti-canvas';
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100vw';
            canvas.style.height = '100vh';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '99999';
            document.body.appendChild(canvas);
        }

        const ctx = canvas.getContext('2d');
        const width = window.innerWidth;
        const height = window.innerHeight;
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        const particles = [];
        const originX = options.x !== undefined ? options.x : width * 0.5;
        const originY = options.y !== undefined ? options.y : height * 0.45;

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 4 + Math.random() * 8;
            particles.push({
                x: originX,
                y: originY,
                vx: Math.cos(angle) * speed * (0.8 + Math.random() * 0.5),
                vy: Math.sin(angle) * speed * 0.9 - 3.5,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 4 + Math.random() * 6,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 12,
                opacity: 1,
                gravity: 0.16 + Math.random() * 0.08,
                drag: 0.96
            });
        }

        let animationFrame;
        const startTime = Date.now();

        function render() {
            ctx.clearRect(0, 0, width, height);
            let alive = false;

            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += p.gravity;
                p.vx *= p.drag;
                p.rotation += p.rotationSpeed;
                p.opacity -= 0.012;

                if (p.opacity > 0 && p.y < height + 20) {
                    alive = true;
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);
                    ctx.globalAlpha = Math.max(0, p.opacity);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
                    ctx.restore();
                }
            });

            if (alive && Date.now() - startTime < 3500) {
                animationFrame = requestAnimationFrame(render);
            } else {
                ctx.clearRect(0, 0, width, height);
                if (canvas && canvas.parentNode) {
                    canvas.parentNode.removeChild(canvas);
                }
            }
        }

        render();
    } catch (e) {
        console.error('Confetti error:', e);
    }
}
