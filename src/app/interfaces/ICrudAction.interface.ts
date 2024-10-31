export interface ICrudAction {
  position: 'HEADER' | 'TABLE';
  label: string;
  icon?: string;
  action: (element?: any) => void;
  showCondition: boolean;
  loadingCondition?: (element?: any) => boolean;
  disabledCondition?: (element?: any) => boolean;
}
