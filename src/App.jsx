import React, { useMemo } from 'react';
import './index.css';
import { useWizard } from './hooks/useWizard';
import { ProgressBar } from './components/ProgressBar';
import { StepWrapper } from './components/StepWrapper';
import { Step1Roles } from './steps/Step1Roles';
import { Step2Vibe } from './steps/Step2Vibe';
import { Step3Location } from './steps/Step3Location';
import { Step4DateTime } from './steps/Step4DateTime';
import { Step5Dresscode } from './steps/Step5Dresscode';
import { Step6Invite } from './steps/Step6Invite';
import { InviteView } from './components/InviteView';
import { decodeInvite } from './utils/inviteLink';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function App() {
  const invite = useMemo(() => decodeInvite(window.location.hash), []);

  if (invite) {
    return (
      <div className="app-shell">
        <InviteView invite={invite} />
      </div>
    );
  }

  const wizard = useWizard();
  const { state, totalSteps, nextStep, prevStep, canProceed } = wizard;

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return (
          <Step1Roles
            state={state}
            setGender={wizard.setGender}
            setInitiatorName={wizard.setInitiatorName}
            setGuestName={wizard.setGuestName}
          />
        );
      case 2:
        return <Step2Vibe state={state} setVibe={wizard.setVibe} />;
      case 3:
        return (
          <Step3Location
            state={state}
            setCity={wizard.setCity}
            setLocation={wizard.setLocation}
          />
        );
      case 4:
        return (
          <Step4DateTime
            state={state}
            setDate={wizard.setDate}
            setTimeOfDay={wizard.setTimeOfDay}
            setWeather={wizard.setWeather}
          />
        );
      case 5:
        return (
          <Step5Dresscode
            state={state}
            toggleChecklist={wizard.toggleChecklist}
            setSelectedLook={wizard.setSelectedLook}
          />
        );
      case 6:
        return (
          <Step6Invite
            state={state}
            setCardTheme={wizard.setCardTheme}
            setCardMessage={wizard.setCardMessage}
            reset={wizard.reset}
          />
        );
      default:
        return null;
    }
  };

  const isLastStep = state.step === totalSteps;
  const isFirstStep = state.step === 1;

  return (
    <div className="app-shell">
      {/* Header glow */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '200px', height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--accent-coral), var(--accent-gold), transparent)',
        zIndex: 200,
      }} />

      {/* Progress */}
      <ProgressBar step={state.step} total={totalSteps} />

      {/* Step content */}
      <StepWrapper stepKey={state.step} direction={state.direction}>
        {renderStep()}
      </StepWrapper>

      {/* Navigation — hidden on last step */}
      {!isLastStep && (
        <div className="nav-buttons">
          {!isFirstStep && (
            <button
              className="nav-btn-back"
              onClick={prevStep}
              aria-label="Назад"
              id="btn-back"
            >
              <ChevronLeft size={22} />
            </button>
          )}
          <button
            className="nav-btn-next"
            onClick={nextStep}
            disabled={!canProceed()}
            aria-label="Далее"
            id="btn-next"
            style={isFirstStep ? { marginLeft: 0 } : {}}
          >
            {state.step === totalSteps - 1 ? (
              <>Посмотреть результат ✨</>
            ) : (
              <>Продолжить <ChevronRight size={20} /></>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
