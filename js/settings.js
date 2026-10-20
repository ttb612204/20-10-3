/**
 * CẤU HÌNH NỘI DUNG VÀ THIẾT LẬP DỰ ÁN 20/10 DÀNH RIÊNG CHO TVY
 * Tất cả nội dung văn bản, tên người nhận, hình ảnh và hiệu ứng đều được quản lý tại đây.
 */

const CONFIG = {
  // Thông tin người nhận
  receiverName: "tvy",
  occasion: "Ngày Phụ nữ Việt Nam 20/10",
  year: 2026,

  // Âm thanh nền (bản nhạc lãng mạn trích xuất từ video)
  audio: {
    src: "assets/audio/music.mp3",
    autoPlayAfterFirstInteraction: true,
    volume: 0.75,
  },

  // Danh sách hình ảnh cá nhân của tvy (nhúng Base64 bảo mật, không cần đẩy file ảnh lên Git, load 100% mượt trên mọi host)
  photos: (typeof window !== 'undefined' && window.BASE64_PHOTOS && window.BASE64_PHOTOS.length > 0)
    ? window.BASE64_PHOTOS
    : [
        "assets/images/photo1.jpg",
        "assets/images/photo2.jpg",
        "assets/images/photo3.jpg",
        "assets/images/photo4.jpg",
        "assets/images/photo5.jpg",
        "assets/images/photo6.jpg",
        "assets/images/photo7.jpg",
      ],

  // Phân cảnh 1: Máy quét vân tay "Mở khóa trái tim"
  scene1: {
    badge: "🔒 KHÓA TRÁI TIM ANH",
    title: "Xác thực quyền truy cập",
    subtitle: "Chỉ dành riêng cho một người duy nhất",
    statusInitial: "Chạm và giữ để xác thực người yêu của anh...",
    successName: "Chào em, tvy yêu dấu!",
    successMsg: "Trái tim anh chỉ có một mã khóa duy nhất, và người nắm giữ chìa khóa chính là em ❤️",
    buttonText: "Mở thiệp tình yêu của anh ❤️",
  },

  // Phân cảnh 3: Thiệp chúc mừng 20/10
  scene3: {
    badge: "Anh ♥ Em",
    title: "Happy Woman's Day",
    monthName: "October 2026",
    highlightDay: 20,
    wish: "Chúc em yêu của anh luôn xinh đẹp, vui vẻ, được yêu thương thật nhiều và luôn có những ngày ngập tràn hạnh phúc.",
    subWish: "Ngày hôm nay, anh muốn dành cho em một điều thật đặc biệt.",
    buttonText: "Khám phá dải ngân hà kỷ niệm ✨",
  },

  // Phân cảnh 4: Vũ trụ kỷ niệm (Di chuyển tự do trong ngân hà)
  scene4: {
    messages: [
      "Cảm ơn em vì đã luôn bên anh ❤️",
      "Hôm nay, nụ cười của em là đẹp nhất ✨",
      "Bông hoa này nhắc anh em tuyệt vời nhường nào 🌸",
      "20 tháng 10, luôn bên em 💕",
      "Vẫn gần em thôi dù xa cách khung trời 🌌",
      "Kề bên anh nơi này có anh 💖",
      "Nguyện mãi bên cạnh nhau yêu say đắm như ngày đầu 🌟",
      "Với anh, nụ cười của em luôn rất đáng quý 💫",
      "Có một điều anh muốn em luôn nhớ: em rất đặc biệt đối với anh ❤️",
      "Mong rằng hôm nay em sẽ cảm nhận được thật nhiều yêu thương 🌹",
    ],
    buttonText: "Em là cả thế giới của anh 🌍❤️",
  },

  // Phân cảnh 5: Quả cầu Trái Đất 3D tròn nguyên khối ghép từ kỷ niệm
  scene5: {
    tipText: "✨ Chạm hoặc kéo để xoay thế giới của chúng mình ✨",
    captionMain: "“ Kề bên anh nơi này có anh ”",
    captionSub: "Với anh, em chính là cả thế giới ❤️",
    buttonText: "Mở bức tường ảnh 💫",
  },

  // Phân cảnh 6: Bức tường ảnh
  scene6: {
    buttonText: "Nhận phong thư tình yêu 💌",
  },

  // Phân cảnh 7: Phong thư tình yêu
  scene7: {
    subtitle: "Anh có vài lời muốn nói với em…",
    buttonText: "Mở thư nhé, em ❤️",
  },

  // Phân cảnh 8: Lá thư tình chân thành
  scene8: {
    title: "Gửi em !",
    headerNote: "Gửi tvy yêu dấu của anh ❤️",
    paragraphs: [
      "Hôm nay là ngày 20/10 - ngày dành riêng cho những người con gái tuyệt vời nhất.",
      "Anh chỉ muốn nói rằng: Cảm ơn em vì đã đến bên anh, mang đến cho anh niềm vui, sự bình yên và những yêu thương ngọt ngào nhất.",
      "Anh chúc em luôn vui vẻ, xinh đẹp, bình an và được yêu thương thật nhiều. Mong rằng mỗi ngày của em đều có những điều khiến em mỉm cười, những niềm vui bất ngờ và thật nhiều lý do để cảm thấy hạnh phúc.",
      "Anh mong em luôn tự tin vào bản thân, luôn được làm những điều mình thích và luôn nhớ rằng em xứng đáng nhận được những điều tốt đẹp nhất.",
      "Có thể món quà này không quá lớn lao, nhưng anh đã muốn gửi gắm vào đó một chút ngọt ngào, một chút bất ngờ và thật nhiều tình cảm dành cho em.",
      "Ngày 20/10, anh mong em được vui, được cười thật nhiều và cảm nhận được rằng có một người luôn muốn dành cho em những điều dịu dàng nhất.",
      "Chúc em yêu của anh có một ngày 20/10 thật hạnh phúc.",
      "Yêu em ❤️",
    ],
    signature: "Người luôn thương em ❤️",
    subSign: "tvy ❤️",
  },

  // Phân cảnh 9: Trái tim kết thúc
  scene9: {
    heartName: "tvy",
    endingMessage: "Chúc em một ngày 20/10 thật hạnh phúc. Anh thương em ❤️",
    buttons: {
      readLetter: "💌 Đọc lại thư",
      replay: "🔄 Xem lại từ đầu",
    },
  },
};

// Đóng băng cấu hình để tránh sửa đổi ngoài ý muốn
Object.freeze(CONFIG);
