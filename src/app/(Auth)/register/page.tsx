'use client';

import { useState } from 'react';
import { AuthSidebar } from '@/components/Auth/register/auth-sidebar';
import { StepOne } from '@/components/Auth/register/step-one';
import { StepTwo } from '@/components/Auth/register/step-two';
import { StepThree } from '@/components/Auth/register/step-three';
import { useRegister } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const { mutate: register, isPending } = useRegister();

  const nextStep = (data: any) => {
    if (step === 2) {
      const payload = { 
        companyName: formData.companyName,
        tenantSlug: formData.tenantSlug,
        orgType: formData.orgType,
        adminName: data.name,
        adminEmail: data.email,
        adminPassword: data.password
      };
      
      register(payload, {
        onSuccess: (response: any) => {
          setFormData({ ...formData, ...data, ...response });
          setStep(3);
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Failed to register. Please try again.');
        }
      });
    } else {
      setFormData((prev: any) => ({ ...prev, ...data }));
      setStep((s) => s + 1);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white">
      <AuthSidebar />

      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[450px]">
          {step === 1 && <StepOne onNext={nextStep} data={formData} />}
          {step === 2 && <StepTwo onNext={nextStep} onBack={() => setStep(1)} data={formData} isPending={isPending} />}
          {step === 3 && <StepThree data={formData} />}
        </div>
      </main>
    </div>
  );
}