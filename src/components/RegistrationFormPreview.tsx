
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Info, Edit, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ProgramData {
  programType: any;
  programName: string;
  mode: 'online' | 'offline';
  paymentRequired: boolean;
  layoutStyle: 'single-column' | 'two-column' | 'question-by-question';
  userType: 'new' | 'existing';
}

interface RegistrationFormPreviewProps {
  programData: ProgramData;
  onBack: () => void;
  onProceed: () => void;
  onEditForm: () => void;
}

const RegistrationFormPreview = ({ programData, onBack, onProceed, onEditForm }: RegistrationFormPreviewProps) => {
  const [previewUserType, setPreviewUserType] = useState<'new' | 'existing'>(programData.userType);

  const personalFields = [
    { id: 'fullName', label: 'Full Name', type: 'text', mandatory: true, prefilled: 'John Doe' },
    { id: 'gender', label: 'Gender', type: 'select', mandatory: true, options: ['Male', 'Female', 'Other', 'Prefer not to say'], prefilled: 'Male' },
    { id: 'mobile', label: 'Mobile Number', type: 'text', mandatory: true, prefilled: '+1 234 567 8900' },
    { id: 'email', label: 'Email Address', type: 'email', mandatory: true, prefilled: 'john.doe@email.com' },
    { id: 'city', label: 'City', type: 'text', mandatory: false, prefilled: 'New York' },
    { id: 'dob', label: 'Date of Birth', type: 'date', mandatory: false },
    { id: 'contact', label: 'Infinitheism Contact', type: 'text', mandatory: false },
    { id: 'roommate', label: 'Roommate Preference', type: 'text', mandatory: false },
    { id: 'notes', label: 'Notes', type: 'textarea', mandatory: false },
  ];

  const invoiceFields = [
    { id: 'invoiceName', label: 'Invoice Name', type: 'text', mandatory: true },
    { id: 'invoiceEmail', label: 'Invoice Email', type: 'email', mandatory: true },
    { id: 'gst', label: 'GST Required', type: 'switch', mandatory: false },
    { id: 'invoiceAddress', label: 'Invoice Address', type: 'textarea', mandatory: true },
    { id: 'paymentMethod', label: 'Payment Method', type: 'select', mandatory: true, options: ['Credit Card', 'Bank Transfer', 'UPI', 'Cash'] },
  ];

  const travelFields = [
    { id: 'idType', label: 'ID Type', type: 'select', mandatory: true, options: ['Passport', 'Driver License', 'National ID'] },
    { id: 'idNumber', label: 'ID Number', type: 'text', mandatory: true },
    { id: 'idUpload', label: 'Upload ID/Photo', type: 'file', mandatory: true },
    { id: 'travelOption', label: 'Travel Timing', type: 'switch', mandatory: false },
    { id: 'transport', label: 'Transportation', type: 'select', mandatory: false, options: ['Own Transport', 'City Pickup', 'Airport Pickup'] },
  ];

  const renderField = (field: any) => {
    const isPrefilled = previewUserType === 'existing' && field.prefilled;
    const fieldValue = isPrefilled ? field.prefilled : '';
    
    return (
      <div key={field.id} className="space-y-2">
        <Label className="text-stone-800 flex items-center gap-2">
          {field.label}
          {field.mandatory && <span className="text-red-500">*</span>}
          {isPrefilled && (
            <Info className="w-4 h-4 text-orange-600" title="Prefilled from existing user data" />
          )}
        </Label>
        
        {field.type === 'text' || field.type === 'email' ? (
          <Input
            value={fieldValue}
            readOnly
            className={cn(
              "rounded-2xl border-stone-200",
              isPrefilled ? "bg-stone-100 text-stone-700" : "bg-white"
            )}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        ) : field.type === 'date' ? (
          <Input
            type="date"
            value={fieldValue}
            readOnly
            className={cn(
              "rounded-2xl border-stone-200",
              isPrefilled ? "bg-stone-100 text-stone-700" : "bg-white"
            )}
          />
        ) : field.type === 'select' ? (
          <Select disabled>
            <SelectTrigger className={cn(
              "rounded-2xl border-stone-200",
              isPrefilled ? "bg-stone-100 text-stone-700" : "bg-white"
            )}>
              <SelectValue placeholder={isPrefilled ? fieldValue : `Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: string) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : field.type === 'textarea' ? (
          <Textarea
            value={fieldValue}
            readOnly
            className={cn(
              "rounded-2xl border-stone-200",
              isPrefilled ? "bg-stone-100 text-stone-700" : "bg-white"
            )}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            rows={3}
          />
        ) : field.type === 'switch' ? (
          <div className="flex items-center space-x-2">
            <Switch disabled className="data-[state=checked]:bg-orange-500" />
            <span className="text-sm text-stone-600">{field.label}</span>
          </div>
        ) : field.type === 'file' ? (
          <Input
            type="file"
            disabled
            className="rounded-2xl border-stone-200 bg-white"
          />
        ) : null}
      </div>
    );
  };

  const renderSingleColumn = () => (
    <div className="space-y-8">
      <Card className="border-stone-200/50">
        <CardHeader>
          <CardTitle className="text-lg text-stone-800">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {personalFields.map(renderField)}
        </CardContent>
      </Card>

      {programData.paymentRequired && (
        <Card className="border-stone-200/50">
          <CardHeader>
            <CardTitle className="text-lg text-stone-800">Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {invoiceFields.map(renderField)}
          </CardContent>
        </Card>
      )}

      {programData.mode === 'offline' && (
        <Card className="border-stone-200/50">
          <CardHeader>
            <CardTitle className="text-lg text-stone-800">Travel Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {travelFields.map(renderField)}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderTwoColumn = () => (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-6">
        <Card className="border-stone-200/50">
          <CardHeader>
            <CardTitle className="text-lg text-stone-800">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {personalFields.map(renderField)}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {programData.paymentRequired && (
          <Card className="border-stone-200/50">
            <CardHeader>
              <CardTitle className="text-lg text-stone-800">Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {invoiceFields.map(renderField)}
            </CardContent>
          </Card>
        )}

        {programData.mode === 'offline' && (
          <Card className="border-stone-200/50">
            <CardHeader>
              <CardTitle className="text-lg text-stone-800">Travel Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {travelFields.map(renderField)}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  const renderQuestionByQuestion = () => (
    <div className="space-y-6">
      <Card className="border-stone-200/50 bg-gradient-to-br from-orange-50 to-amber-50">
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-medium text-stone-800 mb-4">Question-by-Question Preview</h3>
          <p className="text-stone-600 mb-6">
            In this layout, participants will see one question at a time with a "Next" button to proceed.
          </p>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-200/50">
            <div className="space-y-4">
              {renderField(personalFields[0])}
              <div className="flex justify-end">
                <Button disabled className="bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-2xl">
                  Next Question
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
          <p className="text-sm text-stone-500 mt-4">
            This is a simulation. The actual form will progress through all {personalFields.length + (programData.paymentRequired ? invoiceFields.length : 0) + (programData.mode === 'offline' ? travelFields.length : 0)} questions.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-orange-50/30">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-stone-200/50 px-6 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-light text-stone-800 mb-2">Preview Registration Form</h1>
          <p className="text-stone-600">
            Based on your selections, we've generated the form your participants will fill out. You can proceed or customize it.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Preview Toggle */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-stone-700 font-medium">Previewing as:</span>
            <div className="flex items-center space-x-2">
              <Switch
                checked={previewUserType === 'existing'}
                onCheckedChange={(checked) => setPreviewUserType(checked ? 'existing' : 'new')}
                className="data-[state=checked]:bg-orange-500"
              />
              <span className="text-stone-800">
                {previewUserType === 'existing' ? 'Existing User' : 'New User'}
              </span>
            </div>
          </div>
          <div className="text-sm text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
            Layout: {programData.layoutStyle.replace('-', ' ').split(' ').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </div>
        </div>

        {/* Form Preview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-stone-200/30 p-8 mb-8">
          {programData.layoutStyle === 'single-column' && renderSingleColumn()}
          {programData.layoutStyle === 'two-column' && renderTwoColumn()}
          {programData.layoutStyle === 'question-by-question' && renderQuestionByQuestion()}
        </div>

        {/* Interaction Block */}
        <Card className="border-stone-200/50 bg-gradient-to-r from-stone-50 to-orange-50/50">
          <CardContent className="p-8">
            <h3 className="text-lg font-medium text-stone-800 mb-4">
              Is this form ready to go, or do you want to make changes?
            </h3>
            <div className="flex items-center space-x-4">
              <Button
                onClick={onProceed}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-2xl text-white shadow-lg"
              >
                <Check className="w-4 h-4 mr-2" />
                Use This Form As-Is
              </Button>
              <Button
                onClick={onEditForm}
                variant="outline"
                className="rounded-2xl border-orange-200 text-orange-700 hover:bg-orange-50"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Form Fields
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Navigation */}
      <div className="bg-gradient-to-r from-stone-50 to-orange-50/50 px-6 py-6 border-t border-stone-200/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Button
            onClick={onBack}
            variant="outline"
            className="rounded-2xl border-stone-300 text-stone-700 hover:bg-stone-50"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Schedule
          </Button>
          <div className="text-sm text-stone-500">
            Step 3 of 4 • Preview Registration Form
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationFormPreview;
