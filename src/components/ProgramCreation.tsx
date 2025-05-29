
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Save, Eye, Plus, Info } from 'lucide-react';
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

interface ProgramData {
  programName: string;
  programType: string;
  selectedSessions: string[];
  mode: 'online' | 'offline';
  paymentRequired: boolean;
  sessionSchedules: Record<string, { startDate: string; endDate: string }>;
  venueAddress: string;
  travelRequired: boolean;
  programFee: number;
  currency: string;
  refundPolicy: string;
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

const ProgramCreation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [programData, setProgramData] = useState<ProgramData>({
    programName: '',
    programType: 'HDB',
    selectedSessions: ['HDB1', 'HDB2', 'MSD1', 'MSD2'],
    mode: 'online',
    paymentRequired: false,
    sessionSchedules: {},
    venueAddress: '',
    travelRequired: false,
    programFee: 0,
    currency: 'USD',
    refundPolicy: '',
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
    if (!startDate) return '';
    const start = new Date(startDate);
    const duration = sessionType.includes('HDB') ? 7 : 14; // HDB: 1 week, MSD: 2 weeks
    const end = new Date(start);
    end.setDate(start.getDate() + duration);
    return end.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header with Progress */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-amber-200/50 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-light text-amber-900 mb-4">Create a New Program</h1>
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                  currentStep >= step 
                    ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg" 
                    : "bg-amber-100 text-amber-600"
                )}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={cn(
                    "w-12 h-0.5 mx-2 transition-all duration-300",
                    currentStep > step ? "bg-gradient-to-r from-amber-600 to-orange-600" : "bg-amber-200"
                  )} />
                )}
              </div>
            ))}
          </div>
          <div className="flex space-x-8 mt-2">
            <span className={cn("text-sm", currentStep === 1 ? "text-amber-800 font-medium" : "text-amber-600")}>
              Program Basics
            </span>
            <span className={cn("text-sm", currentStep === 2 ? "text-amber-800 font-medium" : "text-amber-600")}>
              Schedule & Logistics
            </span>
            <span className={cn("text-sm", currentStep === 3 ? "text-amber-800 font-medium" : "text-amber-600")}>
              Registration Form
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-amber-200/30 overflow-hidden">
          <div className="p-8">
            {/* Step 1: Program Basics */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="programName" className="text-amber-900 font-medium">Program Name *</Label>
                  <Input
                    id="programName"
                    value={programData.programName}
                    onChange={(e) => updateProgramData({ programName: e.target.value })}
                    className="rounded-xl border-amber-200 focus:border-amber-400 focus:ring-amber-400/20"
                    placeholder="Enter program name"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-amber-900 font-medium flex items-center gap-2">
                    Program Type
                    <Info className="w-4 h-4 text-amber-600" />
                  </Label>
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                    <span className="text-amber-800 font-medium">{programData.programType}</span>
                    <p className="text-sm text-amber-600 mt-1">Pre-configured program type</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-amber-900 font-medium">Session Selection</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {['HDB1', 'HDB2', 'MSD1', 'MSD2'].map((session) => (
                      <div key={session} className="flex items-center space-x-3 bg-amber-50/50 rounded-xl p-4 border border-amber-200/50">
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
                          className="border-amber-400 data-[state=checked]:bg-amber-600"
                        />
                        <Label htmlFor={session} className="text-amber-800 font-medium">{session}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-amber-900 font-medium">Mode of Program</Label>
                  <RadioGroup
                    value={programData.mode}
                    onValueChange={(value: 'online' | 'offline') => updateProgramData({ mode: value })}
                    className="flex space-x-8"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="online" id="online" className="border-amber-400 text-amber-600" />
                      <Label htmlFor="online" className="text-amber-800">Online</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="offline" id="offline" className="border-amber-400 text-amber-600" />
                      <Label htmlFor="offline" className="text-amber-800">Offline</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex items-center justify-between bg-amber-50/50 rounded-xl p-4 border border-amber-200/50">
                  <div>
                    <Label htmlFor="payment" className="text-amber-900 font-medium">Is Payment Required?</Label>
                    <p className="text-sm text-amber-600">Enable if participants need to pay</p>
                  </div>
                  <Switch
                    id="payment"
                    checked={programData.paymentRequired}
                    onCheckedChange={(checked) => updateProgramData({ paymentRequired: checked })}
                    className="data-[state=checked]:bg-amber-600"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Schedule & Logistics */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-fade-in">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-amber-900">Session Scheduler</h3>
                  {programData.selectedSessions.map((session) => (
                    <Card key={session} className="border-amber-200/50 bg-amber-50/30">
                      <CardContent className="p-6">
                        <h4 className="font-medium text-amber-800 mb-4">{session}</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-amber-900">Start Date</Label>
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
                              className="rounded-xl border-amber-200"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-amber-900 flex items-center gap-2">
                              End Date
                              <Info className="w-4 h-4 text-amber-600" />
                            </Label>
                            <Input
                              type="date"
                              value={programData.sessionSchedules[session]?.endDate || ''}
                              disabled
                              className="rounded-xl border-amber-200 bg-amber-50"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {programData.mode === 'offline' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="space-y-2">
                      <Label className="text-amber-900 font-medium">Venue Address</Label>
                      <Textarea
                        value={programData.venueAddress}
                        onChange={(e) => updateProgramData({ venueAddress: e.target.value })}
                        className="rounded-xl border-amber-200 focus:border-amber-400"
                        placeholder="Enter complete venue address"
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center justify-between bg-amber-50/50 rounded-xl p-4 border border-amber-200/50">
                      <div>
                        <Label className="text-amber-900 font-medium">Is Travel Required?</Label>
                        <p className="text-sm text-amber-600">Enable if transportation is needed</p>
                      </div>
                      <Switch
                        checked={programData.travelRequired}
                        onCheckedChange={(checked) => updateProgramData({ travelRequired: checked })}
                        className="data-[state=checked]:bg-amber-600"
                      />
                    </div>
                  </div>
                )}

                {programData.paymentRequired && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-amber-900 font-medium">Program Fee</Label>
                        <Input
                          type="number"
                          value={programData.programFee}
                          onChange={(e) => updateProgramData({ programFee: Number(e.target.value) })}
                          className="rounded-xl border-amber-200"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-amber-900 font-medium">Currency</Label>
                        <Select value={programData.currency} onValueChange={(value) => updateProgramData({ currency: value })}>
                          <SelectTrigger className="rounded-xl border-amber-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="INR">INR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-amber-900 font-medium">Refund Policy</Label>
                      <Textarea
                        value={programData.refundPolicy}
                        onChange={(e) => updateProgramData({ refundPolicy: e.target.value })}
                        className="rounded-xl border-amber-200"
                        placeholder="Describe the refund policy..."
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Registration Form Builder */}
            {currentStep === 3 && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-amber-900">Registration Form Builder</h3>
                  <Button
                    onClick={() => setShowPreview(true)}
                    variant="outline"
                    className="rounded-xl border-amber-300 text-amber-700 hover:bg-amber-50"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Form
                  </Button>
                </div>

                <div className="space-y-4">
                  {programData.formFields.map((field) => (
                    <Card key={field.id} className="border-amber-200/50 bg-amber-50/30">
                      <CardContent className="p-6">
                        <div className="grid grid-cols-3 gap-4 items-start">
                          <div className="space-y-2">
                            <Label className="text-amber-900">Field Label</Label>
                            <Input
                              value={field.label}
                              onChange={(e) => updateFormField(field.id, { label: e.target.value })}
                              className="rounded-xl border-amber-200"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-amber-900">Helper Text</Label>
                            <Input
                              value={field.helperText}
                              onChange={(e) => updateFormField(field.id, { helperText: e.target.value })}
                              className="rounded-xl border-amber-200"
                              placeholder="Optional helper text"
                            />
                          </div>
                          <div className="flex items-center justify-between pt-6">
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={field.mandatory}
                                onCheckedChange={(checked) => updateFormField(field.id, { mandatory: checked })}
                                className="data-[state=checked]:bg-amber-600"
                              />
                              <Label className="text-amber-800 text-sm">Mandatory</Label>
                            </div>
                            <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
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
                    <SelectTrigger className="w-48 rounded-xl border-amber-300">
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
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-8 py-6 border-t border-amber-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {currentStep > 1 && (
                  <Button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    variant="outline"
                    className="rounded-xl border-amber-300 text-amber-700 hover:bg-amber-50"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className="text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-xl"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
              </div>

              <div>
                {currentStep < 3 ? (
                  <Button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 rounded-xl text-white shadow-lg"
                  >
                    {currentStep === 2 ? 'Continue to Form Builder' : 'Next'}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl text-white shadow-lg">
                    Save & Publish Program
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-amber-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-amber-900">Registration Form Preview</h3>
                <Button
                  onClick={() => setShowPreview(false)}
                  variant="ghost"
                  className="text-amber-600 hover:text-amber-800"
                >
                  ✕
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {programData.formFields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label className="text-amber-900 flex items-center gap-1">
                    {field.label}
                    {field.mandatory && <span className="text-red-500">*</span>}
                  </Label>
                  {field.helperText && (
                    <p className="text-sm text-amber-600">{field.helperText}</p>
                  )}
                  {field.type === 'text' && <Input className="rounded-xl border-amber-200" placeholder={`Enter ${field.label.toLowerCase()}`} />}
                  {field.type === 'date' && <Input type="date" className="rounded-xl border-amber-200" />}
                  {field.type === 'file' && <Input type="file" className="rounded-xl border-amber-200" />}
                  {field.type === 'dropdown' && (
                    <Select>
                      <SelectTrigger className="rounded-xl border-amber-200">
                        <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option, idx) => (
                          <SelectItem key={idx} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {field.type === 'paragraph' && <Textarea className="rounded-xl border-amber-200" placeholder={`Enter ${field.label.toLowerCase()}`} />}
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
