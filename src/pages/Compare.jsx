import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  X, 
  TrendingUp, 
  TrendingDown, 
  Building2, 
  Heart,
  Lightbulb,
  Users,
  ArrowUpDown
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Compare() {
  const [selectedBillionaires, setSelectedBillionaires] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);

  // Fetch all billionaires
  const { data: allBillionaires = [], isLoading } = useQuery({
    queryKey: ['billionaires'],
    queryFn: () => base44.entities.Billionaire.list(),
  });

  const addBillionaire = (billionaire) => {
    if (selectedBillionaires.length < 3 && !selectedBillionaires.find(b => b.id === billionaire.id)) {
      setSelectedBillionaires([...selectedBillionaires, billionaire]);
    }
    setSearchOpen(false);
  };

  const removeBillionaire = (id) => {
    setSelectedBillionaires(selectedBillionaires.filter(b => b.id !== id));
  };

  const renderComparisonRow = (label, icon, getValue, formatter = (v) => v) => {
    return (
      <div className="grid grid-cols-4 gap-4 py-4 border-b last:border-b-0">
        <div className="flex items-center gap-3 font-semibold text-gray-700">
          {icon}
          <span>{label}</span>
        </div>
        {selectedBillionaires.map((billionaire, index) => (
          <div key={index} className="text-center font-medium">
            {formatter(getValue(billionaire))}
          </div>
        ))}
        {Array(3 - selectedBillionaires.length).fill(0).map((_, i) => (
          <div key={`empty-${i}`} className="text-center text-gray-300">
            —
          </div>
        ))}
      </div>
    );
  };

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
              <ArrowUpDown className="w-5 h-5 text-orange-500" />
              <span className="font-semibold text-gray-700">Side-by-Side Comparison</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent leading-tight">
              Compare Billionaires
            </h1>
            <p className="text-xl text-gray-700">
              Select up to 3 billionaires to compare their wealth, industries, and impact metrics
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-12">
        {/* Selection Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {Array(3).fill(0).map((_, index) => {
            const billionaire = selectedBillionaires[index];
            return (
              <Card key={index} className="border-0 shadow-xl relative overflow-hidden">
                {billionaire ? (
                  <div className="p-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBillionaire(billionaire.id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </Button>

                    <div className="flex flex-col items-center text-center">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 mb-4">
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

                      <h3 className="text-xl font-bold mb-2">{billionaire.full_name}</h3>
                      
                      <div className="text-sm text-gray-500 mb-3">
                        {billionaire.country_code && (
                          <span className="mr-1">
                            {String.fromCodePoint(...billionaire.country_code.toUpperCase().split('').map(c => 127397 + c.charCodeAt()))}
                          </span>
                        )}
                        {billionaire.country}
                      </div>

                      <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent mb-2">
                        ${billionaire.net_worth?.toFixed(1)}B
                      </div>

                      {billionaire.net_worth_change_percentage !== undefined && (
                        <div className={`flex items-center gap-1 text-sm font-semibold ${
                          billionaire.net_worth_change_percentage >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {billionaire.net_worth_change_percentage >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {Math.abs(billionaire.net_worth_change_percentage).toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 flex flex-col items-center justify-center h-full min-h-[300px]">
                    <Popover open={searchOpen && !billionaire} onOpenChange={setSearchOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 hover:border-orange-500 hover:bg-orange-50 transition-all"
                        >
                          <Plus className="w-8 h-8 text-gray-400" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search billionaires..." />
                          <CommandList>
                            <CommandEmpty>No billionaires found.</CommandEmpty>
                            <CommandGroup>
                              {allBillionaires
                                .filter(b => !selectedBillionaires.find(s => s.id === b.id))
                                .map((billionaire) => (
                                  <CommandItem
                                    key={billionaire.id}
                                    onSelect={() => addBillionaire(billionaire)}
                                    className="cursor-pointer"
                                  >
                                    <div className="flex items-center gap-3 w-full">
                                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                        {billionaire.portrait_url ? (
                                          <img 
                                            src={billionaire.portrait_url} 
                                            alt={billionaire.full_name}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-500">
                                            {billionaire.full_name?.[0]}
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{billionaire.full_name}</p>
                                        <p className="text-xs text-gray-500">${billionaire.net_worth?.toFixed(1)}B</p>
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <p className="text-gray-500 mt-4 text-sm">Select Billionaire #{index + 1}</p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Comparison Table */}
        {selectedBillionaires.length >= 2 && (
          <Card className="border-0 shadow-xl">
            <CardHeader className="border-b">
              <CardTitle className="text-2xl">Detailed Comparison</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                  {/* Header Row */}
                  <div className="grid grid-cols-4 gap-4 p-6 bg-gradient-to-r from-orange-50 to-rose-50 font-bold">
                    <div>Metric</div>
                    {selectedBillionaires.map((_, index) => (
                      <div key={index} className="text-center">Billionaire #{index + 1}</div>
                    ))}
                    {Array(3 - selectedBillionaires.length).fill(0).map((_, i) => (
                      <div key={`empty-header-${i}`} className="text-center text-gray-400">—</div>
                    ))}
                  </div>

                  <div className="p-6">
                    {renderComparisonRow(
                      "Net Worth",
                      <Building2 className="w-5 h-5 text-orange-500" />,
                      (b) => b.net_worth,
                      (v) => v ? `$${v.toFixed(1)}B` : '—'
                    )}
                    
                    {renderComparisonRow(
                      "YoY Change",
                      <TrendingUp className="w-5 h-5 text-green-500" />,
                      (b) => b.net_worth_change_percentage,
                      (v) => v !== undefined ? `${v > 0 ? '+' : ''}${v.toFixed(1)}%` : '—'
                    )}

                    {renderComparisonRow(
                      "Age",
                      <Users className="w-5 h-5 text-blue-500" />,
                      (b) => b.age,
                      (v) => v ? `${v} years` : '—'
                    )}

                    {renderComparisonRow(
                      "Source of Wealth",
                      <Building2 className="w-5 h-5 text-purple-500" />,
                      (b) => b.source_of_wealth,
                      (v) => v || '—'
                    )}

                    {renderComparisonRow(
                      "Industries",
                      <Building2 className="w-5 h-5 text-indigo-500" />,
                      (b) => b.industries?.length || 0,
                      (v) => v ? `${v} industries` : '—'
                    )}

                    {renderComparisonRow(
                      "Philanthropy Score",
                      <Heart className="w-5 h-5 text-rose-500" />,
                      (b) => b.philanthropic_rank,
                      (v) => v ? `${v}/100` : '—'
                    )}

                    {renderComparisonRow(
                      "Innovation Score",
                      <Lightbulb className="w-5 h-5 text-amber-500" />,
                      (b) => b.innovation_score,
                      (v) => v ? `${v}/100` : '—'
                    )}

                    {renderComparisonRow(
                      "Companies Owned",
                      <Building2 className="w-5 h-5 text-cyan-500" />,
                      (b) => b.companies_owned?.length || 0,
                      (v) => v ? `${v} companies` : '—'
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedBillionaires.length < 2 && (
          <Card className="border-0 shadow-xl">
            <CardContent className="p-12 text-center">
              <ArrowUpDown className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Select Billionaires to Compare</h3>
              <p className="text-gray-500">
                Choose at least 2 billionaires to see a detailed side-by-side comparison
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}