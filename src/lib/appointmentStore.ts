import { supabase } from '@/integrations/supabase/client';

export interface Appointment {
  id: string;
  barberName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  service: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  price: number;
  receiptUrl?: string;
  notesUrl?: string;
  notes?: string; // Text notes in addition to file notes
}

export const appointmentStore = {
  async getAppointments(): Promise<Appointment[]> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching appointments:', error);
        return [];
      }

      return data.map(appointment => ({
        id: appointment.id,
        barberName: appointment.barber_name,
        customerName: appointment.customer_name,
        customerPhone: appointment.customer_phone,
        customerEmail: appointment.customer_email,
        service: appointment.service,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status as 'pending' | 'confirmed' | 'completed' | 'cancelled',
        createdAt: appointment.created_at,
        price: appointment.price,
        receiptUrl: (appointment as any).receipt_url || undefined,
        notesUrl: (appointment as any).notes_url || undefined,
        notes: (appointment as any).notes || undefined,
      }));
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }
  },

  async addAppointment(appointment: Omit<Appointment, 'id' | 'createdAt'>): Promise<Appointment | null> {
    try {
      console.log('Adding appointment with data:', {
        barber_name: appointment.barberName,
        customer_name: appointment.customerName,
        customer_phone: appointment.customerPhone,
        customer_email: appointment.customerEmail,
        service: appointment.service,
        date: appointment.date,
        time: appointment.time, // Log the actual time value being passed
        status: appointment.status,
        price: appointment.price,
      });

      const { data, error } = await supabase
        .from('appointments')
        .insert({
          barber_name: appointment.barberName,
          customer_name: appointment.customerName,
          customer_phone: appointment.customerPhone,
          customer_email: appointment.customerEmail,
          service: appointment.service,
          date: appointment.date,
          time: appointment.time,
          status: appointment.status,
          price: appointment.price,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding appointment:', error);
        return null;
      }

      console.log('Successfully added appointment:', data);

      return {
        id: data.id,
        barberName: data.barber_name,
        customerName: data.customer_name,
        customerPhone: data.customer_phone,
        customerEmail: data.customer_email,
        service: data.service,
        date: data.date,
        time: data.time,
        status: data.status as 'pending' | 'confirmed' | 'completed' | 'cancelled',
        createdAt: data.created_at,
        price: data.price,
        receiptUrl: (data as any).receipt_url || undefined,
        notesUrl: (data as any).notes_url || undefined,
        notes: (data as any).notes || undefined,
      };
    } catch (error) {
      console.error('Error adding appointment:', error);
      return null;
    }
  },

  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<void> {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Error updating appointment status:', error);
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  },

  async getAppointmentsByBarber(barberName: string): Promise<Appointment[]> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('barber_name', barberName)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching appointments by barber:', error);
        return [];
      }

      return data.map(appointment => ({
        id: appointment.id,
        barberName: appointment.barber_name,
        customerName: appointment.customer_name,
        customerPhone: appointment.customer_phone,
        customerEmail: appointment.customer_email,
        service: appointment.service,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status as 'pending' | 'confirmed' | 'completed' | 'cancelled',
        createdAt: appointment.created_at,
        price: appointment.price,
        receiptUrl: (appointment as any).receipt_url || undefined,
        notesUrl: (appointment as any).notes_url || undefined,
        notes: (appointment as any).notes || undefined,
      }));
    } catch (error) {
      console.error('Error fetching appointments by barber:', error);
      return [];
    }
  },

  async updateAppointmentFiles(id: string, updates: { receiptUrl?: string; notesUrl?: string; notes?: string }): Promise<void> {
    try {
      const updateData: any = {};
      if (updates.receiptUrl !== undefined) updateData.receipt_url = updates.receiptUrl;
      if (updates.notesUrl !== undefined) updateData.notes_url = updates.notesUrl;
      if (updates.notes !== undefined) updateData.notes = updates.notes;

      const { error } = await supabase
        .from('appointments')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating appointment files:', error);
      }
    } catch (error) {
      console.error('Error updating appointment files:', error);
    }
  },

  async uploadFile(file: File, appointmentId: string, type: 'receipt' | 'notes'): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${appointmentId}-${type}-${Date.now()}.${fileExt}`;
      const filePath = `appointments/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('appointment-files')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('appointment-files')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  },

  async clearAllAppointments(): Promise<void> {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

      if (error) {
        console.error('Error clearing appointments:', error);
      }
    } catch (error) {
      console.error('Error clearing appointments:', error);
    }
  },

  async clearBarberAppointments(barberName: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('barber_name', barberName);

      if (error) {
        console.error('Error clearing barber appointments:', error);
      }
    } catch (error) {
      console.error('Error clearing barber appointments:', error);
    }
  },

  async deleteAppointment(id: string): Promise<void> {
    try {
      console.log('Deleting appointment and related duration blocks:', id);
      
      // First, get the appointment details to find related duration blocks
      const { data: appointment, error: fetchError } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching appointment for deletion:', fetchError);
        return;
      }

      if (!appointment) {
        console.error('Appointment not found for deletion:', id);
        return;
      }

      console.log('Found appointment to delete:', appointment);

      // Extract the base service name without duration block suffix
      const baseService = appointment.service.replace(/ \(Duration Block \d+ of \d+\)$/, '');
      console.log('Base service name:', baseService);

      // Find all appointments (main + duration blocks) for this booking
      // They should all have the same barber, date, customer info, and either the exact service name or be duration blocks
      const { data: relatedAppointments, error: fetchRelatedError } = await supabase
        .from('appointments')
        .select('*')
        .eq('barber_name', appointment.barber_name)
        .eq('date', appointment.date)
        .eq('customer_name', appointment.customer_name)
        .eq('customer_phone', appointment.customer_phone)
        .or(`service.eq.${baseService},service.like.${baseService} (Duration Block%`);

      if (fetchRelatedError) {
        console.error('Error fetching related appointments:', fetchRelatedError);
        return;
      }

      if (relatedAppointments && relatedAppointments.length > 0) {
        console.log('Found related appointments to delete:', relatedAppointments.length);
        console.log('Related appointments:', relatedAppointments.map(apt => ({ id: apt.id, service: apt.service, time: apt.time })));
        
        const appointmentIds = relatedAppointments.map(apt => apt.id);
        const { error: deleteError } = await supabase
          .from('appointments')
          .delete()
          .in('id', appointmentIds);

        if (deleteError) {
          console.error('Error deleting related appointments:', deleteError);
        } else {
          console.log('Successfully deleted all related appointments:', appointmentIds.length);
        }
      } else {
        console.log('No related appointments found, deleting single appointment');
        // Fallback: delete just the single appointment if no related ones found
        const { error: deleteMainError } = await supabase
          .from('appointments')
          .delete()
          .eq('id', id);

        if (deleteMainError) {
          console.error('Error deleting main appointment:', deleteMainError);
        } else {
          console.log('Main appointment deleted successfully');
        }
      }

    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  }
};
