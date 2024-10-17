export interface TableColumn<T> {
  label: string;
  property: string;
  type: 'id' | 'text' | 'number' | 'date' | 'datetime' | 'image' | 'badge' | 'progress' | 'checkbox' | 'button' | 'action';
  visible?: boolean;
  cssClasses?: string[];
}
