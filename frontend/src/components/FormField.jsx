import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const FormField = ({ id, label, type, value, onChange, required = true, placeholder }) => (
  <>
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="bg-input-background w-80 h-12 border-0 rounded-xl ring-primary selection:text-white"
    />
  </>
);

export default FormField;
