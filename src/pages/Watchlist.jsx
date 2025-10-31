import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Skeleton } from "@/components/ui/skeleton";
import BillionaireCard from "../components/directory/BillionaireCard";

export default function Watchlist() {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  // Fetch watchlist
  const { data: watchlist = [], isLoading: watchlistLoading } = useQuery({
    queryKey: ['watchlist', user?.email],
    queryFn: () => user ? base44.entities.Watchlist.filter({ user_email: user.email }) : [],
    enabled: !!user,
  });

  // Fetch all billionaires
  const { data: allBillionaires = [], isLoading: billionairesLoading } = useQuery({
    queryKey: ['billionaires'],
    queryFn: () => base44.entities.Billionaire.list(),
  });

  // Get watched billionaires
  const watchedBillionaires = allBillionaires.filter(b => 
    watchlist.some(w => w.billionaire_id === b.id)
  );

  // Remove from watchlist
  const removeFromWatchlistMutation = useMutation({
    mutationFn: async (billionaireId) => {
      const item = watchlist.find(w => w.billionaire_id === billionaireId);
      if (item) {
        await base44.entities.Watchlist.delete(item.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['watchlist']);
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-rose-100 rounded-full flex items-center justify-center">
            <Star className="w-12 h-12 text-orange-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">
            Sign in to save billionaires to your watchlist and track their progress
          </p>
          <Button 
            onClick={() => base44.auth.redirectToLogin()}
            className="bg-gradient-to-r from-orange-500 to-rose-500 text-white"
          >
            Sign In to Continue
          </Button>
        </div>
      </div>
    );
  }

  const isLoading = watchlistLoading || billionairesLoading;

  return (
    <div className="min-h-screen pb-12">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-100 via-rose-100 to-amber-100 py-20 px-4 md:px-6">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl" />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-md rounded-full px-6 py-3 mb-6 shadow-lg">
              <Star className="w-5 h-5 text-orange-500 fill-current" />
              <span className="font-semibold text-gray-700">Your Personal Watchlist</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent leading-tight">
              Tracking {watchedBillionaires.length} {watchedBillionaires.length === 1 ? 'Billionaire' : 'Billionaires'}
            </h1>
            <p className="text-xl text-gray-700">
              Keep an eye on the world's wealthiest individuals and their impact on innovation and society
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 py-12">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
                <Skeleton className="w-20 h-20 rounded-2xl mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-8 w-1/3" />
              </div>
            ))}
          </div>
        ) : watchedBillionaires.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-rose-100 rounded-full flex items-center justify-center">
              <Star className="w-16 h-16 text-orange-300" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Your Watchlist is Empty</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start building your watchlist by exploring billionaires and clicking the star icon on their profiles
            </p>
            <Link to={createPageUrl("Directory")}>
              <Button className="bg-gradient-to-r from-orange-500 to-rose-500 text-white">
                <Eye className="w-4 h-4 mr-2" />
                Explore Billionaires
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchedBillionaires.map((billionaire) => (
              <BillionaireCard
                key={billionaire.id}
                billionaire={billionaire}
                onToggleWatchlist={(b) => removeFromWatchlistMutation.mutate(b.id)}
                isWatched={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}