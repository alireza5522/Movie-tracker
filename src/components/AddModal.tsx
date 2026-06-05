import { useState } from 'react';
import { WatchlistItem } from '../types';
import { X, Save } from 'lucide-react';

interface AddModalProps {
  item: WatchlistItem;
  onClose: () => void;
  onSave: (updatedItem: Partial<WatchlistItem>) => void;
}

export default function AddModal({ item, onClose, onSave }: AddModalProps) {
  const [currentSeason, setCurrentSeason] = useState(item.current_season || 1);
  const [currentEpisode, setCurrentEpisode] = useState(item.current_episode || 1);
  const [status, setStatus] = useState(item.status || 'watching');

  const handleSave = () => {
    onSave({
      current_season: currentSeason,
      current_episode: currentEpisode,
      status,
      has_new_episodes: false,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">{item.title}</h2>
              {item.year && <p className="text-slate-400">{item.year}</p>}
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {item.poster && (
            <img
              src={item.poster}
              alt={item.title}
              className="w-full max-h-64 object-cover rounded-lg mb-6"
            />
          )}

          {item.overview && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">خلاصه</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{item.overview}</p>
            </div>
          )}

          {item.type === 'tv' && (
            <div className="space-y-6 mb-6">
              <div>
                <label className="block text-white font-semibold mb-3">
                  فصل فعلی
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min="1"
                    max={item.total_seasons || 100}
                    value={currentSeason}
                    onChange={(e) => setCurrentSeason(parseInt(e.target.value) || 1)}
                    className="bg-slate-700 text-white px-4 py-3 rounded-lg w-24 text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {item.total_seasons && (
                    <span className="text-slate-400">از {item.total_seasons} فصل</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-3">
                  قسمت فعلی
                </label>
                <input
                  type="number"
                  min="1"
                  value={currentEpisode}
                  onChange={(e) => setCurrentEpisode(parseInt(e.target.value) || 1)}
                  className="bg-slate-700 text-white px-4 py-3 rounded-lg w-24 text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-white font-semibold mb-3">
              وضعیت
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-slate-700 text-white px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="watching">در حال تماشا</option>
              <option value="completed">تمام شده</option>
              <option value="plan_to_watch">برنامه برای تماشا</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              ذخیره
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              انصراف
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
