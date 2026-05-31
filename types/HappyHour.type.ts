export type HappyHour = {
  id: string;
  dayOfWeek: number;
  startHour: number;
  startMin: number;
  endHour: number;
  endMin: number;
  multiplier: number;
  label: string;
  isActive: boolean;
};

export type HappyHoursResponse = {
  active: { multiplier: number; label: string } | null;
  schedule: HappyHour[];
};
