import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Receipt, Upload, Download, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { appointmentStore, type Appointment } from '@/lib/appointmentStore';

interface AppointmentFileUploadProps {
  appointment: Appointment;
  onUpdate: () => void;
}

const AppointmentFileUpload = ({ appointment, onUpdate }: AppointmentFileUploadProps) => {
  const [isUploading, setIsUploading] = useState<{ receipt: boolean; notes: boolean }>({
    receipt: false,
    notes: false,
  });
  const [textNotes, setTextNotes] = useState(appointment.notes || '');
  const { toast } = useToast();

  const handleFileUpload = async (file: File, type: 'receipt' | 'notes') => {
    if (!file) return;

    // Validate file type
    const allowedTypes = {
      receipt: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
      notes: ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    };

    if (!allowedTypes[type].includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: `Please upload a valid ${type} file.`,
        variant: "destructive",
      });
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(prev => ({ ...prev, [type]: true }));

    try {
      const fileUrl = await appointmentStore.uploadFile(file, appointment.id, type);
      
      if (fileUrl) {
        await appointmentStore.updateAppointmentFiles(appointment.id, {
          [type === 'receipt' ? 'receiptUrl' : 'notesUrl']: fileUrl
        });
        
        toast({
          title: "File uploaded successfully",
          description: `${type.charAt(0).toUpperCase() + type.slice(1)} has been uploaded.`,
        });
        
        onUpdate();
      } else {
        throw new Error('Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleNotesUpdate = async () => {
    try {
      await appointmentStore.updateAppointmentFiles(appointment.id, {
        notes: textNotes
      });
      
      toast({
        title: "Notes updated",
        description: "Appointment notes have been saved.",
      });
      
      onUpdate();
    } catch (error) {
      console.error('Error updating notes:', error);
      toast({
        title: "Update failed",
        description: "Failed to update notes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openFile = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Appointment Files & Notes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="receipt" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="receipt">Receipt</TabsTrigger>
            <TabsTrigger value="notes-file">Notes File</TabsTrigger>
            <TabsTrigger value="text-notes">Text Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="receipt" className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="receipt-upload" className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Upload Receipt (JPG, PNG, PDF)
              </Label>
              
              <div className="flex items-center gap-2">
                <Input
                  id="receipt-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'receipt');
                  }}
                  disabled={isUploading.receipt}
                  className="flex-1"
                />
                
                {appointment.receiptUrl && (
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openFile(appointment.receiptUrl!)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = appointment.receiptUrl!;
                        link.download = `receipt-${appointment.id}`;
                        link.click();
                      }}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
              
              {isUploading.receipt && (
                <p className="text-sm text-muted-foreground">Uploading receipt...</p>
              )}
              
              {appointment.receiptUrl && (
                <p className="text-sm text-green-600">✓ Receipt uploaded successfully</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notes-file" className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="notes-upload" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Upload Notes File (PDF, DOC, DOCX, TXT)
              </Label>
              
              <div className="flex items-center gap-2">
                <Input
                  id="notes-upload"
                  type="file"
                  accept="application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'notes');
                  }}
                  disabled={isUploading.notes}
                  className="flex-1"
                />
                
                {appointment.notesUrl && (
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openFile(appointment.notesUrl!)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = appointment.notesUrl!;
                        link.download = `notes-${appointment.id}`;
                        link.click();
                      }}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
              
              {isUploading.notes && (
                <p className="text-sm text-muted-foreground">Uploading notes file...</p>
              )}
              
              {appointment.notesUrl && (
                <p className="text-sm text-green-600">✓ Notes file uploaded successfully</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="text-notes" className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="text-notes">Additional Notes</Label>
              <Textarea
                id="text-notes"
                placeholder="Enter any additional notes about this appointment..."
                value={textNotes}
                onChange={(e) => setTextNotes(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <Button onClick={handleNotesUpdate} className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Save Notes
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AppointmentFileUpload;