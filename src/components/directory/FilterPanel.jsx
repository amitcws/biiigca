import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, SlidersHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";

const INDUSTRIES = [
  "Technology",
  "Finance",
  "Real Estate",
  "Retail",
  "Energy",
  "Healthcare",
  "Manufacturing",
  "Media & Entertainment",
  "Telecommunications",
  "Automotive",
  "Fashion",
  "Food & Beverage"
];

const COUNTRIES = [
  "United States",
  "China",
  "India",
  "United Kingdom",
  "Germany",
  "France",
  "Russia",
  "Brazil",
  "Canada",
  "Japan",
  "South Korea",
  "Australia"
];

export default function FilterPanel({ filters, onFilterChange, onClearFilters }) {
  const [netWorthRange, setNetWorthRange] = useState(filters.netWorthRange || [0, 500]);

  const handleNetWorthChange = (value) => {
    setNetWorthRange(value);
    onFilterChange({ netWorthRange: value });
  };

  const activeFilterCount = [
    filters.country,
    filters.industry,
    filters.gender,
    filters.netWorthRange?.[0] > 0 || filters.netWorthRange?.[1] < 500,
    filters.minAge || filters.maxAge,
  ].filter(Boolean).length;

  return (
    <Card className="p-6 bg-white border-0 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-rose-500 rounded-lg">
            <SlidersHorizontal className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Filters</h3>
            {activeFilterCount > 0 && (
              <p className="text-xs text-gray-500">{activeFilterCount} active</p>
            )}
          </div>
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Country Filter */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Country</Label>
          <Select 
            value={filters.country || ""} 
            onValueChange={(value) => onFilterChange({ country: value || null })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Countries</SelectItem>
              {COUNTRIES.map(country => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Industry Filter */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Industry</Label>
          <Select 
            value={filters.industry || ""} 
            onValueChange={(value) => onFilterChange({ industry: value || null })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Industries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Industries</SelectItem>
              {INDUSTRIES.map(industry => (
                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Gender Filter */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Gender</Label>
          <Select 
            value={filters.gender || ""} 
            onValueChange={(value) => onFilterChange({ gender: value || null })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Genders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Genders</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Net Worth Range */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">
            Net Worth Range
          </Label>
          <div className="mb-4">
            <Slider
              value={netWorthRange}
              onValueChange={handleNetWorthChange}
              min={0}
              max={500}
              step={5}
              className="mb-3"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>${netWorthRange[0]}B</span>
              <span>${netWorthRange[1]}B{netWorthRange[1] === 500 ? '+' : ''}</span>
            </div>
          </div>
        </div>

        {/* Age Range */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Age Range</Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input
                type="number"
                placeholder="Min"
                value={filters.minAge || ""}
                onChange={(e) => onFilterChange({ minAge: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full"
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxAge || ""}
                onChange={(e) => onFilterChange({ maxAge: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="pt-4 border-t">
            <Label className="text-sm font-semibold mb-3 block">Active Filters</Label>
            <div className="flex flex-wrap gap-2">
              {filters.country && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  {filters.country}
                  <button
                    onClick={() => onFilterChange({ country: null })}
                    className="ml-2 hover:text-orange-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.industry && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  {filters.industry}
                  <button
                    onClick={() => onFilterChange({ industry: null })}
                    className="ml-2 hover:text-orange-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.gender && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  {filters.gender}
                  <button
                    onClick={() => onFilterChange({ gender: null })}
                    className="ml-2 hover:text-orange-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}