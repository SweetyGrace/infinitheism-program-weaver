
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
  const [layoutStyle, setLayoutStyle] = useState<'single-column' | 'multi-column' | 'question-by-question'>('single-column');
  const [personalInfoOpen, setPersonalInfoOpen] = useState(true);
  const [invoiceInfoOpen, setInvoiceInfoOpen] = useState(true);
  const [travelInfoOpen, setTravelInfoOpen] = useState(true);

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

  const renderPersonalInfoSection = () => (
    <Collapsible open={personalInfoOpen} onOpenChange={setPersonalInfoOpen}>
      <CollapsibleTrigger asChild>
        <CardHeader className="cursor-pointer hover:bg-stone-50/50 transition-colors">
          <CardTitle className="text-lg text-stone-800 flex items-center justify-between">
            Personal Information
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
              4 fields
            </span>
          </CardTitle>
        </CardHeader>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <CardContent className="space-y-4">
          {renderFormField('Name', 'text', true, true)}
          {renderFormField('Email', 'text', true, true)}
          {renderFormField('Phone', 'text', true, true)}
          {renderFormField('Age', 'text', false, false)}
        </CardContent>
      </CollapsibleContent>
    </Collapsible>
  );

  const renderInvoiceInfoSection = () => (
    <Collapsible open={invoiceInfoOpen} onOpenChange={setInvoiceInfoOpen}>
      <CollapsibleTrigger asChild>
        <CardHeader className="cursor-pointer hover:bg-stone-50/50 transition-colors">
          <CardTitle className="text-lg text-stone-800 flex items-center justify-between">
            Payment Information
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
              2 fields
            </span>
          </CardTitle>
        </CardHeader>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <CardContent className="space-y-4">
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
        </CardContent>
      </CollapsibleContent>
    </Collapsible>
  );

  const renderTravelInfoSection = () => (
    <Collapsible open={travelInfoOpen} onOpenChange={setTravelInfoOpen}>
      <CollapsibleTrigger asChild>
        <CardHeader className="cursor-pointer hover:bg-stone-50/50 transition-colors">
          <CardTitle className="text-lg text-stone-800 flex items-center justify-between">
            Travel Information
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
              1 field
            </span>
          </CardTitle>
        </CardHeader>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-stone-800">Venue Address</Label>
            <Textarea 
              className="rounded-2xl border-stone-200" 
              value={programData.venueAddress}
              readOnly
            />
          </div>
        </CardContent>
      </CollapsibleContent>
    </Collapsible>
  );

  const renderSingleColumnLayout = () => (
    <div className="space-y-6">
      <Card className="border-stone-200/50">
        {renderPersonalInfoSection()}
      </Card>
      
      {programData.paymentRequired && (
        <Card className="border-stone-200/50">
          {renderInvoiceInfoSection()}
        </Card>
      )}
      
      {(programData.mode === 'offline' || programData.mode === 'hybrid') && (
        <Card className="border-stone-200/50">
          {renderTravelInfoSection()}
        </Card>
      )}
    </div>
  );

  const renderMultiColumnLayout = () => (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <Card className="border-stone-200/50">
          {renderPersonalInfoSection()}
        </Card>
      </div>
      
      <div className="space-y-6">
        {programData.paymentRequired && (
          <Card className="border-stone-200/50">
            {renderInvoiceInfoSection()}
          </Card>
        )}
        
        {(programData.mode === 'offline' || programData.mode === 'hybrid') && (
          <Card className="border-stone-200/50">
            {renderTravelInfoSection()}
          </Card>
        )}
      </div>
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
      <div className="bg-white/90 backdrop-blur-sm border-b border-stone-200/50 px-6 py-4 shadow-sm" style={{ height: '66px' }}>
        <div className="max-w-[1200px] mx-auto flex items-center justify-between" style={{ paddingLeft: '10px' }}>
          <div>
            <h1 className="text-2xl font-light text-stone-800">Preview Registration Form</h1>
            <p className="text-stone-600 text-sm mt-1">
              Based on your selections, we've generated the form your participants will fill out
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* User Type Toggle */}
            <div className="flex items-center space-x-3">
              <User className="w-4 h-4 text-stone-600" />
              <span className="text-sm text-stone-600">Viewing as:</span>
              <div className="flex items-center space-x-2">
                <span className={cn("text-sm", userType === 'new' ? "text-stone-800 font-medium" : "text-stone-600")}>
                  New User
                </span>
                <Switch
                  checked={userType === 'existing'}
                  onCheckedChange={(checked) => setUserType(checked ? 'existing' : 'new')}
                  className="data-[state=checked]:bg-orange-500"
                />
                <span className={cn("text-sm", userType === 'existing' ? "text-stone-800 font-medium" : "text-stone-600")}>
                  Existing User
                </span>
              </div>
            </div>

            {/* Layout Selector */}
            <div className="flex items-center space-x-3">
              <Settings2 className="w-4 h-4 text-stone-600" />
              <span className="text-sm text-stone-600">Change Layout:</span>
              <Select value={layoutStyle} onValueChange={(value: any) => setLayoutStyle(value)}>
                <SelectTrigger className="w-48 rounded-2xl border-stone-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-stone-200 shadow-lg rounded-xl">
                  <SelectItem value="single-column">Single Column</SelectItem>
                  <SelectItem value="multi-column">Multi Column</SelectItem>
                  <SelectItem value="question-by-question">Question-by-Question</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-stone-200/30 overflow-hidden">
          <div className="p-8">
            
            {/* Program Info Banner */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-200/50 mb-8">
              <h3 className="text-lg font-medium text-stone-800 mb-1">
                {programData.programName} Registration Form
              </h3>
              <p className="text-stone-600 text-sm">
                {programData.programType} • {programData.mode} mode
                {programData.paymentRequired && ' • Payment Required'}
              </p>
            </div>

            {/* Form Preview */}
            <div className="border-2 border-dashed border-stone-200 rounded-2xl p-6 bg-stone-50/30">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-medium text-stone-800">Registration Form Preview</h2>
                  <span className="text-sm text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
                    {layoutStyle.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Layout
                  </span>
                </div>

                {layoutStyle === 'single-column' && renderSingleColumnLayout()}
                {layoutStyle === 'multi-column' && renderMultiColumnLayout()}
                {layoutStyle === 'question-by-question' && renderQuestionByQuestionLayout()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-stone-200/50 px-6 py-4 shadow-lg">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <Button
            onClick={onSaveDraft}
            variant="ghost"
            className="text-stone-600 hover:text-stone-800 hover:bg-stone-50 rounded-2xl"
          >
            Save as Draft
          </Button>

          <div className="flex items-center space-x-4">
            <Button
              onClick={onBack}
              variant="outline"
              className="rounded-2xl border-stone-300 text-stone-700 hover:bg-stone-50"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={onConfigureFields}
              className="bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 rounded-2xl text-white shadow-lg px-8"
            >
              Configure Fields for User
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewRegistrationForm;
