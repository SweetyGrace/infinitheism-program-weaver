import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Save, Eye, Plus, Info, Sparkles, Heart } from 'lucide-react';
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
  sessionSchedules: Record<string, { startDate: string; endDate: string }>;
  venueAddress: string;
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
  const [showPreview, setShowPreview] = useState(false);
  const [showFormPreview, setShowFormPreview] = useState(false);
  const [programData, setProgramData] = useState<ProgramData>({
    programType: null,
    programName: '',
    selectedSessions: [],
    mode: 'online',
    paymentRequired: false,
    sessionSchedules: {},
    venueAddress: 'Leonia Holistic Destination, Bommarasipet, Shamirpet Mandal, Medchal-Malkajgiri District, Hyderabad - 500078',
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

  const calculateEndDate = (startDate: string, sessionType: string) => {
    if (!startDate || !programData.programType) return '';
    const start = new Date(startDate);
    const duration = programData.programType.defaultDuration;
    const end = new Date(start);
    end.setDate(start.getDate() + duration);
    return end.toISOString().split('T')[0];
  };

  const getStepTitle = () => {
    if (showFormPreview) return 'Preview Registration Form';
    switch (currentStep) {
      case 0: return 'Program Creation';
      case 1: return 'Program Basics';
      case 2: return 'Schedule & Logistics';
      case 3: return 'Registration Layout & Settings';
      case 4: return 'Registration Form Builder';
      default: return 'Create a New Program';
    }
  };

  if (showFormPreview) {
    return (
      <RegistrationFormPreview
        programData={programData}
        onBack={() => setShowFormPreview(false)}
        onProceed={() => {
          // Handle final save & publish
          console.log('Proceeding with form as-is');
        }}
        onEditForm={() => {
          setShowFormPreview(false);
          setCurrentStep(4);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-orange-50/30">
      {/* Header with Progress */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-stone-200/50 px-6 py-3 shadow-sm" style={{ height: '50px' }}>
        <div className="max-w-5xl mx-auto flex items-center" style={{ paddingLeft: '10px' }}>
          <h1 className="text-2xl font-light text-stone-800">{getStepTitle()}</h1>
        </div>
      </div>

      {/* Progress Steps */}
      {currentStep > 0 && (
        <div className="bg-white/80 backdrop-blur-sm border-b border-stone-200/30 px-6 py-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                    currentStep >= step 
                      ? "bg-gradient-to-r from-orange-300 to-amber-400 text-white shadow-lg" 
                      : "bg-stone-100 text-stone-500"
                  )}>
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={cn(
                      "w-12 h-0.5 mx-2 transition-all duration-300",
                      currentStep > step ? "bg-gradient-to-r from-orange-300 to-amber-400" : "bg-stone-200"
                    )} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex space-x-8 mt-2">
              <span className={cn("text-sm", currentStep === 1 ? "text-stone-800 font-medium" : "text-stone-600")}>
                Program Basics
              </span>
              <span className={cn("text-sm", currentStep === 2 ? "text-stone-800 font-medium" : "text-stone-600")}>
                Schedule & Logistics
              </span>
              <span className={cn("text-sm", currentStep === 3 ? "text-stone-800 font-medium" : "text-stone-600")}>
                Layout & Settings
              </span>
              <span className={cn("text-sm", currentStep === 4 ? "text-stone-800 font-medium" : "text-stone-600")}>
                Form Builder
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-stone-200/30 overflow-hidden">
          <div className="p-8">
            {/* Step 0: Program Type Selection */}
            {currentStep === 0 && (
              <div className="space-y-8 animate-fade-in">
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
                
                {programData.programType && (
                  <div className="flex justify-center mt-8">
                    <Button
                      onClick={() => setCurrentStep(1)}
                      className="bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 rounded-2xl text-white shadow-lg px-8"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Step 1: Program Basics */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-fade-in">
                {/* Banner Section */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-200/50">
                  <p className="text-stone-800 font-medium">
                    You've selected {programData.programType?.name}
                  </p>
                </div>

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
              </div>
            )}

            {/* Step 2: Schedule & Logistics */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-fade-in">
                
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-stone-800">Session Scheduler</h3>
                  {programData.selectedSessions.map((session) => (
                    <Card key={session} className="border-stone-200/50 bg-stone-50/30">
                      <CardContent className="p-6">
                        <h4 className="font-medium text-stone-800 mb-4">{session}</h4>
                        <div className="grid grid-cols-2 gap-4">
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
                                    [session]: { startDate, endDate }
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
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {(programData.mode === 'offline' || programData.mode === 'hybrid') && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="space-y-2">
                      <Label className="text-stone-800 font-medium">Venue Address</Label>
                      <Textarea
                        value={programData.venueAddress}
                        readOnly
                        className="rounded-2xl border-stone-200 bg-stone-50 text-stone-700"
                        rows={3}
                      />
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

                <div className="flex items-center justify-between bg-stone-50/50 rounded-2xl p-4 border border-stone-200/50">
                  <div>
                    <Label htmlFor="payment" className="text-stone-800 font-medium">Is Payment Required?</Label>
                    <p className="text-sm text-stone-600">Enable if participants need to pay</p>
                  </div>
                  <Switch
                    id="payment"
                    checked={programData.paymentRequired}
                    onCheckedChange={(checked) => updateProgramData({ paymentRequired: checked })}
                    className="data-[state=checked]:bg-orange-500"
                  />
                </div>

                {programData.paymentRequired && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-stone-800 font-medium">HDB Fee</Label>
                        <Input
                          type="number"
                          value={programData.hdbFee}
                          onChange={(e) => updateProgramData({ hdbFee: Number(e.target.value) })}
                          className="rounded-2xl border-stone-200 bg-white/80"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-stone-800 font-medium">MSD Fee</Label>
                        <Input
                          type="number"
                          value={programData.msdFee}
                          onChange={(e) => updateProgramData({ msdFee: Number(e.target.value) })}
                          className="rounded-2xl border-stone-200 bg-white/80"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-stone-800 font-medium">Refund Policy</Label>
                      <Textarea
                        value={programData.refundPolicy}
                        onChange={(e) => updateProgramData({ refundPolicy: e.target.value })}
                        className="rounded-2xl border-stone-200 bg-white/80"
                        placeholder="Describe the refund policy..."
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

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
                    onClick={() => setShowPreview(true)}
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

          {/* Footer Navigation */}
          <div className="bg-gradient-to-r from-stone-50 to-orange-50/50 px-8 py-6 border-t border-stone-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {currentStep > 0 && (
                  <Button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    variant="outline"
                    className="rounded-2xl border-stone-300 text-stone-700 hover:bg-stone-50"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className="text-stone-600 hover:text-stone-800 hover:bg-stone-50 rounded-2xl"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
              </div>

              <div>
                {currentStep < 4 && currentStep > 0 ? (
                  <Button
                    onClick={() => {
                      if (currentStep === 3) {
                        setShowFormPreview(true);
                      } else {
                        setCurrentStep(currentStep + 1);
                      }
                    }}
                    className="bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 rounded-2xl text-white shadow-lg"
                  >
                    {currentStep === 2 ? 'Continue to Layout' : currentStep === 3 ? 'Preview Generated Form' : 'Continue to Schedule'}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : currentStep === 4 ? (
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-2xl text-white shadow-lg">
                    Save & Publish Program
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-stone-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-stone-800">Registration Form Preview</h3>
                <Button
                  onClick={() => setShowPreview(false)}
                  variant="ghost"
                  className="text-stone-600 hover:text-stone-800"
                >
                  ✕
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {programData.formFields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label className="text-stone-800 flex items-center gap-1">
                    {field.label}
                    {field.mandatory && <span className="text-red-500">*</span>}
                  </Label>
                  {field.helperText && (
                    <p className="text-sm text-stone-600">{field.helperText}</p>
                  )}
                  {field.type === 'text' && <Input className="rounded-2xl border-stone-200" placeholder={`Enter ${field.label.toLowerCase()}`} />}
                  {field.type === 'date' && <Input type="date" className="rounded-2xl border-stone-200" />}
                  {field.type === 'file' && <Input type="file" className="rounded-2xl border-stone-200" />}
                  {field.type === 'dropdown' && (
                    <Select>
                      <SelectTrigger className="rounded-2xl border-stone-200">
                        <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option, idx) => (
                          <SelectItem key={idx} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {field.type === 'paragraph' && <Textarea className="rounded-2xl border-stone-200" placeholder={`Enter ${field.label.toLowerCase()}`} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramCreation;
