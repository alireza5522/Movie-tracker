import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const TMDB_API_KEY = Deno.env.get("VITE_TMDB_API_KEY") || "";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

interface WatchlistItem {
  id: string;
  tmdb_id: number;
  type: string;
  current_season: number;
  current_episode: number;
  total_seasons: number;
  has_new_episodes: boolean;
}

async function checkForNewEpisodes(item: WatchlistItem) {
  if (item.type !== "tv" || !item.tmdb_id) {
    return { ...item, has_new_episodes: false };
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${item.tmdb_id}?api_key=${TMDB_API_KEY}`
    );
    const data = await response.json();

    const latestSeason = data.number_of_seasons || 0;
    const hasNewSeason = latestSeason > item.total_seasons;

    if (hasNewSeason) {
      return {
        ...item,
        has_new_episodes: true,
        total_seasons: latestSeason,
      };
    }

    if (item.current_season <= data.number_of_seasons) {
      const seasonResponse = await fetch(
        `${TMDB_BASE_URL}/tv/${item.tmdb_id}/season/${item.current_season}?api_key=${TMDB_API_KEY}`
      );
      const seasonData = await seasonResponse.json();
      const episodeCount = seasonData.episodes?.length || 0;

      if (episodeCount > item.current_episode) {
        return { ...item, has_new_episodes: true };
      }
    }

    return { ...item, has_new_episodes: false };
  } catch (error) {
    console.error(`Error checking episodes for ${item.id}:`, error);
    return { ...item, has_new_episodes: false };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase credentials not configured");
    }

    const watchlistResponse = await fetch(
      `${supabaseUrl}/rest/v1/watchlist?type=eq.tv&select=*`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );

    const watchlist: WatchlistItem[] = await watchlistResponse.json();

    const updates = await Promise.all(
      watchlist.map(async (item) => {
        const checked = await checkForNewEpisodes(item);
        return {
          id: item.id,
          has_new_episodes: checked.has_new_episodes,
          total_seasons: checked.total_seasons || item.total_seasons,
          last_checked: new Date().toISOString(),
        };
      })
    );

    for (const update of updates) {
      await fetch(
        `${supabaseUrl}/rest/v1/watchlist?id=eq.${update.id}`,
        {
          method: "PATCH",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            has_new_episodes: update.has_new_episodes,
            total_seasons: update.total_seasons,
            last_checked: update.last_checked,
          }),
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        checked: updates.length,
        updates: updates.filter((u) => u.has_new_episodes).length,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
