import React, { useState } from 'react';
import { ChevronLeft, Edit, Save, Eye, User, UserCheck, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

interface RegistrationFormPreviewProps {
  programData: ProgramData;
  prevStep: () => void;
  onSubmit: () => void;
}

const RegistrationFormPreview: React.FC<RegistrationFormPreviewProps> = ({
  programData,
  prevStep,
  onSubmit
}) => {
  const [userType, setUserType] = useState<'new' | 'existing'>('new');

  const formFields: FormField[] = [
    // Personal Information
    { id: 'fullName', label: 'Full Name', type: 'text', mandatory: true, prefilled: true, section: 'personal' },
    { id: 'email', label: 'Email Address', type: 'email', mandatory: true, prefilled: true, section: 'personal' },
    { id: 'phone', label: 'Phone Number', type: 'text', mandatory: true, prefilled: true, section: 'contact' },
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

  // Filter fields based on user type
  const visibleFields = userType === 'existing' 
    ? formFields.filter(field => !field.prefilled)
    : formFields;

  // Group fields by section
  const groupedFields = visibleFields.reduce((acc, field) => {
    if (!acc[field.section]) {
      acc[field.section] = [];
    }
    acc[field.section].push(field);
    return acc;
  }, {} as Record<string, FormField[]>);

  const sectionTitles = {
    personal: 'Personal Information',
    contact: 'Contact Details',
    travel: 'Travel Information',
    accommodation: 'Accommodation',
    invoice: 'Invoice Information'
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="infinitheism-header">Registration Form Preview</h2>
        <p className="infinitheism-subheader">
          Preview how the form will appear to users registering for your program.
        </p>
      </div>

      {/* User Type Toggle */}
      <Card className="infinitheism-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-blue-800 font-medium">Preview as:</span>
              <div className="flex bg-blue-50 rounded-lg p-1">
                <Button
                  variant={userType === 'new' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setUserType('new')}
                  className={cn(
                    "rounded-md transition-all",
                    userType === 'new' 
                      ? "bg-blue-600 text-white shadow-sm" 
                      : "text-blue-600 hover:bg-blue-100"
                  )}
                >
                  <User className="w-4 h-4 mr-2" />
                  New User
                </Button>
                <Button
                  variant={userType === 'existing' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setUserType('existing')}
                  className={cn(
                    "rounded-md transition-all",
                    userType === 'existing' 
                      ? "bg-blue-600 text-white shadow-sm" 
                      : "text-blue-600 hover:bg-blue-100"
                  )}
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Existing User
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Banner for Existing Users */}
      {userType === 'existing' && (
        <Card className="infinitheism-card border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-blue-800 font-medium">Existing User Preview</p>
                <p className="text-blue-600 text-sm mt-1">
                  We've prefilled some information for returning seekers. Only the remaining fields are shown below.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form Preview */}
      <Card className="infinitheism-card">
        <CardHeader className="border-b border-blue-100">
          <h3 className="text-lg font-semibold text-blue-900">
            Registration for {programData.programName}
          </h3>
          <p className="text-blue-600 text-sm">
            {programData.programType} • {programData.mode.charAt(0).toUpperCase() + programData.mode.slice(1)} Mode
          </p>
        </CardHeader>

        <CardContent className="infinitheism-section">
          <div className="space-y-8">
            {Object.entries(groupedFields).map(([section, fields]) => (
              <div key={section} className="space-y-4">
                <h4 className="text-blue-800 font-medium text-base border-b border-blue-100 pb-2">
                  {sectionTitles[section as keyof typeof sectionTitles]}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <label className="text-blue-700 text-sm font-medium flex items-center">
                        {field.label}
                        {field.mandatory && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {field.type === 'select' ? (
                        <select className="w-full p-3 border border-blue-200 rounded-lg focus:border-blue-400 focus:outline-none bg-white">
                          <option>Select {field.label.toLowerCase()}</option>
                          {field.options?.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea 
                          className="w-full p-3 border border-blue-200 rounded-lg focus:border-blue-400 focus:outline-none resize-none" 
                          rows={3}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                      ) : field.type === 'file' ? (
                        <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 text-center">
                          <p className="text-blue-600 text-sm">Click to upload or drag and drop</p>
                        </div>
                      ) : (
                        <input 
                          type={field.type === 'toggle' ? 'checkbox' : field.type}
                          className="w-full p-3 border border-blue-200 rounded-lg focus:border-blue-400 focus:outline-none"
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={prevStep}
          variant="outline"
          className="rounded-lg border-blue-200 text-blue-700 hover:bg-blue-50"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back: Mode & Fees
        </Button>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="rounded-lg border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Form Fields
          </Button>
          <Button
            onClick={onSubmit}
            className="bg-blue-600 hover:bg-blue-700 rounded-lg text-white shadow-sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview as User
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationFormPreview;
