import React, { useState, useEffect } from 'react';
import { ChevronRight, Save, Eye, Plus, Info, Sparkles, Heart, CheckCircle, Edit, Home, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import RegistrationFormPreview from './RegistrationFormPreview';
import PreviewUserForm from './PreviewUserForm';

interface ProgramType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  defaultSessions: string[];
  defaultDuration: number;
}

interface ValidationRule {
  id: string;
  name: string;
  description: string;
}

interface FormField {
  id: string;
  type: 'text' | 'date' | 'file' | 'dropdown' | 'paragraph';
  label: string;
  mandatory: boolean;
  helperText: string;
  options?: string[];
  validationRules: string[];
  expanded?: boolean;
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
  approvalRequired: boolean;
  registrationStartDate: string;
  registrationStartTime: string;
  registrationEndDate: string;
  registrationEndTime: string;
  seatLimitEnabled: boolean;
  maxSeats: number;
}

const predefinedVenues = [
  'Leonia Holistic Destination, Bommarasipet, Shamirpet Mandal, Medchal-Malkajgiri District, Hyderabad - 500078',
  'Ramoji Film City, Anajpur, Hayathnagar Mandal, Ranga Reddy District, Hyderabad - 501512',
  'The Westin Hyderabad Mindspace, HITEC City, Madhapur, Hyderabad - 500081',
  'Custom'
];

const validationRules: ValidationRule[] = [
  { id: 'text-only', name: 'Text only', description: 'Letters and spaces only' },
  { id: 'number-only', name: 'Number only', description: 'Integers or decimals only' },
  { id: 'email-format', name: 'Email format', description: 'Valid email address format' },
  { id: 'phone-format', name: 'Phone number', description: 'Valid phone number format' },
  { id: 'date-format', name: 'Date format', description: 'DD/MM/YYYY format' },
  { id: 'file-types', name: 'File validation', description: 'JPG, PNG, PDF formats only' },
  { id: 'min-length', name: 'Minimum length', description: 'Minimum character count' },
  { id: 'max-length', name: 'Maximum length', description: 'Maximum character count' }
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
  },
  {
    id: 'tat-online',
    name: 'TAT - Online',
    description: '',
    icon: Sparkles,
    defaultSessions: ['TAT Online 1', 'TAT Online 2'],
    defaultDuration: 5
  },
  {
    id: 'tat-offline',
    name: 'TAT - Offline',
    description: '',
    icon: Heart,
    defaultSessions: ['TAT Offline 1', 'TAT Offline 2'],
    defaultDuration: 5
  },
  {
    id: 'infinipath',
    name: 'infinipath',
    description: '',
    icon: Sparkles,
    defaultSessions: ['Infinipath 1', 'Infinipath 2'],
    defaultDuration: 4
  }
];

const ProgramCreation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showFormPreview, setShowFormPreview] = useState(false);
  const [programData, setProgramData] = useState<ProgramData>({
    programType: null,
    programName: 'HDB-25',
    selectedSessions: [],
    mode: 'online',
    paymentRequired: true,
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
      { 
        id: '1', 
        type: 'text', 
        label: 'Full Name', 
        mandatory: true, 
        helperText: 'Please enter your full legal name', 
        validationRules: ['text-only'],
        expanded: false 
      },
      { 
        id: '2', 
        type: 'text', 
        label: 'Email Address', 
        mandatory: true, 
        helperText: 'Primary contact email address', 
        validationRules: ['email-format'],
        expanded: false 
      },
      { 
        id: '3', 
        type: 'text', 
        label: 'Phone Number', 
        mandatory: true, 
        helperText: 'Contact number with country code', 
        validationRules: ['phone-format'],
        expanded: false 
      },
      { 
        id: '4', 
        type: 'dropdown', 
        label: 'Gender', 
        mandatory: false, 
        helperText: '', 
        options: ['Male', 'Female', 'Other', 'Prefer not to say'],
        validationRules: [],
        expanded: false 
      },
      { 
        id: '5', 
        type: 'text', 
        label: 'Age', 
        mandatory: false, 
        helperText: 'Age in years', 
        validationRules: ['number-only'],
        expanded: false 
      },
    ],
    approvalRequired: false,
    registrationStartDate: '',
    registrationStartTime: '',
    registrationEndDate: '',
    registrationEndTime: '',
    seatLimitEnabled: false,
    maxSeats: 0
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
      options: type === 'dropdown' ? ['Option 1', 'Option 2'] : undefined,
      validationRules: [],
      expanded: true
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

  const deleteFormField = (id: string) => {
    updateProgramData({
      formFields: programData.formFields.filter(field => field.id !== id)
    });
  };

  const toggleFieldExpansion = (id: string) => {
    updateFormField(id, { expanded: !programData.formFields.find(f => f.id === id)?.expanded });
  };

  const addValidationRule = (fieldId: string, ruleId: string) => {
    const field = programData.formFields.find(f => f.id === fieldId);
    if (field && !field.validationRules.includes(ruleId)) {
      updateFormField(fieldId, {
        validationRules: [...field.validationRules, ruleId]
      });
    }
  };

  const removeValidationRule = (fieldId: string, ruleId: string) => {
    const field = programData.formFields.find(f => f.id === fieldId);
    if (field) {
      updateFormField(fieldId, {
        validationRules: field.validationRules.filter(rule => rule !== ruleId)
      });
    }
  };

  if (showFormPreview) {
    const previewProgramData = {
      ...programData,
      programType: programData.programType?.name || ''
    };
    
    return (
      <PreviewUserForm
        programData={previewProgramData}
        onBack={() => setShowFormPreview(false)}
        onEditFormFields={() => {
          setShowFormPreview(false);
          setCurrentStep(3);
        }}
        onSaveAndExit={() => {
          console.log('Saving preview and exiting');
        }}
      />
    );
  }

  // Page 1: Program Type Selection (Standalone)
  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header - Made Sticky */}
        <div className="sticky top-0 z-50 bg-white border-b border-blue-100 px-6 py-3 shadow-sm" style={{ height: '66px' }}>
          <div className="max-w-[1200px] mx-auto flex items-center h-full" style={{ paddingLeft: '10px' }}>
            <h1 className="text-2xl font-semibold text-blue-900">Program Creation</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {programTypes.map((type) => {
              const IconComponent = type.icon;
              const isSelected = programData.programType?.id === type.id;
              return (
                <Card 
                  key={type.id} 
                  className={cn(
                    "cursor-pointer border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg group bg-white",
                    isSelected && "border-blue-400 bg-blue-50 shadow-lg"
                  )}
                  onClick={() => selectProgramType(type)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={cn(
                      "w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center transition-transform duration-300",
                      isSelected ? "scale-110 bg-blue-200" : "group-hover:scale-110"
                    )}>
                      <IconComponent className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-blue-900">{type.name}</h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-blue-100 px-6 py-4 shadow-lg">
          <div className="max-w-[1200px] mx-auto flex items-center justify-end">
            <Button
              onClick={() => setCurrentStep(1)}
              disabled={!programData.programType}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Pages 2-3: Program Basics and Schedule & Logistics with Stepper
  if (currentStep === 1 || currentStep === 2) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header - Made Sticky */}
        <div className="sticky top-0 z-50 bg-white border-b border-blue-100 px-6 py-3 shadow-sm" style={{ height: '66px' }}>
          <div className="max-w-[1200px] mx-auto flex items-center h-full" style={{ paddingLeft: '10px' }}>
            <h1 className="text-2xl font-semibold text-blue-900">Program Creation</h1>
          </div>
        </div>

        <div className="flex" style={{ paddingBottom: '80px' }}>
          {/* Left Vertical Stepper */}
          <div className="w-64 bg-blue-50 border-r border-blue-100 fixed left-0 top-16 bottom-20 p-6">
            <div className="space-y-6">
              <div 
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all",
                  currentStep === 1 ? "bg-blue-100 text-blue-800" : "text-blue-600 hover:bg-blue-50"
                )}
                onClick={() => setCurrentStep(1)}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  currentStep === 1 ? "bg-blue-600 text-white" : "bg-blue-200 text-blue-600"
                )}>
                  1
                </div>
                <span className="font-medium">Program Basics</span>
              </div>
              
              <div 
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all",
                  currentStep === 2 ? "bg-blue-100 text-blue-800" : "text-blue-600 hover:bg-blue-50"
                )}
                onClick={() => setCurrentStep(2)}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  currentStep === 2 ? "bg-blue-600 text-white" : "bg-blue-200 text-blue-600"
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
                <div className="animate-fade-in">
                  
                  {/* Banner Image Section */}
                  {programData.programType && (
                    <div className="mb-8">
                      <div className="w-full max-w-[1200px] mx-auto">
                        <img
                          src="/lovable-uploads/96a2a56e-9042-45b6-b8df-4093d76967e3.png"
                          alt={`Banner for selected program: ${programData.programType.name} – A quick glance.`}
                          className="w-full h-auto max-h-60 object-cover rounded-lg shadow-lg border border-blue-100"
                          style={{ maxHeight: '240px' }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-lg shadow-lg border border-blue-100 overflow-hidden p-8">
                    
                    {/* Banner Section */}
                    {programData.programType && (
                      <div className="bg-blue-50 rounded-lg p-6 border border-blue-100 mb-8 text-center">
                        <p className="text-blue-900 font-medium text-lg">
                          You're now setting the stage for a {programData.programType?.name} program.
                        </p>
                      </div>
                    )}

                    <div className="space-y-8">
                      <div className="space-y-2">
                        <Label htmlFor="programName" className="text-blue-900 font-medium">Program Name *</Label>
                        <Input
                          id="programName"
                          value={programData.programName}
                          onChange={(e) => updateProgramData({ programName: e.target.value })}
                          className="rounded-lg border-blue-200 focus:border-blue-400 focus:ring-blue-200 bg-white"
                          placeholder="Enter program name"
                        />
                      </div>

                      <div className="space-y-4">
                        <Label className="text-blue-900 font-medium">Sessions</Label>
                        <div className="grid grid-cols-2 gap-4">
                          {programData.programType?.defaultSessions.map((session) => (
                            <div key={session} className="flex items-center space-x-3 bg-blue-50 rounded-lg p-4 border border-blue-100">
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
                                className="border-blue-400 data-[state=checked]:bg-blue-600"
                              />
                              <Label htmlFor={session} className="text-blue-900 font-medium">{session}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-blue-900 font-medium">Mode of Program</Label>
                        <RadioGroup
                          value={programData.mode}
                          onValueChange={(value: 'online' | 'offline' | 'hybrid') => updateProgramData({ mode: value })}
                          className="flex space-x-8"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="online" id="online" className="border-blue-400 text-blue-600" />
                            <Label htmlFor="online" className="text-blue-900">Online</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="offline" id="offline" className="border-blue-400 text-blue-600" />
                            <Label htmlFor="offline" className="text-blue-900">Offline</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="hybrid" id="hybrid" className="border-blue-400 text-blue-600" />
                            <Label htmlFor="hybrid" className="text-blue-900">Hybrid</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Registration Settings Section */}
                      <div className="space-y-6">
                        <h4 className="text-lg font-medium text-blue-900">Registration Settings</h4>
                        
                        {/* Registration Period */}
                        <div className="space-y-4">
                          <Label className="text-blue-900 font-medium">Registration Period</Label>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-blue-900">Program Registration Start Date & Time</Label>
                              <div className="grid grid-cols-2 gap-2">
                                <Input
                                  type="date"
                                  value={programData.registrationStartDate}
                                  onChange={(e) => updateProgramData({ registrationStartDate: e.target.value })}
                                  className="rounded-lg border-blue-200 focus:border-blue-400 focus:ring-blue-200 bg-white"
                                />
                                <Input
                                  type="time"
                                  value={programData.registrationStartTime}
                                  onChange={(e) => updateProgramData({ registrationStartTime: e.target.value })}
                                  className="rounded-lg border-blue-200 focus:border-blue-400 focus:ring-blue-200 bg-white"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-blue-900">Program Registration End Date & Time</Label>
                              <div className="grid grid-cols-2 gap-2">
                                <Input
                                  type="date"
                                  value={programData.registrationEndDate}
                                  onChange={(e) => updateProgramData({ registrationEndDate: e.target.value })}
                                  className="rounded-lg border-blue-200 focus:border-blue-400 focus:ring-blue-200 bg-white"
                                />
                                <Input
                                  type="time"
                                  value={programData.registrationEndTime}
                                  onChange={(e) => updateProgramData({ registrationEndTime: e.target.value })}
                                  className="rounded-lg border-blue-200 focus:border-blue-400 focus:ring-blue-200 bg-white"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Approval Required Toggle */}
                        <div className="flex items-center justify-between bg-blue-50 rounded-lg p-4 border border-blue-100">
                          <div className="flex items-center gap-3">
                            <Label className="text-blue-900 font-medium">Is approval required for registration?</Label>
                            <div className="group relative">
                              <Info className="w-4 h-4 text-blue-500 cursor-help" />
                              <div className="absolute invisible group-hover:visible bg-blue-900 text-white text-xs rounded px-2 py-1 -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                                Approval allows manual review of each registration before confirmation
                              </div>
                            </div>
                          </div>
                          <Switch
                            checked={programData.approvalRequired}
                            onCheckedChange={(checked) => updateProgramData({ approvalRequired: checked })}
                            className="data-[state=checked]:bg-blue-600"
                          />
                        </div>

                        {/* Seat Limit Toggle */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between bg-blue-50 rounded-lg p-4 border border-blue-100">
                            <div className="flex items-center gap-3">
                              <Label className="text-blue-900 font-medium">Is there a limit on seats?</Label>
                              <div className="group relative">
                                <Info className="w-4 h-4 text-blue-500 cursor-help" />
                                <div className="absolute invisible group-hover:visible bg-blue-900 text-white text-xs rounded px-2 py-1 -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                                  Leave unchecked for unlimited participants
                                </div>
                              </div>
                            </div>
                            <Switch
                              checked={programData.seatLimitEnabled}
                              onCheckedChange={(checked) => updateProgramData({ seatLimitEnabled: checked })}
                              className="data-[state=checked]:bg-blue-600"
                            />
                          </div>

                          {programData.seatLimitEnabled && (
                            <div className="space-y-2">
                              <Label className="text-blue-900 font-medium">Enter maximum number of seats</Label>
                              <Input
                                type="number"
                                min="1"
                                value={programData.maxSeats || ''}
                                onChange={(e) => updateProgramData({ maxSeats: Math.max(1, parseInt(e.target.value) || 0) })}
                                className="rounded-lg border-blue-200 focus:border-blue-400 focus:ring-blue-200 bg-white"
                                placeholder="Enter maximum seats"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Page 3: Schedule & Logistics */}
              {currentStep === 2 && (
                <div className="animate-fade-in">
                  
                  {/* Banner Image Section */}
                  {programData.programType && (
                    <div className="mb-8">
                      <div className="w-full max-w-[1200px] mx-auto">
                        <img
                          src="/lovable-uploads/96a2a56e-9042-45b6-b8df-4093d76967e3.png"
                          alt={`Banner for selected program: ${programData.programType.name} – A quick glance.`}
                          className="w-full h-auto max-h-60 object-cover rounded-lg shadow-lg border border-blue-100"
                          style={{ maxHeight: '240px' }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-lg shadow-lg border border-blue-100 overflow-hidden p-8">
                    <div className="space-y-8">
                      
                      <div className="space-y-6">
                        <h3 className="text-lg font-medium text-blue-900">Session Scheduler</h3>
                        {programData.selectedSessions.map((session) => (
                          <Card key={session} className="border-blue-100 bg-blue-50">
                            <CardContent className="p-6">
                              <h4 className="font-medium text-blue-900 mb-4">{session}</h4>
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="space-y-2">
                                  <Label className="text-blue-900">Start Date</Label>
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
                                    className="rounded-lg border-blue-200 bg-white"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-blue-900">End Date</Label>
                                  <Input
                                    type="date"
                                    value={programData.sessionSchedules[session]?.endDate || ''}
                                    disabled
                                    className="rounded-lg border-blue-200 bg-blue-50"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-blue-900">Check-in Time</Label>
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
                                    className="rounded-lg border-blue-200 bg-white"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-blue-900">Check-out Time</Label>
                                  <Input
                                    type="time"
                                    value={programData.sessionSchedules[session]?.checkOutTime || ''}
                                    disabled
                                    className="rounded-lg border-blue-200 bg-blue-50"
                                  />
                                  <p className="text-xs text-blue-500">Auto-calculated (6 hours after check-in)</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {(programData.mode === 'offline' || programData.mode === 'hybrid') && (
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label className="text-blue-900 font-medium">Venue Address</Label>
                            <Select value={programData.selectedVenue} onValueChange={handleVenueChange}>
                              <SelectTrigger className="rounded-lg border-blue-200 bg-white">
                                <SelectValue placeholder="Select venue" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border border-blue-200 shadow-lg rounded-xl z-50">
                                {predefinedVenues.map((venue) => (
                                  <SelectItem key={venue} value={venue} className="hover:bg-blue-50">
                                    {venue === 'Custom' ? 'Custom Address' : venue}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            {programData.selectedVenue === 'Custom' && (
                              <Textarea
                                value={programData.customVenue}
                                onChange={(e) => handleCustomVenueChange(e.target.value)}
                                className="rounded-lg border-blue-200 bg-white mt-2"
                                placeholder="Enter custom venue address"
                                rows={3}
                              />
                            )}
                          </div>

                          <div className="flex items-center justify-between bg-blue-50 rounded-lg p-4 border border-blue-100">
                            <div>
                              <Label className="text-blue-900 font-medium">Is Travel Required?</Label>
                              <p className="text-sm text-blue-600">Enable if transportation is needed</p>
                            </div>
                            <Switch
                              checked={programData.travelRequired}
                              onCheckedChange={(checked) => updateProgramData({ travelRequired: checked })}
                              className="data-[state=checked]:bg-blue-600"
                            />
                          </div>
                        </div>
                      )}

                      {/* Payment Configuration - Moved from Program Basics */}
                      <div className="space-y-6">
                        <div className="flex items-center justify-between bg-blue-50 rounded-lg p-4 border border-blue-100">
                          <div>
                            <Label className="text-blue-900 font-medium">Is Payment Required?</Label>
                            <p className="text-sm text-blue-600">Enable if fees are required for this program</p>
                          </div>
                          <Switch
                            checked={programData.paymentRequired}
                            onCheckedChange={(checked) => updateProgramData({ paymentRequired: checked })}
                            className="data-[state=checked]:bg-blue-600"
                          />
                        </div>

                        {programData.paymentRequired && (
                          <div className="space-y-6 bg-blue-50 rounded-lg p-6 border border-blue-200">
                            <h4 className="text-lg font-medium text-blue-900">Payment Configuration</h4>
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label htmlFor="hdbFee" className="text-blue-900 font-medium">HDB Fee (₹)</Label>
                                <Input
                                  id="hdbFee"
                                  type="number"
                                  value={programData.hdbFee}
                                  onChange={(e) => updateProgramData({ hdbFee: Number(e.target.value) })}
                                  className="rounded-lg border-blue-200 focus:border-blue-400 focus:ring-blue-200 bg-white"
                                  placeholder="Enter HDB fee amount"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="msdFee" className="text-blue-900 font-medium">MSD Fee (₹)</Label>
                                <Input
                                  id="msdFee"
                                  type="number"
                                  value={programData.msdFee}
                                  onChange={(e) => updateProgramData({ msdFee: Number(e.target.value) })}
                                  className="rounded-lg border-blue-200 focus:border-blue-400 focus:ring-blue-200 bg-white"
                                  placeholder="Enter MSD fee amount"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-blue-100 px-6 py-4 shadow-lg">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
            >
              <Save className="w-4 h-4 mr-2" />
              Save as Draft
            </Button>

            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setCurrentStep(currentStep - 1)}
                variant="outline"
                className="rounded-lg border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                Back
              </Button>
              {currentStep === 1 ? (
                <Button
                  onClick={() => setCurrentStep(2)}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentStep(2.5)}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // New Confirmation Screen (Step 2.5)
  if (currentStep === 2.5) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-white border-b border-blue-100 px-6 py-3 shadow-sm" style={{ height: '66px' }}>
          <div className="max-w-[1200px] mx-auto flex items-center h-full" style={{ paddingLeft: '10px' }}>
            <h1 className="text-2xl font-semibold text-blue-900">Program Creation</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-center min-h-[calc(100vh-66px)] px-6 py-8">
          <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
            
            {/* Visual Element */}
            <div className="relative">
              <div className="w-32 h-32 mx-auto bg-blue-100 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="w-16 h-16 text-blue-600" />
              </div>
              <div className="absolute inset-0 w-32 h-32 mx-auto bg-blue-200/30 rounded-full animate-pulse" />
            </div>

            {/* Header */}
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold text-blue-900">
                Your program has been created successfully!
              </h1>
              <p className="text-xl text-blue-700 leading-relaxed">
                You've laid the foundation. Now let's shape how the seeker will experience the registration journey.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-8">
              <div className="space-y-3">
                {/* Primary Action */}
                <Button
                  onClick={() => setShowFormPreview(true)}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium rounded-lg shadow-lg"
                >
                  <Eye className="w-5 h-5 mr-3" />
                  Preview User Form
                </Button>

                {/* Secondary Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    onClick={() => setCurrentStep(1)}
                    variant="outline"
                    className="h-12 rounded-lg border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Program Details
                  </Button>

                  <Button
                    onClick={() => setCurrentStep(0)}
                    variant="outline"
                    className="h-12 rounded-lg border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Enhanced Registration Form Builder (No Accordion - Flat List)
  if (currentStep === 3) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-white border-b border-blue-100 px-6 py-4 shadow-sm">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-blue-900">Registration Form Builder</h1>
            <Button
              onClick={() => setShowFormPreview(true)}
              variant="outline"
              className="border-blue-200 text-blue-700 hover:bg-blue-50 rounded-lg"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview Form
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="space-y-6">
            
            {/* Form Fields List - Single Column, No Accordion */}
            <div className="space-y-6">
              {programData.formFields.map((field) => (
                <Card key={field.id} className="border-blue-100 bg-white shadow-md">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CardTitle className="text-lg text-blue-900 flex items-center">
                          {field.label}
                          {field.mandatory && <span className="text-red-500 ml-1">*</span>}
                        </CardTitle>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {field.type}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteFormField(field.id)}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Basic Field Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-blue-900 font-medium">Field Label</Label>
                        <Input
                          value={field.label}
                          onChange={(e) => updateFormField(field.id, { label: e.target.value })}
                          className="border-blue-200 focus:border-blue-400 focus:ring-blue-200 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-blue-900 font-medium">Helper Text</Label>
                        <Input
                          value={field.helperText}
                          onChange={(e) => updateFormField(field.id, { helperText: e.target.value })}
                          className="border-blue-200 focus:border-blue-400 focus:ring-blue-200 rounded-lg"
                          placeholder="Guidance text for users"
                        />
                      </div>
                    </div>

                    {/* Mandatory Toggle */}
                    <div className="flex items-center justify-between bg-blue-50 rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center space-x-3">
                        <Label className="text-blue-900 font-medium">Required Field</Label>
                        <div className="group relative">
                          <Info className="w-4 h-4 text-blue-500 cursor-help" />
                          <div className="absolute invisible group-hover:visible bg-blue-900 text-white text-xs rounded px-2 py-1 -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-10">
                            Mark this field as mandatory for submission
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={field.mandatory}
                        onCheckedChange={(checked) => updateFormField(field.id, { mandatory: checked })}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>

                    {/* Validation Rules */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Label className="text-blue-900 font-medium">Validation Rules</Label>
                        <div className="group relative">
                          <Info className="w-4 h-4 text-blue-500 cursor-help" />
                          <div className="absolute invisible group-hover:visible bg-blue-900 text-white text-xs rounded px-2 py-1 -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-10">
                            Add rules to validate user input
                          </div>
                        </div>
                      </div>

                      {/* Selected Rules */}
                      {field.validationRules.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {field.validationRules.map((ruleId) => {
                            const rule = validationRules.find(r => r.id === ruleId);
                            return rule ? (
                              <div key={ruleId} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                <span>{rule.name}</span>
                                <button
                                  onClick={() => removeValidationRule(field.id, ruleId)}
                                  className="ml-2 text-blue-600 hover:text-blue-800"
                                >
                                  ×
                                </button>
                              </div>
                            ) : null;
                          })}
                        </div>
                      )}

                      {/* Add Validation Rule */}
                      <Select onValueChange={(value) => addValidationRule(field.id, value)}>
                        <SelectTrigger className="w-64 border-blue-200 focus:border-blue-400 rounded-lg">
                          <Plus className="w-4 h-4 mr-2 text-blue-600" />
                          <SelectValue placeholder="Add validation rule" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-blue-200 rounded-lg z-50">
                          {validationRules
                            .filter(rule => !field.validationRules.includes(rule.id))
                            .map((rule) => (
                              <SelectItem key={rule.id} value={rule.id} className="hover:bg-blue-50">
                                <div>
                                  <div className="font-medium text-blue-900">{rule.name}</div>
                                  <div className="text-xs text-blue-600">{rule.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Options for Dropdown Fields */}
                    {field.type === 'dropdown' && (
                      <div className="space-y-3">
                        <Label className="text-blue-900 font-medium">Dropdown Options</Label>
                        <div className="space-y-2">
                          {field.options?.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Input
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...(field.options || [])];
                                  newOptions[index] = e.target.value;
                                  updateFormField(field.id, { options: newOptions });
                                }}
                                className="border-blue-200 focus:border-blue-400 rounded-lg"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newOptions = field.options?.filter((_, i) => i !== index);
                                  updateFormField(field.id, { options: newOptions });
                                }}
                                className="text-red-500 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newOptions = [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`];
                              updateFormField(field.id, { options: newOptions });
                            }}
                            className="border-blue-200 text-blue-700 hover:bg-blue-50 rounded-lg"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Option
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add New Field Section */}
            <Card className="border-blue-200 border-dashed bg-blue-50/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-center space-x-4">
                  <Select onValueChange={(value) => addFormField(value as FormField['type'])}>
                    <SelectTrigger className="w-64 border-blue-300 bg-white rounded-lg">
                      <Plus className="w-4 h-4 mr-2 text-blue-600" />
                      <SelectValue placeholder="Add New Field" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-blue-200 rounded-lg z-50">
                      <SelectItem value="text">Text Field</SelectItem>
                      <SelectItem value="date">Date Field</SelectItem>
                      <SelectItem value="file">File Upload</SelectItem>
                      <SelectItem value="dropdown">Dropdown</SelectItem>
                      <SelectItem value="paragraph">Paragraph</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-blue-100 px-6 py-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowFormPreview(true)}
                variant="outline"
                className="border-blue-200 text-blue-700 hover:bg-blue-50 rounded-lg"
              >
                Back to Preview
              </Button>
              <Button
                variant="ghost"
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
            </div>

            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg px-6">
              Save & Publish Program
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ProgramCreation;
