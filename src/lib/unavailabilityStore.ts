
import { supabase } from '@/integrations/supabase/client';

export interface UnavailabilitySlot {
  id: string;
  barberName: string;
  date: string;
  time?: string;
  isFullDay: boolean;
  reason?: string;
  createdAt: string;
}

export const unavailabilityStore = {
  async getUnavailableSlots(barberName: string): Promise<UnavailabilitySlot[]> {
    try {
      const { data, error } = await supabase
        .from('unavailable_slots')
        .select('*')
        .eq('barber_name', barberName)
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching unavailable slots:', error);
        return [];
      }

      return data?.map((slot: any) => ({
        id: slot.id,
        barberName: slot.barber_name,
        date: slot.date,
        time: slot.time,
        isFullDay: slot.is_whole_day,
        reason: slot.reason,
        createdAt: slot.created_at,
      })) || [];
    } catch (error) {
      console.error('Error fetching unavailable slots:', error);
      return [];
    }
  },

  async markTimeSlot(
    barberName: string, 
    date: string, 
    time: string, 
    reason?: string
  ): Promise<UnavailabilitySlot | null> {
    try {
      const { data, error } = await supabase
        .from('unavailable_slots')
        .insert({
          barber_name: barberName,
          date,
          time,
          is_whole_day: false,
          reason: reason || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error marking time slot unavailable:', error);
        return null;
      }

      const slot = data as any;
      return {
        id: slot.id,
        barberName: slot.barber_name,
        date: slot.date,
        time: slot.time,
        isFullDay: slot.is_whole_day,
        reason: slot.reason,
        createdAt: slot.created_at,
      };
    } catch (error) {
      console.error('Error marking time slot unavailable:', error);
      return null;
    }
  },

  async markWholeDay(
    barberName: string, 
    date: string, 
    reason?: string
  ): Promise<UnavailabilitySlot | null> {
    try {
      const { data, error } = await supabase
        .from('unavailable_slots')
        .insert({
          barber_name: barberName,
          date,
          time: null,
          is_whole_day: true,
          reason: reason || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error marking whole day unavailable:', error);
        return null;
      }

      const slot = data as any;
      return {
        id: slot.id,
        barberName: slot.barber_name,
        date: slot.date,
        time: slot.time,
        isFullDay: slot.is_whole_day,
        reason: slot.reason,
        createdAt: slot.created_at,
      };
    } catch (error) {
      console.error('Error marking whole day unavailable:', error);
      return null;
    }
  },

  async removeUnavailableSlot(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('unavailable_slots')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error removing unavailable slot:', error);
      }
    } catch (error) {
      console.error('Error removing unavailable slot:', error);
    }
  },

  async getUnavailableSlotsForDate(barberName: string, date: string): Promise<UnavailabilitySlot[]> {
    try {
      const { data, error } = await supabase
        .from('unavailable_slots')
        .select('*')
        .eq('barber_name', barberName)
        .eq('date', date);

      if (error) {
        console.error('Error fetching unavailable slots for date:', error);
        return [];
      }

      return data?.map((slot: any) => ({
        id: slot.id,
        barberName: slot.barber_name,
        date: slot.date,
        time: slot.time,
        isFullDay: slot.is_whole_day,
        reason: slot.reason,
        createdAt: slot.created_at,
      })) || [];
    } catch (error) {
      console.error('Error fetching unavailable slots for date:', error);
      return [];
    }
  }
};
