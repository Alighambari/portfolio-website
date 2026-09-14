class NetworkBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.packets = [];
    this.nodes = [];
    this.connections = [];
    // ${`تعداد خط ها`}
    this.numberOfNodes = 45;

    this.maxDistance = 170;

    this.resize();
    this.createNodes();
    this.createPackets();
    window.addEventListener("resize", () => this.resize());
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // فاصله مجاز بین نقاط رو متناسب با اندازه صفحه بزرگ‌تر می‌کنیم
    // تا تو صفحه‌های بزرگ هم خطوط محو نشن
    const diagonal = Math.sqrt(
      this.width * this.width + this.height * this.height,
    );
    this.maxDistance = Math.max(170, diagonal * 0.09);

    this.createNodes();
    this.createPackets();
  }

  createNodes() {
    this.nodes = [];
    const clusters = [
      { x: this.width * 0.58, y: this.height * 0.18 },

      { x: this.width * 0.88, y: this.height * 0.22 },

      { x: this.width * 0.72, y: this.height * 0.42 },

      { x: this.width * 0.95, y: this.height * 0.58 },

      { x: this.width * 0.68, y: this.height * 0.76 },

      { x: this.width * 0.9, y: this.height * 0.88 },
    ];

    for (let i = 0; i < this.numberOfNodes; i++) {
      let vx = (Math.random() * 2 - 1) * 0.4;
      let vy = (Math.random() * 2 - 1) * 0.4;

      // جلوگیری از سرعت خیلی کم
      if (Math.abs(vx) < 0.15) {
        vx = vx < 0 ? -0.15 : 0.15;
      }

      if (Math.abs(vy) < 0.15) {
        vy = vy < 0 ? -0.15 : 0.15;
      }

      const cluster = clusters[Math.floor(Math.random() * clusters.length)];

      const spread = 100 + Math.random() * 80;

      const x = cluster.x + (Math.random() - 0.5) * spread;

      const y = cluster.y + (Math.random() - 0.5) * spread;

      this.nodes.push({
        x: x,

        y: y,

        radius: 1 + Math.random() * 1,

        vx: vx,

        vy: vy,
      });
    }
  }

  drawNodes() {
    // بررسی فعال بودن تم روشن
    const isLight = document.body.classList.contains("light");

    for (const node of this.nodes) {
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

      // رنگ نقاط: در تم روشن سرمه‌ای/مشکی تیره، در تم تاریک سبز نئونی
      this.ctx.fillStyle = isLight ? "#050505" : "#b4c0a8";

      // سایه نقاط
      this.ctx.shadowBlur = isLight ? 0 : 4;
      this.ctx.shadowColor = isLight ? "transparent" : "#d3ff35";

      this.ctx.fill();
      this.ctx.shadowBlur = 0; // ریست کردن سایه برای عناصر بعدی
    }
  }

  drawLines() {
    const isLight = document.body.classList.contains("light");
    this.ctx.lineWidth = 0.7;

    for (const node of this.nodes) {
      const nearest = this.findNearestNodes(node);

      for (const item of nearest) {
        const other = item.node;
        const alpha = 1 - item.distance / (this.maxDistance * this.maxDistance);

        this.ctx.beginPath();

        // رنگ خطوط: در تم روشن مشکی/سرمه‌ای با شفافیت، در تم تاریک سبز
        this.ctx.strokeStyle = isLight
          ? `rgba(15, 23, 42, ${alpha * 0.2})`
          : `rgba(120, 255, 210, ${alpha * 0.4})`;

        this.ctx.moveTo(node.x, node.y);
        this.ctx.lineTo(other.x, other.y);
        this.ctx.stroke();
      }
    }
  }

  distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;

    return dx * dx + dy * dy;
  }

  findNearestNodes(node) {
    const nearest = [];

    for (const other of this.nodes) {
      if (other === node) continue;

      const dx = node.x - other.x;
      const dy = node.y - other.y;

      const d = dx * dx + dy * dy;

      // دیگه فاصله رو فیلتر نمی‌کنیم؛ هر نود همیشه به
      // نزدیک‌ترین نودهاش وصل می‌مونه، حتی اگه خیلی دور باشن
      nearest.push({
        node: other,
        distance: d,
      });
    }

    nearest.sort((a, b) => a.distance - b.distance);

    return nearest.slice(0, 3);
  }

  createPackets() {
    this.packets = [];

    for (const node of this.nodes) {
      const nearest = this.findNearestNodes(node);

      if (nearest.length === 0) continue;

      const target = nearest[Math.floor(Math.random() * nearest.length)].node;

      this.packets.push({
        from: node,

        to: target,

        progress: Math.random(),
      });
    }
  }

  drawPackets() {
    const isLight = document.body.classList.contains("light");

    for (const packet of this.packets) {
      packet.progress += 0.09;

      if (packet.progress >= 1) {
        packet.progress = 0;
        const nearest = this.findNearestNodes(packet.to);
        if (nearest.length > 0) {
          packet.from = packet.to;
          packet.to = nearest[Math.floor(Math.random() * nearest.length)].node;
        }
      }

      const x = packet.from.x + (packet.to.x - packet.from.x) * packet.progress;
      const y = packet.from.y + (packet.to.y - packet.from.y) * packet.progress;

      const dx = packet.to.x - packet.from.x;
      const dy = packet.to.y - packet.from.y;
      const segLen = Math.sqrt(dx * dx + dy * dy) || 1;
      const dirX = dx / segLen;
      const dirY = dy / segLen;

      const tailLength = Math.min(18, segLen * 0.6);
      const tailX = x - dirX * tailLength;
      const tailY = y - dirY * tailLength;

      // گرادینت دنباله نور
      const gradient = this.ctx.createLinearGradient(tailX, tailY, x, y);
      if (isLight) {
        gradient.addColorStop(0, "rgba(15, 23, 42, 0)");
        gradient.addColorStop(1, "rgba(15, 23, 42, 0.6)");
      } else {
        gradient.addColorStop(0, "rgba(140, 255, 210, 0)");
        gradient.addColorStop(1, "rgba(200, 255, 235, 0.85)");
      }

      this.ctx.beginPath();
      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = 1.6;
      this.ctx.lineCap = "round";
      this.ctx.moveTo(tailX, tailY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();

      // سر درخشان پالس
      this.ctx.beginPath();
      this.ctx.arc(x, y, 2, 0, Math.PI * 2);
      this.ctx.fillStyle = isLight ? "#0f172a" : "#eafff5";
      this.ctx.shadowBlur = isLight ? 2 : 8;
      this.ctx.shadowColor = isLight ? "rgba(0,0,0,0.2)" : "#8aeeab";
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (const node of this.nodes) {
      node.x += node.vx;
      node.y += node.vy;

      const minX = this.width * 0.45;
      const maxX = this.width;

      if (node.x < minX || node.x > maxX) {
        node.vx *= -1;
      }

      if (node.y < 0 || node.y > this.height) {
        node.vy *= -1;
      }
    }

    this.drawLines();
    this.drawPackets();
    this.drawNodes();

    requestAnimationFrame(() => this.animate());
  }
}

new NetworkBackground("network-canvas");
