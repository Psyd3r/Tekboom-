
export interface Category {
  id: string;
  name: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  productCount?: number;
}

// Category field format used in product forms
export type CategoryOption = {
  value: string;
  label: string;
};
