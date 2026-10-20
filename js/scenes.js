/**
 * SCENES.JS - QUẢN LÝ TẬP TRUNG TẤT CẢ PHÂN CẢNH VÀ TRẠNG THÁI CHUYỂN TIẾP
 * Đảm bảo dọn dẹp timer, huỷ rAF khi đổi cảnh, hỗ trợ xem lại nhiều lần.
 */

class SceneManager {
  constructor(photoManager) {
    this.photoManager = photoManager;
    this.currentScene = 1;
    this.totalScenes = 9;
    this.isTransitioning = false;
    this.timers = [];
    this.sphereRafId = null;
    this.galaxyRafId = null;

    // Trạng thái camera dải ngân hà tương tác 3D (Scene 4)
    this.galaxyCam = {
      rotX: -5,
      rotY: 0,
      posX: 0,
      posY: 0,
      isDragging: false,
      startX: 0,
      startY: 0,
      velX: 0,
      velY: 0,
    };

    // Trạng thái tương tác xoay quả cầu Trái Đất 3D (Scene 5)
    this.sphereState = {
      rotX: -15,
      rotY: 0,
      isDragging: false,
      startX: 0,
      startY: 0,
      velX: 0,
      velY: 0,
    };

    this.init();
  }

  init() {
    this.setupScene1();
    this.setupScene3();
    this.setupScene4();
    this.setupScene5();
    this.setupScene6();
    this.setupScene7();
    this.setupScene8();
    this.setupScene9();
  }

  clearAllTimers() {
    this.timers.forEach(t => clearTimeout(t));
    this.timers = [];
    this.stopSphereLoop();
    this.stopGalaxyLoop();
  }

  addTimer(callback, delay) {
    const t = setTimeout(callback, delay);
    this.timers.push(t);
    return t;
  }

  goToScene(sceneNum) {
    if (this.isTransitioning || sceneNum === this.currentScene) return;
    if (sceneNum < 1 || sceneNum > this.totalScenes) return;

    this.isTransitioning = true;
    const fromSceneEl = document.getElementById(`scene-${this.currentScene}`);
    const toSceneEl = document.getElementById(`scene-${sceneNum}`);

    // Dọn dẹp hoạt ảnh của cảnh cũ
    this.leaveScene(this.currentScene);

    if (fromSceneEl) {
      fromSceneEl.classList.remove('active');
    }

    this.currentScene = sceneNum;

    // Chuyển sang cảnh mới sau khi mờ cảnh cũ
    this.addTimer(() => {
      if (toSceneEl) {
        toSceneEl.classList.add('active');
        this.enterScene(sceneNum);
      }
      this.isTransitioning = false;
    }, 600);
  }

  nextScene() {
    if (this.currentScene < this.totalScenes) {
      this.goToScene(this.currentScene + 1);
    }
  }

  resetExperience() {
    this.clearAllTimers();
    // Ẩn tất cả các cảnh
    for (let i = 1; i <= this.totalScenes; i++) {
      const el = document.getElementById(`scene-${i}`);
      if (el) el.classList.remove('active');
    }

    // Reset trạng thái máy quét vân tay và chúc mừng
    const celebration = document.getElementById('unlock-celebration');
    if (celebration) celebration.classList.remove('active');

    const heartBtn = document.getElementById('scanner-heart-btn');
    if (heartBtn) heartBtn.classList.remove('scanning');

    const percentEl = document.getElementById('scanner-percent');
    if (percentEl) percentEl.textContent = '0%';

    const statusEl = document.getElementById('scanner-status');
    if (statusEl) statusEl.textContent = 'Chạm và giữ để xác thực người yêu của anh...';

    const progressPath = document.getElementById('scanner-progress-path');
    if (progressPath) {
      try {
        const len = progressPath.getTotalLength() || 650;
        progressPath.style.strokeDashoffset = `${len}`;
      } catch (e) {}
    }

    if (this.resetScannerState) {
      this.resetScannerState();
    }

    const envelope = document.querySelector('.envelope');
    if (envelope) envelope.classList.remove('open');

    const photoWall = document.querySelector('.photo-wall-grid');
    if (photoWall) photoWall.classList.remove('dispersed');

    this.currentScene = 1;
    this.isTransitioning = false;
    const scene1 = document.getElementById('scene-1');
    if (scene1) scene1.classList.add('active');
  }

  /* ==========================================================================
     PHÂN CẢNH 1: MÁY QUÉT DẤU VÂN TAY “MỞ KHÓA TRÁI TIM” (CONCEPT 2)
     ========================================================================== */
  setupScene1() {
    const heartBtn = document.getElementById('scanner-heart-btn');
    const progressPath = document.getElementById('scanner-progress-path');
    const percentEl = document.getElementById('scanner-percent');
    const statusEl = document.getElementById('scanner-status');
    const celebrationEl = document.getElementById('unlock-celebration');
    const nextBtn = document.getElementById('scene-1-next-btn');
    const ripplesContainer = document.getElementById('scanner-ripples');
    const particlesContainer = document.getElementById('celebration-particles');

    if (!heartBtn) return;

    let totalLength = 650;
    if (progressPath) {
      try {
        totalLength = progressPath.getTotalLength() || 650;
      } catch (e) {
        totalLength = 650;
      }
      progressPath.style.strokeDasharray = `${totalLength}`;
      progressPath.style.strokeDashoffset = `${totalLength}`;
    }

    let isPressing = false;
    let scanProgress = 0;
    let scanInterval = null;
    let isUnlocked = false;

    this.resetScannerState = () => {
      isPressing = false;
      scanProgress = 0;
      isUnlocked = false;
      if (scanInterval) clearInterval(scanInterval);
    };

    const updateScanUI = (percent) => {
      if (percentEl) percentEl.textContent = `${Math.min(100, Math.floor(percent))}%`;
      if (progressPath) {
        const offset = totalLength * (1 - percent / 100);
        progressPath.style.strokeDashoffset = `${offset}`;
      }

      if (statusEl) {
        if (percent < 25) {
          statusEl.textContent = "Đang nhận diện dấu vân tay...";
        } else if (percent < 55) {
          statusEl.textContent = "Đang kiểm tra nhịp đập trái tim... 💓";
        } else if (percent < 85) {
          statusEl.textContent = "Khớp mã sinh trắc học: 99.9%...";
        } else if (percent < 100) {
          statusEl.textContent = "Chuẩn bị mở khóa trái tim anh...";
        } else {
          statusEl.textContent = "XÁC NHẬN THÀNH CÔNG: tvy ❤️";
        }
      }
    };

    const addRipple = () => {
      if (!ripplesContainer) return;
      const ripple = document.createElement('div');
      ripple.className = 'ripple-circle';
      ripplesContainer.appendChild(ripple);
      setTimeout(() => {
        if (ripple.parentNode) ripple.remove();
      }, 1200);
    };

    const triggerSuccess = () => {
      isUnlocked = true;
      heartBtn.classList.remove('scanning');

      // Rung phản hồi xúc giác nếu thiết bị hỗ trợ
      if (navigator.vibrate) {
        try { navigator.vibrate([80, 40, 150]); } catch (e) {}
      }

      // Tạo các hạt tim bay bùng nổ
      if (particlesContainer) {
        particlesContainer.innerHTML = '';
        const hearts = ['❤️', '💖', '✨', '🌸', '💕', '🌹'];
        for (let i = 0; i < 36; i++) {
          const p = document.createElement('div');
          p.className = 'celebration-heart';
          p.textContent = hearts[Math.floor(Math.random() * hearts.length)];
          p.style.left = `${Math.random() * 90 + 5}%`;
          p.style.top = `${Math.random() * 60 + 20}%`;
          p.style.fontSize = `${Math.random() * 16 + 14}px`;
          p.style.animationDelay = `${Math.random() * 0.8}s`;
          p.style.animationDuration = `${Math.random() * 1.5 + 2}s`;
          particlesContainer.appendChild(p);
        }
      }

      // Hiển thị màn chúc mừng mở khóa thành công
      this.addTimer(() => {
        if (celebrationEl) {
          celebrationEl.classList.add('active');
        }
      }, 400);
    };

    const startScan = (e) => {
      if (isUnlocked) return;
      isPressing = true;
      heartBtn.classList.add('scanning');

      // Tự động phát nhạc nền khi chạm
      if (window.audioController) {
        window.audioController.play();
      }

      // Rung xúc giác nhẹ bắt đầu
      if (navigator.vibrate) {
        try { navigator.vibrate(30); } catch (e) {}
      }

      addRipple();
      const rippleTimer = setInterval(() => {
        if (isPressing) addRipple();
        else clearInterval(rippleTimer);
      }, 350);

      const stepTime = 20; // 20ms mỗi bước
      const totalSteps = 85; // ~1.7 giây hoàn thành

      if (scanInterval) clearInterval(scanInterval);
      scanInterval = setInterval(() => {
        if (!isPressing) {
          clearInterval(scanInterval);
          return;
        }

        scanProgress += (100 / totalSteps);
        if (scanProgress >= 100) {
          scanProgress = 100;
          clearInterval(scanInterval);
          updateScanUI(100);
          triggerSuccess();
        } else {
          updateScanUI(scanProgress);
        }
      }, stepTime);
    };

    const stopScan = () => {
      if (isUnlocked) return;
      isPressing = false;
      heartBtn.classList.remove('scanning');
      if (scanInterval) clearInterval(scanInterval);

      // Nếu nhấc tay trước khi đạt 100% -> hoàn tác về 0
      if (scanProgress < 100) {
        if (statusEl) {
          statusEl.textContent = "Em nhấc tay sớm quá! Chạm và giữ thêm chút nhé em... ❤️";
        }
        const resetInterval = setInterval(() => {
          scanProgress -= 5;
          if (scanProgress <= 0) {
            scanProgress = 0;
            clearInterval(resetInterval);
            if (statusEl && !isPressing) {
              statusEl.textContent = "Chạm và giữ để xác thực người yêu của anh...";
            }
          }
          updateScanUI(scanProgress);
        }, 15);
      }
    };

    // Sự kiện chuột máy tính
    heartBtn.addEventListener('mousedown', startScan);
    window.addEventListener('mouseup', stopScan);

    // Sự kiện cảm ứng điện thoại
    heartBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startScan(e);
    }, { passive: false });

    window.addEventListener('touchend', stopScan);
    window.addEventListener('touchcancel', stopScan);

    // Bấm nút chuyển cảnh sang Thiệp 20/10
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.goToScene(3);
      });
    }
  }

  /* ==========================================================================
     PHÂN CẢNH 3: THIỆP CHÚC MỪNG 20/10
     ========================================================================== */
  setupScene3() {
    // Tạo các mảnh puzzle trái tim từ ảnh của tvy
    const puzzleContainer = document.getElementById('heart-puzzle-grid');
    if (puzzleContainer && this.photoManager) {
      this.photoManager.generateHeartPuzzlePieces(puzzleContainer);
    }

    // Vẽ lịch tháng 10/2026 chính xác
    this.renderCalendar();

    const btnNext = document.getElementById('scene-3-btn');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        this.goToScene(4);
      });
    }
  }

  renderCalendar() {
    const grid = document.getElementById('cal-days-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // Thứ trong tuần: S M T W T F S
    const headers = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    headers.forEach(h => {
      const el = document.createElement('div');
      el.className = 'cal-day-header';
      el.textContent = h;
      grid.appendChild(el);
    });

    // Tháng 10/2026: Ngày 1/10/2026 rơi vào Thứ Năm (Thursday - index 4)
    // Cần 4 ô trống đầu tháng
    for (let i = 0; i < 4; i++) {
      const empty = document.createElement('div');
      empty.className = 'cal-cell empty';
      grid.appendChild(empty);
    }

    // Tháng 10 có 31 ngày
    for (let day = 1; day <= 31; day++) {
      const cell = document.createElement('div');
      cell.className = 'cal-cell';
      if (day === CONFIG.scene3.highlightDay) {
        cell.className += ' highlight-20';
        cell.innerHTML = `❤️ 20`;
      } else {
        cell.textContent = day;
      }
      grid.appendChild(cell);
    }
  }

  /* ==========================================================================
     PHÂN CẢNH 4: VŨ TRỤ TÌNH YÊU (DI CHUYỂN ĐƯỢC ĐỂ XEM)
     ========================================================================== */
  setupScene4() {
    const container = document.getElementById('galaxy-floating-container');
    if (!container || !this.photoManager) return;
    container.innerHTML = '';

    const messages = CONFIG.scene4.messages;
    const totalPhotos = 16;

    // Phân bố các khung ảnh bay trong không gian 3D
    for (let i = 0; i < totalPhotos; i++) {
      const card = document.createElement('div');
      card.className = 'floating-photo-card';

      const posX = Math.random() * 85 + 5; // 5% - 90%
      const posY = Math.random() * 80 + 8; // 8% - 88%
      const scale = Math.random() * 0.45 + 0.65; // 0.65 - 1.1
      const rotZ = (Math.random() - 0.5) * 24; // -12deg đến +12deg
      const depthZ = Math.random() * 200 - 100; // -100px đến +100px

      const width = Math.floor(Math.random() * 30 + 75); // 75px - 105px
      const height = Math.floor(width * 1.25);

      card.style.left = `${posX}%`;
      card.style.top = `${posY}%`;
      card.style.width = `${width}px`;
      card.style.height = `${height}px`;
      card.style.transform = `translateZ(${depthZ}px) scale(${scale}) rotate(${rotZ}deg)`;

      const img = document.createElement('img');
      img.src = this.photoManager.getPhoto(i);
      img.alt = 'Kỷ niệm tvy';
      img.onerror = () => { img.src = this.photoManager.getPhoto(0); };
      card.appendChild(img);

      // Nhấp vào ảnh để phóng to xem rõ nét hơn
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        card.style.transform = `translateZ(120px) scale(${scale * 1.4}) rotate(0deg)`;
        this.addTimer(() => {
          card.style.transform = `translateZ(${depthZ}px) scale(${scale}) rotate(${rotZ}deg)`;
        }, 2200);
      });

      container.appendChild(card);
    }

    // Phân bố các dải ruy băng lời nhắn tình cảm
    messages.forEach((msg, idx) => {
      const ribbon = document.createElement('div');
      ribbon.className = 'floating-ribbon-msg';

      const posX = (idx % 2 === 0 ? 8 : 55) + Math.random() * 25;
      const posY = 15 + idx * 7.5;
      const rotZ = (Math.random() - 0.5) * 8;

      ribbon.style.left = `${posX}%`;
      ribbon.style.top = `${posY}%`;
      ribbon.style.transform = `rotate(${rotZ}deg)`;
      ribbon.textContent = msg;

      container.appendChild(ribbon);
    });

    // Thao tác kéo chuột / cảm ứng để di chuyển quan sát toàn bộ dải ngân hà
    const stage = document.getElementById('scene-4');
    if (stage) {
      const onPointerDown = (e) => {
        if (e.target.closest('#scene-4-btn')) return;
        this.galaxyCam.isDragging = true;
        this.galaxyCam.startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        this.galaxyCam.startY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
        this.galaxyCam.velX = 0;
        this.galaxyCam.velY = 0;
      };

      const onPointerMove = (e) => {
        if (!this.galaxyCam.isDragging) return;
        const curX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        const curY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
        const dx = curX - this.galaxyCam.startX;
        const dy = curY - this.galaxyCam.startY;

        this.galaxyCam.rotY += dx * 0.16;
        this.galaxyCam.rotX -= dy * 0.16;
        this.galaxyCam.posX += dx * 0.45;
        this.galaxyCam.posY += dy * 0.45;

        this.galaxyCam.velX = dx * 0.12;
        this.galaxyCam.velY = dy * 0.12;

        this.galaxyCam.startX = curX;
        this.galaxyCam.startY = curY;
      };

      const onPointerUp = () => {
        this.galaxyCam.isDragging = false;
      };

      stage.addEventListener('mousedown', onPointerDown);
      window.addEventListener('mousemove', onPointerMove);
      window.addEventListener('mouseup', onPointerUp);

      stage.addEventListener('touchstart', onPointerDown, { passive: true });
      window.addEventListener('touchmove', onPointerMove, { passive: true });
      window.addEventListener('touchend', onPointerUp);
    }

    const btnNext = document.getElementById('scene-4-btn');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        // Hiệu ứng các ảnh trong dải ngân hà hút về trung tâm để ghép thành Trái Đất
        const cards = document.querySelectorAll('.floating-photo-card');
        cards.forEach((c) => {
          c.style.transform = 'translate3d(0, 0, 0) scale(0.1)';
          c.style.opacity = '0';
        });

        this.addTimer(() => {
          this.goToScene(5);
        }, 800);
      });
    }
  }

  startGalaxyLoop() {
    const world = document.getElementById('galaxy-world');
    if (!world) return;

    const loop = () => {
      if (!this.galaxyCam.isDragging) {
        // Tự động trôi lơ lửng nhẹ nhàng trong không gian
        this.galaxyCam.rotY += 0.05;
        this.galaxyCam.posX += (0 - this.galaxyCam.posX) * 0.015;
        this.galaxyCam.posY += (0 - this.galaxyCam.posY) * 0.015;
        this.galaxyCam.rotX += (-5 - this.galaxyCam.rotX) * 0.015;

        // Quán tính sau khi thả kéo
        this.galaxyCam.rotY += this.galaxyCam.velX;
        this.galaxyCam.rotX -= this.galaxyCam.velY;
        this.galaxyCam.velX *= 0.92;
        this.galaxyCam.velY *= 0.92;
      }

      world.style.transform = `rotateX(${this.galaxyCam.rotX}deg) rotateY(${this.galaxyCam.rotY}deg) translate3d(${this.galaxyCam.posX}px, ${this.galaxyCam.posY}px, 0px)`;
      this.galaxyRafId = requestAnimationFrame(loop);
    };

    if (this.galaxyRafId) cancelAnimationFrame(this.galaxyRafId);
    this.galaxyRafId = requestAnimationFrame(loop);
  }

  stopGalaxyLoop() {
    if (this.galaxyRafId) {
      cancelAnimationFrame(this.galaxyRafId);
      this.galaxyRafId = null;
    }
  }

  /* ==========================================================================
     PHÂN CẢNH 5: THẾ GIỚI CỦA ANH LÀ EM - QUẢ CẦU ẢNH TRÁI ĐẤT 3D NGUYÊN KHỐI
     ========================================================================== */
  setupScene5() {
    const sphere = document.getElementById('photo-sphere');
    if (!sphere || !this.photoManager) return;

    // Đảm bảo lõi tối vũ trụ 3D luôn tồn tại bên trong tạo chiều sâu
    let coreBall = sphere.querySelector('.earth-core-ball');
    if (!coreBall) {
      coreBall = document.createElement('div');
      coreBall.className = 'earth-core-ball';
      coreBall.id = 'earth-core-ball';
      sphere.prepend(coreBall);
    }

    let tilesContainer = sphere.querySelector('#photo-sphere-tiles');
    if (!tilesContainer) {
      tilesContainer = document.createElement('div');
      tilesContainer.id = 'photo-sphere-tiles';
      tilesContainer.className = 'photo-sphere-tiles';
      sphere.appendChild(tilesContainer);
    }

    // Tạo khối cầu ảnh dày đặc chuẩn xác theo media_1792508276899_db88ab1d.png
    const sphereRadius = window.innerWidth < 600 ? 135 : 180;
    this.photoManager.generatePhotoGlobe(sphere, sphereRadius);

    // Thao tác kéo / chạm để xoay quả cầu ảnh Trái Đất 3D
    const stage = document.getElementById('scene-5');
    if (stage) {
      const onPointerDown = (e) => {
        this.sphereState.isDragging = true;
        this.sphereState.startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        this.sphereState.startY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
        this.sphereState.velX = 0;
        this.sphereState.velY = 0;
      };

      const onPointerMove = (e) => {
        if (!this.sphereState.isDragging) return;
        const curX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        const curY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
        const dx = curX - this.sphereState.startX;
        const dy = curY - this.sphereState.startY;

        this.sphereState.rotY += dx * 0.45;
        this.sphereState.rotX -= dy * 0.45;

        this.sphereState.velX = dx * 0.3;
        this.sphereState.velY = dy * 0.3;

        this.sphereState.startX = curX;
        this.sphereState.startY = curY;
      };

      const onPointerUp = () => {
        this.sphereState.isDragging = false;
      };

      stage.addEventListener('mousedown', onPointerDown);
      window.addEventListener('mousemove', onPointerMove);
      window.addEventListener('mouseup', onPointerUp);

      stage.addEventListener('touchstart', onPointerDown, { passive: true });
      window.addEventListener('touchmove', onPointerMove, { passive: true });
      window.addEventListener('touchend', onPointerUp);
    }

    const btnNext = document.getElementById('scene-5-btn');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        this.goToScene(6);
      });
    }
  }

  startSphereLoop() {
    const sphere = document.getElementById('photo-sphere');
    if (!sphere) return;

    const loop = () => {
      if (!this.sphereState.isDragging) {
        // Tự động xoay chậm liên tục
        this.sphereState.rotY += 0.35;
        this.sphereState.rotX += ( -12 - this.sphereState.rotX ) * 0.02;

        // Giảm dần vận tốc kéo (damped inertia)
        this.sphereState.rotY += this.sphereState.velX;
        this.sphereState.rotX -= this.sphereState.velY;
        this.sphereState.velX *= 0.94;
        this.sphereState.velY *= 0.94;
      }

      sphere.style.transform = `rotateX(${this.sphereState.rotX}deg) rotateY(${this.sphereState.rotY}deg)`;
      this.sphereRafId = requestAnimationFrame(loop);
    };

    if (this.sphereRafId) cancelAnimationFrame(this.sphereRafId);
    this.sphereRafId = requestAnimationFrame(loop);
  }

  stopSphereLoop() {
    if (this.sphereRafId) {
      cancelAnimationFrame(this.sphereRafId);
      this.sphereRafId = null;
    }
  }

  /* ==========================================================================
     PHÂN CẢNH 6: BỨC TƯỜNG ẢNH VÀ TÁCH HÌNH
     ========================================================================== */
  setupScene6() {
    const grid = document.getElementById('photo-wall-grid');
    if (!grid || !this.photoManager) return;
    grid.innerHTML = '';

    const count = window.innerWidth < 600 ? 15 : 24;
    for (let i = 0; i < count; i++) {
      const tile = document.createElement('div');
      tile.className = 'wall-tile';

      const img = document.createElement('img');
      img.src = this.photoManager.getPhoto(i);
      img.alt = `Tường kỷ niệm ${i + 1}`;
      img.onerror = () => { img.src = this.photoManager.getPhoto(0); };
      tile.appendChild(img);

      grid.appendChild(tile);
    }

    const btnNext = document.getElementById('scene-6-btn');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        this.dispersePhotoWallAndNext();
      });
    }
  }

  dispersePhotoWallAndNext() {
    const grid = document.getElementById('photo-wall-grid');
    if (grid) {
      grid.classList.add('dispersed');
      const tiles = grid.querySelectorAll('.wall-tile');
      tiles.forEach((t, i) => {
        const dirX = (Math.random() - 0.5) * 800;
        const dirY = (Math.random() - 0.5) * 800;
        const rot = (Math.random() - 0.5) * 90;
        t.style.transform = `translate3d(${dirX}px, ${dirY}px, 400px) rotate(${rot}deg) scale(0.4)`;
      });
    }

    this.addTimer(() => {
      this.goToScene(7);
    }, 1200);
  }

  /* ==========================================================================
     PHÂN CẢNH 7: PHONG THƯ TÌNH YÊU
     ========================================================================== */
  setupScene7() {
    // Tạo 3 khung ảnh nhỏ bên dưới phong thư theo đúng video
    const subContainer = document.getElementById('envelope-sub-photos');
    if (subContainer && this.photoManager) {
      subContainer.innerHTML = '';
      for (let i = 0; i < 3; i++) {
        const item = document.createElement('div');
        item.className = 'sub-photo-item';
        const img = document.createElement('img');
        img.src = this.photoManager.getPhoto(i + 1);
        img.alt = 'tvy';
        img.onerror = () => { img.src = this.photoManager.getPhoto(0); };
        item.appendChild(img);
        subContainer.appendChild(item);
      }
    }

    const envelopeWrap = document.getElementById('envelope-wrapper');
    const btnOpen = document.getElementById('scene-7-btn');

    const triggerOpen = () => {
      const env = document.querySelector('.envelope');
      if (env && !env.classList.contains('open')) {
        env.classList.add('open');

        // Chuyển sang lá thư tình sau khi nắp thư mở
        this.addTimer(() => {
          this.goToScene(8);
        }, 1100);
      }
    };

    if (envelopeWrap) envelopeWrap.addEventListener('click', triggerOpen);
    if (btnOpen) btnOpen.addEventListener('click', triggerOpen);
  }

  /* ==========================================================================
     PHÂN CẢNH 8: LÁ THƯ TÌNH CHÂN THÀNH DÀNH CHO TVY
     ========================================================================== */
  setupScene8() {
    const body = document.getElementById('letter-body');
    if (!body) return;
    body.innerHTML = '';

    CONFIG.scene8.paragraphs.forEach(pText => {
      const p = document.createElement('p');
      p.textContent = pText;
      body.appendChild(p);
    });

    // Nút đọc lại thư
    const btnReread = document.getElementById('btn-reread-letter');
    if (btnReread) {
      btnReread.addEventListener('click', () => {
        this.revealLetterParagraphs();
        const wrapper = document.querySelector('.letter-wrapper');
        if (wrapper) wrapper.scrollTop = 0;
      });
    }

    // Nút xem màn hình trái tim kết thúc
    const btnHeart = document.getElementById('btn-to-heart');
    if (btnHeart) {
      btnHeart.addEventListener('click', () => {
        this.goToScene(9);
      });
    }

    // Nút xem lại từ đầu
    const btnReplay = document.getElementById('btn-replay-from-letter');
    if (btnReplay) {
      btnReplay.addEventListener('click', () => {
        this.resetExperience();
      });
    }
  }

  revealLetterParagraphs() {
    const ps = document.querySelectorAll('#letter-body p');
    ps.forEach(p => p.classList.remove('revealed'));

    ps.forEach((p, idx) => {
      this.addTimer(() => {
        p.classList.add('revealed');
      }, 400 + idx * 350);
    });
  }

  /* ==========================================================================
     PHÂN CẢNH 9: TRÁI TIM KẾT THÚC VÀ TÊN TVY
     ========================================================================== */
  setupScene9() {
    const btnRead = document.getElementById('final-btn-read');
    if (btnRead) {
      btnRead.addEventListener('click', () => {
        this.goToScene(8);
      });
    }

    const btnReplay = document.getElementById('final-btn-replay');
    if (btnReplay) {
      btnReplay.addEventListener('click', () => {
        this.resetExperience();
      });
    }
  }

  /* ==========================================================================
     HOOKS VÀO / RA CỦA TỪNG CẢNH
     ========================================================================== */
  enterScene(sceneNum) {
    if (sceneNum === 4) {
      this.startGalaxyLoop();
    } else if (sceneNum === 5) {
      this.startSphereLoop();
    } else if (sceneNum === 8) {
      this.revealLetterParagraphs();
    }
  }

  leaveScene(sceneNum) {
    if (sceneNum === 4) {
      this.stopGalaxyLoop();
    } else if (sceneNum === 5) {
      this.stopSphereLoop();
    }
  }
}

// Xuất đối tượng dùng toàn cục
window.SceneManager = SceneManager;
