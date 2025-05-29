import React, { useState } from 'react';
import { ChevronLeft, Info, User, Edit, Save, Plus, Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
  selectedSessions: string[];
  sessionSchedules: Record<string, string>;
  refundPolicy: string;
  layoutStyle: 'single-column' | 'two-column' | 'question-by-question';
  customFormFields: any[];
  formSettings: Record<string, any>;
}

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'select' | 'textarea' | 'date' | 'file' | 'toggle';
  mandatory: boolean;
  prefilled: boolean;
  section: 'personal' | 'contact' | 'travel' | 'accommodation' | 'invoice';
  options?: string[];
}

interface PreviewUserFormProps {
  programData: ProgramData;
  onBack: () => void;
  onEditFormFields: () => void;
  onSaveAndExit: () => void;
}

const PreviewUserForm: React.FC<PreviewUserFormProps> = ({
  programData,
  onBack,
  onEditFormFields,
  onSaveAndExit
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [currentSection, setCurrentSection] = useState(0);

  const formFields: FormField[] = [
    // Personal Information
    { id: 'fullName', label: 'Full Name', type: 'text', mandatory: true, prefilled: false, section: 'personal' },
    { id: 'email', label: 'Email Address', type: 'email', mandatory: true, prefilled: false, section: 'personal' },
    { id: 'phone', label: 'Phone Number', type: 'text', mandatory: true, prefilled: false, section: 'contact' },
    { id: 'emergencyContact', label: 'Emergency Contact', type: 'text', mandatory: false, prefilled: false, section: 'contact' },

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

  const handleInputChange = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id] || '';

    return (
      <div key={field.id} className="space-y-2">
        <Label className="text-blue-800 font-medium flex items-center">
          {field.label}
          {field.mandatory && <span className="text-red-500 ml-1">*</span>}
        </Label>
        
        {field.type === 'select' ? (
          <Select onValueChange={(value) => handleInputChange(field.id, value)}>
            <SelectTrigger className="rounded-lg border-blue-200">
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent className="bg-white border border-blue-200 shadow-lg">
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : field.type === 'textarea' ? (
          <Textarea
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className="rounded-lg border-blue-200 focus:border-blue-400"
            rows={3}
          />
        ) : field.type === 'file' ? (
          <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 text-center hover:border-blue-300 transition-colors">
            <input type="file" className="hidden" />
            <p className="text-blue-600 text-sm">Click to upload or drag and drop</p>
            <p className="text-blue-500 text-xs mt-1">PDF, JPG, PNG up to 10MB</p>
          </div>
        ) : (
          <Input
            type={field.type === 'toggle' ? 'checkbox' : field.type}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className="rounded-lg border-blue-200 focus:border-blue-400"
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
      {/* Header */}
      <div className="bg-white border-b border-blue-100 px-6 py-6 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-blue-900">User Registration Preview</h1>
              <p className="text-blue-600 mt-1 text-sm">
                Experience the form as your users will see it
              </p>
            </div>
            <Button
              onClick={onBack}
              variant="outline"
              className="rounded-lg border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <X className="w-4 h-4 mr-2" />
              Exit Preview
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card className="infinitheism-card shadow-lg">
          <CardHeader className="border-b border-blue-100">
            <h2 className="text-xl font-semibold text-blue-900">
              Registration for {programData.programName}
            </h2>
            <p className="text-blue-600">
              {programData.programType} • {programData.mode.charAt(0).toUpperCase() + programData.mode.slice(1)} Mode
            </p>
          </CardHeader>

          <CardContent className="infinitheism-section">
            <div className="space-y-8">
              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formFields.map((field) => renderField(field))}
              </div>

              {/* Payment Information */}
              {programData.paymentRequired && (
                <Card className="infinitheism-card bg-blue-50/30">
                  <CardContent className="p-6">
                    <h3 className="text-blue-800 font-medium mb-4">Payment Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">HDB Fee:</span>
                        <span className="text-blue-900 font-medium">₹{programData.hdbFee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">MSD Fee:</span>
                        <span className="text-blue-900 font-medium">₹{programData.msdFee}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <Card className="infinitheism-card mt-6">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <Button
                onClick={onEditFormFields}
                variant="outline"
                className="rounded-lg border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Form Fields
              </Button>
              <Button
                onClick={onSaveAndExit}
                className="bg-blue-600 hover:bg-blue-700 rounded-lg text-white shadow-sm"
              >
                <Save className="w-4 h-4 mr-2" />
                Save & Exit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PreviewUserForm;
