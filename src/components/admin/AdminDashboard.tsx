import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw, Trash2, LogOut, Check, X, Clock, Calendar, Eye, FileText, Receipt, Home, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';
import type { Barber } from '@/pages/Admin';
import { appointmentStore, type Appointment } from '@/lib/appointmentStore';
import AppointmentDetails from '@/components/AppointmentDetails';
import { UnavailabilityManager } from './UnavailabilityManager';
interface AdminDashboardProps {
  barber: Barber;
  onLogout: () => void;
}

// Removed mock data - now using real appointments from store

export const AdminDashboard = ({
  barber,
  onLogout
}: AdminDashboardProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    loadAppointments();
  }, [barber.name]);
  const loadAppointments = async () => {
    if (barber.isAdmin) {
      // Admin can see all appointments from all barbers
      const allAppointments = await appointmentStore.getAppointments();
      setAppointments(allAppointments);
    } else {
      // Regular barber sees only their own appointments
      const barberAppointments = await appointmentStore.getAppointmentsByBarber(barber.name);
      setAppointments(barberAppointments);
    }
  };
  const updateAppointmentStatus = async (id: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    await appointmentStore.updateAppointmentStatus(id, status);
    await loadAppointments();
    toast({
      title: "Status Updated",
      description: `Appointment status changed to ${status}`
    });
  };
  const clearAllAppointments = async () => {
    try {
      if (barber.isAdmin) {
        console.log('Admin clearing all appointments from all barbers');
        await appointmentStore.clearAllAppointments();
        toast({
          title: "All Cleared",
          description: "All appointments from all barbers have been cleared"
        });
      } else {
        console.log('Clearing all appointments for barber:', barber.name);
        await appointmentStore.clearBarberAppointments(barber.name);
        toast({
          title: "All Cleared",
          description: "All your appointments have been cleared"
        });
      }
      await loadAppointments();
      console.log('Successfully cleared all appointments');
    } catch (error) {
      console.error('Error clearing appointments:', error);
      toast({
        title: "Error",
        description: "Failed to clear appointments",
        variant: "destructive"
      });
    }
  };
  const deleteAppointment = async (id: string) => {
    try {
      console.log('Deleting appointment with id:', id);
      await appointmentStore.deleteAppointment(id);
      await loadAppointments();
      toast({
        title: "Appointment Deleted",
        description: "Appointment has been permanently removed"
      });
      console.log('Successfully deleted appointment:', id);
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast({
        title: "Error",
        description: "Failed to delete appointment",
        variant: "destructive"
      });
    }
  };
  const refreshAppointments = async () => {
    await loadAppointments();
    toast({
      title: "Refreshed",
      description: "Appointment list has been refreshed"
    });
  };
  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDetails(true);
  };
  const downloadBookingDetails = async (appointment: Appointment) => {
    try {
      // Create a temporary element with the booking details
      const element = document.createElement('div');
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      element.style.background = 'white';
      element.style.padding = '40px';
      element.style.width = '600px';
      element.style.fontFamily = 'Arial, sans-serif';
      element.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #D4AF37; font-size: 28px; margin: 0; font-weight: bold;">Booking Details</h1>
          <p style="color: #666; margin: 5px 0 0 0;">Appointment Confirmation</p>
        </div>
        
        <div style="border: 2px solid #D4AF37; border-radius: 10px; padding: 30px; background: #fafafa;">
          <div style="display: grid; gap: 20px;">
            <div style="border-bottom: 1px solid #eee; padding-bottom: 15px;">
              <h3 style="color: #D4AF37; margin: 0 0 10px 0; font-size: 18px;">Customer Information</h3>
              <p style="margin: 5px 0; font-size: 16px;"><strong>Name:</strong> ${appointment.customerName}</p>
              <p style="margin: 5px 0; font-size: 16px;"><strong>Phone:</strong> ${appointment.customerPhone}</p>
              <p style="margin: 5px 0; font-size: 16px;"><strong>Email:</strong> ${appointment.customerEmail}</p>
            </div>
            
            <div style="border-bottom: 1px solid #eee; padding-bottom: 15px;">
              <h3 style="color: #D4AF37; margin: 0 0 10px 0; font-size: 18px;">Appointment Details</h3>
              <p style="margin: 5px 0; font-size: 16px;"><strong>Date:</strong> ${appointment.date}</p>
              <p style="margin: 5px 0; font-size: 16px;"><strong>Time:</strong> ${appointment.time}</p>
              <p style="margin: 5px 0; font-size: 16px;"><strong>Barber:</strong> ${appointment.barberName}</p>
            </div>
            
            <div style="border-bottom: 1px solid #eee; padding-bottom: 15px;">
              <h3 style="color: #D4AF37; margin: 0 0 10px 0; font-size: 18px;">Service Information</h3>
              <p style="margin: 5px 0; font-size: 16px;"><strong>Service:</strong> ${appointment.service}</p>
              <p style="margin: 5px 0; font-size: 16px;"><strong>Price:</strong> ₱${appointment.price}</p>
              <p style="margin: 5px 0; font-size: 16px;"><strong>Status:</strong> ${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</p>
            </div>
            
            <div>
              <h3 style="color: #D4AF37; margin: 0 0 10px 0; font-size: 18px;">Appointment ID</h3>
              <p style="margin: 5px 0; font-size: 14px; color: #666; font-family: monospace;">${appointment.id}</p>
            </div>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
          <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>
      `;
      document.body.appendChild(element);

      // Generate the canvas
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false
      });

      // Remove the temporary element
      document.body.removeChild(element);

      // Create download link
      const link = document.createElement('a');
      link.download = `booking-${appointment.customerName.replace(/\s+/g, '-')}-${appointment.date}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast({
        title: "Download Complete",
        description: "Booking details have been downloaded as PNG"
      });
    } catch (error) {
      console.error('Error downloading booking details:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download booking details",
        variant: "destructive"
      });
    }
  };
  const getStatusBadge = (status: string) => {
    const variants = {
      pending: {
        variant: 'secondary' as const,
        icon: Clock
      },
      confirmed: {
        variant: 'default' as const,
        icon: Check
      },
      completed: {
        variant: 'default' as const,
        icon: Check
      },
      cancelled: {
        variant: 'destructive' as const,
        icon: X
      }
    };
    const config = variants[status as keyof typeof variants] || variants.pending;
    const Icon = config.icon;
    return <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>;
  };
  const filterAppointments = (filter: string) => {
    const today = new Date().toISOString().split('T')[0];
    // Filter out duration block appointments - only show main appointments
    const mainAppointments = appointments.filter(apt => !apt.service.includes('(Duration Block'));
    let filtered;
    switch (filter) {
      case 'today':
        filtered = mainAppointments.filter(apt => apt.date === today && apt.status === 'pending');
        break;
      case 'pending':
        filtered = mainAppointments.filter(apt => apt.status === 'pending');
        break;
      case 'completed':
        filtered = mainAppointments.filter(apt => apt.status === 'completed');
        break;
      default:
        filtered = mainAppointments;
    }

    // Sort by date first, then by time
    return filtered.sort((a, b) => {
      // Compare dates first
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      // If dates are the same, compare times properly
      const timeA = new Date(`1970-01-01 ${a.time}`).getTime();
      const timeB = new Date(`1970-01-01 ${b.time}`).getTime();
      return timeA - timeB;
    });
  };
  const today = new Date().toISOString().split('T')[0];
  // Count only main appointments, not duration blocks
  const mainAppointments = appointments.filter(apt => !apt.service.includes('(Duration Block'));
  const pendingCount = mainAppointments.filter(apt => apt.status === 'pending').length;
  const todayCount = mainAppointments.filter(apt => apt.date === today && apt.status === 'pending').length;
  const completedCount = mainAppointments.filter(apt => apt.status === 'completed').length;
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex flex-col sm:flex-row h-auto sm:h-16 items-start sm:items-center justify-between p-4 sm:px-6 gap-4 sm:gap-0">
          <div className="w-full sm:w-auto">
            <h1 className="text-xl sm:text-2xl font-serif font-semibold">Appointment Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {barber.name}</p>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={() => navigate('/')} className="flex-1 sm:flex-none min-w-0">
              <Home className="h-4 w-4 mr-2" />
              <span className="hidden xs:inline">Home</span>
            </Button>
            <Button variant="outline" size="sm" onClick={refreshAppointments} className="flex-1 sm:flex-none min-w-0">
              <RefreshCw className="h-4 w-4 mr-2" />
              <span className="hidden xs:inline">Refresh</span>
            </Button>
            <Button variant="destructive" size="sm" onClick={clearAllAppointments} className="flex-1 sm:flex-none min-w-0">
              <Trash2 className="h-4 w-4 mr-2" />
              <span className="hidden xs:inline">Clear All</span>
            </Button>
            <Button variant="outline" onClick={onLogout} className="flex-1 sm:flex-none min-w-0">
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden xs:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6">
        <Tabs defaultValue="all" className="space-y-4 sm:space-y-6">
          <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full h-auto sm:h-10 gap-1 sm:gap-0 p-1">
            <TabsTrigger value="all" className="text-xs sm:text-sm p-2 sm:p-3">
              <span className="hidden sm:inline">All Appointments ({mainAppointments.length})</span>
              <span className="sm:hidden">All ({mainAppointments.length})</span>
            </TabsTrigger>
            <TabsTrigger value="today" className="text-xs sm:text-sm p-2 sm:p-3">
              <span className="hidden sm:inline">Pending Today ({todayCount})</span>
              <span className="sm:hidden">Today ({todayCount})</span>
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs sm:text-sm p-2 sm:p-3">
              <span className="hidden sm:inline">Pending ({pendingCount})</span>
              <span className="sm:hidden">Pending ({pendingCount})</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs sm:text-sm p-2 sm:p-3">
              <span className="hidden sm:inline">Completed ({completedCount})</span>
              <span className="sm:hidden">Done ({completedCount})</span>
            </TabsTrigger>
            <TabsTrigger value="unavailable" className="text-destructive text-xs sm:text-sm p-2 sm:p-3 col-span-2 sm:col-span-1">
              <span className="hidden sm:inline">Unavailable</span>
              <span className="sm:hidden">Unavailable</span>
            </TabsTrigger>
          </TabsList>

          {['all', 'today', 'pending', 'completed'].map(filter => <TabsContent key={filter} value={filter}>
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                    Appointments Management
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Manage your {filter === 'all' ? 'all' : filter} appointments
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                  {/* Desktop Table View */}
                  <div className="hidden sm:block">
                    <Table>
                       <TableHeader>
                         <TableRow>
                           <TableHead>Customer</TableHead>
                           <TableHead>Contact</TableHead>
                           <TableHead>Appointment</TableHead>
                           {barber.isAdmin && <TableHead>Barber</TableHead>}
                           <TableHead>Service</TableHead>
                           <TableHead>Status</TableHead>
                           <TableHead>Actions</TableHead>
                         </TableRow>
                       </TableHeader>
                      <TableBody>
                        {filterAppointments(filter).map(appointment => <TableRow key={appointment.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{appointment.customerName}</div>
                                <div className="text-sm text-muted-foreground">Customer</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div>{appointment.customerPhone}</div>
                                <div className="text-sm text-muted-foreground">{appointment.customerEmail}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <div>
                                  <div>{appointment.date}</div>
                                  <div className="text-sm text-muted-foreground">{appointment.time}</div>
                                </div>
                              </div>
                             </TableCell>
                             {barber.isAdmin && (
                               <TableCell>
                                 <div className="font-medium">{appointment.barberName}</div>
                               </TableCell>
                             )}
                             <TableCell>
                               <div>
                                 <div className="font-medium">{appointment.service}</div>
                                 <div className="text-sm text-muted-foreground">₱{appointment.price}</div>
                               </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(appointment.status)}
                            </TableCell>
                            <TableCell>
                               <div className="flex gap-1">
                                 <Button size="sm" variant="outline" onClick={() => handleViewDetails(appointment)} className="flex items-center gap-1">
                                   <Eye className="h-3 w-3" />
                                   Details
                                 </Button>
                                 
                                {appointment.status === 'pending' && <Button size="sm" variant="default" onClick={() => updateAppointmentStatus(appointment.id, 'completed')}>
                                    <Check className="h-4 w-4 mr-2" />
                                    Mark Done
                                  </Button>}
                                {appointment.status === 'confirmed' && <Button size="sm" variant="default" onClick={() => updateAppointmentStatus(appointment.id, 'completed')}>
                                    <Check className="h-4 w-4" />
                                  </Button>}
                                <Button size="sm" variant="destructive" onClick={() => deleteAppointment(appointment.id)}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>)}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="sm:hidden space-y-4 p-4">
                    {filterAppointments(filter).length === 0 ? <div className="text-center py-8 text-muted-foreground">
                        No appointments found
                      </div> : filterAppointments(filter).map(appointment => <Card key={appointment.id} className="p-4">
                          <div className="space-y-3">
                            {/* Customer Info */}
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-lg">{appointment.customerName}</h3>
                                <p className="text-sm text-muted-foreground">{appointment.customerPhone}</p>
                                <p className="text-xs text-muted-foreground">{appointment.customerEmail}</p>
                              </div>
                              {getStatusBadge(appointment.status)}
                            </div>

                            {/* Appointment Details */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Date & Time</p>
                                <p className="font-medium">{appointment.date}</p>
                                <p className="text-muted-foreground">{appointment.time}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Service</p>
                                <p className="font-medium">{appointment.service}</p>
                                <p className="text-muted-foreground">₱{appointment.price}</p>
                              </div>
                              {barber.isAdmin && (
                                <div>
                                  <p className="text-muted-foreground">Barber</p>
                                  <p className="font-medium">{appointment.barberName}</p>
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                             <div className="flex gap-2 pt-2">
                               <Button size="sm" variant="outline" onClick={() => handleViewDetails(appointment)} className="flex-1">
                                 <Eye className="h-4 w-4 mr-2" />
                                 View
                               </Button>
                               <Button size="sm" variant="outline" onClick={() => downloadBookingDetails(appointment)} className="flex-1">
                                 <Download className="h-4 w-4 mr-2" />
                                 PNG
                               </Button>
                              {appointment.status === 'pending' && <Button size="sm" variant="default" onClick={() => updateAppointmentStatus(appointment.id, 'completed')} className="flex-1">
                                  <Check className="h-4 w-4 mr-2" />
                                  Done
                                </Button>}
                              {appointment.status === 'confirmed' && <Button size="sm" variant="default" onClick={() => updateAppointmentStatus(appointment.id, 'completed')} className="flex-1">
                                  <Check className="h-4 w-4 mr-2" />
                                  Done
                                </Button>}
                              <Button size="sm" variant="destructive" onClick={() => deleteAppointment(appointment.id)} className="px-3">
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>)}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>)}

          <TabsContent value="unavailable">
            <UnavailabilityManager barberName={barber.name} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Appointment Details Modal */}
      <AppointmentDetails appointment={selectedAppointment} open={showDetails} onOpenChange={setShowDetails} onUpdate={loadAppointments} />
    </div>;
};