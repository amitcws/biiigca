import { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Grid3x3, List, ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import BillionaireCard from "../components/directory/BillionaireCard";
import FilterPanel from "../components/directory/FilterPanel";

export default function Directory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    country: null,
    industry: null,
    gender: null,
    netWorthRange: [0, 500],
    minAge: null,
    maxAge: null,
  });
  const [sortBy, setSortBy] = useState("net_worth_desc");
  const [viewMode, setViewMode] = useState("grid");
  const [user, setUser] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  // Fetch billionaires
  const { data: billionaires = [], isLoading } = useQuery({
    queryKey: ['billionaires'],
    queryFn: () => base44.entities.Billionaire.list(),
  });

  // Fetch watchlist
  const { data: watchlist = [] } = useQuery({
    queryKey: ['watchlist', user?.email],
    queryFn: () => user ? base44.entities.Watchlist.filter({ user_email: user.email }) : [],
    enabled: !!user,
  });

  // Toggle watchlist mutation
  const toggleWatchlistMutation = useMutation({
    mutationFn: async (billionaire) => {
      if (!user) {
        base44.auth.redirectToLogin();
        return;
      }

      const existing = watchlist.find(w => w.billionaire_id === billionaire.id);
      if (existing) {
        await base44.entities.Watchlist.delete(existing.id);
      } else {
        await base44.entities.Watchlist.create({
          billionaire_id: billionaire.id,
          billionaire_name: billionaire.full_name,
          user_email: user.email,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['watchlist']);
    },
  });

  // Filter and sort billionaires
  const filteredAndSortedBillionaires = useMemo(() => {
    let result = [...billionaires];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(b => 
        b.full_name?.toLowerCase().includes(query) ||
        b.source_of_wealth?.toLowerCase().includes(query) ||
        b.country?.toLowerCase().includes(query)
      );
    }

    // Country filter
    if (filters.country) {
      result = result.filter(b => b.country === filters.country);
    }

    // Industry filter
    if (filters.industry) {
      result = result.filter(b => 
        b.industries && b.industries.some(ind => ind === filters.industry)
      );
    }

    // Gender filter
    if (filters.gender) {
      result = result.filter(b => b.gender === filters.gender);
    }

    // Net worth range filter
    if (filters.netWorthRange) {
      const [min, max] = filters.netWorthRange;
      result = result.filter(b => {
        const worth = b.net_worth || 0;
        return worth >= min && (max === 500 || worth <= max);
      });
    }

    // Age range filter
    if (filters.minAge) {
      result = result.filter(b => (b.age || 0) >= filters.minAge);
    }
    if (filters.maxAge) {
      result = result.filter(b => (b.age || 0) <= filters.maxAge);
    }

    // Sort
    switch (sortBy) {
      case "net_worth_desc":
        result.sort((a, b) => (b.net_worth || 0) - (a.net_worth || 0));
        break;
      case "net_worth_asc":
        result.sort((a, b) => (a.net_worth || 0) - (b.net_worth || 0));
        break;
      case "growth_desc":
        result.sort((a, b) => (b.net_worth_change_percentage || 0) - (a.net_worth_change_percentage || 0));
        break;
      case "growth_asc":
        result.sort((a, b) => (a.net_worth_change_percentage || 0) - (b.net_worth_change_percentage || 0));
        break;
      case "name_asc":
        result.sort((a, b) => (a.full_name || "").localeCompare(b.full_name || ""));
        break;
      default:
        break;
    }

    return result;
  }, [billionaires, searchQuery, filters, sortBy]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => {
      // Handle the special "__all__" case for dropdowns
      const updated = { ...prev, ...newFilters };
      Object.keys(newFilters).forEach(key => {
        if (newFilters[key] === "__all__") {
          updated[key] = null;
        }
      });
      return updated;
    });
  };

  const handleClearFilters = () => {
    setFilters({
      country: null,
      industry: null,
      gender: null,
      netWorthRange: [0, 500],
      minAge: null,
      maxAge: null,
    });
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 md:px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-rose-100 to-amber-100 opacity-50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-rose-600 to-orange-600 bg-clip-text text-transparent leading-tight">
              Explore the World's Billionaires
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Track wealth, industries, and impact. Discover who's shaping innovation and society.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-rose-500 rounded-2xl blur-xl opacity-30" />
              <div className="relative bg-white rounded-2xl shadow-2xl p-2 flex items-center gap-2">
                <Search className="w-6 h-6 text-gray-400 ml-3" />
                <Input
                  type="text"
                  placeholder="Search by name, country, or source of wealth..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border-0 focus-visible:ring-0 text-lg"
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-3xl mx-auto">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="text-3xl font-bold text-orange-600">{billionaires.length}</div>
                <div className="text-sm text-gray-600">Billionaires</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="text-3xl font-bold text-rose-600">
                  ${billionaires.reduce((sum, b) => sum + (b.net_worth || 0), 0).toFixed(1)}T
                </div>
                <div className="text-sm text-gray-600">Total Wealth</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="text-3xl font-bold text-amber-600">
                  {new Set(billionaires.map(b => b.country)).size}
                </div>
                <div className="text-sm text-gray-600">Countries</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="text-3xl font-bold text-orange-600">
                  {new Set(billionaires.flatMap(b => b.industries || [])).size}
                </div>
                <div className="text-sm text-gray-600">Industries</div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="sticky top-28">
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </aside>

          {/* Results Section */}
          <main className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">
                  {filteredAndSortedBillionaires.length} Results
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="net_worth_desc">Net Worth: High to Low</SelectItem>
                    <SelectItem value="net_worth_asc">Net Worth: Low to High</SelectItem>
                    <SelectItem value="growth_desc">Growth: High to Low</SelectItem>
                    <SelectItem value="growth_asc">Growth: Low to High</SelectItem>
                    <SelectItem value="name_asc">Name: A to Z</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className={viewMode === "grid" ? "bg-white shadow-sm" : ""}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className={viewMode === "list" ? "bg-white shadow-sm" : ""}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            {isLoading ? (
              <div className={`grid ${viewMode === "grid" ? "md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"} gap-6`}>
                {Array(9).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
                    <Skeleton className="w-20 h-20 rounded-2xl mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-8 w-1/3" />
                  </div>
                ))}
              </div>
            ) : filteredAndSortedBillionaires.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-rose-100 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Results Found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
                <Button
                  onClick={handleClearFilters}
                  className="bg-gradient-to-r from-orange-500 to-rose-500 text-white"
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className={`grid ${viewMode === "grid" ? "md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"} gap-6`}>
                {filteredAndSortedBillionaires.map((billionaire) => (
                  <BillionaireCard
                    key={billionaire.id}
                    billionaire={billionaire}
                    onToggleWatchlist={(b) => toggleWatchlistMutation.mutate(b)}
                    isWatched={watchlist.some(w => w.billionaire_id === billionaire.id)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}