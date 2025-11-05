'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Sphere, Cylinder, Torus } from '@react-three/drei'

export default function AnimatedTomato() {
  const groupRef = useRef<THREE.Group>(null)
  const forkRef = useRef<THREE.Group>(null)
  const sliceRef = useRef<THREE.Group>(null)
  const mouthRef = useRef<THREE.Mesh>(null)
  const leftEyeRef = useRef<THREE.Mesh>(null)
  const rightEyeRef = useRef<THREE.Mesh>(null)
  const leftPupilRef = useRef<THREE.Mesh>(null)
  const rightPupilRef = useRef<THREE.Mesh>(null)

  const startTime = useRef(Date.now())

  useFrame(() => {
    const elapsed = (Date.now() - startTime.current) / 1000

    // Phase 1: Fork feeding (0-2 seconds)
    if (elapsed < 2) {
      const progress = elapsed / 2
      const easeProgress = 1 - Math.pow(1 - progress, 3)

      if (forkRef.current && sliceRef.current) {
        forkRef.current.position.x = -3 + easeProgress * 2.8
        forkRef.current.position.y = -0.3 + Math.sin(easeProgress * Math.PI) * 0.2
        sliceRef.current.position.x = -3 + easeProgress * 2.8
        sliceRef.current.position.y = -0.3 + Math.sin(easeProgress * Math.PI) * 0.2
        sliceRef.current.rotation.z = easeProgress * Math.PI * 0.5
      }

      // Eyes following fork
      if (leftPupilRef.current && rightPupilRef.current) {
        const lookX = Math.min(0.15, easeProgress * 0.15)
        leftPupilRef.current.position.x = -lookX
        rightPupilRef.current.position.x = -lookX
      }

      // Mouth opening wider
      if (mouthRef.current) {
        const mouthScale = 1 + easeProgress * 0.6
        mouthRef.current.scale.set(mouthScale, mouthScale, 1)
      }
    }
    // Phase 2: Chewing (2-5 seconds)
    else if (elapsed < 5) {
      const chewElapsed = elapsed - 2
      const chewProgress = chewElapsed / 3

      // Hide fork and slice
      if (forkRef.current && sliceRef.current) {
        forkRef.current.visible = false
        sliceRef.current.visible = false
      }

      // Chewing animation
      const chewCycle = Math.sin(chewElapsed * 5) * 0.5 + 0.5

      if (mouthRef.current) {
        const mouthScale = 1.3 + chewCycle * 0.3
        mouthRef.current.scale.set(mouthScale, 1.6 - chewCycle * 0.3, 1)
      }

      // Eyes squinting with happiness
      if (leftEyeRef.current && rightEyeRef.current) {
        const squint = Math.sin(chewElapsed * 5) * 0.1 + 0.9
        leftEyeRef.current.scale.y = squint
        rightEyeRef.current.scale.y = squint
      }

      // Pupils back to center
      if (leftPupilRef.current && rightPupilRef.current) {
        leftPupilRef.current.position.x = 0
        rightPupilRef.current.position.x = 0
      }

      // Gentle head movement
      if (groupRef.current) {
        groupRef.current.rotation.z = Math.sin(chewElapsed * 3) * 0.05
      }
    }
    // Loop
    else {
      startTime.current = Date.now()
      if (forkRef.current && sliceRef.current) {
        forkRef.current.visible = true
        sliceRef.current.visible = true
      }
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main Tomato Body */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#ff3b30"
          roughness={0.2}
          metalness={0.1}
          envMapIntensity={0.8}
        />
      </mesh>

      {/* Stem */}
      <group position={[0, 1.05, 0]} rotation={[0, 0, 0.1]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.12, 0.3, 16]} />
          <meshStandardMaterial color="#4a7c3b" roughness={0.7} />
        </mesh>
        {/* Leaves */}
        {[0, 1, 2, 3, 4].map((i) => (
          <group key={i} rotation={[0, (i * Math.PI * 2) / 5, Math.PI / 3]} position={[0, 0.1, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.35, 0.02, 0.15]} />
              <meshStandardMaterial color="#5ea847" roughness={0.6} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Left Eye */}
      <mesh ref={leftEyeRef} position={[-0.35, 0.25, 0.85]} castShadow>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </mesh>

      {/* Left Pupil */}
      <mesh ref={leftPupilRef} position={[-0.35, 0.25, 1.0]}>
        <sphereGeometry args={[0.09, 32, 32]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Right Eye */}
      <mesh ref={rightEyeRef} position={[0.35, 0.25, 0.85]} castShadow>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </mesh>

      {/* Right Pupil */}
      <mesh ref={rightPupilRef} position={[0.35, 0.25, 1.0]}>
        <sphereGeometry args={[0.09, 32, 32]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 0.05, 0.98]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#e63027" roughness={0.3} />
      </mesh>

      {/* Mouth */}
      <mesh ref={mouthRef} position={[0, -0.25, 0.92]} castShadow>
        <torusGeometry args={[0.25, 0.08, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#8b0000" roughness={0.4} />
      </mesh>

      {/* Tongue */}
      <mesh position={[0, -0.35, 0.88]}>
        <sphereGeometry args={[0.15, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#ff6b6b" roughness={0.6} />
      </mesh>

      {/* Fork */}
      <group ref={forkRef} position={[-3, -0.3, 1]}>
        {/* Handle */}
        <mesh>
          <cylinderGeometry args={[0.03, 0.03, 1.5, 16]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Prongs */}
        {[-0.08, -0.03, 0.03, 0.08].map((offset, i) => (
          <mesh key={i} position={[offset, 0.8, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.4, 8]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* Tomato Slice */}
      <group ref={sliceRef} position={[-3, -0.3, 1]}>
        <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.08, 32]} />
          <meshStandardMaterial color="#ff4444" roughness={0.3} />
        </mesh>
        {/* Seeds */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i * Math.PI * 2) / 6
          const radius = 0.12
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
              ]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshStandardMaterial color="#ffffcc" />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}
