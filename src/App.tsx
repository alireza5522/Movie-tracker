import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { WatchlistItem } from './types';
import { extractIMDBId, searchByIMDB, getPosterUrl, getTVDetails, isAPIKeyConfigured } from './lib/tmdb';
import MovieCard from './components/MovieCard';
import AddModal from './components/AddModal';
import SetupInstructions from './components/SetupInstructions';
import { Film, RefreshCw } from 'lucide-react';

function App() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WatchlistItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    loadWatchlist();
  }, []);

  async function loadWatchlist() {
    const { data, error } = await supabase
      .from('watchlist')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setWatchlist(data);
    }
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    setIsLoading(true);

    const url = e.dataTransfer.getData('text/plain');
    const imdbId = extractIMDBId(url);

    if (!imdbId) {
      alert('لینک معتبر IMDB پیدا نشد');
      setIsLoading(false);
      return;
    }

    const existing = watchlist.find(item => item.imdb_id === imdbId);
    if (existing) {
      alert('این فیلم/سریال قبلا اضافه شده است');
      setIsLoading(false);
      return;
    }

    const result = await searchByIMDB(imdbId);
    if (!result) {
      alert('اطلاعات فیلم/سریال پیدا نشد');
      setIsLoading(false);
      return;
    }

    let totalSeasons = 0;
    if (result.media_type === 'tv') {
      const details = await getTVDetails(result.id);
      totalSeasons = details?.number_of_seasons || 0;
    }

    const newItem: Partial<WatchlistItem> = {
      tmdb_id: result.id,
      imdb_id: imdbId,
      title: result.title || result.name || '',
      year: (result.release_date || result.first_air_date || '').split('-')[0],
      poster: getPosterUrl(result.poster_path),
      overview: result.overview,
      type: result.media_type,
      total_seasons: totalSeasons,
      current_season: result.media_type === 'tv' ? 1 : 0,
      current_episode: result.media_type === 'tv' ? 1 : 0,
      status: 'watching',
      has_new_episodes: false,
    };

    const { data, error } = await supabase
      .from('watchlist')
      .insert([newItem])
      .select()
      .single();

    if (!error && data) {
      setWatchlist([data, ...watchlist]);
    }

    setIsLoading(false);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function openModal(item: WatchlistItem) {
    setSelectedItem(item);
    setIsModalOpen(true);
  }

  function closeModal() {
    setSelectedItem(null);
    setIsModalOpen(false);
  }

  async function handleUpdate(updatedItem: Partial<WatchlistItem>) {
    if (!selectedItem) return;

    const { error } = await supabase
      .from('watchlist')
      .update(updatedItem)
      .eq('id', selectedItem.id);

    if (!error) {
      setWatchlist(watchlist.map(item =>
        item.id === selectedItem.id ? { ...item, ...updatedItem } : item
      ));
      closeModal();
    }
  }

  async function handleDelete(id: string) {
    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('id', id);

    if (!error) {
      setWatchlist(watchlist.filter(item => item.id !== id));
    }
  }

  async function checkForNewEpisodes() {
    setIsChecking(true);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-new-episodes`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, { headers });
      const result = await response.json();

      if (result.success) {
        await loadWatchlist();
        if (result.updates > 0) {
          alert(`${result.updates} سریال جدید پیدا شد!`);
        } else {
          alert('قسمت جدیدی پیدا نشد');
        }
      }
    } catch (error) {
      console.error('Error checking episodes:', error);
      alert('خطا در بررسی قسمت‌های جدید');
    }
    setIsChecking(false);
  }

  if (!isAPIKeyConfigured()) {
    return <SetupInstructions />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Film className="w-8 h-8 text-emerald-400" />
              <h1 className="text-4xl font-bold text-white">لیست تماشای من</h1>
            </div>
            <button
              onClick={checkForNewEpisodes}
              disabled={isChecking}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${isChecking ? 'animate-spin' : ''}`} />
              {isChecking ? 'در حال بررسی...' : 'بررسی قسمت‌های جدید'}
            </button>
          </div>
          <p className="text-slate-400 text-lg">لینک IMDB فیلم یا سریال را از مرورگر بکشید و اینجا رها کنید</p>
        </header>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`transition-all duration-300 rounded-2xl border-4 border-dashed p-8 mb-8 ${
            isDragging
              ? 'border-emerald-500 bg-emerald-500/10 scale-105'
              : 'border-slate-700 bg-slate-800/50'
          }`}
        >
          <div className="text-center">
            <Film className={`w-16 h-16 mx-auto mb-4 ${isDragging ? 'text-emerald-400' : 'text-slate-600'}`} />
            <p className={`text-xl ${isDragging ? 'text-emerald-400' : 'text-slate-500'}`}>
              {isDragging ? 'رها کنید!' : 'لینک IMDB را اینجا بکشید'}
            </p>
            {isLoading && (
              <p className="text-slate-400 mt-2">در حال بارگذاری...</p>
            )}
          </div>
        </div>

        {watchlist.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">هنوز چیزی اضافه نکرده‌اید</p>
            <p className="text-slate-600 mt-2">یک لینک IMDB بکشید و شروع کنید!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {watchlist.map(item => (
              <MovieCard
                key={item.id}
                item={item}
                onClick={() => openModal(item)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && selectedItem && (
        <AddModal
          item={selectedItem}
          onClose={closeModal}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
}

export default App;
