/**
 * EFFECTS.JS - QUẢN LÝ HIỆU ỨNG CANVAS VŨ TRỤ, HẠT SÁNG VÀ SVG ĐỒ HỌA
 * Tối ưu hiệu năng, dùng requestAnimationFrame, tự động dừng khi ẩn tab.
 */

class GalaxyEffects {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.stardust = [];
    this.shootingStars = [];
    this.animationFrameId = null;
    this.isRunning = false;
    this.width = 0;
    this.height = 0;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Tạo sao trong vũ trụ (160 ngôi sao)
    const starCount = Math.min(window.innerWidth < 600 ? 100 : 180, 200);
    this.stars = [];
    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 1.5 + 0.3,
        alpha: Math.random(),
        speed: Math.random() * 0.02 + 0.005,
        twinkleDirection: Math.random() > 0.5 ? 1 : -1,
        color: this.getStarColor(),
      });
    }

    // Tạo các hạt bụi sáng bồng bềnh (Stardust)
    const dustCount = window.innerWidth < 600 ? 25 : 45;
    this.stardust = [];
    for (let i = 0; i < dustCount; i++) {
      this.stardust.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.15,
        radius: Math.random() * 2.2 + 0.8,
        alpha: Math.random() * 0.6 + 0.2,
        color: Math.random() > 0.5 ? 'rgba(255, 182, 193, ' : 'rgba(199, 125, 255, ',
      });
    }

    // Tự động tạm dừng hoạt ảnh khi chuyển tab để tiết kiệm pin và tài nguyên
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stop();
      } else {
        this.start();
      }
    });

    this.start();
  }

  getStarColor() {
    const colors = [
      'rgba(255, 255, 255, ',
      'rgba(255, 230, 245, ',
      'rgba(230, 210, 255, ',
      'rgba(255, 200, 220, ',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    if (this.canvas) {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }
  }

  triggerShootingStar() {
    if (this.shootingStars.length < 2 && Math.random() < 0.015) {
      this.shootingStars.push({
        x: Math.random() * (this.width * 0.7),
        y: Math.random() * (this.height * 0.4),
        length: Math.random() * 80 + 40,
        speed: Math.random() * 7 + 6,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
        alpha: 1,
      });
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Ánh sáng tinh vân trung tâm tím & hồng
    const gradient = this.ctx.createRadialGradient(
      this.width * 0.5,
      this.height * 0.45,
      10,
      this.width * 0.5,
      this.height * 0.45,
      Math.max(this.width, this.height) * 0.65
    );
    gradient.addColorStop(0, 'rgba(55, 18, 75, 0.45)');
    gradient.addColorStop(0.4, 'rgba(28, 10, 48, 0.25)');
    gradient.addColorStop(0.8, 'rgba(10, 4, 18, 0.15)');
    gradient.addColorStop(1, 'rgba(7, 3, 14, 0)');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // 2. Vẽ và cập nhật các ngôi sao
    for (let star of this.stars) {
      star.alpha += star.speed * star.twinkleDirection;
      if (star.alpha >= 1) {
        star.alpha = 1;
        star.twinkleDirection = -1;
      } else if (star.alpha <= 0.2) {
        star.alpha = 0.2;
        star.twinkleDirection = 1;
      }

      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = star.color + star.alpha + ')';
      this.ctx.fill();
    }

    // 3. Vẽ và cập nhật bụi sáng bồng bềnh
    for (let p of this.stardust) {
      p.x += p.vx;
      p.y += p.vy;

      // Vòng lặp khi vượt ra ngoài màn hình
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color + p.alpha + ')';
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = 'rgba(255, 179, 198, 0.8)';
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }

    // 4. Vẽ sao băng
    this.triggerShootingStar();
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const s = this.shootingStars[i];
      const ex = s.x + Math.cos(s.angle) * s.length;
      const ey = s.y + Math.sin(s.angle) * s.length;

      const grad = this.ctx.createLinearGradient(s.x, s.y, ex, ey);
      grad.addColorStop(0, `rgba(255, 255, 255, ${s.alpha})`);
      grad.addColorStop(1, 'rgba(255, 117, 143, 0)');

      this.ctx.beginPath();
      this.ctx.moveTo(s.x, s.y);
      this.ctx.lineTo(ex, ey);
      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = 1.8;
      this.ctx.stroke();

      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.alpha -= 0.02;

      if (s.alpha <= 0 || s.x > this.width || s.y > this.height) {
        this.shootingStars.splice(i, 1);
      }
    }
  }

  animate() {
    if (!this.isRunning) return;
    this.draw();
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}

// Xuất đối tượng dùng toàn cục
window.GalaxyEffects = GalaxyEffects;
