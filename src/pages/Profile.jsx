import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Building2, 
  MapPin, 
  Calendar,
  Users,
  GraduationCap,
  Heart,
  Lightbulb,
  ExternalLink,
  Edit3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Profile() {
  const urlParams = new URLSearchParams(window.location.search);
  const billionaireId = urlParams.get('id');
  const [user, setUser] = useState(null);
  const [suggestDialogOpen, setSuggestDialogOpen] = useState(false);
  const [suggestion, setSuggestion] = useState({
    field_name: '',
    suggested_value: '',
    reason: '',
    source_url: ''
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  // Fetch billionaire
  const { data: billionaire, isLoading } = useQuery({
    queryKey: ['billionaire', billionaireId],
    queryFn: async () => {
      const all = await base44.entities.Billionaire.list();
      return all.find(b => b.id === billionaireId);
    },
    enabled: !!billionaireId,
  });

  // Fetch watchlist status
  const { data: watchlist = [] } = useQuery({
    queryKey: ['watchlist', user?.email],
    queryFn: () => user ? base44.entities.Watchlist.filter({ user_email: user.email }) : [],
    enabled: !!user,
  });

  const isWatched = watchlist.some(w => w.billionaire_id === billionaireId);

  // Toggle watchlist
  const toggleWatchlistMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        base44.auth.redirectToLogin();
        return;
      }

      const existing = watchlist.find(w => w.billionaire_id === billionaireId);
      if (existing) {
        await base44.entities.Watchlist.delete(existing.id);
      } else {
        await base44.entities.Watchlist.create({
          billionaire_id: billionaireId,
          billionaire_name: billionaire.full_name,
          user_email: user.email,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['watchlist']);
    },
  });

  // Submit suggestion
  const submitSuggestionMutation = useMutation({
    mutationFn: async (data) => {
      if (!user) {
        base44.auth.redirectToLogin();
        return;
      }
      await base44.entities.EditSuggestion.create({
        billionaire_id: billionaireId,
        billionaire_name: billionaire.full_name,
        submitter_email: user.email,
        ...data,
      });
    },
    onSuccess: () => {
      setSuggestDialogOpen(false);
      setSuggestion({ field_name: '', suggested_value: '', reason: '', source_url: '' });
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <Skeleton className="h-96 w-full rounded-3xl mb-8" />
        <div className="grid md:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!billionaire) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Billionaire Not Found</h1>
        <Link to={createPageUrl("Directory")}>
          <Button>Back to Directory</Button>
        </Link>
      </div>
    );
  }

  const netWorthFormatted = `$${billionaire.net_worth?.toFixed(1)}B`;
  const changeIsPositive = (billionaire.net_worth_change_percentage || 0) >= 0;

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-100 via-rose-100 to-amber-100 py-12 px-4 md:px-6">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-20 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl" />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="mb-6">
            <Link to={createPageUrl("Directory")}>
              <Button variant="outline" className="bg-white/80 backdrop-blur-sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Explorer
              </Button>
            </Link>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Portrait */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-rose-500 rounded-3xl blur-2xl opacity-30" />
                <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-3xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 shadow-2xl">
                  {billionaire.portrait_url ? (
                    <img 
                      src={billionaire.portrait_url} 
                      alt={billionaire.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-gray-500">
                      {billionaire.full_name?.[0]}
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                      {billionaire.full_name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        <span className="text-lg">
                          {billionaire.country_code && (
                            <span className="mr-2">
                              {String.fromCodePoint(...billionaire.country_code.toUpperCase().split('').map(c => 127397 + c.charCodeAt()))}
                            </span>
                          )}
                          {billionaire.primary_residence || billionaire.country}
                        </span>
                      </div>
                      {billionaire.age && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          <span className="text-lg">{billionaire.age} years old</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={() => toggleWatchlistMutation.mutate()}
                    className={`${
                      isWatched 
                        ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white' 
                        : 'bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-50'
                    }`}
                  >
                    <Star className={`w-5 h-5 mr-2 ${isWatched ? 'fill-current' : ''}`} />
                    {isWatched ? 'Watching' : 'Add to Watchlist'}
                  </Button>
                </div>

                {/* Net Worth Display */}
                <div className="bg-gradient-to-r from-orange-500 to-rose-500 rounded-2xl p-6 mb-6 shadow-xl">
                  <div className="flex items-baseline justify-between flex-wrap gap-4">
                    <div>
                      <p className="text-white/80 text-sm mb-1">Net Worth</p>
                      <div className="flex items-baseline gap-3">
                        <span className="text-5xl font-bold text-white">
                          {netWorthFormatted}
                        </span>
                        {billionaire.net_worth_change_percentage !== undefined && billionaire.net_worth_change_percentage !== null && (
                          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
                            changeIsPositive 
                              ? 'bg-green-500/20 text-green-100' 
                              : 'bg-red-500/20 text-red-100'
                          }`}>
                            {changeIsPositive ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingDown className="w-4 h-4" />
                            )}
                            {Math.abs(billionaire.net_worth_change_percentage).toFixed(1)}%
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {billionaire.source_of_wealth && (
                    <div className="text-center p-4 bg-white rounded-xl shadow-md">
                      <Building2 className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                      <p className="text-xs text-gray-500 mb-1">Source</p>
                      <p className="font-semibold text-sm">{billionaire.source_of_wealth}</p>
                    </div>
                  )}
                  {billionaire.philanthropic_rank && (
                    <div className="text-center p-4 bg-white rounded-xl shadow-md">
                      <Heart className="w-6 h-6 mx-auto mb-2 text-rose-500" />
                      <p className="text-xs text-gray-500 mb-1">Philanthropy</p>
                      <p className="font-semibold text-sm">{billionaire.philanthropic_rank}/100</p>
                    </div>
                  )}
                  {billionaire.innovation_score && (
                    <div className="text-center p-4 bg-white rounded-xl shadow-md">
                      <Lightbulb className="w-6 h-6 mx-auto mb-2 text-amber-500" />
                      <p className="text-xs text-gray-500 mb-1">Innovation</p>
                      <p className="font-semibold text-sm">{billionaire.innovation_score}/100</p>
                    </div>
                  )}
                  {billionaire.children !== undefined && (
                    <div className="text-center p-4 bg-white rounded-xl shadow-md">
                      <Users className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                      <p className="text-xs text-gray-500 mb-1">Children</p>
                      <p className="font-semibold text-sm">{billionaire.children}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-12">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-white shadow-lg p-2 rounded-xl">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-rose-500 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="companies" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-rose-500 data-[state=active]:text-white">
              Companies
            </TabsTrigger>
            <TabsTrigger value="details" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-rose-500 data-[state=active]:text-white">
              Details
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Biography */}
              {billionaire.biography && (
                <Card className="border-0 shadow-xl">
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-orange-500" />
                      Biography
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-gray-700 leading-relaxed">{billionaire.biography}</p>
                  </CardContent>
                </Card>
              )}

              {/* Industries */}
              {billionaire.industries && billionaire.industries.length > 0 && (
                <Card className="border-0 shadow-xl">
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-orange-500" />
                      Industries
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-3">
                      {billionaire.industries.map((industry, index) => (
                        <Badge 
                          key={index}
                          className="bg-gradient-to-r from-orange-100 to-rose-100 text-orange-700 border-0 px-4 py-2 text-sm"
                        >
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Education */}
              {billionaire.education && (
                <Card className="border-0 shadow-xl">
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-orange-500" />
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-gray-700">{billionaire.education}</p>
                  </CardContent>
                </Card>
              )}

              {/* Personal */}
              <Card className="border-0 shadow-xl">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-orange-500" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-3">
                  {billionaire.gender && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Gender:</span>
                      <span className="font-semibold">{billionaire.gender}</span>
                    </div>
                  )}
                  {billionaire.nationality && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Nationality:</span>
                      <span className="font-semibold">{billionaire.nationality}</span>
                    </div>
                  )}
                  {billionaire.marital_status && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Marital Status:</span>
                      <span className="font-semibold">{billionaire.marital_status}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Companies Tab */}
          <TabsContent value="companies">
            {billionaire.companies_owned && billionaire.companies_owned.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {billionaire.companies_owned.map((company, index) => (
                  <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-shadow">
                    <CardContent className="p-6">
                      {company.logo_url && (
                        <div className="w-full h-32 mb-4 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
                          <img 
                            src={company.logo_url} 
                            alt={company.name}
                            className="max-w-full max-h-full object-contain p-4"
                          />
                        </div>
                      )}
                      <h3 className="font-bold text-xl mb-2">{company.name}</h3>
                      {company.stake_percentage && (
                        <p className="text-sm text-gray-600 mb-3">
                          Stake: <span className="font-semibold text-orange-600">{company.stake_percentage}%</span>
                        </p>
                      )}
                      {company.website && (
                        <a 
                          href={company.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
                        >
                          Visit Website
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-0 shadow-xl">
                <CardContent className="p-12 text-center">
                  <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">No company information available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details">
            <Card className="border-0 shadow-xl">
              <CardHeader className="border-b flex flex-row items-center justify-between">
                <CardTitle>All Details</CardTitle>
                <Dialog open={suggestDialogOpen} onOpenChange={setSuggestDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Suggest Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Suggest an Edit</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label>Field Name</Label>
                        <Input
                          value={suggestion.field_name}
                          onChange={(e) => setSuggestion({...suggestion, field_name: e.target.value})}
                          placeholder="e.g., net_worth, biography"
                        />
                      </div>
                      <div>
                        <Label>Suggested Value</Label>
                        <Input
                          value={suggestion.suggested_value}
                          onChange={(e) => setSuggestion({...suggestion, suggested_value: e.target.value})}
                          placeholder="New value"
                        />
                      </div>
                      <div>
                        <Label>Reason</Label>
                        <Textarea
                          value={suggestion.reason}
                          onChange={(e) => setSuggestion({...suggestion, reason: e.target.value})}
                          placeholder="Why should this be changed?"
                        />
                      </div>
                      <div>
                        <Label>Source URL (optional)</Label>
                        <Input
                          value={suggestion.source_url}
                          onChange={(e) => setSuggestion({...suggestion, source_url: e.target.value})}
                          placeholder="https://..."
                        />
                      </div>
                      <Button
                        onClick={() => submitSuggestionMutation.mutate(suggestion)}
                        className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white"
                        disabled={!suggestion.field_name || !suggestion.suggested_value}
                      >
                        Submit Suggestion
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(billionaire).map(([key, value]) => {
                    if (key === 'id' || key === 'portrait_url' || !value || key.includes('_date')) return null;
                    return (
                      <div key={key} className="border-b pb-3">
                        <p className="text-sm text-gray-500 mb-1 capitalize">
                          {key.replace(/_/g, ' ')}
                        </p>
                        <p className="font-semibold">
                          {Array.isArray(value) ? value.join(', ') : 
                           typeof value === 'object' ? JSON.stringify(value) : 
                           String(value)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}