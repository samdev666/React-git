import React, {
  useEffect,
  useRef,
  ChangeEvent,
  KeyboardEvent,
  forwardRef,
} from 'react';
import { StyledOTPInput, StyledOTPInputBox } from './styles';

interface Props {
  otpValues: string[];
  setOtpValues: React.Dispatch<React.SetStateAction<string[]>>;
}

const OtpInput = forwardRef<HTMLInputElement, Props>(
  ({ otpValues, setOtpValues }, ref) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Focus on the first input as soon as the component mounts
    useEffect(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, []);

    const handleChange = (
      index: number,
      event: ChangeEvent<HTMLInputElement>,
    ) => {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = event.target.value;
      setOtpValues(newOtpValues);

      if (event.target.value !== '' && index < otpValues.length - 1) {
        if (inputRefs.current[index + 1]) {
          inputRefs.current[index + 1].focus();
        }
      }
    };

    const handleKeyDown = (
      index: number,
      event: KeyboardEvent<HTMLInputElement>,
    ) => {
      if (event.key === 'Backspace' && otpValues[index] === '' && index > 0) {
        if (inputRefs.current[index - 1]) {
          inputRefs.current[index - 1].focus();
        }
      }
    };

    return (
      <StyledOTPInputBox>
        {otpValues.map((value, index) => (
          <StyledOTPInput
          // eslint-disable-next-line react/no-array-index-key
            key={index}
            autoComplete="off"
            maxLength={1}
            value={value}
            placeholder="0"
            onChange={(e) => {
              if (Number(e.target.value) >= 0 && Number(e.target.value) <= 9) {
                handleChange(index, e);
              }
            }}
            onKeyDown={(e) => handleKeyDown(index, e)}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
          />
        ))}
      </StyledOTPInputBox>
    );
  },
);

export default OtpInput;
