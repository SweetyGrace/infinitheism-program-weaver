
import React, { useState, useEffect } from 'react';
import { ChevronRight, Save, Eye, Plus, Info, Sparkles, Heart, CheckCircle, Edit, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import RegistrationFormPreview from './RegistrationFormPreview';
import PreviewUserForm from './PreviewUserForm';

// Updated interfaces to match PreviewUserForm expectations
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

enum ProgramType {
  Level1 = 'Level 1',
  Level2 = 'Level 2',
  Level3 = 'Level 3',
  SpecialProgram = 'Special Program',
  Event = 'Event',
}

const PROGRAM_TYPES = Object.values(ProgramType);

const ProgramCreation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [programData, setProgramData] = useState<ProgramData>({
    programType: '',
    programName: '',
    mode: 'online',
    paymentRequired: false,
    hdbFee: 0,
    msdFee: 0,
    venueAddress: '',
    travelRequired: false,
    selectedSessions: [],
    sessionSchedules: {},
    refundPolicy: '',
    layoutStyle: 'single-column',
    customFormFields: [],
    formSettings: {}
  });
  const [showFormPreview, setShowFormPreview] = useState(false);

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setProgramData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProgramData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Program Data:', programData);
    setShowFormPreview(true);
  };

  if (showFormPreview) {
    return (
      <PreviewUserForm
        programData={programData}
        onBack={() => setShowFormPreview(false)}
        onEditFormFields={() => {
          setShowFormPreview(false);
          setCurrentStep(3);
        }}
        onSaveAndExit={() => {
          console.log('Saving and exiting preview');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-orange-50/30">
      <div className="bg-white/90 backdrop-blur-sm border-b border-stone-200/50 px-6 py-4 shadow-sm">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light text-stone-800">Create New Program</h1>
            <p className="text-stone-600 mt-1">
              Configure program details and registration settings
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => alert('Save progress')}
              variant="ghost"
              className="text-stone-600 hover:text-stone-800 hover:bg-stone-50 rounded-2xl"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Progress
            </Button>
            <Button
              onClick={() => alert('Exit setup')}
              variant="outline"
              className="rounded-2xl border-stone-300 text-stone-700 hover:bg-stone-50"
            >
              Exit Setup
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-stone-200/30 overflow-hidden">
          <div className="grid grid-cols-4">
            {/* Sidebar Navigation */}
            <aside className="col-span-1 border-r border-stone-200/50">
              <nav className="p-4 space-y-2">
                <NavItem
                  step={1}
                  currentStep={currentStep}
                  label="Program Basics"
                  icon={Sparkles}
                />
                <NavItem
                  step={2}
                  currentStep={currentStep}
                  label="Mode & Fees"
                  icon={Heart}
                />
                <NavItem
                  step={3}
                  currentStep={currentStep}
                  label="Form Fields"
                  icon={Edit}
                />
                <NavItem
                  step={4}
                  currentStep={currentStep}
                  label="Confirmation"
                  icon={CheckCircle}
                />
              </nav>
            </aside>

            {/* Main Content Area */}
            <div className="col-span-3 p-8">
              {currentStep === 0 && (
                <Step1
                  programData={programData}
                  handleInputChange={handleInputChange}
                  handleSelectChange={handleSelectChange}
                  nextStep={nextStep}
                />
              )}
              {currentStep === 1 && (
                <Step2
                  programData={programData}
                  handleInputChange={handleInputChange}
                  setProgramData={setProgramData}
                  nextStep={nextStep}
                  prevStep={prevStep}
                />
              )}
              {currentStep === 2 && (
                <RegistrationFormPreview
                  programData={programData}
                  prevStep={prevStep}
                  onSubmit={handleSubmit}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface NavItemProps {
  step: number;
  currentStep: number;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const NavItem: React.FC<NavItemProps> = ({ step, currentStep, label, icon: Icon }) => {
  const isActive = step === currentStep;
  return (
    <Button
      variant="ghost"
      className={cn(
        "justify-start rounded-xl w-full",
        isActive ? "bg-orange-50 text-orange-700 font-medium" : "text-stone-600 hover:bg-stone-50"
      )}
      onClick={() => alert(`Go to step ${step}`)}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </Button>
  );
};

interface Step1Props {
  programData: ProgramData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  nextStep: () => void;
}

const Step1: React.FC<Step1Props> = ({ programData, handleInputChange, handleSelectChange, nextStep }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium text-stone-800">Program Basics</h2>
      <p className="text-stone-600">
        Tell us the basic details about your program.
      </p>

      <div className="space-y-4">
        <div>
          <Label htmlFor="programType" className="text-stone-800">Program Type</Label>
          <Select onValueChange={(value) => handleSelectChange('programType', value)}>
            <SelectTrigger className="rounded-2xl border-stone-200">
              <SelectValue placeholder="Select a program type" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-stone-200 shadow-lg">
              {PROGRAM_TYPES.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="programName" className="text-stone-800">Program Name</Label>
          <Input
            type="text"
            id="programName"
            name="programName"
            placeholder="Enter program name"
            className="rounded-2xl border-stone-200"
            value={programData.programName}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={nextStep}
          className="bg-orange-500 hover:bg-orange-600 rounded-2xl text-white"
        >
          Next: Mode & Fees
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

interface Step2Props {
  programData: ProgramData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setProgramData: React.Dispatch<React.SetStateAction<ProgramData>>;
  nextStep: () => void;
  prevStep: () => void;
}

const Step2: React.FC<Step2Props> = ({ programData, handleInputChange, setProgramData, nextStep, prevStep }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium text-stone-800">Mode & Fees</h2>
      <p className="text-stone-600">
        Configure the program mode and associated fees.
      </p>

      <div className="space-y-4">
        <div>
          <Label className="text-stone-800">Program Mode</Label>
          <RadioGroup defaultValue={programData.mode} className="flex space-x-2">
            <RadioGroupItem value="online" id="online" className="peer sr-only" />
            <Label
              htmlFor="online"
              className="bg-white rounded-2xl border border-stone-200 px-4 py-2 text-stone-700 hover:bg-stone-50 peer-checked:bg-orange-50 peer-checked:text-orange-700 cursor-pointer"
            >
              Online
            </Label>
            <RadioGroupItem value="offline" id="offline" className="peer sr-only" />
            <Label
              htmlFor="offline"
              className="bg-white rounded-2xl border border-stone-200 px-4 py-2 text-stone-700 hover:bg-stone-50 peer-checked:bg-orange-50 peer-checked:text-orange-700 cursor-pointer"
            >
              Offline
            </Label>
            <RadioGroupItem value="hybrid" id="hybrid" className="peer sr-only" />
            <Label
              htmlFor="hybrid"
              className="bg-white rounded-2xl border border-stone-200 px-4 py-2 text-stone-700 hover:bg-stone-50 peer-checked:bg-orange-50 peer-checked:text-orange-700 cursor-pointer"
            >
              Hybrid
            </Label>
          </RadioGroup>
        </div>

        <div className="flex items-center space-x-4">
          <Label htmlFor="paymentRequired" className="text-stone-800">Payment Required</Label>
          <Switch
            id="paymentRequired"
            name="paymentRequired"
            checked={programData.paymentRequired}
            onCheckedChange={(checked) =>
              setProgramData(prevData => ({ ...prevData, paymentRequired: checked }))
            }
            className="data-[state=checked]:bg-orange-500"
          />
        </div>

        {programData.paymentRequired && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hdbFee" className="text-stone-800">HDB Fee</Label>
              <Input
                type="number"
                id="hdbFee"
                name="hdbFee"
                placeholder="Enter HDB fee"
                className="rounded-2xl border-stone-200"
                value={programData.hdbFee}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="msdFee" className="text-stone-800">MSD Fee</Label>
              <Input
                type="number"
                id="msdFee"
                name="msdFee"
                placeholder="Enter MSD fee"
                className="rounded-2xl border-stone-200"
                value={programData.msdFee}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )}

        {programData.mode === 'offline' && (
          <div>
            <Label htmlFor="venueAddress" className="text-stone-800">Venue Address</Label>
            <Textarea
              id="venueAddress"
              name="venueAddress"
              placeholder="Enter venue address"
              className="rounded-2xl border-stone-200"
              value={programData.venueAddress}
              onChange={handleInputChange}
            />
          </div>
        )}

        {programData.mode === 'offline' && (
          <div className="flex items-center space-x-4">
            <Label htmlFor="travelRequired" className="text-stone-800">Travel Required</Label>
            <Switch
              id="travelRequired"
              name="travelRequired"
              checked={programData.travelRequired}
              onCheckedChange={(checked) =>
                setProgramData(prevData => ({ ...prevData, travelRequired: checked }))
              }
              className="data-[state=checked]:bg-orange-500"
            />
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button
          onClick={prevStep}
          variant="outline"
          className="rounded-2xl border-stone-300 text-stone-700 hover:bg-stone-50"
        >
          <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
          Back: Program Basics
        </Button>
        <Button
          onClick={nextStep}
          className="bg-orange-500 hover:bg-orange-600 rounded-2xl text-white"
        >
          Next: Form Fields
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

interface NavItemProps {
  step: number;
  currentStep: number;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const NavItem: React.FC<NavItemProps> = ({ step, currentStep, label, icon: Icon }) => {
  const isActive = step === currentStep;
  return (
    <Button
      variant="ghost"
      className={cn(
        "justify-start rounded-xl w-full",
        isActive ? "bg-orange-50 text-orange-700 font-medium" : "text-stone-600 hover:bg-stone-50"
      )}
      onClick={() => alert(`Go to step ${step}`)}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </Button>
  );
};

export default ProgramCreation;
