import { useState, useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { updateUser } from '../store/slices/userSlice';
import { User, UserFormData } from '../types';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { toast } from '@/hooks/useToast';

interface UserEditFormProps {
  user: User;
  open: boolean;
  onOpenChange: (data: any) => void;
}

const UserEditForm = ({ user, open, onOpenChange }: UserEditFormProps) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    role: 'user',
    status: 'active',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        role: user.role,
        status: user.status,
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await dispatch(updateUser({ id: user.id, userData: formData }));
      if (response.type.endsWith('/fulfilled') && response.payload) {
        setErrors({}); // Clear any previous errors
        onOpenChange({open:false, user:response.payload}); // Close modal on success
        toast({ 
          title: 'User updated successfully', 
          description: 'User updated successfully',
          variant: 'success'
        });
        } else if (response.type.endsWith('/rejected')) {
          // Don't close modal on error - keep it open to show validation errors
          onOpenChange({open:true, user:null});
          setErrors({ email: 'Email already exists' });
     
          toast({ 
            title: 'Update failed', 
            description: 'Email already exists',
            variant: 'destructive'
          });
        }
    } catch (error) {
      // Don't close modal on error - keep it open to show validation errors
      setErrors({ general: 'An unexpected error occurred' });
      toast({ 
        title: 'Update failed', 
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
    <Dialog open={open} onOpenChange={()=>onOpenChange({open:false, user:user})}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Make changes to the user information. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
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
            <Label htmlFor="edit-role">Role</Label>
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
            <Label htmlFor="edit-status">Status</Label>
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange({open:false, user:user})}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button> 
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditForm;
