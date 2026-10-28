import { ControllerState } from '@/src/core/mirror';

export interface StatsState extends ControllerState {
  variant: 'default' | 'elevated' | 'glass';
  isHovered: boolean;
  setIsHovered: (hovered: boolean) => void;
}

export function createInitialStatsState(variant: 'default' | 'elevated' | 'glass' = 'glass'): StatsState {
  return {
    variant,
    isHovered: false,
    setIsHovered: () => {},
  };
}
