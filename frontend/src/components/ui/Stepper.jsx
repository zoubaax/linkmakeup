import React, { useState, Children } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HiCheck, HiChevronLeft, HiChevronRight, HiSparkles } from 'react-icons/hi2';

/**
 * Stepper Component
 * Ultra-responsive, clean, modern multi-step wizard.
 * Supports step titles, subtitles, responsive mobile indicators, and smooth transitions.
 */
export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  stepCircleContainerClassName = '',
  stepContainerClassName = '',
  contentClassName = '',
  footerClassName = '',
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = 'Previous',
  nextButtonText = 'Continue',
  disableStepIndicators = false,
  renderStepIndicator,
  stepsMetadata = [],
  ...rest
}) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  const updateStep = (newStep) => {
    setCurrentStep(newStep);
    if (newStep > totalSteps) onFinalStepCompleted();
    else onStepChange(newStep);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      updateStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      setDirection(1);
      updateStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    setDirection(1);
    updateStep(totalSteps + 1);
  };

  // Extract titles / descriptions from children Step props if available
  const stepsInfo = stepsArray.map((child, index) => {
    const meta = stepsMetadata[index] || {};
    return {
      title: meta.title || child.props?.title || `Step ${index + 1}`,
      description: meta.description || child.props?.description || '',
      icon: meta.icon || child.props?.icon || null,
    };
  });

  const activeStepInfo = stepsInfo[currentStep - 1] || stepsInfo[0];
  const progressPercent = Math.round(((currentStep - 1) / (totalSteps - 1 || 1)) * 100);

  return (
    <div
      className="flex w-full items-center justify-center p-0"
      {...rest}
    >
      <div
        className={`w-full max-w-2xl rounded-3xl bg-surface border border-border shadow-xl overflow-hidden transition-all duration-300 ${stepCircleContainerClassName}`}
      >
        {/* Step Progress Indicators Header */}
        <div className={`p-4 sm:px-6 sm:py-5 border-b border-border/80 bg-surface-alt/40 backdrop-blur-md ${stepContainerClassName}`}>
          
          {/* Mobile Stepper Header (< sm) */}
          <div className="flex sm:hidden flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
                  {currentStep}
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-fg leading-none">
                    {activeStepInfo?.title || `Step ${currentStep}`}
                  </span>
                  {activeStepInfo?.description && (
                    <span className="text-[10px] text-fg-subtle leading-tight mt-0.5">
                      {activeStepInfo.description}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[11px] font-semibold font-mono text-fg-subtle px-2 py-0.5 rounded-full bg-surface border border-border">
                {currentStep} / {totalSteps}
              </span>
            </div>

            {/* Mobile Progress Bar with clickable step dots */}
            <div className="relative flex items-center justify-between gap-1.5 pt-1">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-full bg-border rounded-full overflow-hidden z-0">
                <motion.div
                  className="h-full bg-emerald-500 rounded-full"
                  initial={false}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>
              {stepsArray.map((_, index) => {
                const stepNum = index + 1;
                const isStepActive = currentStep === stepNum;
                const isStepComplete = currentStep > stepNum;
                return (
                  <button
                    key={stepNum}
                    type="button"
                    onClick={() => {
                      if (!disableStepIndicators && (isStepComplete || stepNum <= currentStep)) {
                        setDirection(stepNum > currentStep ? 1 : -1);
                        updateStep(stepNum);
                      }
                    }}
                    disabled={disableStepIndicators || stepNum > currentStep}
                    aria-label={`Go to step ${stepNum}`}
                    className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                      isStepActive
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 scale-110 ring-2 ring-emerald-500/30'
                        : isStepComplete
                        ? 'bg-emerald-600 text-white cursor-pointer'
                        : 'bg-surface border border-border text-fg-subtle'
                    }`}
                  >
                    {isStepComplete ? <HiCheck className="w-3.5 h-3.5" /> : stepNum}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop & Tablet Stepper Header (>= sm) */}
          <div className="hidden sm:flex items-center justify-between w-full relative">
            {stepsArray.map((_, index) => {
              const stepNumber = index + 1;
              const isNotLastStep = index < totalSteps - 1;
              const stepInfo = stepsInfo[index];

              return (
                <React.Fragment key={stepNumber}>
                  {renderStepIndicator ? (
                    renderStepIndicator({
                      step: stepNumber,
                      currentStep,
                      title: stepInfo.title,
                      description: stepInfo.description,
                      onStepClick: (clicked) => {
                        setDirection(clicked > currentStep ? 1 : -1);
                        updateStep(clicked);
                      },
                    })
                  ) : (
                    <StepIndicator
                      step={stepNumber}
                      title={stepInfo.title}
                      description={stepInfo.description}
                      disableStepIndicators={disableStepIndicators}
                      currentStep={currentStep}
                      onClickStep={(clicked) => {
                        setDirection(clicked > currentStep ? 1 : -1);
                        updateStep(clicked);
                      }}
                    />
                  )}
                  {isNotLastStep && <StepConnector isComplete={currentStep > stepNumber} />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step Content Area */}
        <StepContentWrapper
          isCompleted={isCompleted}
          currentStep={currentStep}
          direction={direction}
          className={`p-4 sm:p-7 ${contentClassName}`}
        >
          {stepsArray[currentStep - 1]}
        </StepContentWrapper>

        {/* Footer Navigation Bar */}
        {!isCompleted && (
          <div className={`px-4 sm:px-7 py-3.5 sm:py-4 border-t border-border/80 bg-surface-alt/40 backdrop-blur-sm ${footerClassName}`}>
            <div className="flex items-center justify-between gap-3">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl text-fg-muted hover:text-fg hover:bg-surface border border-border/60 hover:border-border transition-all active:scale-95 shrink-0"
                  {...backButtonProps}
                >
                  <HiChevronLeft className="w-4 h-4" />
                  <span>{backButtonText}</span>
                </button>
              ) : (
                <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-fg-subtle font-medium">
                  <HiSparkles className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Setup Wizard</span>
                </div>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <span className="hidden md:inline-block text-[11px] font-medium text-fg-subtle font-mono mr-2">
                  Step {currentStep} of {totalSteps}
                </span>

                <button
                  type="button"
                  onClick={isLastStep ? handleComplete : handleNext}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:hover:scale-100 disabled:shadow-none cursor-pointer"
                  {...nextButtonProps}
                >
                  <span>{isLastStep ? 'Complete Setup' : nextButtonText}</span>
                  {!isLastStep && <HiChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepContentWrapper({ isCompleted, currentStep, direction, children, className }) {
  return (
    <div className={`relative w-full min-h-[220px] ${className}`}>
      <AnimatePresence initial={false} mode="wait" custom={direction}>
        {!isCompleted && (
          <motion.div
            key={currentStep}
            custom={direction}
            variants={{
              enter: (dir) => ({ x: dir >= 0 ? 24 : -24, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (dir) => ({ x: dir >= 0 ? -24 : 24, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-full"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Step({ children, title, description, icon }) {
  return <div className="w-full" data-step-title={title} data-step-desc={description}>{children}</div>;
}

function StepIndicator({ step, title, description, currentStep, onClickStep, disableStepIndicators }) {
  const isComplete = currentStep > step;
  const isActive = currentStep === step;
  const isUpcoming = currentStep < step;
  const isClickable = !disableStepIndicators && (isComplete || isActive);

  const handleClick = () => {
    if (step !== currentStep && isClickable) {
      onClickStep(step);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!isClickable}
      className={`group flex items-center gap-2.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl transition-all ${
        isClickable ? 'cursor-pointer' : 'cursor-default'
      }`}
    >
      <motion.div
        animate={{
          scale: isActive ? 1.05 : 1,
        }}
        transition={{ duration: 0.2 }}
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-extrabold text-xs transition-all duration-200 ${
          isActive
            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25 ring-2 ring-emerald-500/30'
            : isComplete
            ? 'bg-emerald-500 text-white shadow-xs group-hover:bg-emerald-600'
            : 'bg-surface border border-border text-fg-subtle'
        }`}
      >
        {isComplete ? (
          <HiCheck className="h-4 w-4 text-white" />
        ) : (
          <span>{step}</span>
        )}
      </motion.div>

      {title && (
        <div className="hidden md:flex flex-col">
          <span
            className={`text-xs font-bold leading-tight transition-colors ${
              isActive
                ? 'text-fg font-extrabold'
                : isComplete
                ? 'text-fg-muted group-hover:text-fg'
                : 'text-fg-subtle'
            }`}
          >
            {title}
          </span>
          {description && (
            <span className="text-[10px] text-fg-subtle leading-tight hidden lg:inline-block mt-0.5">
              {description}
            </span>
          )}
        </div>
      )}
    </button>
  );
}

function StepConnector({ isComplete }) {
  return (
    <div className="relative mx-2 sm:mx-3 h-0.5 flex-1 min-w-[20px] rounded-full bg-border overflow-hidden">
      <motion.div
        className="absolute left-0 top-0 h-full bg-emerald-500 rounded-full"
        initial={false}
        animate={{ width: isComplete ? '100%' : '0%' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </div>
  );
}
