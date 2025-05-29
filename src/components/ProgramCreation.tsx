
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, LayoutList, ListChecks, LucideIcon, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import PreviewRegistrationForm from './PreviewRegistrationForm';

interface ProgramType {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

interface FormData {
  programType: string;
  programName: string;
  mode: 'online' | 'offline' | 'hybrid';
  paymentRequired: boolean;
  hdbFee: number;
  msdFee: number;
  venueAddress: string;
  travelRequired: boolean;
}

const ProgramCreation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    programType: '',
    programName: '',
    mode: 'online',
    paymentRequired: false,
    hdbFee: 0,
    msdFee: 0,
    venueAddress: '',
    travelRequired: false,
  });
  const [showPreview, setShowPreview] = useState(false);

  const programTypes: ProgramType[] = [
    {
      id: 'workshop',
      name: 'Workshop',
      description: 'Hands-on sessions for skill development',
      icon: Settings2,
    },
    {
      id: 'seminar',
      name: 'Seminar',
      description: 'Informative talks and discussions',
      icon: LayoutList,
    },
    {
      id: 'conference',
      name: 'Conference',
      description: 'Large-scale events with multiple speakers',
      icon: ListChecks,
    },
  ];

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return formData.programType !== '' && formData.programName !== '';
    }
    return true;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-light text-stone-800 mb-2">Program Basics</h2>
              <p className="text-stone-600">Set up the fundamental details of your program</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium text-stone-800 mb-4 block">
                  What type of program are you creating?
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                  {programTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <Card 
                        key={type.id}
                        className={cn(
                          "cursor-pointer transition-all duration-200 border-2 hover:shadow-lg w-full",
                          formData.programType === type.id 
                            ? "border-orange-400 bg-orange-50/50 shadow-md" 
                            : "border-stone-200 hover:border-orange-200"
                        )}
                        onClick={() => setFormData(prev => ({ ...prev, programType: type.id }))}
                      >
                        <CardContent className="p-6 text-left">
                          <div className="flex items-start space-x-4">
                            <div className="text-2xl">
                              <IconComponent />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-stone-800 mb-2">{type.name}</h3>
                              <p className="text-sm text-stone-600 leading-relaxed">{type.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {formData.programType && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="programName" className="text-base font-medium text-stone-800">
                      Program Name *
                    </Label>
                    <Input
                      id="programName"
                      value={formData.programName}
                      onChange={(e) => setFormData(prev => ({ ...prev, programName: e.target.value }))}
                      className="mt-2 rounded-2xl border-stone-200"
                      placeholder="Enter the name of your program"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-light text-stone-800 mb-2">Additional Settings</h2>
              <p className="text-stone-600">Customize further details for your program</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium text-stone-800 mb-4 block">
                  Mode of Program
                </Label>
                <div className="flex space-x-4">
                  <Button
                    variant={formData.mode === 'online' ? 'default' : 'outline'}
                    onClick={() => setFormData(prev => ({ ...prev, mode: 'online' }))}
                    className="rounded-2xl"
                  >
                    Online
                  </Button>
                  <Button
                    variant={formData.mode === 'offline' ? 'default' : 'outline'}
                    onClick={() => setFormData(prev => ({ ...prev, mode: 'offline' }))}
                    className="rounded-2xl"
                  >
                    Offline
                  </Button>
                  <Button
                    variant={formData.mode === 'hybrid' ? 'default' : 'outline'}
                    onClick={() => setFormData(prev => ({ ...prev, mode: 'hybrid' }))}
                    className="rounded-2xl"
                  >
                    Hybrid
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium text-stone-800 mb-4 block">
                  Payment Required?
                </Label>
                <div className="flex space-x-4">
                  <Button
                    variant={formData.paymentRequired ? 'default' : 'outline'}
                    onClick={() => setFormData(prev => ({ ...prev, paymentRequired: true }))}
                    className="rounded-2xl"
                  >
                    Yes
                  </Button>
                  <Button
                    variant={!formData.paymentRequired ? 'default' : 'outline'}
                    onClick={() => setFormData(prev => ({ ...prev, paymentRequired: false }))}
                    className="rounded-2xl"
                  >
                    No
                  </Button>
                </div>
              </div>

              {formData.paymentRequired && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="hdbFee" className="text-base font-medium text-stone-800">
                      HDB Fee *
                    </Label>
                    <Input
                      id="hdbFee"
                      type="number"
                      value={formData.hdbFee}
                      onChange={(e) => setFormData(prev => ({ ...prev, hdbFee: parseFloat(e.target.value) }))}
                      className="mt-2 rounded-2xl border-stone-200"
                      placeholder="Enter HDB Fee"
                    />
                  </div>
                  <div>
                    <Label htmlFor="msdFee" className="text-base font-medium text-stone-800">
                      MSD Fee *
                    </Label>
                    <Input
                      id="msdFee"
                      type="number"
                      value={formData.msdFee}
                      onChange={(e) => setFormData(prev => ({ ...prev, msdFee: parseFloat(e.target.value) }))}
                      className="mt-2 rounded-2xl border-stone-200"
                      placeholder="Enter MSD Fee"
                    />
                  </div>
                </div>
              )}

              {(formData.mode === 'offline' || formData.mode === 'hybrid') && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="venueAddress" className="text-base font-medium text-stone-800">
                      Venue Address
                    </Label>
                    <Input
                      id="venueAddress"
                      value={formData.venueAddress}
                      onChange={(e) => setFormData(prev => ({ ...prev, venueAddress: e.target.value }))}
                      className="mt-2 rounded-2xl border-stone-200"
                      placeholder="Enter Venue Address"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-light text-stone-800 mb-2">Review and Confirm</h2>
              <p className="text-stone-600">
                Please review the details you've entered. Once confirmed, your program will be created.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium text-stone-800 mb-4 block">
                  Program Type: {programTypes.find(type => type.id === formData.programType)?.name}
                </Label>
              </div>
              <div>
                <Label className="text-base font-medium text-stone-800 mb-4 block">
                  Program Name: {formData.programName}
                </Label>
              </div>
              <div>
                <Label className="text-base font-medium text-stone-800 mb-4 block">
                  Mode: {formData.mode}
                </Label>
              </div>
              <div>
                <Label className="text-base font-medium text-stone-800 mb-4 block">
                  Payment Required: {formData.paymentRequired ? 'Yes' : 'No'}
                </Label>
              </div>
              {formData.paymentRequired && (
                <>
                  <div>
                    <Label className="text-base font-medium text-stone-800 mb-4 block">
                      HDB Fee: {formData.hdbFee}
                    </Label>
                  </div>
                  <div>
                    <Label className="text-base font-medium text-stone-800 mb-4 block">
                      MSD Fee: {formData.msdFee}
                    </Label>
                  </div>
                </>
              )}
              {(formData.mode === 'offline' || formData.mode === 'hybrid') && (
                <div>
                  <Label className="text-base font-medium text-stone-800 mb-4 block">
                    Venue Address: {formData.venueAddress}
                  </Label>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-orange-50/30">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-stone-200/50 px-6 py-4 shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-light text-stone-800">Create New Program</h1>
          <p className="text-stone-600 mt-1">
            Set up your program details in a few easy steps.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-stone-200/30 overflow-hidden">
          <div className="p-8">
            {renderStepContent()}
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="bg-gradient-to-r from-stone-50 to-orange-50/50 px-8 py-6 border-t border-stone-200/50 sticky bottom-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            onClick={handleBack}
            variant="outline"
            disabled={currentStep === 1}
            className="rounded-2xl border-stone-300 text-stone-700 hover:bg-stone-50 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center space-x-4">
            {currentStep < 3 && (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed px-8"
              >
                {currentStep === 2 ? 'Create Program' : 'Next Step'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramCreation;
