import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  ArrowRight,
  Check,
  Mail
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${createPageUrl("Directory")}?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Email capture mutation
  const submitEmailMutation = useMutation({
    mutationFn: async (emailData) => {
      await base44.integrations.Core.SendEmail({
        to: emailData,
        subject: "Welcome to BiiiG - Complete Your Registration",
        body: `Thank you for joining BiiiG! Click here to complete your registration: ${window.location.origin}${createPageUrl("Directory")}`,
      });
      
      return { success: true };
    },
    onSuccess: () => {
      setSubmitted(true);
      setTimeout(() => {
        setJoinDialogOpen(false);
        setSubmitted(false);
        setEmail("");
      }, 3000);
    },
  });

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      submitEmailMutation.mutate(email);
    }
  };

  // Compact stats - top 6 only, no icons
  const topStats = [
    { value: "$550T", label: "Total Tracked Net Worth", change: "+12.3%" },
    { value: "3,029", label: "Billionaires Tracked", change: "+2.1%" },
    { value: "$68,750", label: "Avg Net Worth If Distributed", note: "550T ÷ 8B people" },
    { value: "38%", label: "Tech Industry Share", change: "+5.2%" },
    { value: "735M", label: "People Starving", change: "-1.8%" },
    { value: "$2.5T", label: "War Spending / Year", change: "+8.4%" },
  ];

  return (
    <div className="min-h-screen bg-[#fffaf5]">
      {/* Tight Hero Section */}
      <section className="px-4 md:px-6 pt-8 pb-6">
        <div className="container mx-auto max-w-5xl text-center">
          {/* Main Headline - Updated with two-line format */}
          <div className="mb-4">
            <h1 className="text-5xl md:text-6xl font-bold text-[#ef6c00] mb-2">
              BiiiG
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-700 leading-tight">
              Big Impact Innovative
              <br />
              Initiatives for Good
            </h2>
          </div>
          
          {/* Updated Tagline */}
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Monitor Initiatives, Innovations, and our Ongoing Collective Impact
          </p>

          {/* Primary JOIN CTA - Very Prominent */}
          <Button 
            onClick={() => setJoinDialogOpen(true)}
            size="lg"
            className="bg-[#ef6c00] hover:bg-[#d66000] text-white px-12 py-6 text-xl font-bold rounded-xl shadow-2xl hover:shadow-3xl mb-8 transition-all"
          >
            <Mail className="w-6 h-6 mr-3" />
            JOIN NOW
          </Button>

          <p className="text-sm text-gray-500 mb-8">
            Join to get notified, track favorites, and help drive change
          </p>

          {/* Compact Search Bar */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-md border border-gray-200">
              <Search className="w-5 h-5 text-gray-400 ml-2" />
              <Input
                type="text"
                placeholder="Search by issue, person, or country"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-0 focus-visible:ring-0 bg-transparent"
              />
              <Button 
                type="submit"
                size="sm"
                className="bg-[#ef6c00] hover:bg-[#d66000] text-white"
              >
                Search
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Above-the-Fold Stats - No Heading, No Icons, Ultra Compact */}
      <section className="px-4 md:px-6 py-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {topStats.map((stat, index) => (
              <Card 
                key={index} 
                className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white"
              >
                <CardContent className="p-4">
                  <div className="text-2xl md:text-3xl font-bold text-[#ef6c00] mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-700 font-medium leading-tight mb-1">
                    {stat.label}
                  </div>
                  {stat.change && (
                    <div className={`text-xs font-semibold ${
                      stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change} YoY
                    </div>
                  )}
                  {stat.note && (
                    <div className="text-xs text-gray-500 mt-1">
                      {stat.note}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Single Compact Bottom Section - Updated text */}
      <section className="px-4 md:px-6 py-12 bg-gradient-to-br from-[#fff3e2] to-[#ffe0c0]">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Track Issues, Drive Change
              </h3>
              <p className="text-gray-700">
                Monitor the people, wealth, and innovations making a difference. Get involved in BiiiG today.
              </p>
            </div>
            <Button 
              onClick={() => setJoinDialogOpen(true)}
              size="lg"
              className="bg-[#ef6c00] hover:bg-[#d66000] text-white px-10 py-6 text-lg font-bold rounded-xl shadow-xl whitespace-nowrap"
            >
              Join Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="px-4 md:px-6 py-8 bg-white border-t">
        <div className="container mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-6 mb-4 text-sm">
            <Link to={createPageUrl("Directory")} className="text-gray-600 hover:text-[#ef6c00]">
              Explore
            </Link>
            <Link to={createPageUrl("Compare")} className="text-gray-600 hover:text-[#ef6c00]">
              Compare
            </Link>
            <Link to={createPageUrl("Watchlist")} className="text-gray-600 hover:text-[#ef6c00]">
              Watchlist
            </Link>
            <a href="#" className="text-gray-600 hover:text-[#ef6c00]">About</a>
            <a href="#" className="text-gray-600 hover:text-[#ef6c00]">Terms</a>
            <a href="#" className="text-gray-600 hover:text-[#ef6c00]">Privacy</a>
          </div>
          <p className="text-gray-500 text-sm">
            © 2025 BiiiG.ca — Big Impact Innovative Initiatives for Good
          </p>
        </div>
      </footer>

      {/* Email Capture Modal */}
      <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#ef6c00]">
              Join BiiiG
            </DialogTitle>
            <DialogDescription>
              Enter your email to get started. We'll send you a link to complete your registration.
            </DialogDescription>
          </DialogHeader>

          {!submitted ? (
            <form onSubmit={handleJoinSubmit} className="space-y-4 py-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2"
                  required
                />
              </div>
              
              <Button 
                type="submit"
                className="w-full bg-[#ef6c00] hover:bg-[#d66000] text-white font-semibold py-3"
                disabled={submitEmailMutation.isPending}
              >
                {submitEmailMutation.isPending ? "Sending..." : "Join Now"}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                By joining, you agree to receive updates from BiiiG. We respect your privacy.
              </p>
            </form>
          ) : (
            <div className="py-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Check Your Email!</h3>
              <p className="text-gray-600">
                We sent an email to <span className="font-semibold">{email}</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Click the link in the email to finish your registration and unlock full features.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}