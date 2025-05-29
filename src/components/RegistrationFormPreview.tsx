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
      <div key={field.id} className="space-y-3">
        <Label className={cn(
          "label-text text-gray-900 flex items-center gap-1",
          isPrefilledForExisting && "text-gray-600"
        )}>
          {field.label}
          {field.mandatory && <span className="text-red-500">*</span>}
          {isPrefilledForExisting && <Info className="w-3 h-3 text-blue-500" />}
        </Label>
        {field.helperText && (
          <p className="description-text">{field.helperText}</p>
        )}
        
        {field.type === 'text' && (
          <Input 
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isPrefilledForExisting && "bg-gray-50 text-gray-600"
            )}
            placeholder={isPrefilledForExisting ? "John Doe" : `Enter ${field.label.toLowerCase()}`}
            value={isPrefilledForExisting ? "John Doe" : ""}
            readOnly
          />
        )}
        
        {field.type === 'date' && (
          <Input 
            type="date" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
            readOnly
          />
        )}
        
        {field.type === 'file' && (
          <Input 
            type="file" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2" 
            disabled
          />
        )}
        
        {field.type === 'dropdown' && (
          <Select disabled>
            <SelectTrigger className="rounded-md border border-input">
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
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
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
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            We've prefilled some information for returning seekers. Only the remaining fields are shown below.
          </AlertDescription>
        </Alert>
      )}

      {/* Personal Information Section */}
      {groupedFields.personal.length > 0 && (
        <Card className="border-0 shadow-lg card-hover">
          <CardContent className="p-6">
            <h3 className="section-title mb-4">Personal Information</h3>
            <div className="space-y-6">
              {groupedFields.personal.map((field, index) => renderFormField(field, index))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Payment Information */}
      {programData.paymentRequired && (
        <Card className="border-0 shadow-lg card-hover">
          <CardContent className="p-6">
            <h3 className="section-title mb-4">Payment Information</h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="label-text text-gray-900">HDB Fee *</Label>
                <Input 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2" 
                  value={`₹ ${programData.hdbFee}`}
                  readOnly
                />
              </div>
              <div className="space-y-3">
                <Label className="label-text text-gray-900">MSD Fee *</Label>
                <Input 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2" 
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
        <Card className="border-0 shadow-lg card-hover">
          <CardContent className="p-6">
            <h3 className="section-title mb-4">Travel Information</h3>
            <div className="space-y-6">
              {groupedFields.travel.map((field, index) => renderFormField(field, index))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Show message if no fields are visible for existing user */}
      {previewAsExisting && visibleFields.length === 0 && !programData.paymentRequired && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-gray-600">
              <Info className="w-8 h-8 mx-auto mb-3 text-blue-500" />
              <p className="section-title mb-2">All Set!</p>
              <p className="description-text">All required information is already available for returning seekers.</p>
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
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            We've prefilled some information for returning seekers. Only the remaining fields are shown below.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        {groupedFields.personal.length > 0 && (
          <Card className="border-0 shadow-lg card-hover">
            <CardContent className="p-6">
              <h3 className="section-title mb-4">Personal Information</h3>
              <div className="space-y-6">
                {groupedFields.personal.map((field, index) => renderFormField(field, index))}
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="space-y-6">
          {/* Payment Information */}
          {programData.paymentRequired && (
            <Card className="border-0 shadow-lg card-hover">
              <CardContent className="p-6">
                <h3 className="section-title mb-4">Payment Information</h3>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="label-text text-gray-900">HDB Fee *</Label>
                    <Input 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2" 
                      value={`₹ ${programData.hdbFee}`}
                      readOnly
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="label-text text-gray-900">MSD Fee *</Label>
                    <Input 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2" 
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
            <Card className="border-0 shadow-lg card-hover">
              <CardContent className="p-6">
                <h3 className="section-title mb-4">Travel Information</h3>
                <div className="space-y-6">
                  {groupedFields.travel.map((field, index) => renderFormField(field, index))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Show message if no fields are visible for existing user */}
      {previewAsExisting && visibleFields.length === 0 && !programData.paymentRequired && (
        <Card className="border-0 shadow-lg col-span-2">
          <CardContent className="p-6 text-center">
            <div className="text-gray-600">
              <Info className="w-8 h-8 mx-auto mb-3 text-blue-500" />
              <p className="section-title mb-2">All Set!</p>
              <p className="description-text">All required information is already available for returning seekers.</p>
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
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              We've prefilled some information for returning seekers. Only the remaining fields are shown below.
            </AlertDescription>
          </Alert>
        )}

        {currentField ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="section-title mb-4">Question 1 of {visibleFields.length}</h3>
              <div className="space-y-6">
                {renderFormField(currentField, 0)}
                <div className="flex justify-end pt-4">
                  <Button disabled className="primary-button">
                    Next Question
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-gray-600">
                <Info className="w-8 h-8 mx-auto mb-3 text-blue-500" />
                <p className="section-title mb-2">All Set!</p>
                <p className="description-text">All required information is already available for returning seekers.</p>
              </div>
            </CardContent>
          </Card>
        )}
        
        <p className="description-text text-center italic">
          Preview shows first question only. Actual form will show one question at a time.
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 fade-in">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="main-title">Preview Registration Form</h1>
          <p className="description-text mt-2">
            Based on your selections, we've generated the form your participants will fill out. You can proceed or customize it.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-xl border-0 overflow-hidden">
          <div className="p-8">
            {/* User Type Toggle */}
            <div className="flex items-center justify-between mb-8 p-6 bg-gray-50 rounded-lg">
              <div>
                <Label className="label-text text-gray-900 font-medium">Preview Mode</Label>
                <p className="description-text mt-1">Toggle to see how the form appears for different user types</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={cn("text-sm", !previewAsExisting ? "text-gray-900 font-medium" : "text-gray-600")}>
                  New User
                </span>
                <Switch
                  checked={previewAsExisting}
                  onCheckedChange={setPreviewAsExisting}
                  className="data-[state=checked]:bg-blue-500"
                />
                <span className={cn("text-sm", previewAsExisting ? "text-gray-900 font-medium" : "text-gray-600")}>
                  Existing User
                </span>
              </div>
            </div>

            {/* Form Preview */}
            <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 bg-blue-50/30 transition-all duration-300">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="section-title">
                    {programData.programName} Registration
                  </h2>
                  <span className="text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded-full font-medium">
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
              <h3 className="section-title mb-6">
                Is this form ready to go, or do you want to make changes?
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Button
                  onClick={onProceed}
                  className="primary-button"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                  }}
                >
                  ✅ Use This Form As-Is
                </Button>
                <Button
                  onClick={onEditForm}
                  variant="outline"
                  className="px-8 py-3 text-base font-medium rounded-full border-blue-400 text-blue-600 hover:bg-blue-50 transition-all duration-300"
                >
                  ✏️ Edit Form Fields
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 border-t sticky bottom-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            onClick={onBack}
            variant="outline"
            className="px-6 py-2 text-sm font-medium rounded-full border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300"
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
