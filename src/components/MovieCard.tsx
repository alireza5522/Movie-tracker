import { WatchlistItem } from '../types';
import { Trash2, Tv, Film } from 'lucide-react';

interface MovieCardProps {
  item: WatchlistItem;
  onClick: () => void;
  onDelete: (id: string) => void;
}

export default function MovieCard({ item, onClick, onDelete }: MovieCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`آیا می‌خواهید "${item.title}" را حذف کنید؟`)) {
      onDelete(item.id);
    }
  };

  return (
    <div
      onClick={onClick}
      className={`group relative bg-slate-800 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
        item.has_new_episodes ? 'ring-4 ring-red-500 ring-offset-2 ring-offset-slate-900' : ''
      }`}
    >
      <div className="aspect-[2/3] relative">
        {item.poster ? (
          <img
            src={item.poster}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-700 flex items-center justify-center">
            {item.type === 'tv' ? (
              <Tv className="w-16 h-16 text-slate-600" />
            ) : (
              <Film className="w-16 h-16 text-slate-600" />
            )}
          </div>
        )}

        {item.has_new_episodes && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
            جدید!
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleDelete}
            className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-full transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
          <h3 className="font-bold text-white text-sm mb-1 line-clamp-2">{item.title}</h3>
          {item.year && (
            <p className="text-slate-300 text-xs mb-2">{item.year}</p>
          )}
          {item.type === 'tv' && (
            <div className="text-xs text-emerald-400 font-semibold">
              S{item.current_season} E{item.current_episode}
              {item.total_seasons && ` / ${item.total_seasons} فصل`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
