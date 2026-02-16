
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

const UserManagementForm = ({ isOpen, onClose, mode = 'create', initialData = null, onSubmit, isSubmitting }) => {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      full_name: '',
      phone: '',
      role: 'student'
    }
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setValue('email', initialData.email);
        setValue('full_name', initialData.full_name);
        setValue('phone', initialData.phone);
        setValue('role', initialData.role || 'student');
      } else {
        reset({
          email: '',
          full_name: '',
          phone: '',
          role: 'student'
        });
      }
    }
  }, [isOpen, mode, initialData, setValue, reset]);

  const onFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create New User' : 'Edit User'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address {mode === 'create' && <span className="text-red-500">*</span>}</Label>
            <Input
              id="email"
              type="email"
              disabled={mode === 'edit'} // Read-only in edit mode
              className={mode === 'edit' ? "bg-gray-100 text-gray-500" : ""}
              {...register('email', { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
            />
            {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name <span className="text-red-500">*</span></Label>
            <Input
              id="full_name"
              {...register('full_name', { required: "Full Name is required" })}
            />
            {errors.full_name && <span className="text-xs text-red-500">{errors.full_name.message}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              {...register('phone')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role <span className="text-red-500">*</span></Label>
            <Select 
              onValueChange={(val) => setValue('role', val)} 
              defaultValue={mode === 'edit' && initialData ? initialData.role : "student"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="director">Director</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="shareholder">Shareholder</SelectItem>
                <SelectItem value="applicant">Applicant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#003D82] text-white hover:bg-[#002855]" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                mode === 'create' ? 'Create User' : 'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserManagementForm;
