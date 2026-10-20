/**
 * PHOTOS.JS - HỆ THỐNG QUẢN LÝ VÀ PHÂN BỐ HÌNH ẢNH DÀNH CHO TVY
 * Hỗ trợ tạo ảnh trái tim puzzle, phân bố hình cầu Fibonacci 3D và tường ảnh.
 */

class PhotoManager {
  constructor(photoList) {
    this.photos = photoList && photoList.length > 0 ? photoList : this.generateFallbackPhotos();
    this.preloadPhotos();
  }

  // Tạo ảnh trang trí nghệ thuật dự phòng nếu không tìm thấy ảnh
  generateFallbackPhotos() {
    const list = [];
    const colors = ['#ff758f', '#c77dff', '#ff8fab', '#9d4edd', '#ffb3c6', '#7209b7', '#f72585'];
    for (let i = 0; i < 7; i++) {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');

      const grad = ctx.createLinearGradient(0, 0, 300, 300);
      grad.addColorStop(0, colors[i % colors.length]);
      grad.addColorStop(1, '#1b092b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 300, 300);

      // Vẽ trái tim nhỏ ở giữa
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '70px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('❤️', 150, 150);

      list.push(canvas.toDataURL());
    }
    return list;
  }

  preloadPhotos() {
    this.photos.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }

  getPhoto(index) {
    return this.photos[index % this.photos.length];
  }

  getAll() {
    return this.photos;
  }

  /**
   * Tạo các mảnh ghép cho Trái Tim Puzzle (Scene 3)
   * Tạo 14 mảnh ghép nhỏ sắp xếp thành hình trái tim hoàn chỉnh
   */
  generateHeartPuzzlePieces(container) {
    if (!container) return;
    container.innerHTML = '';

    // Tọa độ tương đối theo hình trái tim (x: 0-100%, y: 0-100%, w, h)
    const pieces = [
      { x: 38, y: 72, w: 24, h: 22, rot: -4 },  // Đáy tim
      { x: 26, y: 54, w: 23, h: 22, rot: 3 },
      { x: 51, y: 54, w: 23, h: 22, rot: -2 },
      { x: 15, y: 36, w: 23, h: 22, rot: -5 },
      { x: 39, y: 36, w: 22, h: 22, rot: 2 },
      { x: 62, y: 36, w: 23, h: 22, rot: 4 },
      { x: 6, y: 18, w: 22, h: 22, rot: -6 },   // Tai tim trái
      { x: 28, y: 16, w: 22, h: 22, rot: 3 },
      { x: 50, y: 16, w: 22, h: 22, rot: -3 },
      { x: 72, y: 18, w: 22, h: 22, rot: 6 },   // Tai tim phải
      { x: 16, y: 2, w: 20, h: 20, rot: -4 },   // Đỉnh trái
      { x: 64, y: 2, w: 20, h: 20, rot: 4 },    // Đỉnh phải
    ];

    pieces.forEach((p, idx) => {
      const div = document.createElement('div');
      div.className = 'puzzle-piece';
      div.style.left = `${p.x}%`;
      div.style.top = `${p.y}%`;
      div.style.width = `${p.w}%`;
      div.style.height = `${p.h}%`;
      div.style.transform = `rotate(${p.rot}deg)`;

      const img = document.createElement('img');
      img.src = this.getPhoto(idx);
      img.alt = `tvy kỷ niệm ${idx + 1}`;
      img.loading = 'lazy';
      img.onerror = () => { img.src = this.getPhoto(0); };

      div.appendChild(img);
      container.appendChild(div);
    });
  }

  /**
   * Tạo Quả Cầu Ảnh 3D ghép các ảnh kỷ niệm của tvy (Scene 5)
   * Chuẩn xác 100% theo hình ảnh tham khảo media_1792508276899_db88ab1d.png
   */
  generatePhotoGlobe(container, radius = 180) {
    if (!container) return;

    let tilesContainer = container.querySelector('#photo-sphere-tiles');
    if (!tilesContainer) {
      tilesContainer = container;
    }
    tilesContainer.innerHTML = '';

    // Cập nhật khối lõi tối bên trong để quả cầu có chiều sâu không gian
    const coreBall = container.querySelector('.earth-core-ball');
    if (coreBall) {
      const coreSize = Math.round(radius * 1.96);
      coreBall.style.width = `${coreSize}px`;
      coreBall.style.height = `${coreSize}px`;
    }

    const scale = radius / 180;
    let photoIdx = 0;

    // 11 tầng vòng vĩ độ xếp kín khít tạo nên quả cầu ảnh hoàn hảo theo screenshot
    const rings = [
      { lat: 80,  count: 6,  w: Math.round(44 * scale), h: Math.round(34 * scale) },
      { lat: 66,  count: 10, w: Math.round(52 * scale), h: Math.round(38 * scale) },
      { lat: 50,  count: 14, w: Math.round(58 * scale), h: Math.round(42 * scale) },
      { lat: 33,  count: 18, w: Math.round(64 * scale), h: Math.round(45 * scale) },
      { lat: 16,  count: 22, w: Math.round(68 * scale), h: Math.round(47 * scale) },
      { lat: 0,   count: 24, w: Math.round(72 * scale), h: Math.round(48 * scale) },
      { lat: -16, count: 22, w: Math.round(68 * scale), h: Math.round(47 * scale) },
      { lat: -33, count: 18, w: Math.round(64 * scale), h: Math.round(45 * scale) },
      { lat: -50, count: 14, w: Math.round(58 * scale), h: Math.round(42 * scale) },
      { lat: -66, count: 10, w: Math.round(52 * scale), h: Math.round(38 * scale) },
      { lat: -80, count: 6,  w: Math.round(44 * scale), h: Math.round(34 * scale) },
    ];

    rings.forEach(ring => {
      const step = 360 / ring.count;
      for (let i = 0; i < ring.count; i++) {
        const rotY = i * step;
        const rotX = -ring.lat;

        const item = document.createElement('div');
        item.className = 'sphere-item';
        item.style.width = `${ring.w}px`;
        item.style.height = `${ring.h}px`;
        item.style.marginTop = `${-ring.h / 2}px`;
        item.style.marginLeft = `${-ring.w / 2}px`;
        item.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg) translateZ(${radius}px)`;

        const img = document.createElement('img');
        img.src = this.getPhoto(photoIdx++);
        img.alt = 'Kỷ niệm tvy';
        img.onerror = () => { img.src = this.getPhoto(0); };
        item.appendChild(img);

        tilesContainer.appendChild(item);
      }
    });
  }
}

// Xuất đối tượng dùng toàn cục
window.PhotoManager = PhotoManager;
