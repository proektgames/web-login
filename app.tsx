import { useState } from 'react';
import './styles/globals.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Card } from './components/ui/card';
import { Mail, Lock, ArrowRight, ArrowLeft, User } from 'lucide-react';
import { createRoot } from 'react-dom/client';


export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const steps = [
    {
      id: 'email',
      title: 'Create your account',
      subtitle: 'Enter your email to get started',
      icon: Mail,
      field: 'email',
      placeholder: 'Enter your email',
      type: 'email'
    },
    {
      id: 'password',
      title: 'Secure your account',
      subtitle: 'Create a strong password',
      icon: Lock,
      field: 'password',
      placeholder: 'Enter your password',
      type: 'password'
    },
    {
      id: 'confirm',
      title: 'Almost there!',
      subtitle: 'Confirm your password',
      icon: User,
      field: 'confirmPassword',
      placeholder: 'Confirm your password',
      type: 'password'
    }
  ];

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Handle form submission
      console.log('Form submitted:', formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      [currentStepData.field]: value
    }));
  };

  const isCurrentStepValid = () => {
    const value = formData[currentStepData.field as keyof typeof formData];
    if (currentStepData.field === 'email') {
      return value.includes('@') && value.length > 3;
    }
    if (currentStepData.field === 'password') {
      return value.length >= 6;
    }
    if (currentStepData.field === 'confirmPassword') {
      return value === formData.password && value.length >= 6;
    }
    return value.length > 0;
  };

  return (
    <div className="dark min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-card border-border shadow-2xl overflow-hidden">
          <div className="p-8">
            {/* Progress indicator */}
            <div className="flex justify-center mb-8">
              <div className="flex space-x-2">
                {steps.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`h-2 rounded-full ${
                      index <= currentStep 
                        ? 'bg-primary' 
                        : 'bg-muted'
                    }`}
                    initial={{ width: 8 }}
                    animate={{ 
                      width: index === currentStep ? 32 : 8,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                ))}
              </div>
            </div>

            {/* Animated panels */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-6"
              >
                {/* Icon */}
                <motion.div 
                  className="flex justify-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                </motion.div>

                {/* Title and subtitle */}
                <div className="text-center space-y-2">
                  <motion.h1 
                    className="text-foreground"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    {currentStepData.title}
                  </motion.h1>
                  <motion.p 
                    className="text-muted-foreground"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    {currentStepData.subtitle}
                  </motion.p>
                </div>

                {/* Input field */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <Label htmlFor={currentStepData.field} className="text-foreground">
                    {currentStepData.field === 'confirmPassword' ? 'Confirm Password' : 
                     currentStepData.field.charAt(0).toUpperCase() + currentStepData.field.slice(1)}
                  </Label>
                  <Input
                    id={currentStepData.field}
                    type={currentStepData.type}
                    placeholder={currentStepData.placeholder}
                    value={formData[currentStepData.field as keyof typeof formData]}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-ring"
                    autoFocus
                  />
                  {currentStepData.field === 'confirmPassword' && 
                   formData.confirmPassword && 
                   formData.confirmPassword !== formData.password && (
                    <p className="text-destructive text-sm">Passwords don't match</p>
                  )}
                </motion.div>

                {/* Navigation buttons */}
                <motion.div 
                  className="flex justify-between pt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>

                  <Button
                    onClick={handleNext}
                    disabled={!isCurrentStepValid()}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    {currentStep === steps.length - 1 ? (
                      <>
                        Create Account
                        <User className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Sign in link */}
            <motion.div 
              className="text-center mt-8 pt-6 border-t border-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <button className="text-primary hover:text-primary/80 transition-colors">
                  Sign in
                </button>
              </p>
            </motion.div>
          </div>
        </Card>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
