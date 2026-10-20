/**
 * MAIN.JS - KHỞI TẠO CHÍNH VÀ ĐIỀU KHIỂN ÂM THANH CHO WEBSITE 20/10
 */

class AudioController {
  constructor(audioId, toggleBtnId) {
    this.audio = document.getElementById(audioId);
    this.toggleBtn = document.getElementById(toggleBtnId);
    this.isPlaying = false;
    this.hasInteracted = false;

    this.init();
  }

  init() {
    if (!this.audio) return;
    this.audio.volume = CONFIG.audio.volume || 0.75;

    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });
    }

    // Lắng nghe tương tác đầu tiên của người dùng để kích hoạt âm thanh an toàn
    const startAudioOnInteraction = () => {
      if (!this.hasInteracted && CONFIG.audio.autoPlayAfterFirstInteraction) {
        this.hasInteracted = true;
        this.play();
        window.removeEventListener('click', startAudioOnInteraction);
        window.removeEventListener('touchstart', startAudioOnInteraction);
      }
    };

    window.addEventListener('click', startAudioOnInteraction);
    window.addEventListener('touchstart', startAudioOnInteraction, { passive: true });
  }

  play() {
    if (!this.audio) return;
    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          this.updateUI();
        })
        .catch(() => {
          // Trình duyệt chặn autoplay cho tới khi có tương tác
          this.isPlaying = false;
          this.updateUI();
        });
    }
  }

  pause() {
    if (!this.audio) return;
    this.audio.pause();
    this.isPlaying = false;
    this.updateUI();
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  updateUI() {
    if (!this.toggleBtn) return;
    const icon = this.toggleBtn.querySelector('.audio-icon');
    const text = this.toggleBtn.querySelector('.audio-text');

    if (this.isPlaying) {
      if (icon) {
        icon.textContent = '🎵';
        icon.classList.add('playing');
      }
      if (text) text.textContent = 'Tắt nhạc';
    } else {
      if (icon) {
        icon.textContent = '🔇';
        icon.classList.remove('playing');
      }
      if (text) text.textContent = 'Bật nhạc';
    }
  }
}

// Khởi chạy khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  // 1. Khởi tạo hiệu ứng nền vũ trụ
  const galaxyEffects = new GalaxyEffects('galaxy-canvas');
  window.galaxyEffects = galaxyEffects;

  // 2. Khởi tạo bộ quản lý âm thanh
  const audioController = new AudioController('bgm-audio', 'audio-toggle-btn');
  window.audioController = audioController;

  // 3. Khởi tạo bộ quản lý ảnh
  const photoManager = new PhotoManager(CONFIG.photos);
  window.photoManager = photoManager;

  // 4. Khởi tạo bộ điều phối phân cảnh
  const sceneManager = new SceneManager(photoManager);
  window.sceneManager = sceneManager;
});
