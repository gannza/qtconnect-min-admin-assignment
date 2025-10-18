import { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { createUser } from '../store/slices/userSlice';
import { UserFormData } from '../types';
import { toast } from '../hooks/useToast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface UserFormProps {

  onRefreshChange: (refresh: boolean) => void;
}

const UserForm =  ({onRefreshChange }: UserFormProps) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    role: 'user',
    status: 'active',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({}); // Clear previous errors

    try {
      const response = await dispatch(createUser(formData));
   
      if (response.type.endsWith('/fulfilled') && response.payload) {
        setFormData({
          email: '',
          role: 'user',
          status: 'active',
        });
        toast({ 
          title: 'User created successfully', 
          description: 'User created successfully',
          variant: 'success'
        });
        onRefreshChange(true);
      } else if (response.type.endsWith('/rejected')) {
        setErrors({ email: 'Email already exists' });
        // Don't close modal on error - keep it open to show validation errors
        toast({ 
          title: 'Create user failed', 
          description: 'Email already exists',
          variant: 'destructive'
        });
      }
     } catch (error) {
      toast({ 
        title: 'Creation failed', 
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="user@example.com"
          required
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select
          value={formData.role}
          onValueChange={(value) => handleChange('role', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => handleChange('status', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create User'}
      </Button>
    </form>
  );
};

export default UserForm;
