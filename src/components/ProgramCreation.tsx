import React, { useState, useEffect } from 'react';
import { ChevronRight, Save, Eye, Plus, Info, Sparkles, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import RegistrationFormPreview from './RegistrationFormPreview';

interface ProgramType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  defaultSessions: string[];
  defaultDuration: number;
}

interface ProgramData {
  programType: ProgramType | null;
  programName: string;
  selectedSessions: string[];
  mode: 'online' | 'offline' | 'hybrid';
  paymentRequired: boolean;
  sessionSchedules: Record<string, { startDate: string; endDate: string; checkInTime: string; checkOutTime: string }>;
  venueAddress: string;
  selectedVenue: string;
  customVenue: string;
  travelRequired: boolean;
  hdbFee: number;
  msdFee: number;
  refundPolicy: string;
  layoutStyle: 'single-column' | 'two-column' | 'question-by-question';
  userType: 'new' | 'existing';
  formFields: FormField[];
}

interface FormField {
  id: string;
  type: 'text' | 'date' | 'file' | 'dropdown' | 'paragraph';
  label: string;
  mandatory: boolean;
  helperText: string;
  options?: string[];
}

const predefinedVenues = [
  'Leonia Holistic Destination, Bommarasipet, Shamirpet Mandal, Medchal-Malkajgiri District, Hyderabad - 500078',
  'Ramoji Film City, Anajpur, Hayathnagar Mandal, Ranga Reddy District, Hyderabad - 501512',
  'The Westin Hyderabad Mindspace, HITEC City, Madhapur, Hyderabad - 500081',
  'Custom'
];

const programTypes: ProgramType[] = [
  {
    id: 'hdb-msd',
    name: 'HDB / MSD',
    description: '',
    icon: Sparkles,
    defaultSessions: ['HDB 1', 'HDB 2', 'HDB 3', 'MSD 1', 'MSD 2'],
    defaultDuration: 7
  },
  {
    id: 'entrainment',
    name: 'Entrainment',
    description: '',
    icon: Heart,
    defaultSessions: ['ENT1', 'ENT2'],
    defaultDuration: 3
  }
];

const ProgramCreation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showFormPreview, setShowFormPreview] = useState(false);
  const [programData, setProgramData] = useState<ProgramData>({
    programType: null,
    programName: '',
    selectedSessions: [],
    mode: 'online',
    paymentRequired: true, // Pre-selected as true
    sessionSchedules: {},
    venueAddress: 'Leonia Holistic Destination, Bommarasipet, Shamirpet Mandal, Medchal-Malkajgiri District, Hyderabad - 500078',
    selectedVenue: predefinedVenues[0],
    customVenue: '',
    travelRequired: false,
    hdbFee: 0,
    msdFee: 0,
    refundPolicy: '',
    layoutStyle: 'single-column',
    userType: 'new',
    formFields: [
      { id: '1', type: 'text', label: 'Name', mandatory: true, helperText: 'Full legal name' },
      { id: '2', type: 'text', label: 'Email', mandatory: true, helperText: 'Primary contact email' },
      { id: '3', type: 'text', label: 'Phone', mandatory: true, helperText: 'Contact number' },
      { id: '4', type: 'dropdown', label: 'Gender', mandatory: false, helperText: '', options: ['Male', 'Female', 'Other', 'Prefer not to say'] },
      { id: '5', type: 'text', label: 'Age', mandatory: false, helperText: 'Age in years' },
    ]
  });

  const updateProgramData = (updates: Partial<ProgramData>) => {
    setProgramData(prev => ({ ...prev, ...updates }));
  };

  const selectProgramType = (type: ProgramType) => {
    updateProgramData({ 
      programType: type,
      selectedSessions: type.defaultSessions
    });
  };

  const calculateEndDate = (startDate: string, sessionType: string) => {
    if (!startDate || !programData.programType) return '';
    const start = new Date(startDate);
    const duration = programData.programType.defaultDuration;
    const end = new Date(start);
    end.setDate(start.getDate() + duration);
    return end.toISOString().split('T')[0];
  };

  const calculateCheckOutTime = (checkInTime: string) => {
    if (!checkInTime) return '';
    const [hours, minutes] = checkInTime.split(':').map(Number);
    const checkInDate = new Date();
    checkInDate.setHours(hours, minutes, 0, 0);
    
    // Add 6 hours
    const checkOutDate = new Date(checkInDate.getTime() + 6 * 60 * 60 * 1000);
    
    return checkOutDate.toTimeString().slice(0, 5);
  };

  const handleVenueChange = (value: string) => {
    updateProgramData({ 
      selectedVenue: value,
      venueAddress: value === 'Custom' ? programData.customVenue : value
    });
  };

  const handleCustomVenueChange = (value: string) => {
    updateProgramData({ 
      customVenue: value,
      venueAddress: value
    });
  };

  const addFormField = (type: FormField['type']) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type,
      label: `New ${type} field`,
      mandatory: false,
      helperText: '',
      options: type === 'dropdown' ? ['Option 1', 'Option 2'] : undefined
    };
    updateProgramData({
      formFields: [...programData.formFields, newField]
    });
  };

  const updateFormField = (id: string, updates: Partial<FormField>) => {
    updateProgramData({
      formFields: programData.formFields.map(field => 
        field.id === id ? { ...field, ...updates } : field
      )
    });
  };

  if (showFormPreview) {
    return (
      <RegistrationFormPreview
        programData={programData}
        onBack={() => setShowFormPreview(false)}
        onProceed={() => {
          console.log('Proceeding with form as-is');
        }}
        onEditForm={() => {
          setShowFormPreview(false);
          setCurrentStep(4);
        }}
      />
    );
  }

  // Page 1: Program Type Selection (Standalone)
  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-orange-50/30">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-stone-200/50 px-6 py-3 shadow-sm" style={{ height: '50px' }}>
          <div className="max-w-[1200px] mx-auto flex items-center h-full" style={{ paddingLeft: '10px' }}>
            <h1 className="text-2xl font-light text-stone-800">Program Creation</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {programTypes.map((type) => {
              const IconComponent = type.icon;
              const isSelected = programData.programType?.id === type.id;
              return (
                <Card 
                  key={type.id} 
                  className={cn(
                    "cursor-pointer border-stone-200/50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg group bg-gradient-to-br from-white to-stone-50/50",
                    isSelected && "border-orange-300 bg-orange-50/50 shadow-lg"
                  )}
                  onClick={() => selectProgramType(type)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={cn(
                      "w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center transition-transform duration-300",
                      isSelected ? "scale-110" : "group-hover:scale-110"
                    )}>
                      <IconComponent className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-medium text-stone-800">{type.name}</h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-stone-200/50 px-6 py-4 shadow-lg">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              className="text-stone-600 hover:text-stone-800 hover:bg-stone-50 rounded-2xl"
            >
              <Save className="w-4 h-4 mr-2" />
              Save as Draft
            </Button>

            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setCurrentStep(1)}
                disabled={!programData.programType}
                className="bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 rounded-2xl text-white shadow-lg"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pages 2-3: Program Basics and Schedule & Logistics with Stepper
  if (currentStep === 1 || currentStep === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-orange-50/30">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-stone-200/50 px-6 py-3 shadow-sm" style={{ height: '66px' }}>
          <div className="max-w-[1200px] mx-auto flex items-center h-full" style={{ paddingLeft: '10px' }}>
            <h1 className="text-2xl font-light text-stone-800">Program Creation</h1>
          </div>
        </div>

        <div className="flex" style={{ marginTop: '66px', paddingBottom: '80px' }}>
          {/* Left Vertical Stepper */}
          <div className="w-64 bg-white/80 backdrop-blur-sm border-r border-stone-200/30 fixed left-0 top-16 bottom-20 p-6">
            <div className="space-y-6">
              <div 
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all",
                  currentStep === 1 ? "bg-orange-100 text-orange-800" : "text-stone-600 hover:bg-stone-50"
                )}
                onClick={() => setCurrentStep(1)}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  currentStep === 1 ? "bg-orange-500 text-white" : "bg-stone-200 text-stone-600"
                )}>
                  1
                </div>
                <span className="font-medium">Program Basics</span>
              </div>
              
              <div 
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all",
                  currentStep === 2 ? "bg-orange-100 text-orange-800" : "text-stone-600 hover:bg-stone-50"
                )}
                onClick={() => setCurrentStep(2)}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  currentStep === 2 ? "bg-orange-500 text-white" : "bg-stone-200 text-stone-600"
                )}>
                  2
                </div>
                <span className="font-medium">Schedule & Logistics</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 ml-64">
            <div className="max-w-[1200px] mx-auto px-6 py-8">
              
              {/* Page 2: Program Basics */}
              {currentStep === 1 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-stone-200/30 overflow-hidden p-8 animate-fade-in">
                  
                  {/* Banner Section */}
                  {programData.programType && (
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-200/50 mb-8">
                      <p className="text-stone-800 font-medium">
                        You've selected {programData.programType?.name}
                      </p>
                    </div>
                  )}

                  <div className="space-y-8">
                    <div className="space-y-2">
                      <Label htmlFor="programName" className="text-stone-800 font-medium">Program Name *</Label>
                      <Input
                        id="programName"
                        value={programData.programName}
                        onChange={(e) => updateProgramData({ programName: e.target.value })}
                        className="rounded-2xl border-stone-200 focus:border-orange-300 focus:ring-orange-300/20 bg-white/80"
                        placeholder="Enter program name"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label className="text-stone-800 font-medium">Sessions</Label>
                      <div className="grid grid-cols-2 gap-4">
                        {programData.programType?.defaultSessions.map((session) => (
                          <div key={session} className="flex items-center space-x-3 bg-stone-50/50 rounded-2xl p-4 border border-stone-200/50">
                            <Checkbox
                              id={session}
                              checked={programData.selectedSessions.includes(session)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  updateProgramData({
                                    selectedSessions: [...programData.selectedSessions, session]
                                  });
                                } else {
                                  updateProgramData({
                                    selectedSessions: programData.selectedSessions.filter(s => s !== session)
                                  });
                                }
                              }}
                              className="border-orange-300 data-[state=checked]:bg-orange-500"
                            />
                            <Label htmlFor={session} className="text-stone-800 font-medium">{session}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-stone-800 font-medium">Mode of Program</Label>
                      <RadioGroup
                        value={programData.mode}
                        onValueChange={(value: 'online' | 'offline' | 'hybrid') => updateProgramData({ mode: value })}
                        className="flex space-x-8"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="online" id="online" className="border-orange-300 text-orange-600" />
                          <Label htmlFor="online" className="text-stone-800">Online</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="offline" id="offline" className="border-orange-300 text-orange-600" />
                          <Label htmlFor="offline" className="text-stone-800">Offline</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="hybrid" id="hybrid" className="border-orange-300 text-orange-600" />
                          <Label htmlFor="hybrid" className="text-stone-800">Hybrid</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="flex items-center justify-between bg-stone-50/50 rounded-2xl p-4 border border-stone-200/50">
                      <div>
                        <Label className="text-stone-800 font-medium">Is Payment Required?</Label>
                        <p className="text-sm text-stone-600">Enable if fees are required for this program</p>
                      </div>
                      <Switch
                        checked={programData.paymentRequired}
                        onCheckedChange={(checked) => updateProgramData({ paymentRequired: checked })}
                        className="data-[state=checked]:bg-orange-500"
                      />
                    </div>

                    {programData.paymentRequired && (
                      <div className="space-y-6 bg-orange-50/30 rounded-2xl p-6 border border-orange-200/50">
                        <h4 className="text-lg font-medium text-stone-800">Payment Configuration</h4>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="hdbFee" className="text-stone-800 font-medium">HDB Fee (₹)</Label>
                            <Input
                              id="hdbFee"
                              type="number"
                              value={programData.hdbFee}
                              onChange={(e) => updateProgramData({ hdbFee: Number(e.target.value) })}
                              className="rounded-2xl border-stone-200 focus:border-orange-300 focus:ring-orange-300/20 bg-white/80"
                              placeholder="Enter HDB fee amount"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="msdFee" className="text-stone-800 font-medium">MSD Fee (₹)</Label>
                            <Input
                              id="msdFee"
                              type="number"
                              value={programData.msdFee}
                              onChange={(e) => updateProgramData({ msdFee: Number(e.target.value) })}
                              className="rounded-2xl border-stone-200 focus:border-orange-300 focus:ring-orange-300/20 bg-white/80"
                              placeholder="Enter MSD fee amount"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Page 3: Schedule & Logistics */}
              {currentStep === 2 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-stone-200/30 overflow-hidden p-8 animate-fade-in">
                  <div className="space-y-8">
                    
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-stone-800">Session Scheduler</h3>
                      {programData.selectedSessions.map((session) => (
                        <Card key={session} className="border-stone-200/50 bg-stone-50/30">
                          <CardContent className="p-6">
                            <h4 className="font-medium text-stone-800 mb-4">{session}</h4>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="space-y-2">
                                <Label className="text-stone-800">Start Date</Label>
                                <Input
                                  type="date"
                                  value={programData.sessionSchedules[session]?.startDate || ''}
                                  onChange={(e) => {
                                    const startDate = e.target.value;
                                    const endDate = calculateEndDate(startDate, session);
                                    updateProgramData({
                                      sessionSchedules: {
                                        ...programData.sessionSchedules,
                                        [session]: { 
                                          ...programData.sessionSchedules[session],
                                          startDate, 
                                          endDate 
                                        }
                                      }
                                    });
                                  }}
                                  className="rounded-2xl border-stone-200 bg-white/80"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-stone-800 flex items-center gap-2">
                                  End Date
                                  <Info className="w-4 h-4 text-stone-500" />
                                </Label>
                                <Input
                                  type="date"
                                  value={programData.sessionSchedules[session]?.endDate || ''}
                                  disabled
                                  className="rounded-2xl border-stone-200 bg-stone-50"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-stone-800">Check-in Time</Label>
                                <Input
                                  type="time"
                                  value={programData.sessionSchedules[session]?.checkInTime || ''}
                                  onChange={(e) => {
                                    const checkInTime = e.target.value;
                                    const checkOutTime = calculateCheckOutTime(checkInTime);
                                    updateProgramData({
                                      sessionSchedules: {
                                        ...programData.sessionSchedules,
                                        [session]: { 
                                          ...programData.sessionSchedules[session],
                                          checkInTime, 
                                          checkOutTime 
                                        }
                                      }
                                    });
                                  }}
                                  className="rounded-2xl border-stone-200 bg-white/80"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-stone-800 flex items-center gap-2">
                                  Check-out Time
                                  <Info className="w-4 h-4 text-stone-500" />
                                </Label>
                                <Input
                                  type="time"
                                  value={programData.sessionSchedules[session]?.checkOutTime || ''}
                                  disabled
                                  className="rounded-2xl border-stone-200 bg-stone-50"
                                />
                                <p className="text-xs text-stone-500">Auto-calculated (6 hours after check-in)</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {(programData.mode === 'offline' || programData.mode === 'hybrid') && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label className="text-stone-800 font-medium">Venue Address</Label>
                          <Select value={programData.selectedVenue} onValueChange={handleVenueChange}>
                            <SelectTrigger className="rounded-2xl border-stone-200 bg-white/80">
                              <SelectValue placeholder="Select venue" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-stone-200 shadow-lg rounded-xl z-50">
                              {predefinedVenues.map((venue) => (
                                <SelectItem key={venue} value={venue} className="hover:bg-stone-50">
                                  {venue === 'Custom' ? 'Custom Address' : venue}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          {programData.selectedVenue === 'Custom' && (
                            <Textarea
                              value={programData.customVenue}
                              onChange={(e) => handleCustomVenueChange(e.target.value)}
                              className="rounded-2xl border-stone-200 bg-white/80 mt-2"
                              placeholder="Enter custom venue address"
                              rows={3}
                            />
                          )}
                        </div>

                        <div className="flex items-center justify-between bg-stone-50/50 rounded-2xl p-4 border border-stone-200/50">
                          <div>
                            <Label className="text-stone-800 font-medium">Is Travel Required?</Label>
                            <p className="text-sm text-stone-600">Enable if transportation is needed</p>
                          </div>
                          <Switch
                            checked={programData.travelRequired}
                            onCheckedChange={(checked) => updateProgramData({ travelRequired: checked })}
                            className="data-[state=checked]:bg-orange-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-stone-200/50 px-6 py-4 shadow-lg">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              className="text-stone-600 hover:text-stone-800 hover:bg-stone-50 rounded-2xl"
            >
              <Save className="w-4 h-4 mr-2" />
              Save as Draft
            </Button>

            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setCurrentStep(currentStep - 1)}
                variant="outline"
                className="rounded-2xl border-stone-300 text-stone-700 hover:bg-stone-50"
              >
                Back
              </Button>
              {currentStep === 1 ? (
                <Button
                  onClick={() => setCurrentStep(2)}
                  className="bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 rounded-2xl text-white shadow-lg"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentStep(3)}
                  className="bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 rounded-2xl text-white shadow-lg"
                >
                  Continue to Layout & Settings
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Steps 3 and 4 remain unchanged
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-orange-50/30">
      {/* Header with Progress */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-stone-200/50 px-6 py-3 shadow-sm" style={{ height: '66px' }}>
        <div className="max-w-5xl mx-auto flex items-center" style={{ paddingLeft: '10px' }}>
          <h1 className="text-2xl font-light text-stone-800">
            {currentStep === 3 ? 'Registration Layout & Settings' : 'Registration Form Builder'}
          </h1>
        </div>
      </div>

      {/* Main Content for Steps 3-4 */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-stone-200/30 overflow-hidden">
          <div className="p-8">
            
            {/* Step 3: Registration Layout & Settings */}
            {currentStep === 3 && (
              <div className="space-y-8 animate-fade-in">
                
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-stone-800">Choose Registration Layout</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'single-column', name: 'Single Column', description: 'Traditional stacked form layout' },
                      { id: 'two-column', name: 'Two Column', description: 'Personal info on left, other details on right' },
                      { id: 'question-by-question', name: 'Question-by-Question', description: 'Progressive form with one question at a time' }
                    ].map((layout) => (
                      <Card 
                        key={layout.id}
                        className={cn(
                          "cursor-pointer border-stone-200/50 transition-all duration-300 hover:shadow-lg",
                          programData.layoutStyle === layout.id ? "border-orange-300 bg-orange-50/50" : "hover:border-orange-200"
                        )}
                        onClick={() => updateProgramData({ layoutStyle: layout.id as any })}
                      >
                        <CardContent className="p-6 text-center">
                          <h4 className="font-medium text-stone-800 mb-2">{layout.name}</h4>
                          <p className="text-sm text-stone-600">{layout.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-stone-800">Choose User Context</h3>
                  <RadioGroup
                    value={programData.userType}
                    onValueChange={(value: 'new' | 'existing') => updateProgramData({ userType: value })}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-3 bg-stone-50/50 rounded-2xl p-4 border border-stone-200/50">
                      <RadioGroupItem value="new" id="new-user" className="border-orange-300 text-orange-600" />
                      <div>
                        <Label htmlFor="new-user" className="text-stone-800 font-medium">New User</Label>
                        <p className="text-sm text-stone-600">Show blank form for first-time participants</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 bg-stone-50/50 rounded-2xl p-4 border border-stone-200/50">
                      <RadioGroupItem value="existing" id="existing-user" className="border-orange-300 text-orange-600" />
                      <div>
                        <Label htmlFor="existing-user" className="text-stone-800 font-medium">Existing User</Label>
                        <p className="text-sm text-stone-600">Prefill known fields like name, email, contact</p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Step 4: Registration Form Builder */}
            {currentStep === 4 && (
              <div className="space-y-8 animate-fade-in">
                
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-stone-800">Registration Form Builder</h3>
                  <Button
                    onClick={() => setShowFormPreview(true)}
                    variant="outline"
                    className="rounded-2xl border-orange-200 text-orange-700 hover:bg-orange-50"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Form
                  </Button>
                </div>

                <div className="space-y-4">
                  {programData.formFields.map((field) => (
                    <Card key={field.id} className="border-stone-200/50 bg-stone-50/30">
                      <CardContent className="p-6">
                        <div className="grid grid-cols-3 gap-4 items-start">
                          <div className="space-y-2">
                            <Label className="text-stone-800">Field Label</Label>
                            <Input
                              value={field.label}
                              onChange={(e) => updateFormField(field.id, { label: e.target.value })}
                              className="rounded-2xl border-stone-200 bg-white/80"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-stone-800">Helper Text</Label>
                            <Input
                              value={field.helperText}
                              onChange={(e) => updateFormField(field.id, { helperText: e.target.value })}
                              className="rounded-2xl border-stone-200 bg-white/80"
                              placeholder="Optional helper text"
                            />
                          </div>
                          <div className="flex items-center justify-between pt-6">
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={field.mandatory}
                                onCheckedChange={(checked) => updateFormField(field.id, { mandatory: checked })}
                                className="data-[state=checked]:bg-orange-500"
                              />
                              <Label className="text-stone-800 text-sm">Mandatory</Label>
                            </div>
                            <span className="text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded-full">
                              {field.type}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex items-center space-x-4">
                  <Select onValueChange={(value) => addFormField(value as FormField['type'])}>
                    <SelectTrigger className="w-48 rounded-2xl border-orange-200 bg-white/80">
                      <Plus className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Add New Field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text Field</SelectItem>
                      <SelectItem value="date">Date Field</SelectItem>
                      <SelectItem value="file">File Upload</SelectItem>
                      <SelectItem value="dropdown">Dropdown</SelectItem>
                      <SelectItem value="paragraph">Paragraph</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Footer Navigation for Steps 3-4 */}
          <div className="bg-gradient-to-r from-stone-50 to-orange-50/50 px-8 py-6 border-t border-stone-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setCurrentStep(currentStep === 3 ? 2 : currentStep - 1)}
                  variant="outline"
                  className="rounded-2xl border-stone-300 text-stone-700 hover:bg-stone-50"
                >
                  Back
                </Button>
                <Button
                  variant="ghost"
                  className="text-stone-600 hover:text-stone-800 hover:bg-stone-50 rounded-2xl"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
              </div>

              <div>
                {currentStep === 3 ? (
                  <Button
                    onClick={() => setCurrentStep(4)}
                    className="bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 rounded-2xl text-white shadow-lg"
                  >
                    Continue to Form Builder
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-2xl text-white shadow-lg">
                    Save & Publish Program
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramCreation;
