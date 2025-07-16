import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UnavailabilitySlot {
  id: string;
  barber_name: string;
  date: string;
  time: string | null;
  reason: string | null;
  is_whole_day: boolean;
}

interface UnavailabilityManagerProps {
  barberName: string;
}

const timeSlots = [
  '9:00 AM', '9:20 AM', '9:40 AM', '10:00 AM', '10:20 AM', '10:40 AM',
  '11:00 AM', '11:20 AM', '11:40 AM', '12:00 PM', '12:20 PM', '12:40 PM',
  '1:00 PM', '1:20 PM', '1:40 PM', '2:00 PM', '2:20 PM', '2:40 PM',
  '3:00 PM', '3:20 PM', '3:40 PM', '4:00 PM', '4:20 PM', '4:40 PM',
  '5:00 PM', '5:20 PM', '5:40 PM', '6:00 PM', '6:20 PM', '6:40 PM', '7:00 PM'
];

export const UnavailabilityManager = ({ barberName }: UnavailabilityManagerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [reason, setReason] = useState('');
  const [unavailableSlots, setUnavailableSlots] = useState<UnavailabilitySlot[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadUnavailableSlots();
  }, [barberName]);

  const loadUnavailableSlots = async () => {
    try {
      const { data, error } = await supabase
        .from('unavailable_slots')
        .select('*')
        .eq('barber_name', barberName)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error loading unavailable slots:', error);
        return;
      }

      setUnavailableSlots(data || []);
    } catch (error) {
      console.error('Error loading unavailable slots:', error);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTimes(prev => 
      prev.includes(time) 
        ? prev.filter(t => t !== time)
        : [...prev, time]
    );
  };

  const markWholeDay = async () => {
    if (!selectedDate) {
      toast({
        title: "No Date Selected",
        description: "Please select a date first",
        variant: "destructive"
      });
      return;
    }

    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    
    try {
      const { error } = await supabase
        .from('unavailable_slots')
        .insert({
          barber_name: barberName,
          date: dateStr,
          time: null,
          reason: reason || null,
          is_whole_day: true
        });

      if (error) {
        console.error('Error marking whole day:', error);
        toast({
          title: "Error",
          description: "Failed to mark whole day as unavailable",
          variant: "destructive"
        });
        return;
      }

      await loadUnavailableSlots();
      
      setSelectedDate(undefined);
      setReason('');
      
      toast({
        title: "Whole Day Marked",
        description: `${dateStr} has been marked as unavailable`,
      });
    } catch (error) {
      console.error('Error marking whole day:', error);
      toast({
        title: "Error",
        description: "Failed to mark whole day as unavailable",
        variant: "destructive"
      });
    }
  };

  const markTimeSlots = async () => {
    if (!selectedDate || selectedTimes.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select a date and at least one time slot",
        variant: "destructive"
      });
      return;
    }

    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    
    try {
      const slotsToInsert = selectedTimes.map(time => ({
        barber_name: barberName,
        date: dateStr,
        time: time,
        reason: reason || null,
        is_whole_day: false
      }));

      const { error } = await supabase
        .from('unavailable_slots')
        .insert(slotsToInsert);

      if (error) {
        console.error('Error marking time slots:', error);
        toast({
          title: "Error",
          description: "Failed to mark time slots as unavailable",
          variant: "destructive"
        });
        return;
      }

      await loadUnavailableSlots();
      
      setSelectedDate(undefined);
      setSelectedTimes([]);
      setReason('');
      
      toast({
        title: "Time Slots Marked",
        description: `${selectedTimes.length} time slots marked as unavailable`,
      });
    } catch (error) {
      console.error('Error marking time slots:', error);
      toast({
        title: "Error",
        description: "Failed to mark time slots as unavailable",
        variant: "destructive"
      });
    }
  };

  const removeUnavailableSlot = async (id: string) => {
    try {
      const { error } = await supabase
        .from('unavailable_slots')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error removing unavailable slot:', error);
        toast({
          title: "Error",
          description: "Failed to remove unavailable slot",
          variant: "destructive"
        });
        return;
      }

      await loadUnavailableSlots();
      
      toast({
        title: "Removed",
        description: "Unavailable slot has been removed",
      });
    } catch (error) {
      console.error('Error removing unavailable slot:', error);
      toast({
        title: "Error",
        description: "Failed to remove unavailable slot",
        variant: "destructive"
      });
    }
  };

  const groupedSlots = unavailableSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, UnavailabilitySlot[]>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mark Daily Unavailability</CardTitle>
          <CardDescription>
            Select dates and times when you're not available for appointments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date">Select Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "MM/dd/yyyy") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Whole Day Option */}
          <Button 
            onClick={markWholeDay} 
            className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            disabled={!selectedDate}
          >
            Mark Whole Day Unavailable
          </Button>

          {/* Time Slot Selection */}
          <div className="space-y-4">
            <div>
              <Label>Select Specific Unavailable Time Slots</Label>
              <p className="text-sm text-muted-foreground">
                Click on time slots to mark them as unavailable. You can select multiple times.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTimes.includes(time) ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => handleTimeSelect(time)}
                  className="text-sm"
                >
                  {time}
                </Button>
              ))}
            </div>

            {selectedTimes.length > 0 && (
              <div className="space-y-2">
                <Label>Selected unavailable times ({selectedTimes.length}):</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedTimes.map((time) => (
                    <Badge key={time} variant="destructive" className="flex items-center gap-1">
                      {time}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => handleTimeSelect(time)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reason Field */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="Enter reason for unavailability..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <Button 
            onClick={markTimeSlots}
            className="w-full"
            disabled={!selectedDate || selectedTimes.length === 0}
            variant="default"
          >
            Mark {selectedTimes.length} Time Slot{selectedTimes.length !== 1 ? 's' : ''} as Unavailable
          </Button>
        </CardContent>
      </Card>

      {/* Current Unavailable Slots */}
      <Card>
        <CardHeader>
          <CardTitle>Current Unavailable Slots</CardTitle>
          <CardDescription>
            Your marked unavailable dates and times
          </CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(groupedSlots).length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No unavailable slots marked
            </p>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedSlots)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([date, slots]) => (
                  <div key={date} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">{format(new Date(date), 'EEEE, MMMM d, yyyy')}</h4>
                    <div className="space-y-2">
                      {slots.map((slot) => (
                        <div key={slot.id} className="flex items-center justify-between bg-muted/50 rounded p-2">
                          <div className="flex-1">
                            <span className="font-medium">
                              {slot.is_whole_day ? 'Whole Day' : slot.time}
                            </span>
                            {slot.reason && (
                              <p className="text-sm text-muted-foreground">{slot.reason}</p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeUnavailableSlot(slot.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};