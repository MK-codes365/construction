import React from 'react';
import ProjectSitesOSMMap from '@/components/ProjectSitesOSMMap';

export default function SitesMapPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Project Sites Map</h1>
  <ProjectSitesOSMMap />
    </div>
  );
}
