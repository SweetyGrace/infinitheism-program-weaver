import React, { useState } from 'react';
import { ChevronLeft, Info, User, Edit, Save, Plus, Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface ProgramData {
  programType: string;
  programName: string;
  mode: 'online' | 'offline' | 'hybrid';
  paymentRequired: boolean;
  hdbFee: number;
  msdFee: number;
  venueAddress: string;
  travelRequired: boolean;
}

interface PreviewUserFormProps {
  programData: ProgramData;
  onBack: () => void;
  onEditFormFields: () => void;
  onSaveAndExit: () => void;
}

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'select' | 'textarea' | 'date' | 'file' | 'toggle';
  mandatory: boolean;
  prefilled: boolean;
  section: 'personal' | 'invoice' | 'travel';
  options?: string[];
}

const PreviewUserForm: React.FC<PreviewUserFormProps> = ({
  programData,
  onBack,
  onEditFormFields,
  onSaveAndExit
}) => {
  const [userType, setUserType] = useState<'new' | 'existing'>('new');
  const [layoutStyle, setLayoutStyle] = useState<'single-column' | 'two-column' | 'question-by-question'>('single-column');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const isExistingUser = userType === 'existing';

  // Define all form fields based on the requirements
  const formFields: FormField[] = [
    // Personal Info
    { id: 'fullName', label: 'Full Name', type: 'text', mandatory: true, prefilled: true, section: 'personal' },
    { id: 'gender', label: 'Gender', type: 'select', mandatory: false, prefilled: false, section: 'personal', options: ['Male', 'Female', 'Other', 'Prefer not to say'] },
    { id: 'mobile', label: 'Mobile Number', type: 'text', mandatory: true, prefilled: true, section: 'personal' },
    { id: 'email', label: 'Email Address', type: 'email', mandatory: true, prefilled: true, section: 'personal' },
    { id: 'dob', label: 'Date of Birth', type: 'date', mandatory: false, prefilled: false, section: 'personal' },
    { id: 'infinitheismContact', label: 'Infinitheism Contact', type: 'text', mandatory: false, prefilled: false, section: 'personal' },
    { id: 'city', label: 'City', type: 'text', mandatory: false, prefilled: false, section: 'personal' },
    { id: 'roommate', label: 'Preferred Roommate\'s Name', type: 'text', mandatory: false, prefilled: false, section: 'personal' },
    { id: 'note', label: 'Note', type: 'textarea', mandatory: false, prefilled: false, section: 'personal' },

    // Invoice Details
    { id: 'invoiceName', label: 'Name for Invoice', type: 'text', mandatory: false, prefilled: false, section: 'invoice' },
    { id: 'invoiceEmail', label: 'Email Address for Invoice', type: 'email', mandatory: false, prefilled: false, section: 'invoice' },
    { id: 'gstRegistered', label: 'Registered under Indian GST', type: 'toggle', mandatory: false, prefilled: false, section: 'invoice' },
    { id: 'invoiceAddress', label: 'Address for Invoice', type: 'textarea', mandatory: false, prefilled: false, section: 'invoice' },
    { id: 'tds', label: 'TDS', type: 'text', mandatory: false, prefilled: false, section: 'invoice' },
    { id: 'tan', label: 'TAN', type: 'text', mandatory: false, prefilled: false, section: 'invoice' },
    { id: 'paymentMethod', label: 'Payment Method', type: 'select', mandatory: false, prefilled: false, section: 'invoice', options: ['Credit Card', 'Debit Card', 'UPI', 'Bank Transfer'] },
    { id: 'amount', label: 'Amount', type: 'text', mandatory: false, prefilled: false, section: 'invoice' },
    { id: 'handoverDate', label: 'Handover Date', type: 'date', mandatory: false, prefilled: false, section: 'invoice' },
    { id: 'handoverTo', label: 'Handover To', type: 'text', mandatory: false, prefilled: false, section: 'invoice' },

    // Travel Info (only show if offline or hybrid)
    ...(programData.mode === 'offline' || programData.mode === 'hybrid' ? [
      { id: 'idType', label: 'ID Type', type: 'select' as const, mandatory: false, prefilled: false, section: 'travel' as const, options: ['Passport', 'Driving License', 'Aadhar Card', 'PAN Card'] },
      { id: 'idNumber', label: 'ID Number', type: 'text' as const, mandatory: false, prefilled: false, section: 'travel' as const },
      { id: 'idPicture', label: 'Upload ID Picture', type: 'file' as const, mandatory: false, prefilled: false, section: 'travel' as const },
      { id: 'userPicture', label: 'Upload Your Picture', type: 'file' as const, mandatory: false, prefilled: false, section: 'travel' as const },
      { id: 'tshirtSize', label: 'T-shirt Size', type: 'select' as const, mandatory: false, prefilled: false, section: 'travel' as const, options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
      { id: 'travelUpdate', label: 'Travel Details: Update now / later', type: 'toggle' as const, mandatory: false, prefilled: false, section: 'travel' as const },
      { id: 'airlineName', label: 'Flight: Airline Name', type: 'text' as const, mandatory: false, prefilled: false, section: 'travel' as const },
      { id: 'flightNumber', label: 'Flight: Number', type: 'text' as const, mandatory: false, prefilled: false, section: 'travel' as const },
      { id: 'arrivalDateTime', label: 'Arrival Date & Time', type: 'date' as const, mandatory: false, prefilled: false, section: 'travel' as const },
      { id: 'comingFrom', label: 'Coming From', type: 'text' as const, mandatory: false, prefilled: false, section: 'travel' as const },
      { id: 'pickupTime', label: 'Airport Pickup Time', type: 'text' as const, mandatory: false, prefilled: false, section: 'travel' as const },
      { id: 'checkInTime', label: 'Own Transport: Check-in Time & Location', type: 'text' as const, mandatory: false, prefilled: false, section: 'travel' as const },
      { id: 'cityPickup', label: 'City Pickup: Time and Location', type: 'text' as const, mandatory: false, prefilled: false, section: 'travel' as const }
    ] : [])
  ];

  const renderFormField = (field: FormField, showTooltip: boolean = false) => {
    const fieldValue = field.prefilled && isExistingUser ? "John Doe" : "";
    const fieldPlaceholder = field.prefilled && isExistingUser ? "John Doe" : `Enter ${field.label.toLowerCase()}`;

    return (
      <div key={field.id} className="space-y-2">
        <Label className={cn(
          "text-stone-800 flex items-center gap-2",
          field.prefilled && isExistingUser && "text-stone-600"
        )}>
          {field.label}
          {field.mandatory && <span className="text-red-500">*</span>}
          {field.prefilled && isExistingUser && <Info className="w-3 h-3 text-stone-500" />}
          {showTooltip && (
            <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded-full">
              Auto-added due to {programData.mode} mode
            </span>
          )}
        </Label>
        
        {field.type === 'text' || field.type === 'email' ? (
          <Input 
            type={field.type}
            className={cn(
              "rounded-2xl border-stone-200",
              field.prefilled && isExistingUser && "bg-stone-50 text-stone-600"
            )}
            placeholder={fieldPlaceholder}
            value={fieldValue}
            readOnly
          />
        ) : field.type === 'textarea' ? (
          <Textarea 
            className={cn(
              "rounded-2xl border-stone-200",
              field.prefilled && isExistingUser && "bg-stone-50 text-stone-600"
            )}
            placeholder={fieldPlaceholder}
            value={fieldValue}
            readOnly
          />
        ) : field.type === 'select' ? (
          <Select disabled>
            <SelectTrigger className="rounded-2xl border-stone-200">
              <SelectValue placeholder={fieldPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option.toLowerCase()}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : field.type === 'date' ? (
          <Input 
            type="date"
            className="rounded-2xl border-stone-200"
            readOnly
          />
        ) : field.type === 'file' ? (
          <Input 
            type="file"
            className="rounded-2xl border-stone-200"
            disabled
          />
        ) : field.type === 'toggle' ? (
          <div className="flex items-center space-x-2">
            <Switch disabled />
            <span className="text-sm text-stone-600">No</span>
          </div>
        ) : null}
      </div>
    );
  };

  const groupedFields = {
    personal: formFields.filter(f => f.section === 'personal'),
    invoice: formFields.filter(f => f.section === 'invoice'),
    travel: formFields.filter(f => f.section === 'travel')
  };

  const renderSingleColumnLayout = () => (
    <div className="space-y-8">
      <Card className="border-stone-200/50">
        <CardHeader>
          <CardTitle className="text-lg text-stone-800 flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {groupedFields.personal.map(field => renderFormField(field))}
        </CardContent>
      </Card>
      
      {programData.paymentRequired && (
        <Card className="border-stone-200/50">
          <CardHeader>
            <CardTitle className="text-lg text-stone-800">Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {groupedFields.invoice.map(field => renderFormField(field))}
          </CardContent>
        </Card>
      )}
      
      {(programData.mode === 'offline' || programData.mode === 'hybrid') && groupedFields.travel.length > 0 && (
        <Card className="border-stone-200/50">
          <CardHeader>
            <CardTitle className="text-lg text-stone-800">Travel Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {groupedFields.travel.map(field => renderFormField(field, true))}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderTwoColumnLayout = () => (
    <div className="space-y-8">
      <Card className="border-stone-200/50">
        <CardHeader>
          <CardTitle className="text-lg text-stone-800 flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groupedFields.personal.map(field => renderFormField(field))}
          </div>
        </CardContent>
      </Card>
      
      {programData.paymentRequired && (
        <Card className="border-stone-200/50">
          <CardHeader>
            <CardTitle className="text-lg text-stone-800">Invoice Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groupedFields.invoice.map(field => renderFormField(field))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {(programData.mode === 'offline' || programData.mode === 'hybrid') && groupedFields.travel.length > 0 && (
        <Card className="border-stone-200/50">
          <CardHeader>
            <CardTitle className="text-lg text-stone-800">Travel Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groupedFields.travel.map(field => renderFormField(field, true))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderQuestionByQuestionLayout = () => {
    const allFields = [...groupedFields.personal, ...groupedFields.invoice, ...groupedFields.travel];
    const currentField = allFields[currentQuestionIndex];
    
    if (!currentField) return null;

    return (
      <div className="space-y-6">
        <Card className="border-stone-200/50">
          <CardHeader>
            <CardTitle className="text-lg text-stone-800">
              Question {currentQuestionIndex + 1} of {allFields.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderFormField(currentField)}
            <div className="flex justify-between pt-4">
              <Button
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                variant="outline"
                className="rounded-2xl"
              >
                Previous
              </Button>
              <Button
                onClick={() => setCurrentQuestionIndex(Math.min(allFields.length - 1, currentQuestionIndex + 1))}
                disabled={currentQuestionIndex === allFields.length - 1}
                className="bg-orange-500 hover:bg-orange-600 rounded-2xl text-white"
              >
                Next Question
              </Button>
            </div>
          </CardContent>
        </Card>
        <p className="text-sm text-stone-600 text-center italic">
          Preview shows step-by-step experience. Actual form will guide users one question at a time.
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-orange-50/30">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-stone-200/50 px-6 py-4 shadow-sm">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light text-stone-800">Preview User Form</h1>
            <p className="text-stone-600 mt-1">
              See how participants will experience the registration process
            </p>
          </div>
          
          {/* Top Controls */}
          <div className="flex items-center space-x-6">
            {/* User Type Toggle */}
            <div className="flex items-center space-x-3">
              <span className={cn("text-sm", !isExistingUser ? "text-stone-800 font-medium" : "text-stone-600")}>
                New User
              </span>
              <Switch
                checked={isExistingUser}
                onCheckedChange={(checked) => setUserType(checked ? 'existing' : 'new')}
                className="data-[state=checked]:bg-orange-500"
              />
              <span className={cn("text-sm", isExistingUser ? "text-stone-800 font-medium" : "text-stone-600")}>
                Existing User
              </span>
            </div>

            {/* Layout Selector */}
            <Select value={layoutStyle} onValueChange={(value: any) => setLayoutStyle(value)}>
              <SelectTrigger className="w-56 rounded-2xl border-stone-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border border-stone-200 shadow-lg">
                <SelectItem value="single-column">Single Column</SelectItem>
                <SelectItem value="two-column">Two Column</SelectItem>
                <SelectItem value="question-by-question">Question by Question</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-stone-200/30 overflow-hidden">
          <div className="p-8">
            {/* Form Preview */}
            <div className="border-2 border-dashed border-stone-200 rounded-2xl p-6 bg-stone-50/30">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-medium text-stone-800">
                    {programData.programName} Registration
                  </h2>
                  <span className="text-sm text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
                    {layoutStyle.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Layout
                  </span>
                </div>

                {layoutStyle === 'single-column' && renderSingleColumnLayout()}
                {layoutStyle === 'two-column' && renderTwoColumnLayout()}
                {layoutStyle === 'question-by-question' && renderQuestionByQuestionLayout()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="bg-gradient-to-r from-stone-50 to-orange-50/50 px-8 py-6 border-t border-stone-200/50 sticky bottom-0">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <Button
            onClick={onBack}
            variant="outline"
            className="rounded-2xl border-stone-300 text-stone-700 hover:bg-stone-50"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Confirmation
          </Button>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={onSaveAndExit}
              variant="ghost"
              className="text-stone-600 hover:text-stone-800 hover:bg-stone-50 rounded-2xl"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Preview & Exit
            </Button>
            <Button
              onClick={onEditFormFields}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-2xl text-white shadow-lg px-8"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Form Fields
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewUserForm;
