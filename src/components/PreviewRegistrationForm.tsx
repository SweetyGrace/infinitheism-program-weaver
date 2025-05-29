
import React, { useState } from 'react';
import { ChevronLeft, Info, User, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface PreviewRegistrationFormProps {
  programData: ProgramData;
  onBack: () => void;
  onConfigureFields: () => void;
  onSaveDraft: () => void;
}

const PreviewRegistrationForm: React.FC<PreviewRegistrationFormProps> = ({
  programData,
  onBack,
  onConfigureFields,
  onSaveDraft
}) => {
  const [userType, setUserType] = useState<'new' | 'existing'>('new');
  const [layoutStyle, setLayoutStyle] = useState<'single-column' | 'two-column' | 'question-by-question'>('single-column');

  const isExistingUser = userType === 'existing';

  const renderFormField = (
    label: string,
    type: string = 'text',
    mandatory: boolean = false,
    prefilled: boolean = false,
    placeholder?: string
  ) => {
    const fieldValue = prefilled && isExistingUser ? "John Doe" : "";
    const fieldPlaceholder = prefilled && isExistingUser ? "John Doe" : placeholder || `Enter ${label.toLowerCase()}`;

    return (
      <div className="form-field-spacing">
        <Label className={cn(
          "label-text flex items-center gap-1",
          prefilled && isExistingUser && "text-gray-600"
        )}>
          {label}
          {mandatory && <span className="text-red-500">*</span>}
          {prefilled && isExistingUser && <Info className="w-3 h-3 text-blue-500" />}
        </Label>
        
        {type === 'text' && (
          <Input 
            className={cn(
              "form-input",
              prefilled && isExistingUser && "bg-gray-50 text-gray-600"
            )}
            placeholder={fieldPlaceholder}
            value={fieldValue}
            readOnly
          />
        )}
        
        {type === 'textarea' && (
          <Textarea 
            className={cn(
              "form-input",
              prefilled && isExistingUser && "bg-gray-50 text-gray-600"
            )}
            placeholder={fieldPlaceholder}
            value={fieldValue}
            readOnly
          />
        )}
        
        {type === 'select' && (
          <Select disabled>
            <SelectTrigger className="form-input">
              <SelectValue placeholder={fieldPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
    );
  };

  const personalInfoFields = [
    { label: 'Name', type: 'text', mandatory: true, prefilled: true },
    { label: 'Email', type: 'text', mandatory: true, prefilled: true },
    { label: 'Phone', type: 'text', mandatory: true, prefilled: true },
    { label: 'Age', type: 'text', mandatory: false, prefilled: false }
  ];

  const paymentFields = [
    { label: 'HDB Fee', type: 'currency', mandatory: true, value: programData.hdbFee },
    { label: 'MSD Fee', type: 'currency', mandatory: true, value: programData.msdFee }
  ];

  const travelFields = [
    { label: 'Venue Address', type: 'textarea', mandatory: false, value: programData.venueAddress }
  ];

  const renderSingleColumnLayout = () => (
    <div className="form-section-spacing">
      <Card className="card-main card-hover group">
        <CardHeader className="section-bg p-8 border-b">
          <CardTitle className="section-title flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="form-section-spacing p-6">
          {personalInfoFields.map((field, index) => 
            renderFormField(field.label, field.type, field.mandatory, field.prefilled)
          )}
        </CardContent>
      </Card>
      
      {programData.paymentRequired && (
        <Card className="card-main card-hover group">
          <CardHeader className="section-bg p-8 border-b">
            <CardTitle className="section-title">Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="form-section-spacing p-6">
            {paymentFields.map((field, index) => (
              <div key={index} className="form-field-spacing">
                <Label className="label-text">
                  {field.label} <span className="text-red-500">*</span>
                </Label>
                <Input 
                  className="form-input" 
                  value={`₹ ${field.value}`}
                  readOnly
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      {(programData.mode === 'offline' || programData.mode === 'hybrid') && (
        <Card className="card-main card-hover group">
          <CardHeader className="section-bg p-8 border-b">
            <CardTitle className="section-title">Travel Information</CardTitle>
          </CardHeader>
          <CardContent className="form-section-spacing p-6">
            {travelFields.map((field, index) => (
              <div key={index} className="form-field-spacing">
                <Label className="label-text">{field.label}</Label>
                <Textarea 
                  className="form-input" 
                  value={field.value}
                  readOnly
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderTwoColumnLayout = () => (
    <div className="form-section-spacing">
      <Card className="card-main card-hover group">
        <CardHeader className="section-bg p-8 border-b">
          <CardTitle className="section-title flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            {personalInfoFields.map((field, index) => 
              renderFormField(field.label, field.type, field.mandatory, field.prefilled)
            )}
          </div>
        </CardContent>
      </Card>
      
      {programData.paymentRequired && (
        <Card className="card-main card-hover group">
          <CardHeader className="section-bg p-8 border-b">
            <CardTitle className="section-title">Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-2">
              {paymentFields.map((field, index) => (
                <div key={index} className="form-field-spacing">
                  <Label className="label-text">
                    {field.label} <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    className="form-input" 
                    value={`₹ ${field.value}`}
                    readOnly
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {(programData.mode === 'offline' || programData.mode === 'hybrid') && (
        <Card className="card-main card-hover group">
          <CardHeader className="section-bg p-8 border-b">
            <CardTitle className="section-title">Travel Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-2">
              {travelFields.map((field, index) => (
                <div key={index} className="form-field-spacing">
                  <Label className="label-text">{field.label}</Label>
                  <Textarea 
                    className="form-input" 
                    value={field.value}
                    readOnly
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderQuestionByQuestionLayout = () => (
    <div className="form-section-spacing">
      <Card className="card-main">
        <CardHeader className="section-bg p-8 border-b">
          <CardTitle className="section-title">Question 1 of 7</CardTitle>
        </CardHeader>
        <CardContent className="form-section-spacing p-6">
          {renderFormField('Name', 'text', true, true)}
          <div className="flex justify-end pt-4">
            <Button disabled className="primary-button">
              Next Question
            </Button>
          </div>
        </CardContent>
      </Card>
      <p className="description-text text-center italic">
        Preview shows first question only. Actual form will show one question at a time.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen gradient-bg fade-in">
      {/* Header */}
      <div className="bg-white shadow-sm border-b container-main py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="main-title">Preview Registration Form</h1>
          <p className="description-text mt-2">
            Based on your selections, we've generated the form your participants will fill out. You can proceed or customize it.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-form">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden card-main">
          <div className="p-8">
            {/* User Type Toggle */}
            <div className="flex items-center justify-between mb-8 p-6 section-bg rounded-lg">
              <div>
                <Label className="label-text font-medium">Preview Mode</Label>
                <p className="description-text mt-1">Toggle to see how the form appears for different user types</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={cn("text-sm", !isExistingUser ? "text-gray-900 font-medium" : "text-gray-600")}>
                  New User
                </span>
                <Switch
                  checked={isExistingUser}
                  onCheckedChange={(checked) => setUserType(checked ? 'existing' : 'new')}
                  className="data-[state=checked]:bg-blue-500"
                />
                <span className={cn("text-sm", isExistingUser ? "text-gray-900 font-medium" : "text-gray-600")}>
                  Existing User
                </span>
              </div>
            </div>

            {/* Layout Selector */}
            <div className="flex items-center justify-between mb-8 p-6 section-bg rounded-lg">
              <div>
                <Label className="label-text font-medium">Layout Style</Label>
                <p className="description-text mt-1">Choose how form fields are arranged</p>
              </div>
              <Select value={layoutStyle} onValueChange={(value: any) => setLayoutStyle(value)}>
                <SelectTrigger className="w-64 form-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single-column">Single Column</SelectItem>
                  <SelectItem value="two-column">Two Column</SelectItem>
                  <SelectItem value="question-by-question">Question by Question</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Form Preview */}
            <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 bg-blue-50/30">
              <div className="bg-white rounded-lg p-6 card-secondary">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="section-title">
                    {programData.programName} Registration
                  </h2>
                  <span className="text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded-full font-medium">
                    {layoutStyle.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Layout
                  </span>
                </div>

                {layoutStyle === 'single-column' && renderSingleColumnLayout()}
                {layoutStyle === 'two-column' && renderTwoColumnLayout()}
                {layoutStyle === 'question-by-question' && renderQuestionByQuestionLayout()}
              </div>
            </div>

            {/* Action Section */}
            <div className="mt-8 text-center">
              <h3 className="section-title mb-6">
                Is this form ready to go, or do you want to make changes?
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Button
                  onClick={onConfigureFields}
                  className="primary-button"
                  style={{
                    backgroundImage: "url('/lovable-uploads/203da045-4558-4833-92ac-07479a336dfb.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  ✅ Use This Form As-Is
                </Button>
                <Button
                  onClick={onConfigureFields}
                  variant="outline"
                  className="outline-button"
                >
                  ✏️ Edit Form Fields
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="section-bg border-t sticky bottom-0 container-main py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            onClick={onBack}
            variant="outline"
            className="outline-button"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={onSaveDraft}
            variant="ghost"
            className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-6 py-2 text-sm font-medium rounded-full transition-all duration-300"
          >
            Save as Draft
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreviewRegistrationForm;
