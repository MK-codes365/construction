// AR Blueprint Viewer Component


import React, { useEffect, useState, useRef } from 'react';
import { useAR } from '../../hooks/useAR';
import { fetchWasteLogs } from '../../services/arService';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

const ARBlueprintViewer = () => {
  const blueprints = useAR();
  const [wasteLogs, setWasteLogs] = useState([]);
  const mountRef = useRef(null);
  const materialColors = {
    Concrete: 0x888888,
    Wood: 0x8d5524,
    Metal: 0x00bcd4,
    Plastic: 0xff9800,
    Glass: 0x90caf9,
    Other: 0x43a047,
  };

  // Chart component removed from AR file — chart/legend live in VR view now

  useEffect(() => {
    fetchWasteLogs().then(res => {
      if (res.status === 'ok') setWasteLogs(res.logs);
    });
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;
    // Basic Three.js scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 600 / 400, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(600, 400);
    mountRef.current.appendChild(renderer.domElement);

    // CSS2DRenderer for labels
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(600, 400);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.left = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    mountRef.current.appendChild(labelRenderer.domElement);

    // Add a simple grid as blueprint
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    // Add waste log markers as spheres with labels and colors
    const markers = [];
    wasteLogs.slice(0, 10).forEach((log, idx) => {
      const geometry = new THREE.SphereGeometry(0.2, 32, 32);
      // normalize material type to canonical key (case-insensitive + trim)
      const rawMat = (log.materialType || '').toString().trim();
      const canonical = Object.keys(materialColors).find(k => k.toLowerCase() === rawMat.toLowerCase()) || (rawMat || 'Other');
      const color = materialColors[canonical] || 0x00ff00;
      const material = new THREE.MeshBasicMaterial({ color });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set((idx % 5) - 2, 0.2, Math.floor(idx / 5) - 1);
      scene.add(sphere);
      // store canonical material and log for tooltip/legend consistency
      sphere.userData.log = { ...log, materialType: canonical };
      markers.push(sphere);

      // Add label using CSS2DObject
      const labelDiv = document.createElement('div');
      labelDiv.className = 'ar-label';
      labelDiv.style.color = '#fff';
      labelDiv.style.background = '#333a';
      labelDiv.style.padding = '2px 6px';
      labelDiv.style.borderRadius = '4px';
      labelDiv.style.fontSize = '0.8em';
      labelDiv.style.pointerEvents = 'none';
  labelDiv.innerText = canonical;
      const labelObj = new CSS2DObject(labelDiv);
      labelObj.position.set(sphere.position.x, sphere.position.y + 0.3, sphere.position.z);
      scene.add(labelObj);
      sphere.userData.labelObj = labelObj;
    });

    // Tooltip div for hover info
    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.padding = '6px 8px';
    tooltip.style.background = 'rgba(0,0,0,0.8)';
    tooltip.style.color = '#fff';
    tooltip.style.borderRadius = '6px';
    tooltip.style.fontSize = '0.85em';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.display = 'none';
    mountRef.current.appendChild(tooltip);

    // Raycaster for hover detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(markers);
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const log = hit.userData.log || {};
        tooltip.style.left = `${event.clientX - rect.left + 12}px`;
        tooltip.style.top = `${event.clientY - rect.top + 12}px`;
              tooltip.innerHTML = `<strong>${log.materialType || 'Unknown'}</strong><br/>Qty: ${log.quantity || '-'} kg<br/>Cause: ${log.cause || '-'}<br/>Site: ${log.site || '-'} `;
        tooltip.style.display = 'block';
      } else {
        tooltip.style.display = 'none';
      }
    };

    renderer.domElement.addEventListener('mousemove', onMouseMove);

    // Camera controls
    let controls;
    try {
      controls = new OrbitControls(camera, renderer.domElement);
    } catch (e) {}

    camera.position.z = 8;
    camera.position.y = 4;
    camera.lookAt(0, 0, 0);

    // Animation loop for controls and label renderer
    const animate = () => {
      if (controls) controls.update();
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      try {
        renderer.domElement.removeEventListener('mousemove', onMouseMove);
      } catch (e) {}
      try { mountRef.current.removeChild(renderer.domElement); } catch (e) {}
      try { mountRef.current.removeChild(labelRenderer.domElement); } catch (e) {}
      try { mountRef.current.removeChild(tooltip); } catch (e) {}
      // dispose geometries/materials
      markers.forEach(m => {
        try { m.geometry.dispose(); } catch (e) {}
        try { m.material.dispose(); } catch (e) {}
      });
    };
  }, [wasteLogs]);


    return (
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', width: '100%' }}>
        <div style={{ flex: '0 0 620px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>AR Blueprint Viewer (3D)</h2>
          <div
            ref={mountRef}
            style={{ width: 600, height: 400, background: '#222', borderRadius: '8px', marginBottom: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}
          />
            {/* Material chart removed from AR view per user request (kept in VR view) */}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ marginBottom: '1rem' }}>Blueprints</h2>
          {/* Legend removed from AR view - moved to VR Safety Training as requested */}
          {blueprints.length > 0 ? (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {blueprints.map((bp, idx) => (
                <div key={idx} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '1rem', background: '#fafafa', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
                  <h3 style={{ margin: 0 }}>{bp.name}</h3>
                  <p style={{ margin: '0.5rem 0' }}>{bp.description}</p>
                  <a href={bp.url} target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3', textDecoration: 'underline' }}>View Blueprint</a>
                  <div style={{ fontSize: '0.9em', color: '#888', marginTop: '0.5rem' }}>Last updated: {bp.updated}</div>
                </div>
              ))}
            </div>
          ) : (
            <p>No blueprints available.</p>
          )}
        </div>
      </div>
    );
};

export default ARBlueprintViewer;
