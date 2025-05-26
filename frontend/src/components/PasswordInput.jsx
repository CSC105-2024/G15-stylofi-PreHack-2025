import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const PasswordInput = ({ register, name, error, placeholder = 'Password' }) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <div className="relative flex items-center justify-center max-w-xs">
        <Input
          {...register(name)}
          id={name}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          className="bg-input-background/80 w-80 h-12 border-0 rounded-xl ring-primary"
        />
        <Button
          type="button"
          variant="ghost"
          className="absolute right-0 px-3 py-2 cursor-pointer hover:bg-input-background/80"
          onClick={() => setShow(!show)}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </>
  );
};

export default PasswordInput;
