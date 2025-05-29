
import React, { useState } from 'react';
import { ChevronLeft, Info, User, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
      <div className="space-y-2">
        <Label className={cn(
          "text-stone-800 flex items-center gap-1",
          prefilled && isExistingUser && "text-stone-600"
        )}>
          {label}
          {mandatory && <span className="text-red-500">*</span>}
          {prefilled && isExistingUser && <Info className="w-3 h-3 text-stone-500" />}
        </Label>
        
        {type === 'text' && (
          <Input 
            className={cn(
              "rounded-2xl border-stone-200",
              prefilled && isExistingUser && "bg-stone-50 text-stone-600"
            )}
            placeholder={fieldPlaceholder}
            value={fieldValue}
            readOnly
          />
        )}
        
        {type === 'textarea' && (
          <Textarea 
            className={cn(
              "rounded-2xl border-stone-200",
              prefilled && isExistingUser && "bg-stone-50 text-stone-600"
            )}
            placeholder={fieldPlaceholder}
            value={fieldValue}
            readOnly
          />
        )}
        
        {type === 'select' && (
          <Select disabled>
            <SelectTrigger className="rounded-2xl border-stone-200">
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
    <div className="space-y-6">
      <Card className="border-stone-200/50">
        <CardHeader>
          <CardTitle className="text-lg text-stone-800">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {personalInfoFields.map((field, index) => 
            renderFormField(field.label, field.type, field.mandatory, field.prefilled)
          )}
        </CardContent>
      </Card>
      
      {programData.paymentRequired && (
        <Card className="border-stone-200/50">
          <CardHeader>
            <CardTitle className="text-lg text-stone-800">Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentFields.map((field, index) => (
              <div key={index} className="space-y-2">
                <Label className="text-stone-800">{field.label} *</Label>
                <Input 
                  className="rounded-2xl border-stone-200" 
                  value={`₹ ${field.value}`}
                  readOnly
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      {(programData.mode === 'offline' || programData.mode === 'hybrid') && (
        <Card className="border-stone-200/50">
          <CardHeader>
            <CardTitle className="text-lg text-stone-800">Travel Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {travelFields.map((field, index) => (
              <div key={index} className="space-y-2">
                <Label className="text-stone-800">{field.label}</Label>
                <Textarea 
                  className="rounded-2xl border-stone-200" 
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
    <div className="space-y-6">
      <Card className="border-stone-200/50">
        <CardHeader>
          <CardTitle className="text-lg text-stone-800">Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {personalInfoFields.map((field, index) => 
              renderFormField(field.label, field.type, field.mandatory, field.prefilled)
            )}
          </div>
        </CardContent>
      </Card>
      
      {programData.paymentRequired && (
        <Card className="border-stone-200/50">
          <CardHeader>
            <CardTitle className="text-lg text-stone-800">Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {paymentFields.map((field, index) => (
                <div key={index} className="space-y-2">
                  <Label className="text-stone-800">{field.label} *</Label>
                  <Input 
                    className="rounded-2xl border-stone-200" 
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
        <Card className="border-stone-200/50">
          <CardHeader>
            <CardTitle className="text-lg text-stone-800">Travel Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {travelFields.map((field, index) => (
                <div key={index} className="space-y-2">
                  <Label className="text-stone-800">{field.label}</Label>
                  <Textarea 
                    className="rounded-2xl border-stone-200" 
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
    <div className="space-y-6">
      <Card className="border-stone-200/50">
        <CardHeader>
          <CardTitle className="text-lg text-stone-800">Question 1 of 7</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderFormField('Name', 'text', true, true)}
          <div className="flex justify-end pt-4">
            <Button disabled className="bg-orange-400 text-white rounded-2xl">
              Next Question
            </Button>
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
            </div>

            {/* Layout Selector */}
            <div className="flex items-center justify-between mb-8 p-4 bg-stone-50/50 rounded-2xl border border-stone-200/50">
              <div>
                <Label className="text-stone-800 font-medium">Layout Style</Label>
                <p className="text-sm text-stone-600">Choose how form fields are arranged</p>
              </div>
              <Select value={layoutStyle} onValueChange={(value: any) => setLayoutStyle(value)}>
                <SelectTrigger className="w-64 rounded-2xl border-stone-200">
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

            {/* Action Section */}
            <div className="mt-8 text-center">
              <h3 className="text-lg font-medium text-stone-800 mb-4">
                Is this form ready to go, or do you want to make changes?
              </h3>
              <div className="flex items-center justify-center space-x-4">
                <Button
                  onClick={onConfigureFields}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-2xl text-white shadow-lg px-8"
                >
                  ✅ Use This Form As-Is
                </Button>
                <Button
                  onClick={onConfigureFields}
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
          <Button
            onClick={onSaveDraft}
            variant="ghost"
            className="text-stone-600 hover:text-stone-800 hover:bg-stone-50 rounded-2xl"
          >
            Save as Draft
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreviewRegistrationForm;
