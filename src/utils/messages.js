export const TROLL_MESSAGES = [
  "Không được chọn cái này 😝",
  "Ơ kìa 🥺",
  "Trượt rùi nha 😜",
  "Bắt hụt rồi nè 🏃‍♂️💨",
  "Đi đi màaa 🥺",
  "Anh năn nỉ đấy 😭",
  "Đi với anh nhaaa ❤️",
  "Lêu lêu không bấm được 😝",
  "Đừng ấn nữa mỏi tay đấy 🥹",
  "Nút này trơn lắm 🧈",
  "Bên kia cơ mà 👉❤️",
  "Em không bắt được anh đâu 😝",
  "Sao em dai thế nhờ 😂",
  "Chỉ có 1 đường duy nhất là 'Dạ đi' thui ❤️",
  "Bấm 100 lần cũng trượt thui 😜",
  "Anh chuẩn bị lâu lắm rùi đó 😭",
  "Thôi mà, đi với anh nhé 🥺",
  "Đầu hàng chưa nàoo 🥹",
  "Không đi là anh buồn 5 phút đấy 🥺",
  "Đi nha? Nha? Nha? 🥹❤️",
  "Chấp em ấn cả ngày luônn 😆",
  "Nút này có phép thuật đấy ✨",
  "Thương anh một tí đi mừ 🥺",
  "Dạ đi mà, anh bao tất tần tật! 🍜☕",
  "Em ngoan bấm 'Dạ đi' đi nàoo 🥰",
  "Còn cố chấp là anh thơm đấy 😳❤️"
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
  if (count >= 15) return "😂 Em dai thật sự nhưng anh không bỏ cuộc đâu!";
  if (count >= 12) return "😭 EM ƠIIII tha cho cái nút đó đi!";
  if (count >= 9) return "Thôi đừng đuổi theo nút kia nữa 😭 Bấm 'Dạ đi' đi mà ❤️";
  if (count >= 6) return "Anh năn nỉ thật lòng đấy 😭❤️";
  if (count >= 3) return "Em vẫn định từ chối anh thật à? 🥺";
  return "Cuối tuần này đi chơi với anh không? 🥺❤️";
}

export function getSubtitleForRejection(count) {
  if (count >= 15) return "Hệ thống phát hiện em đã bấm né nút này quá nhiều lần. Chỉ còn duy nhất nút 'Dạ đi' là bấm được thôi hihi 😌";
  if (count >= 12) return "Server xác nhận lựa chọn này không hợp lệ. Vui lòng ấn 'Dạ đi' ngay!";
  if (count >= 9) return "Nút đó có cánh bay lượn đấy, em bấm cả ngày cũng không trúng đâu 😝";
  if (count >= 6) return "Dỗi một chút nhẹ... nhưng mà vẫn thương em nhất quả đất 🥺";
  if (count >= 3) return "Ấn nhầm đúng hong? Bấm nút đỏ bên cạnh mới đúng nà ❤️";
  return "Anh đã suy nghĩ rất kỹ trước khi gửi lời mời cực kỳ quan trọng này...";
}
