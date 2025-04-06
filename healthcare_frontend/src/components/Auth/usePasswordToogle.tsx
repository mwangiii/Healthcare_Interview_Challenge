import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const usePasswordToggle = (): [string, React.ElementType, () => void] => {
  const [isVisible, setIsVisible] = useState(false);

  const Icon = isVisible ? Eye : EyeOff;
  const inputType = isVisible ? 'text' : 'password';

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  return [inputType, Icon, toggleVisibility];
};

export default usePasswordToggle;
