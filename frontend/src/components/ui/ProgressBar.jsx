import React from 'react';
import { Check } from 'lucide-react';

const steps = [
  { id: 1, label: 'Bolsa' },
  { id: 2, label: 'Envío & Pago' },
  { id: 3, label: 'Confirmación' }
];

const ProgressBar = ({ currentStep = 2 }) => {
  return (
    <div className="flex items-center gap-2 md:gap-4">
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;
        
        return (
          <React.Fragment key={step.id}>
            {/* Línea conectora (se muestra antes del paso, excepto en el primero) */}
            {index > 0 && (
              <div 
                className={`h-[1px] w-4 md:w-8 transition-colors duration-300 ${
                  step.id <= currentStep ? 'bg-vinilo-black' : 'bg-gray-200'
                }`} 
              />
            )}

            {/* Círculo y Texto */}
            <div className="flex items-center gap-2">
              {/* Círculo */}
              <div 
                className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 border
                  ${isActive 
                    ? 'bg-vinilo-black text-white border-vinilo-black scale-110' 
                    : isCompleted 
                        ? 'bg-vinilo-black text-white border-vinilo-black'
                        : 'bg-transparent text-gray-300 border-gray-200'
                  }
                `}
              >
                {isCompleted ? <Check size={12} strokeWidth={3} /> : step.id}
              </div>

              {/* Texto (Oculto en móviles muy pequeños para ahorrar espacio) */}
              <span 
                className={`
                  text-[10px] uppercase tracking-widest font-bold hidden sm:block
                  ${isActive ? 'text-vinilo-black' : isCompleted ? 'text-vinilo-black' : 'text-gray-300'}
                `}
              >
                {step.label}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ProgressBar;