import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Heart,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Bell,
  Trash2,
} from 'lucide-react';
import { fetchCloudChoice, clearChoice, getTopicName } from '../utils/syncService';
import { playPop } from '../utils/sound';

export default function DashboardView({ onBackToInvite }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedDashLink, setCopiedDashLink] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchCloudChoice();
      if (result) {
        setData(result);
      }
      setLastRefreshed(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Auto poll every 6 seconds for real-time updates
    const interval = setInterval(() => {
      fetchCloudChoice().then((res) => {
        if (res) {
          setData(res);
          setLastRefreshed(new Date());
        }
      });
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    playPop();
    loadData();
  };

  const handleReset = async () => {
    if (window.confirm('Bạn có chắc muốn đặt lại dữ liệu để kiểm tra lại từ đầu không?')) {
      playPop();
      const reset = await clearChoice();
      setData(reset);
    }
  };

  const formatVietnameseDate = (dateVal) => {
    if (!dateVal) return 'Chưa chọn';
    const dt = new Date(dateVal);
    if (isNaN(dt.getTime())) return 'Chưa chọn';
    const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const dayName = dayNames[dt.getDay()];
    const dd = String(dt.getDate()).padStart(2, '0');
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const yyyy = dt.getFullYear();
    return `${dayName}, ${dd}/${mm}/${yyyy}`;
  };

  const getTrollRating = (count = 0) => {
    if (count === 0) return 'Ngoan thế, đồng ý ngay từ đầu 🥰';
    if (count <= 3) return 'Hơi ngại ngùng chút xíu nhưng vẫn ngoan 🥺';
    if (count <= 7) return 'Cố tình ấn nút từ chối nhưng không thoát được tay anh 😆';
    if (count <= 14) return 'Lì lợm ấn mỏi cả tay mà vẫn phải bấm "Dạ đi" 😂';
    return 'Kỷ lục gia né nút! Cuối cùng cũng chịu đầu hàng ❤️';
  };

  const getBaseInviteUrl = () => {
    if (typeof window === 'undefined') return '';
    const url = new URL(window.location.href);
    url.searchParams.delete('dashboard');
    url.searchParams.delete('admin');
    url.pathname = url.pathname.replace(/\/dashboard\/?$/, '/');
    url.hash = '';
    return url.origin + url.pathname;
  };

  const getDashboardUrl = () => {
    if (typeof window === 'undefined') return '';
    return window.location.origin + '/dashboard';
  };

  const copyToClipboard = (text, setCopiedState) => {
    playPop();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedState(true);
        setTimeout(() => setCopiedState(false), 2500);
      });
    }
  };

  const rejectCount = data?.rejectCount || 0;
  const isCompleted = data?.status === 'completed';
  const topicName = getTopicName();

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-start px-3.5 py-5 sm:py-8 z-10">
      <div className="w-full max-w-xl mx-auto space-y-4">
        {/* Navigation Bar */}
        <header className="flex items-center justify-between bg-white/85 backdrop-blur-md px-4 py-3 rounded-2xl border border-rose-200/80 shadow-subtle">
          <button
            type="button"
            onClick={onBackToInvite}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-rose-700 hover:text-rose-900 bg-rose-50/80 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200/60 transition-all cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Mở giao diện bạn gái</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Cloud Sync</span>
            </span>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-all cursor-pointer active:scale-95"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-rose-600' : ''}`} />
            </button>
          </div>
        </header>

        {/* Hero Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 sm:p-6 rounded-3xl stationery-card text-left relative overflow-hidden"
        >
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-50 text-rose-800 text-[11px] font-bold tracking-wide border border-rose-200/70 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                <span>Kênh theo dõi riêng tư của bạn trai</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                Lịch Hẹn Của Em Ý ❤️
              </h1>
            </div>

            <div className={`px-3 py-1.5 rounded-2xl text-xs font-bold shrink-0 ${
              isCompleted
                ? 'bg-rose-600 text-white shadow-btn-rose'
                : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}>
              {isCompleted ? '🎉 Đã Chốt Kèo' : '⏳ Đang Lựa Chọn'}
            </div>
          </div>

          {/* Core Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {/* Date card */}
            <div className="p-4 rounded-2xl bg-white/90 border border-stone-200/80 shadow-xs flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Ngày em chọn đi chơi
                </div>
                <div className="text-sm sm:text-base font-bold text-stone-900 truncate">
                  {formatVietnameseDate(data?.selectedDate)}
                </div>
              </div>
            </div>

            {/* Time card */}
            <div className="p-4 rounded-2xl bg-white/90 border border-stone-200/80 shadow-xs flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Giờ đón em
                </div>
                <div className="text-sm sm:text-base font-bold text-stone-900 truncate">
                  {data?.selectedTime ? `${data.selectedTime} 🚗💨` : 'Chưa chọn'}
                </div>
              </div>
            </div>
          </div>

          {/* Rejection / Troll Counter Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-orange-50/60 border border-rose-200/70 shadow-xs mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span>Số lần em định ấn "Không đi":</span>
              </span>
              <span className="text-xl sm:text-2xl font-black text-rose-700 bg-white/90 px-3 py-0.5 rounded-xl border border-rose-200 shadow-xs">
                {rejectCount} lần
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 font-medium italic mt-1">
              "{getTrollRating(rejectCount)}"
            </p>
          </div>

          {/* Last updated timestamp */}
          <div className="flex items-center justify-between text-[11px] text-stone-400 border-t border-stone-200/70 pt-3">
            <span>
              {data?.updatedAt
                ? `Lần cuối thao tác: ${new Date(data.updatedAt).toLocaleTimeString('vi-VN')} - ${new Date(data.updatedAt).toLocaleDateString('vi-VN')}`
                : 'Chưa có lượt tương tác nào'}
            </span>
            <span>Refreshed: {lastRefreshed.toLocaleTimeString('vi-VN')}</span>
          </div>
        </motion.div>

        {/* Quick Link Sharing Tools */}
        <div className="p-5 rounded-3xl bg-white/90 border border-stone-200/80 shadow-subtle space-y-3 text-left">
          <h2 className="text-sm font-bold text-stone-800 uppercase tracking-wider">
            🔗 Đường dẫn tiện ích
          </h2>

          {/* Link for Girlfriend */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-600">
              1. Link gửi cho bạn gái (không hiện dashboard, bí mật 100%):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={getBaseInviteUrl()}
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-700 select-all font-mono"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(getBaseInviteUrl(), setCopiedLink)}
                className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Đã chép' : 'Sao chép'}</span>
              </button>
            </div>
          </div>

          {/* Link for Boyfriend Dashboard */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-semibold text-stone-600">
              2. Link xem Dashboard này của bạn (lưu lại vào bookmark điện thoại):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={getDashboardUrl()}
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-700 select-all font-mono"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(getDashboardUrl(), setCopiedDashLink)}
                className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                {copiedDashLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDashLink ? 'Đã chép' : 'Sao chép'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Push Notification Tip */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-left text-xs text-amber-900 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <Bell className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Muốn nhận thông báo đẩy về điện thoại khi em ý vừa bấm xong?</span>
          </div>
          <p className="leading-relaxed text-amber-900/90">
            Kênh Cloud Sync của bạn là: <code className="bg-amber-100/90 px-1.5 py-0.5 rounded font-mono font-bold text-amber-950">{topicName}</code>.
            Bạn có thể mở{' '}
            <a
              href={`https://ntfy.sh/${topicName}`}
              target="_blank"
              rel="noreferrer"
              className="font-bold underline text-rose-700 hover:text-rose-900 inline-flex items-center gap-1"
            >
              ntfy.sh/{topicName} <ExternalLink className="w-3 h-3" />
            </a>{' '}
            hoặc cài app ntfy (miễn phí) trên iPhone/Android để nhận chuông báo ngay khi em ý vừa chốt lịch!
          </p>
        </div>

        {/* Reset Action */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-stone-500 hover:text-rose-700 flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa lịch sử để thử lại từ đầu</span>
          </button>

          <span className="text-[11px] text-stone-400">
            Made with ❤️ for Duy
          </span>
        </div>
      </div>
    </div>
  );
}

