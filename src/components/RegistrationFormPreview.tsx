
import React from 'react';
import { ChevronLeft, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ProgramType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  defaultSessions: string[];
  defaultDuration: number;
}

interface FormField {
  id: string;
  type: 'text' | 'date' | 'file' | 'dropdown' | 'paragraph';
  label: string;
  mandatory: boolean;
  helperText: string;
  options?: string[];
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
  programFee: number;
  currency: string;
  refundPolicy: string;
  layoutStyle: 'single-column' | 'two-column' | 'question-by-question';
  userType: 'new' | 'existing';
  formFields: FormField[];
}

interface RegistrationFormPreviewProps {
  programData: ProgramData;
  onBack: () => void;
  onProceed: () => void;
  onEditForm: () => void;
}

const RegistrationFormPreview: React.FC<RegistrationFormPreviewProps> = ({
  programData,
  onBack,
  onProceed,
  onEditForm
}) => {
  const [previewAsExisting, setPreviewAsExisting] = React.useState(programData.userType === 'existing');

  const renderFormField = (field: FormField, index: number) => {
    const isPrefilledForExisting = previewAsExisting && ['Name', 'Email', 'Phone'].includes(field.label);
    
    return (
      <div key={field.id} className="space-y-2">
        <Label className={cn(
          "text-stone-800 flex items-center gap-1",
          isPrefilledForExisting && "text-stone-600"
        )}>
          {field.label}
          {field.mandatory && <span className="text-red-500">*</span>}
          {isPrefilledForExisting && <Info className="w-3 h-3 text-stone-500" />}
        </Label>
        {field.helperText && (
          <p className="text-xs text-stone-600">{field.helperText}</p>
        )}
        
        {field.type === 'text' && (
          <Input 
            className={cn(
              "rounded-2xl border-stone-200",
              isPrefilledForExisting && "bg-stone-50 text-stone-600"
            )}
            placeholder={isPrefilledForExisting ? "John Doe" : `Enter ${field.label.toLowerCase()}`}
            value={isPrefilledForExisting ? "John Doe" : ""}
            readOnly
          />
        )}
        
        {field.type === 'date' && (
          <Input 
            type="date" 
            className="rounded-2xl border-stone-200" 
            readOnly
          />
        )}
        
        {field.type === 'file' && (
          <Input 
            type="file" 
            className="rounded-2xl border-stone-200" 
            disabled
          />
        )}
        
        {field.type === 'dropdown' && (
          <Select disabled>
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
        
        {field.type === 'paragraph' && (
          <Textarea 
            className="rounded-2xl border-stone-200" 
            placeholder={`Enter ${field.label.toLowerCase()}`}
            readOnly
          />
        )}
      </div>
    );
  };

  const renderSingleColumnLayout = () => (
    <div className="space-y-6">
      <Card className="border-stone-200/50">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-stone-800 mb-4">Personal Information</h3>
          <div className="space-y-4">
            {programData.formFields.map((field, index) => renderFormField(field, index))}
          </div>
        </CardContent>
      </Card>
      
      {programData.paymentRequired && (
        <Card className="border-stone-200/50">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-stone-800 mb-4">Payment Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-stone-800">Program Fee *</Label>
                <Input 
                  className="rounded-2xl border-stone-200" 
                  value={`${programData.currency} ${programData.programFee}`}
                  readOnly
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {programData.mode === 'offline' && (
        <Card className="border-stone-200/50">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-stone-800 mb-4">Travel Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-stone-800">Venue Address</Label>
                <Textarea 
                  className="rounded-2xl border-stone-200" 
                  value={programData.venueAddress}
                  readOnly
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderTwoColumnLayout = () => (
    <div className="grid grid-cols-2 gap-6">
      <Card className="border-stone-200/50">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-stone-800 mb-4">Personal Information</h3>
          <div className="space-y-4">
            {programData.formFields.map((field, index) => renderFormField(field, index))}
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        {programData.paymentRequired && (
          <Card className="border-stone-200/50">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-stone-800 mb-4">Payment Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-stone-800">Program Fee *</Label>
                  <Input 
                    className="rounded-2xl border-stone-200" 
                    value={`${programData.currency} ${programData.programFee}`}
                    readOnly
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {programData.mode === 'offline' && (
          <Card className="border-stone-200/50">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-stone-800 mb-4">Travel Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-stone-800">Venue Address</Label>
                  <Textarea 
                    className="rounded-2xl border-stone-200" 
                    value={programData.venueAddress}
                    readOnly
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  const renderQuestionByQuestionLayout = () => (
    <div className="space-y-6">
      <Card className="border-stone-200/50">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-stone-800 mb-4">Question 1 of {programData.formFields.length}</h3>
          <div className="space-y-4">
            {programData.formFields.length > 0 && renderFormField(programData.formFields[0], 0)}
            <div className="flex justify-end pt-4">
              <Button disabled className="bg-orange-400 text-white rounded-2xl">
                Next Question
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <p className="text-sm text-stone-600 text-center italic">
        Preview shows first question only. Actual form will show one question at a time.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-orange-50/30">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-stone-200/50 px-6 py-4 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-light text-stone-800">Preview Registration Form</h1>
          <p className="text-stone-600 mt-1">
            Based on your selections, we've generated the form your participants will fill out. You can proceed or customize it.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-stone-200/30 overflow-hidden">
          <div className="p-8">
            {/* User Type Toggle */}
            <div className="flex items-center justify-between mb-8 p-4 bg-orange-50/50 rounded-2xl border border-orange-200/50">
              <div>
                <Label className="text-stone-800 font-medium">Preview Mode</Label>
                <p className="text-sm text-stone-600">Toggle to see how the form appears for different user types</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={cn("text-sm", !previewAsExisting ? "text-stone-800 font-medium" : "text-stone-600")}>
                  New User
                </span>
                <Switch
                  checked={previewAsExisting}
                  onCheckedChange={setPreviewAsExisting}
                  className="data-[state=checked]:bg-orange-500"
                />
                <span className={cn("text-sm", previewAsExisting ? "text-stone-800 font-medium" : "text-stone-600")}>
                  Existing User
                </span>
              </div>
            </div>

            {/* Form Preview */}
            <div className="border-2 border-dashed border-stone-200 rounded-2xl p-6 bg-stone-50/30">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-medium text-stone-800">
                    {programData.programName} Registration
                  </h2>
                  <span className="text-sm text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
                    {programData.layoutStyle.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Layout
                  </span>
                </div>

                {programData.layoutStyle === 'single-column' && renderSingleColumnLayout()}
                {programData.layoutStyle === 'two-column' && renderTwoColumnLayout()}
                {programData.layoutStyle === 'question-by-question' && renderQuestionByQuestionLayout()}
              </div>
            </div>

            {/* Action Section */}
            <div className="mt-8 text-center">
              <h3 className="text-lg font-medium text-stone-800 mb-4">
                Is this form ready to go, or do you want to make changes?
              </h3>
              <div className="flex items-center justify-center space-x-4">
                <Button
                  onClick={onProceed}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-2xl text-white shadow-lg px-8"
                >
                  ✅ Use This Form As-Is
                </Button>
                <Button
                  onClick={onEditForm}
                  variant="outline"
                  className="rounded-2xl border-orange-200 text-orange-700 hover:bg-orange-50 px-8"
                >
                  ✏️ Edit Form Fields
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="bg-gradient-to-r from-stone-50 to-orange-50/50 px-8 py-6 border-t border-stone-200/50 sticky bottom-0">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Button
            onClick={onBack}
            variant="outline"
            className="rounded-2xl border-stone-300 text-stone-700 hover:bg-stone-50"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationFormPreview;
