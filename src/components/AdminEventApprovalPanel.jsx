
import React, { useState } from 'react';
import { approveEventRegistration, rejectEventRegistration } from '@/services/eventService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminEventApprovalPanel = ({ registrations, onUpdate }) => {
    const [processing, setProcessing] = useState(null);
    const { toast } = useToast();

    // Filter for pending only
    const pendingRegistrations = registrations.filter(r => r.approval_status === 'pending');

    const handleApprove = async (id) => {
        setProcessing(id);
        const result = await approveEventRegistration(id, 'Admin'); // Ideally get user from context
        if (result.success) {
            toast({ title: "Approved", description: "Registration approved and QR code sent." });
            onUpdate();
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
        setProcessing(null);
    };

    const handleReject = async (id) => {
        setProcessing(id);
        const result = await rejectEventRegistration(id, 'Admin');
        if (result.success) {
            toast({ title: "Rejected", description: "Registration rejected and user notified." });
            onUpdate();
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
        setProcessing(null);
    };

    if (pendingRegistrations.length === 0) {
        return (
            <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed">
                <p className="text-gray-500">No pending registrations to review.</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border bg-white shadow">
            <div className="p-4 bg-gray-50 border-b">
                <h3 className="font-semibold text-navy">Pending Approvals ({pendingRegistrations.length})</h3>
            </div>
            <div className="divide-y">
                {pendingRegistrations.map((reg) => (
                    <div key={reg.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <p className="font-bold text-navy">{reg.full_name}</p>
                            <p className="text-sm text-gray-500">{reg.email} • {reg.phone}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">{reg.company_name || 'Individual'}</Badge>
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {new Date(reg.created_at).toLocaleString()}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                                onClick={() => handleApprove(reg.id)}
                                disabled={processing === reg.id}
                            >
                                <Check className="w-4 h-4 mr-1" /> Approve
                            </Button>
                            <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                onClick={() => handleReject(reg.id)}
                                disabled={processing === reg.id}
                            >
                                <X className="w-4 h-4 mr-1" /> Reject
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminEventApprovalPanel;
