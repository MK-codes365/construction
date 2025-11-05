import type { WasteLog, ProjectSite } from '@/lib/types';

export let projectSites: ProjectSite[] = [
  { id: 'site-01', name: 'Downtown Tower', location: '123 Main St, Metropolis', manager: 'Alice Johnson', startDate: new Date('2023-01-15'), squareMeters: 50000 },
  { id: 'site-02', name: 'Greenwood Plaza', location: '456 Oak Ave, Star City', manager: 'Bob Williams', startDate: new Date('2023-03-01'), squareMeters: 75000 },
  { id: 'site-03', name: 'Oceanview Residences', location: '789 Beach Blvd, Coast City', manager: 'Charlie Brown', startDate: new Date('2023-05-20'), squareMeters: 30000 },
  { id: 'site-04', name: 'Hillside Complex', location: '101 Hilltop Rd, Gotham', manager: 'Diana Prince', startDate: new Date('2023-08-10'), squareMeters: 120000 },
];

export let wasteLogs: WasteLog[] = [
  { id: 'log-01', materialType: 'Concrete', quantity: 1200, date: new Date('2024-07-01'), site: 'Downtown Tower', disposalMethod: 'Recycled', imageUrl: 'https://picsum.photos/seed/log-01/400/300', binId: 'BIN-01A', cause: 'Rework' },
  { id: 'log-02', materialType: 'Wood', quantity: 350, date: new Date('2024-07-01'), site: 'Downtown Tower', disposalMethod: 'Disposed', binId: 'BIN-02C', cause: 'Offcut' },
  { id: 'log-03', materialType: 'Metal', quantity: 800, date: new Date('2024-07-02'), site: 'Greenwood Plaza', disposalMethod: 'Recycled', binId: 'BIN-G4', cause: 'Damage' },
  { id: 'log-04', materialType: 'Plastic', quantity: 150, date: new Date('2024-07-03'), site: 'Downtown Tower', disposalMethod: 'Recycled', binId: 'BIN-03B', cause: 'Packaging' },
  { id: 'log-05', materialType: 'Concrete', quantity: 2500, date: new Date('2024-07-03'), site: 'Oceanview Residences', disposalMethod: 'Recycled', imageUrl: 'https://picsum.photos/seed/log-05/400/300', binId: 'OC-C1', cause: 'Rework' },
  { id: 'log-06', materialType: 'Glass', quantity: 200, date: new Date('2024-07-04'), site: 'Greenwood Plaza', disposalMethod: 'Recycled', binId: 'BIN-G7', cause: 'Damage' },
  { id: 'log-07', materialType: 'Other', quantity: 100, date: new Date('2024-07-05'), site: 'Downtown Tower', disposalMethod: 'Disposed', binId: 'BIN-MISC', cause: 'Other' },
  { id: 'log-08', materialType: 'Wood', quantity: 450, date: new Date('2024-07-05'), site: 'Oceanview Residences', disposalMethod: 'Recycled', binId: 'OC-W2', cause: 'Offcut' },
  { id: 'log-09', materialType: 'Metal', quantity: 600, date: new Date('2024-07-06'), site: 'Downtown Tower', disposalMethod: 'Recycled', binId: 'BIN-01A', cause: 'Rework' },
  { id: 'log-10', materialType: 'Concrete', quantity: 1800, date: new Date('2024-07-08'), site: 'Greenwood Plaza', disposalMethod: 'Disposed', binId: 'BIN-G5', cause: 'Rework' },
  { id: 'log-11', materialType: 'Plastic', quantity: 250, date: new Date('2024-07-09'), site: 'Oceanview Residences', disposalMethod: 'Recycled', binId: 'OC-P1', cause: 'Packaging' },
  { id: 'log-12', materialType: 'Wood', quantity: 500, date: new Date('2024-07-10'), site: 'Downtown Tower', disposalMethod: 'Recycled', binId: 'BIN-02C', cause: 'Offcut' },
  { id: 'log-13', materialType: 'Metal', quantity: 750, date: new Date('2024-07-11'), site: 'Hillside Complex', disposalMethod: 'Recycled', binId: 'HC-M1', cause: 'Damage' },
  { id: 'log-14', materialType: 'Glass', quantity: 300, date: new Date('2024-07-12'), site: 'Greenwood Plaza', disposalMethod: 'Disposed', binId: 'BIN-G8', cause: 'Damage' },
  { id: 'log-15', materialType: 'Concrete', quantity: 3200, date: new Date('2024-07-15'), site: 'Downtown Tower', disposalMethod: 'Recycled', binId: 'BIN-01B', cause: 'Rework' },
];

export function addWasteLog(log: Omit<WasteLog, 'id'>) {
  const newLog = {
    ...log,
    id: `log-${Date.now()}`
  };
  wasteLogs = [newLog, ...wasteLogs];
}

export function addProjectSite(site: Omit<ProjectSite, 'id'>) {
  const newSite = {
    ...site,
    id: `site-${Date.now()}`
  };
  projectSites = [newSite, ...projectSites];
}

export function updateProjectSite(updatedSite: ProjectSite) {
  projectSites = projectSites.map(site => 
    site.id === updatedSite.id ? updatedSite : site
  );
}

export function getSiteById(id: string): ProjectSite | undefined {
  return projectSites.find(site => site.id === id);
}


export const materialTypes = ['Concrete', 'Wood', 'Metal', 'Plastic', 'Glass', 'Other'];

export const wasteCauses = ['Offcut', 'Packaging', 'Damage', 'Rework', 'Other'];
