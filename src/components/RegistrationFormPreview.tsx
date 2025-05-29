import React from 'react';
import { ChevronLeft, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  prefilled?: boolean;
  section?: 'personal' | 'payment' | 'travel';
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

  // Enhanced form fields with prefilled and section information
  const enhancedFormFields: FormField[] = [
    // Personal Information
    { id: 'name', type: 'text', label: 'Full Name', mandatory: true, helperText: '', prefilled: true, section: 'personal' },
    { id: 'email', type: 'text', label: 'Email', mandatory: true, helperText: '', prefilled: true, section: 'personal' },
    { id: 'phone', type: 'text', label: 'Phone', mandatory: true, helperText: '', prefilled: true, section: 'personal' },
    { id: 'gender', type: 'dropdown', label: 'Gender', mandatory: false, helperText: '', options: ['Male', 'Female', 'Other'], prefilled: false, section: 'personal' },
    { id: 'dob', type: 'date', label: 'Date of Birth', mandatory: false, helperText: '', prefilled: false, section: 'personal' },
    { id: 'city', type: 'text', label: 'City', mandatory: false, helperText: '', prefilled: false, section: 'personal' },
    { id: 'roommate', type: 'text', label: 'Preferred Roommate Name', mandatory: false, helperText: '', prefilled: false, section: 'personal' },
    { id: 'note', type: 'paragraph', label: 'Special Notes', mandatory: false, helperText: '', prefilled: false, section: 'personal' },
    
    // Travel Information (only for offline/hybrid)
    ...(programData.mode === 'offline' || programData.mode === 'hybrid' ? [
      { id: 'idType', type: 'dropdown', label: 'ID Type', mandatory: false, helperText: '', options: ['Passport', 'License', 'Aadhar'], prefilled: false, section: 'travel' },
      { id: 'idNumber', type: 'text', label: 'ID Number', mandatory: false, helperText: '', prefilled: false, section: 'travel' },
      { id: 'tshirtSize', type: 'dropdown', label: 'T-shirt Size', mandatory: false, helperText: '', options: ['XS', 'S', 'M', 'L', 'XL'], prefilled: false, section: 'travel' },
      { id: 'flightDetails', type: 'text', label: 'Flight Details', mandatory: false, helperText: '', prefilled: false, section: 'travel' }
    ] as FormField[] : [])
  ];

  // Filter fields based on user type
  const getVisibleFields = () => {
    if (previewAsExisting) {
      // Show only non-prefilled fields for existing users
      return enhancedFormFields.filter(field => !field.prefilled);
    }
    return enhancedFormFields;
  };

  const visibleFields = getVisibleFields();
  
  // Group fields by section
  const groupedFields = {
    personal: visibleFields.filter(f => f.section === 'personal'),
    payment: [], // Payment fields are handled separately
    travel: visibleFields.filter(f => f.section === 'travel')
  };

  const renderFormField = (field: FormField, index: number) => {
    const isPrefilledForExisting = previewAsExisting && field.prefilled;
    
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
      {/* Existing User Info Banner */}
      {previewAsExisting && (
        <Alert className="border-blue-200 bg-blue-50/50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            We've prefilled some information for returning seekers. Only the remaining fields are shown below.
          </AlertDescription>
        </Alert>
      )}

      {/* Personal Information Section */}
      {groupedFields.personal.length > 0 && (
        <Card className="border-stone-200/50">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-stone-800 mb-4">Personal Information</h3>
            <div className="space-y-4">
              {groupedFields.personal.map((field, index) => renderFormField(field, index))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Payment Information */}
      {programData.paymentRequired && (
        <Card className="border-stone-200/50">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-stone-800 mb-4">Payment Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-stone-800">HDB Fee *</Label>
                <Input 
                  className="rounded-2xl border-stone-200" 
                  value={`₹ ${programData.hdbFee}`}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label className="text-stone-800">MSD Fee *</Label>
                <Input 
                  className="rounded-2xl border-stone-200" 
                  value={`₹ ${programData.msdFee}`}
                  readOnly
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Travel Information */}
      {(programData.mode === 'offline' || programData.mode === 'hybrid') && groupedFields.travel.length > 0 && (
        <Card className="border-stone-200/50">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-stone-800 mb-4">Travel Information</h3>
            <div className="space-y-4">
              {groupedFields.travel.map((field, index) => renderFormField(field, index))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Show message if no fields are visible for existing user */}
      {previewAsExisting && visibleFields.length === 0 && !programData.paymentRequired && (
        <Card className="border-stone-200/50">
          <CardContent className="p-6 text-center">
            <div className="text-stone-600">
              <Info className="w-8 h-8 mx-auto mb-3 text-blue-500" />
              <p className="text-lg font-medium text-stone-800 mb-2">All Set!</p>
              <p>All required information is already available for returning seekers.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderTwoColumnLayout = () => (
    <div className="space-y-6">
      {/* Existing User Info Banner */}
      {previewAsExisting && (
        <Alert className="border-blue-200 bg-blue-50/50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            We've prefilled some information for returning seekers. Only the remaining fields are shown below.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Personal Information */}
        {groupedFields.personal.length > 0 && (
          <Card className="border-stone-200/50">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-stone-800 mb-4">Personal Information</h3>
              <div className="space-y-4">
                {groupedFields.personal.map((field, index) => renderFormField(field, index))}
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="space-y-6">
          {/* Payment Information */}
          {programData.paymentRequired && (
            <Card className="border-stone-200/50">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-stone-800 mb-4">Payment Information</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-stone-800">HDB Fee *</Label>
                    <Input 
                      className="rounded-2xl border-stone-200" 
                      value={`₹ ${programData.hdbFee}`}
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-stone-800">MSD Fee *</Label>
                    <Input 
                      className="rounded-2xl border-stone-200" 
                      value={`₹ ${programData.msdFee}`}
                      readOnly
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Travel Information */}
          {(programData.mode === 'offline' || programData.mode === 'hybrid') && groupedFields.travel.length > 0 && (
            <Card className="border-stone-200/50">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-stone-800 mb-4">Travel Information</h3>
                <div className="space-y-4">
                  {groupedFields.travel.map((field, index) => renderFormField(field, index))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Show message if no fields are visible for existing user */}
      {previewAsExisting && visibleFields.length === 0 && !programData.paymentRequired && (
        <Card className="border-stone-200/50 col-span-2">
          <CardContent className="p-6 text-center">
            <div className="text-stone-600">
              <Info className="w-8 h-8 mx-auto mb-3 text-blue-500" />
              <p className="text-lg font-medium text-stone-800 mb-2">All Set!</p>
              <p>All required information is already available for returning seekers.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderQuestionByQuestionLayout = () => {
    const currentField = visibleFields.length > 0 ? visibleFields[0] : null;
    
    return (
      <div className="space-y-6">
        {/* Existing User Info Banner */}
        {previewAsExisting && (
          <Alert className="border-blue-200 bg-blue-50/50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              We've prefilled some information for returning seekers. Only the remaining fields are shown below.
            </AlertDescription>
          </Alert>
        )}

        {currentField ? (
          <Card className="border-stone-200/50">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-stone-800 mb-4">Question 1 of {visibleFields.length}</h3>
              <div className="space-y-4">
                {renderFormField(currentField, 0)}
                <div className="flex justify-end pt-4">
                  <Button disabled className="bg-orange-400 text-white rounded-2xl">
                    Next Question
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-stone-200/50">
            <CardContent className="p-6 text-center">
              <div className="text-stone-600">
                <Info className="w-8 h-8 mx-auto mb-3 text-blue-500" />
                <p className="text-lg font-medium text-stone-800 mb-2">All Set!</p>
                <p>All required information is already available for returning seekers.</p>
              </div>
            </CardContent>
          </Card>
        )}
        
        <p className="text-sm text-stone-600 text-center italic">
          Preview shows first question only. Actual form will show one question at a time.
        </p>
      </div>
    );
  };

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
            <div className="border-2 border-dashed border-stone-200 rounded-2xl p-6 bg-stone-50/30 transition-all duration-300">
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
