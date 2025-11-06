"use client";
// VR Safety Training Component



import React, { useEffect, useState, useRef } from 'react';
import { useAR } from '../../hooks/useAR';
import { fetchWasteLogs } from '../../services/arService';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';


const VRSafetyTraining = () => {
  const blueprints = useAR();
  const [wasteLogs, setWasteLogs] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const mountRef = useRef(null);
  const materialColors = {
    Concrete: 0x888888,
    Wood: 0x8d5524,
    Metal: 0x00bcd4,
    Plastic: 0xff9800,
    Glass: 0x90caf9,
    Other: 0x43a047,
  };

  // Simple inline bar chart component
  const BarChart = ({ items }) => {
    if (!items || items.length === 0) return <div style={{ color: '#aaa' }}>No data to chart.</div>;
    const max = Math.max(...items.map(i => i.value));
    const height = 120;
    return (
      <svg width="100%" height={height} viewBox={`0 0 ${items.length * 80} ${height}`} preserveAspectRatio="xMidYMid meet">
        {items.map((it, idx) => {
          const w = 40;
          const x = idx * 80 + 20;
          const h = max > 0 ? (it.value / max) * (height - 30) : 0;
          const y = height - h - 20;
          return (
            <g key={it.key}>
              <rect x={x} y={y} width={w} height={h} rx={4} ry={4} fill={it.color} />
              <text x={x + w/2} y={height - 6} fontSize={12} fill="#111" textAnchor="middle">{it.key}</text>
              <text x={x + w/2} y={y - 4} fontSize={11} fill="#111" textAnchor="middle">{it.value}</text>
            </g>
          );
        })}
      </svg>
    );
  };

  useEffect(() => {
    fetchWasteLogs().then(res => {
      if (res.status === 'ok') setWasteLogs(res.logs);
    });
  }, []);

  useEffect(() => {
    if (!mountRef.current || wasteLogs.length === 0) return;
    // Basic Three.js VR scene setup
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

    // Add a simple ground
    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.MeshBasicMaterial({ color: 0xeeeeee });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Material colors
    const materialColors = {
      Concrete: 0x888888,
      Wood: 0x8d5524,
      Metal: 0x00bcd4,
      Plastic: 0xff9800,
      Glass: 0x90caf9,
      Other: 0x43a047,
    };

    // Add all logs as cubes with labels and enable hover tooltip
    const markers = [];
    wasteLogs.slice(0, 10).forEach((log, idx) => {
      // normalize materialType to canonical key (trim + case-insensitive)
      const rawMat = (log.materialType || '').toString().trim();
      const canonical = Object.keys(materialColors).find(k => k.toLowerCase() === rawMat.toLowerCase()) || (rawMat || 'Other');
      const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const color = materialColors[canonical] || 0x8e24aa;
      const cubeMaterial = new THREE.MeshBasicMaterial({ color });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.set((idx % 5) - 2, 0.25, Math.floor(idx / 5) - 1);
      scene.add(cube);
      // attach normalized materialType for tooltip/legend/chart consistency
      cube.userData.log = { ...log, materialType: canonical };
      markers.push(cube);

      // Add label using CSS2DObject
      const labelDiv = document.createElement('div');
      labelDiv.className = 'vr-label';
      labelDiv.style.color = '#fff';
      labelDiv.style.background = '#333a';
      labelDiv.style.padding = '2px 6px';
      labelDiv.style.borderRadius = '4px';
      labelDiv.style.fontSize = '0.8em';
      labelDiv.style.pointerEvents = 'none';
      labelDiv.innerText = `${canonical} (${log.quantity}kg)`;
      const labelObj = new CSS2DObject(labelDiv);
      labelObj.position.set(cube.position.x, cube.position.y + 0.3, cube.position.z);
      scene.add(labelObj);
      cube.userData.labelObj = labelObj;
    });

    // Tooltip for hover
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

    camera.position.z = 6;
    camera.position.y = 3;
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
      try { renderer.domElement.removeEventListener('mousemove', onMouseMove); } catch (e) {}
      try { mountRef.current.removeChild(renderer.domElement); } catch (e) {}
      try { mountRef.current.removeChild(labelRenderer.domElement); } catch (e) {}
      try { mountRef.current.removeChild(tooltip); } catch (e) {}
      markers.forEach(m => {
        try { m.geometry.dispose(); } catch (e) {}
        try { m.material.dispose(); } catch (e) {}
      });
    };
  }, [wasteLogs, selectedIdx]);

  return (
    <div>
      <h2>VR Safety Training (3D)</h2>
      <div ref={mountRef} style={{width: 600, height: 400, background: '#222', borderRadius: '8px', marginBottom: '1rem', position: 'relative'}} />
      {/* Chart and legend area below VR */}
      <div style={{ width: 600, marginTop: 8, background: '#111', padding: '0.75rem', borderRadius: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0, color: '#ddd' }}>Material Quantities</h4>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {Object.keys(materialColors).map((m) => (
              <div key={m} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: 14, height: 14, borderRadius: 4, display: 'inline-block', background: `#${(materialColors[m]).toString(16).padStart(6,'0')}` }} />
                <span style={{ fontSize: '0.85em', color: '#ddd' }}>{m}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 8 }}>
          {(() => {
            const slice = wasteLogs.slice(0, 10);
            const agg = {};
            slice.forEach(l => {
              const raw = (l.materialType || '').toString().trim();
              const key = Object.keys(materialColors).find(k => k.toLowerCase() === raw.toLowerCase()) || (raw || 'Other');
              const q = Number(l.quantity) || 0;
              agg[key] = (agg[key] || 0) + q;
            });
            // produce items in canonical material order so bars align with legend
            const canonicalOrder = Object.keys(materialColors);
            const items = canonicalOrder.map(k => ({ key: k, value: Math.round((agg[k] || 0) * 100) / 100, color: `#${(materialColors[k] || 0x00ff00).toString(16).padStart(6,'0')}` }));
            // filter out zero-value items so chart focuses on present materials (optional)
            const visible = items.filter(it => it.value > 0);
            return <BarChart items={visible} />;
          })()}
        </div>
      </div>
      {wasteLogs.length > 0 ? (
        <div>
          <strong>Scenario Selection:</strong>
          <div style={{display: 'flex', gap: '0.5rem', margin: '0.5rem 0'}}>
            {wasteLogs.slice(0, 5).map((log, i) => (
              <button key={i} onClick={() => setSelectedIdx(i)} style={{padding: '0.5rem 1rem', borderRadius: '4px', background: selectedIdx === i ? '#8e24aa' : '#eee', color: selectedIdx === i ? '#fff' : '#333', border: 'none', cursor: 'pointer'}}>
                {log.materialType} @ {log.site}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p>No training scenarios available.</p>
      )}
    </div>
  );
};

export default VRSafetyTraining;
