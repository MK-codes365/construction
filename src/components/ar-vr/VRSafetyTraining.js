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

    // Add all logs as cubes with labels
    wasteLogs.slice(0, 10).forEach((log, idx) => {
      const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const color = materialColors[log.materialType] || 0x8e24aa;
      const cubeMaterial = new THREE.MeshBasicMaterial({ color });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.set((idx % 5) - 2, 0.25, Math.floor(idx / 5) - 1);
      scene.add(cube);

      // Add label using CSS2DObject
      const labelDiv = document.createElement('div');
      labelDiv.className = 'vr-label';
      labelDiv.style.color = '#fff';
      labelDiv.style.background = '#333a';
      labelDiv.style.padding = '2px 6px';
      labelDiv.style.borderRadius = '4px';
      labelDiv.style.fontSize = '0.8em';
      labelDiv.style.pointerEvents = 'none';
      labelDiv.innerText = `${log.materialType} (${log.quantity}kg)`;
      const labelObj = new CSS2DObject(labelDiv);
      labelObj.position.set(cube.position.x, cube.position.y + 0.3, cube.position.z);
      scene.add(labelObj);
      cube.userData.labelObj = labelObj;
    });

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
      if (mountRef.current && renderer && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      if (mountRef.current && labelRenderer && labelRenderer.domElement) {
        mountRef.current.removeChild(labelRenderer.domElement);
      }
    };
  }, [wasteLogs, selectedIdx]);

  return (
    <div>
      <h2>VR Safety Training (3D)</h2>
      <div ref={mountRef} style={{width: 600, height: 400, background: '#222', borderRadius: '8px', marginBottom: '1rem'}} />
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
