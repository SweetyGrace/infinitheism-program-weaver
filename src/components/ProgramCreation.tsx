
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Users, Calendar, MapPin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import PreviewRegistrationForm from '@/components/PreviewRegistrationForm';
import PreviewUserForm from '@/components/PreviewUserForm';

const ProgramCreation = () => {
  const [programName, setProgramName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [capacity, setCapacity] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewType, setPreviewType] = useState<'registration' | 'user'>('registration');

  const handleCreateProgram = () => {
    if (!programName || !description || !location || !startDate || !endDate || !capacity) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Program Created Successfully!",
      description: `${programName} has been created and is ready for registration.`,
    });

    console.log('Program created:', {
      programName,
      description,
      location,
      startDate,
      endDate,
      capacity
    });
  };

  const handlePreview = (type: 'registration' | 'user') => {
    setPreviewType(type);
    setShowPreview(true);
  };

  if (showPreview) {
    return previewType === 'registration' ? 
      <PreviewRegistrationForm onBack={() => setShowPreview(false)} /> :
      <PreviewUserForm onBack={() => setShowPreview(false)} />;
  }

  return (
    <div className="gradient-bg min-h-screen">
      <div className="container-main py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 fade-in">
          <h1 className="main-title mb-4">Create Transformation Program</h1>
          <p className="body-text max-w-2xl mx-auto">
            Design and launch your consciousness transformation program with our intuitive creation tools.
          </p>
        </div>

        {/* Main Form Card */}
        <Card className="card-main card-hover max-w-4xl mx-auto">
          <CardHeader className="p-8">
            <CardTitle className="section-title flex items-center gap-3">
              <Plus className="h-6 w-6 text-blue-500" />
              Program Details
            </CardTitle>
            <p className="description-text">
              Enter the essential information for your transformation program
            </p>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="form-section-spacing">
              {/* Program Name */}
              <div className="form-field-spacing">
                <Label htmlFor="programName" className="label-text">Program Name</Label>
                <Input
                  id="programName"
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                  placeholder="Enter program name"
                  className="form-input"
                />
              </div>

              {/* Description */}
              <div className="form-field-spacing">
                <Label htmlFor="description" className="label-text">Description</Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your transformation program"
                  rows={4}
                  className="form-input resize-none"
                />
              </div>

              {/* Location and Dates Grid */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="form-field-spacing">
                  <Label htmlFor="location" className="label-text flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Program location"
                    className="form-input"
                  />
                </div>

                <div className="form-field-spacing">
                  <Label htmlFor="capacity" className="label-text flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    Capacity
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="Maximum participants"
                    className="form-input"
                  />
                </div>
              </div>

              {/* Date Range */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="form-field-spacing">
                  <Label htmlFor="startDate" className="label-text flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-field-spacing">
                  <Label htmlFor="endDate" className="label-text flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  onClick={handleCreateProgram}
                  className="primary-button flex-1"
                >
                  Create Program
                </button>
                
                <div className="flex gap-4">
                  <Button
                    onClick={() => handlePreview('registration')}
                    variant="outline"
                    className="outline-button"
                  >
                    Preview Registration Form
                  </Button>
                  
                  <Button
                    onClick={() => handlePreview('user')}
                    variant="outline"
                    className="outline-button"
                  >
                    Preview User Form
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgramCreation;
