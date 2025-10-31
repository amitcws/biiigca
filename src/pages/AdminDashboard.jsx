import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X,
  AlertCircle,
  Users,
  DollarSign
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingBillionaire, setEditingBillionaire] = useState(null);
  const [newBillionaire, setNewBillionaire] = useState({
    full_name: '',
    net_worth: 0,
    country: '',
    source_of_wealth: '',
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  // Fetch billionaires
  const { data: billionaires = [], isLoading: billionairesLoading } = useQuery({
    queryKey: ['billionaires'],
    queryFn: () => base44.entities.Billionaire.list(),
  });

  // Fetch edit suggestions
  const { data: suggestions = [], isLoading: suggestionsLoading } = useQuery({
    queryKey: ['suggestions'],
    queryFn: () => base44.entities.EditSuggestion.list('-created_date'),
  });

  // Create billionaire
  const createBillionaireMutation = useMutation({
    mutationFn: (data) => base44.entities.Billionaire.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['billionaires']);
      setAddDialogOpen(false);
      setNewBillionaire({ full_name: '', net_worth: 0, country: '', source_of_wealth: '' });
    },
  });

  // Update billionaire
  const updateBillionaireMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Billionaire.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['billionaires']);
      setEditingBillionaire(null);
    },
  });

  // Delete billionaire
  const deleteBillionaireMutation = useMutation({
    mutationFn: (id) => base44.entities.Billionaire.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['billionaires']);
    },
  });

  // Moderate suggestion
  const moderateSuggestionMutation = useMutation({
    mutationFn: ({ id, status, notes }) => 
      base44.entities.EditSuggestion.update(id, { status, moderator_notes: notes }),
    onSuccess: () => {
      queryClient.invalidateQueries(['suggestions']);
    },
  });

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-0 shadow-2xl">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-100 to-rose-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              You need admin privileges to access this dashboard
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingSuggestions = suggestions.filter(s => s.status === 'pending');

  return (
    <div className="min-h-screen pb-12">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-100 via-rose-100 to-amber-100 py-20 px-4 md:px-6">
        <div className="container mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-rose-500 rounded-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Manage billionaires and moderate submissions</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold">{billionaires.length}</p>
                    <p className="text-xs text-gray-500">Total Billionaires</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">
                      ${billionaires.reduce((sum, b) => sum + (b.net_worth || 0), 0).toFixed(1)}T
                    </p>
                    <p className="text-xs text-gray-500">Total Wealth</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-8 h-8 text-amber-500" />
                  <div>
                    <p className="text-2xl font-bold">{pendingSuggestions.length}</p>
                    <p className="text-xs text-gray-500">Pending Edits</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Check className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">
                      {suggestions.filter(s => s.status === 'approved').length}
                    </p>
                    <p className="text-xs text-gray-500">Approved Edits</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-12">
        <Tabs defaultValue="billionaires" className="space-y-8">
          <TabsList className="bg-white shadow-lg p-2 rounded-xl">
            <TabsTrigger value="billionaires" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-rose-500 data-[state=active]:text-white">
              Manage Billionaires
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-rose-500 data-[state=active]:text-white">
              Edit Suggestions ({pendingSuggestions.length})
            </TabsTrigger>
          </TabsList>

          {/* Billionaires Management */}
          <TabsContent value="billionaires">
            <Card className="border-0 shadow-xl">
              <CardHeader className="border-b flex flex-row items-center justify-between">
                <CardTitle>All Billionaires</CardTitle>
                <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-orange-500 to-rose-500 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Billionaire
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Billionaire</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Full Name *</Label>
                          <Input
                            value={newBillionaire.full_name}
                            onChange={(e) => setNewBillionaire({...newBillionaire, full_name: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Net Worth (Billions USD) *</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={newBillionaire.net_worth}
                            onChange={(e) => setNewBillionaire({...newBillionaire, net_worth: parseFloat(e.target.value)})}
                          />
                        </div>
                        <div>
                          <Label>Country *</Label>
                          <Input
                            value={newBillionaire.country}
                            onChange={(e) => setNewBillionaire({...newBillionaire, country: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Country Code (e.g., US)</Label>
                          <Input
                            value={newBillionaire.country_code || ''}
                            onChange={(e) => setNewBillionaire({...newBillionaire, country_code: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Source of Wealth</Label>
                          <Input
                            value={newBillionaire.source_of_wealth}
                            onChange={(e) => setNewBillionaire({...newBillionaire, source_of_wealth: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Age</Label>
                          <Input
                            type="number"
                            value={newBillionaire.age || ''}
                            onChange={(e) => setNewBillionaire({...newBillionaire, age: parseInt(e.target.value)})}
                          />
                        </div>
                        <div>
                          <Label>Portrait URL</Label>
                          <Input
                            value={newBillionaire.portrait_url || ''}
                            onChange={(e) => setNewBillionaire({...newBillionaire, portrait_url: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Gender</Label>
                          <Select
                            value={newBillionaire.gender || ''}
                            onValueChange={(value) => setNewBillionaire({...newBillionaire, gender: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>Biography</Label>
                        <Textarea
                          value={newBillionaire.biography || ''}
                          onChange={(e) => setNewBillionaire({...newBillionaire, biography: e.target.value})}
                          rows={4}
                        />
                      </div>
                      <Button
                        onClick={() => createBillionaireMutation.mutate(newBillionaire)}
                        className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white"
                        disabled={!newBillionaire.full_name || !newBillionaire.net_worth || !newBillionaire.country}
                      >
                        Create Billionaire
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Net Worth</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {billionaires.map((billionaire) => (
                      <TableRow key={billionaire.id}>
                        <TableCell className="font-medium">{billionaire.full_name}</TableCell>
                        <TableCell>${billionaire.net_worth?.toFixed(1)}B</TableCell>
                        <TableCell>{billionaire.country}</TableCell>
                        <TableCell className="max-w-xs truncate">{billionaire.source_of_wealth}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingBillionaire(billionaire)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this billionaire?')) {
                                  deleteBillionaireMutation.mutate(billionaire.id);
                                }
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Edit Suggestions */}
          <TabsContent value="suggestions">
            <Card className="border-0 shadow-xl">
              <CardHeader className="border-b">
                <CardTitle>User-Submitted Edit Suggestions</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {suggestions.length === 0 ? (
                  <div className="text-center py-12">
                    <Check className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No edit suggestions yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {suggestions.map((suggestion) => (
                      <Card key={suggestion.id} className="border">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h4 className="font-bold text-lg mb-2">{suggestion.billionaire_name}</h4>
                              <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-500">Field:</p>
                                  <p className="font-semibold">{suggestion.field_name}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Current Value:</p>
                                  <p className="font-semibold">{suggestion.current_value || '(empty)'}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Suggested Value:</p>
                                  <p className="font-semibold text-orange-600">{suggestion.suggested_value}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Submitted by:</p>
                                  <p className="font-semibold">{suggestion.submitter_email}</p>
                                </div>
                              </div>
                              {suggestion.reason && (
                                <div className="mt-3">
                                  <p className="text-gray-500 text-sm">Reason:</p>
                                  <p className="text-sm">{suggestion.reason}</p>
                                </div>
                              )}
                              {suggestion.source_url && (
                                <div className="mt-2">
                                  <a 
                                    href={suggestion.source_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:underline"
                                  >
                                    View Source
                                  </a>
                                </div>
                              )}
                            </div>
                            <Badge
                              className={
                                suggestion.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                suggestion.status === 'approved' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }
                            >
                              {suggestion.status}
                            </Badge>
                          </div>
                          {suggestion.status === 'pending' && (
                            <div className="flex gap-3 pt-4 border-t">
                              <Button
                                onClick={() => moderateSuggestionMutation.mutate({
                                  id: suggestion.id,
                                  status: 'approved',
                                  notes: 'Approved by admin'
                                })}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                              >
                                <Check className="w-4 h-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                onClick={() => moderateSuggestionMutation.mutate({
                                  id: suggestion.id,
                                  status: 'rejected',
                                  notes: 'Rejected by admin'
                                })}
                                variant="outline"
                                className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}