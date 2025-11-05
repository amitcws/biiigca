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
  // const topStats = [
  //   { value: "$550T", label: "Total Tracked Net Worth", change: "+12.3%" },
  //   { value: "3,029", label: "Billionaires Tracked", change: "+2.1%" },
  //   { value: "$68,750", label: "Avg Net Worth If Distributed", note: "550T ÷ 8B people" },
  //   { value: "38%", label: "Tech Industry Share", change: "+5.2%" },
  //   { value: "735M", label: "People Starving", change: "-1.8%" },
  //   { value: "$2.5T", label: "War Spending / Year", change: "+8.4%" },
  // ];

  const stats = [
    // Row 1: 5 columns (lg)
    { value: "3029", label: "Billionaires", row: 1 },
    { value: "735 Million", label: "Starving", row: 1 },
    { value: "2.2 Billion", label: "With no clean water", row: 1 },
    { value: "4.25 Billion", label: "Without healthcare", row: 1 },
    { value: "12,100", label: "Nuclear weapons", row: 1 },

    // Row 2: 4 columns (md)
    { value: "2.5 Trillion", label: "$ spent on war / yr", row: 2 },
    { value: "55 Billion", label: "Factory farm animals", row: 2 },
    { value: "43 Million", label: "Global refugees", row: 2 },
    { value: "$20 Trillion $", label: "Total global wealth", row: 2 },

    // Row 3: 3 columns (md), multi-line
    { value: "-11%", label: ["10 year climate", "change progress"], row: 3 },
    { value: "-7.5%", label: ["10 year progress", "on biodiversity"], row: 3 },
    { value: "5", label: "Involved in BiiiG", row: 3 },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-6 text-center">
        <h1 className="text-2xl md:text-4xl font-medium text-gray-700 mb-2">
          Big Impact Innovative Initiatives for Good
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-4">
          Ideate, initiate, innovate and reiterate
        </p>

        {/* First JOIN NOW Button */}
        <button
          onClick={() => setJoinDialogOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 mb-2 inline-flex items-center gap-2"
        >
          <i className="fas fa-envelope" />
          JOIN NOW
        </button>
        <p className="text-sm text-gray-500 mb-6">
          Join to get notified, track favorites, and help drive change
        </p>

        {/* Mission Statement */}
        <div className="max-w-3xl mx-auto mb-6">
          <p className="text-lg md:text-xl text-gray-800">
            To get the fastest results to world issues, we need to attract smart,
          </p>
          <p className="text-lg md:text-xl text-gray-800">
            action oriented, problem solving people who simply think differently.
          </p>
          <p className="text-2xl font-semibold text-gray-800 mb-6">We do!</p>
        </div>

        {/* Payment Info */}
        <div className="max-w-3xl mx-auto mb-6">
          <p className="text-base md:text-lg text-gray-800">
            <span className="font-bold underline">Here are just some ways:</span>{" "}
            BiiiG PAYS You $1 to JOIN! (via PayPal instantly)
          </p>
          <p className="text-base md:text-lg text-gray-800">
            We pay you with increasing frequency every time you achieve fast simple milestones
          </p>
          <p className="text-base md:text-lg text-gray-800 mb-4">
            that make a difference.
          </p>

          {/* Second JOIN NOW Button */}
          <button
            onClick={() => setJoinDialogOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 mb-8 inline-flex items-center gap-2"
          >
            <i className="fas fa-envelope" />
            JOIN NOW
          </button>
        </div>

        {/* Track Statement */}
        <p className="text-base md:text-lg text-gray-800 mb-4">
          Track issues, Wealth, industries, people, and impact. Discover who is shaping solutions.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by issue, country, person, or anything else"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-24 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-green-200 focus:ring-2 focus:ring-green-200 focus:ring-opacity-50"
            />
            <Button
              type="submit"
              className="absolute right-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300"
            >
              Search
            </Button>
          </div>
        </form>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 pb-12">
        {[1, 2, 3].map((row) => {
          const rowStats = stats.filter((s) => s.row === row);
          const isLastRow = row === 3;

          const gridClasses = isLastRow
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto"
            : row === 1
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4"
            : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4";

          return (
            <div key={row} className={gridClasses}>
              {rowStats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white border-2 border-green-500 rounded-lg p-4 text-center"
                >
                  <p className="text-2xl md:text-3xl font-bold text-secondary mb-1">
                    {stat.value}
                  </p>
                  {Array.isArray(stat.label) ? (
                    stat.label.map((line, i) => (
                      <p key={i} className="text-sm text-textColor">
                        {line}
                      </p>
                    ))
                  ) : (
                    <p className="text-sm text-textColor">{stat.label}</p>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </section>

      {/* Partners Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-xl mx-auto">
          <div className="mb-8">
            <img
              src="images/biig_partnership_structure2.png"
              alt="BiiiG Partnership Structure"
              className="w-full max-w-lg mx-auto"
            />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-secondary mb-2">BiiiG useful links</h3>
            <ul>
              <li>
                <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors duration-300 text-lg font-semibold">
                  our business outline
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors duration-300 text-lg font-semibold">
                  our financial modelling
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors duration-300 text-lg font-semibold">
                  our partner modelling <b className="text-black">(local, regional, national)</b>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Pre-Footer Navigation */}
      <section className="bg-gray-50 py-8 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <nav className="mb-4">
            <ul className="flex flex-wrap justify-center items-center gap-6 text-gray-600">
              <li>
                <a href="#" className="hover:text-green-600 transition-colors duration-300">About</a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600 transition-colors duration-300">Terms</a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600 transition-colors duration-300">Privacy</a>
              </li>
            </ul>
          </nav>
          <p className="text-center text-gray-600 text-sm">
            © 2025 BiiiG.ca — Big Impact Innovative Initiatives for Good
          </p>
        </div>
      </section>

      {/* Email Capture Modal */}
      <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-green-600">Join BiiiG</DialogTitle>
            <DialogDescription>
              Enter your email to get started. We'll send you $1 via PayPal + a link to complete registration.
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
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
                disabled={submitEmailMutation.isPending}
              >
                {submitEmailMutation.isPending ? "Sending..." : "Join Now & Get $1"}
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
                Click the link to finish registration and claim your $1 PayPal reward.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}