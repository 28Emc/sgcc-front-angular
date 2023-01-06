export interface TableColumn<T> {
  label: string;
  property: string;
  type: 'text' | 'image' | 'badge' | 'progress' | 'checkbox' | 'button' | 'date' | 'hour' | 'number' | 'input' | 'selection' | 'icon' | 'url';
  visible?: boolean;
  cssClasses?: string[];
}
