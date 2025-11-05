export type WasteLog = {
  id: string;
  materialType: 'Concrete' | 'Wood' | 'Metal' | 'Plastic' | 'Glass' | 'Other';
  quantity: number; // in kg
  date: Date;
  site: string;
  disposalMethod: 'Recycled' | 'Disposed';
  imageUrl?: string;
  binId?: string;
  cause?: 'Offcut' | 'Packaging' | 'Damage' | 'Rework' | 'Other';
};

export type ProjectSite = {
  id: string;
  name: string;
  location: string;
  manager: string;
  startDate: Date;
  squareMeters: number;
};
