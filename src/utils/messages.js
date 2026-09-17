export const TROLL_MESSAGES = [
  "Không được chọn cái này 😝",
  "Ơ kìa 🥺",
  "Đi đi màaa 🥺",
  "Anh năn nỉ đấy 😭",
  "Đi với anh nhaaa ❤️",
  "Đừng từ chối mà 🥹",
  "Cho anh một cơ hội đi 😭",
  "Ấn bên kia kìa 👉❤️",
  "Em không bắt được anh đâu 😝",
  "Thôi mà, đi với anh nhé 🥺",
  "Anh chuẩn bị tinh thần rủ em lâu lắm rồi đó 😭",
  "Không đi là anh buồn 5 phút đấy 🥺",
  "Đi nha? Nha? Nha? 🥹"
];

export const TIME_SLOTS = [
  { id: 't1', icon: '☀️', time: '08:00', label: 'Buổi sáng trong lành' },
  { id: 't2', icon: '🌤️', time: '10:00', label: 'Nắng ấm dạo phố' },
  { id: 't3', icon: '🍜', time: '12:00', label: 'Ăn trưa no căng' },
  { id: 't4', icon: '☕', time: '14:00', label: 'Cà phê ngọt ngào' },
  { id: 't5', icon: '🌇', time: '17:00', label: 'Hoàng hôn lãng mạn' },
  { id: 't6', icon: '🌙', time: '19:00', label: 'Buổi tối lung linh' },
  { id: 't7', icon: '✨', time: '20:00', label: 'Đêm chill hẹn hò' },
];

export function getHeadingForRejection(count) {
  if (count >= 12) return "😭 EM ƠIIII";
  if (count >= 10) return "Thôi đừng đuổi theo nút kia nữa 😭 Bấm 'Dạ đi' đi mà ❤️";
  if (count >= 7) return "Anh năn nỉ thật đấy 😭❤️";
  if (count >= 5) return "Em vẫn định từ chối anh thật à? 🥺";
  return "Cuối tuần này đi chơi với anh không? 🥺❤️";
}

export function getSubtitleForRejection(count) {
  if (count >= 12) return "Server xác nhận lựa chọn này không hợp lệ. Vui lòng ấn 'Dạ đi'!";
  if (count >= 10) return "Nút đó có chân đấy, em bấm cả ngày cũng không trúng đâu hihi 😝";
  if (count >= 5) return "Dỗi một chút nhẹ... nhưng mà vẫn thương em nhất quả đất 🥺";
  return "Anh đã suy nghĩ rất kỹ trước khi gửi lời mời cực kỳ quan trọng này...";
}

