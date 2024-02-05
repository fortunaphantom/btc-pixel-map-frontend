/* eslint-disable security/detect-object-injection */
import { Alert, Modal, Spinner } from "flowbite-react";
import { FC } from "react";
import { BiCheckCircle, BiErrorCircle, BiMinusCircle } from "react-icons/bi";

type Props = {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  title: string;
  steps: ConfirmStep[];
  activeStep: number;
  errorStep?: number;
  errorMessage?: string;
  handleRetry: () => void;
  handleContinue: () => void;
  successMessage: string;
};

const ConformModal: FC<Props> = ({
  isOpen,
  setOpen,
  title,
  steps,
  activeStep,
  errorStep,
  errorMessage,
  handleRetry,
  handleContinue,
  successMessage,
}) => {
  return (
    <Modal show={isOpen} onClose={() => setOpen(false)}>
      <Modal.Header className="bg-slate-800">{title}</Modal.Header>
      <Modal.Body className="overflow-auto bg-slate-800">
        <div className="mt-6 flex w-full flex-col items-start gap-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_auto] items-center gap-2"
            >
              {errorStep == index ? (
                <BiErrorCircle className="h-7 w-7 text-red-600" />
              ) : activeStep == index ? (
                <Spinner color="success" aria-label="spinner example" />
              ) : activeStep > index ? (
                <BiCheckCircle className="h-7 w-7 text-cyan-600" />
              ) : (
                <BiMinusCircle className="h-7 w-7 text-cyan-600" />
              )}
              <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-200">
                {step.title}
              </p>
            </div>
          ))}
        </div>
        {errorMessage ? (
          <Alert
            color="info"
            rounded={false}
            withBorderAccent
            additionalContent={
              <>
                <div className="mb-4 mt-2 text-sm text-red-700 dark:text-red-800">
                  {errorMessage}
                </div>
                <div className="flex">
                  <button
                    type="button"
                    onClick={() => handleRetry()}
                    className="mr-2 inline-flex items-center rounded-lg bg-cyan-700 px-3 py-1.5 text-center text-xs font-medium text-white hover:bg-cyan-800 focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-800 dark:hover:bg-cyan-900"
                  >
                    Continue
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-lg border border-green-700 bg-transparent px-3 py-1.5 text-center text-xs font-medium text-green-700 hover:bg-green-800 hover:text-white focus:ring-4 focus:ring-green-300 dark:border-green-800 dark:text-green-800 dark:hover:text-white"
                  >
                    Dismiss
                  </button>
                </div>
              </>
            }
          >
            <h3 className="text-lg font-medium text-red-700 dark:text-red-800">
              {steps[errorStep ?? 0].title}
            </h3>
          </Alert>
        ) : activeStep < steps.length ? (
          <Alert
            color="info"
            rounded={false}
            withBorderAccent
            additionalContent={
              <>
                <div className="mb-4 mt-2 text-sm text-green-700 dark:text-green-800">
                  {steps[activeStep].description}
                </div>
              </>
            }
          >
            <h3 className="text-lg font-medium text-green-700 dark:text-green-800">
              {steps[activeStep].title}
            </h3>
          </Alert>
        ) : (
          <Alert
            color="success"
            rounded={false}
            withBorderAccent
            additionalContent={
              <>
                <div className="mb-4 mt-2 text-sm text-cyan-700 dark:text-cyan-800">
                  {errorMessage}
                </div>
                <div className="flex">
                  <button
                    type="button"
                    onClick={() => handleContinue()}
                    className="rounded-lg border border-cyan-700 bg-transparent px-3 py-1.5 text-center text-xs font-medium text-cyan-700 hover:bg-cyan-800 hover:text-white focus:ring-4 focus:ring-cyan-300 dark:border-cyan-800 dark:text-cyan-800 dark:hover:text-white"
                  >
                    Continue
                  </button>
                </div>
              </>
            }
          >
            <h3 className="text-lg font-medium text-cyan-700 dark:text-cyan-800">
              {successMessage}
            </h3>
          </Alert>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ConformModal;
