import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { TrendingUp, TrendingDown, Star, Building2, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function BillionaireCard({ billionaire, onToggleWatchlist, isWatched }) {
  const netWorthFormatted = `$${billionaire.net_worth?.toFixed(1)}B`;
  const changeIsPositive = (billionaire.net_worth_change_percentage || 0) >= 0;

  return (
    <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white border-0">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-rose-500/0 to-orange-500/0 group-hover:from-orange-500/10 group-hover:via-rose-500/10 group-hover:to-orange-500/10 transition-all duration-500" />
      
      <div className="relative p-6">
        {/* Header with Portrait */}
        <div className="flex items-start gap-4 mb-4">
          <Link 
            to={`${createPageUrl("Profile")}?id=${billionaire.id}`}
            className="relative flex-shrink-0"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-rose-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
              {billionaire.portrait_url ? (
                <img 
                  src={billionaire.portrait_url} 
                  alt={billionaire.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-500">
                  {billionaire.full_name?.[0]}
                </div>
              )}
            </div>
          </Link>

          <div className="flex-1 min-w-0">
            <Link 
              to={`${createPageUrl("Profile")}?id=${billionaire.id}`}
              className="block group-hover:text-orange-600 transition-colors"
            >
              <h3 className="text-lg font-bold truncate mb-1">
                {billionaire.full_name}
              </h3>
            </Link>
            
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate">
                {billionaire.country_code && (
                  <span className="mr-1">
                    {String.fromCodePoint(...billionaire.country_code.toUpperCase().split('').map(c => 127397 + c.charCodeAt()))}
                  </span>
                )}
                {billionaire.country}
              </span>
            </div>

            {/* Net Worth */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                {netWorthFormatted}
              </span>
              {billionaire.net_worth_change_percentage !== undefined && billionaire.net_worth_change_percentage !== null && (
                <div className={`flex items-center gap-1 text-xs font-semibold ${
                  changeIsPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {changeIsPositive ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  {Math.abs(billionaire.net_worth_change_percentage).toFixed(1)}%
                </div>
              )}
            </div>
          </div>

          {/* Watchlist Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              onToggleWatchlist(billionaire);
            }}
            className={`flex-shrink-0 ${isWatched ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'}`}
          >
            <Star className={`w-5 h-5 ${isWatched ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Source of Wealth */}
        {billionaire.source_of_wealth && (
          <div className="mb-3 flex items-start gap-2">
            <Building2 className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600 line-clamp-2">
              {billionaire.source_of_wealth}
            </p>
          </div>
        )}

        {/* Industries */}
        {billionaire.industries && billionaire.industries.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {billionaire.industries.slice(0, 3).map((industry, index) => (
              <Badge 
                key={index}
                variant="secondary"
                className="bg-orange-100 text-orange-700 border-0 text-xs"
              >
                {industry}
              </Badge>
            ))}
            {billionaire.industries.length > 3 && (
              <Badge 
                variant="secondary"
                className="bg-gray-100 text-gray-600 border-0 text-xs"
              >
                +{billionaire.industries.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Scores */}
        {(billionaire.philanthropic_rank || billionaire.innovation_score) && (
          <div className="mt-4 pt-4 border-t flex gap-4 text-xs">
            {billionaire.philanthropic_rank && (
              <div>
                <span className="text-gray-500">Philanthropy: </span>
                <span className="font-semibold text-green-600">{billionaire.philanthropic_rank}/100</span>
              </div>
            )}
            {billionaire.innovation_score && (
              <div>
                <span className="text-gray-500">Innovation: </span>
                <span className="font-semibold text-blue-600">{billionaire.innovation_score}/100</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hover Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-rose-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </Card>
  );
}