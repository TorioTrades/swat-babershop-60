import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Calendar, Clock, User, Phone, Mail, Scissors, DollarSign, FileText, Receipt } from 'lucide-react';
import { type Appointment } from '@/lib/appointmentStore';
import AppointmentFileUpload from './AppointmentFileUpload';

interface AppointmentDetailsProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

const AppointmentDetails = ({ appointment, open, onOpenChange, onUpdate }: AppointmentDetailsProps) => {
  const [showFileUpload, setShowFileUpload] = useState(false);

  if (!appointment) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'confirmed':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'EEEE, MMMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Appointment Details</span>
            <Badge className={getStatusColor(appointment.status)}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{appointment.customerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{appointment.customerPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{appointment.customerEmail}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Appointment Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Appointment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-sm text-muted-foreground">Barber</span>
                    <p className="font-medium">{appointment.barberName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Scissors className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-sm text-muted-foreground">Service</span>
                    <p className="font-medium">{appointment.service}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-sm text-muted-foreground">Date</span>
                    <p className="font-medium">{formatDate(appointment.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-sm text-muted-foreground">Time</span>
                    <p className="font-medium">{appointment.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-sm text-muted-foreground">Total Amount</span>
                    <p className="font-medium">₱{appointment.price}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Files & Notes Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Files & Notes
              </h3>
              <Button
                variant="outline"
                onClick={() => setShowFileUpload(!showFileUpload)}
              >
                {showFileUpload ? 'Hide' : 'Manage'} Files
              </Button>
            </div>

            {/* Current Files Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Receipt className="h-4 w-4" />
                  <span className="font-medium">Receipt</span>
                </div>
                {appointment.receiptUrl ? (
                  <div className="space-y-2">
                    <p className="text-sm text-green-600">✓ Receipt uploaded</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(appointment.receiptUrl, '_blank')}
                    >
                      View Receipt
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No receipt uploaded</p>
                )}
              </div>

              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">Notes File</span>
                </div>
                {appointment.notesUrl ? (
                  <div className="space-y-2">
                    <p className="text-sm text-green-600">✓ Notes file uploaded</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(appointment.notesUrl, '_blank')}
                    >
                      View Notes
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No notes file uploaded</p>
                )}
              </div>
            </div>

            {/* Text Notes */}
            {appointment.notes && (
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium mb-2">Additional Notes</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {appointment.notes}
                </p>
              </div>
            )}

            {/* File Upload Component */}
            {showFileUpload && (
              <AppointmentFileUpload
                appointment={appointment}
                onUpdate={() => {
                  onUpdate();
                  setShowFileUpload(false);
                }}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetails;