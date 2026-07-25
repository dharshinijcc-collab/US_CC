'use client';

import React, { useEffect, useState } from 'react';

interface GridChar {
  char: string;
  opacity: number;
}

export default function MatrixBackground() {
  const [grids, setGrids] = useState<{
    id: number;
    style: React.CSSProperties;
    cells: GridChar[][];
  }[]>([]);

  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+=-_~αβγδεζηθικλμνξοπρστυφχψωF_N_T_R_G_U_Z_I_Q_M_O_V_L_H_E_b_d_s";
    
    // Position specifications matching the reference image's three layout blocks with circular radial masks
    const configs = [
      // 1. Top-Left Block (curves inward from the top-left corner)
      {
        id: 1,
        rows: 10,
        cols: 14,
        style: {
          position: 'absolute' as const,
          top: '0px',
          left: '0px',
          width: '220px',
          height: '220px',
          WebkitMaskImage: 'radial-gradient(circle at 0% 0%, black 20%, transparent 80%)',
          maskImage: 'radial-gradient(circle at 0% 0%, black 20%, transparent 80%)',
        }
      },
      // 2. Right-Middle Block (curves inward from the middle-right edge)
      {
        id: 2,
        rows: 16,
        cols: 10,
        style: {
          position: 'absolute' as const,
          top: '20%',
          right: '0px',
          width: '180px',
          height: '320px',
          WebkitMaskImage: 'radial-gradient(circle at 100% 50%, black 20%, transparent 80%)',
          maskImage: 'radial-gradient(circle at 100% 50%, black 20%, transparent 80%)',
        }
      },
      // 3. Bottom-Left Block (curves inward from the bottom-left corner)
      {
        id: 3,
        rows: 12,
        cols: 14,
        style: {
          position: 'absolute' as const,
          bottom: '0px',
          left: '0px',
          width: '220px',
          height: '220px',
          WebkitMaskImage: 'radial-gradient(circle at 0% 100%, black 20%, transparent 80%)',
          maskImage: 'radial-gradient(circle at 0% 100%, black 20%, transparent 80%)',
        }
      }
    ];

    const generatedGrids = configs.map(config => {
      const cells: GridChar[][] = [];
      for (let r = 0; r < config.rows; r++) {
        const rowCells: GridChar[] = [];
        for (let c = 0; c < config.cols; c++) {
          const char = Math.random() < 0.65 
            ? chars[Math.floor(Math.random() * chars.length)] 
            : ' ';
          
          const rand = Math.random();
          // Boosted opacity saturation for visibility
          const opacity = char === ' ' 
            ? 0 
            : rand < 0.3 
              ? 0.08 
              : rand < 0.8 
                ? 0.14 
                : 0.24;
          
          rowCells.push({ char, opacity });
        }
        cells.push(rowCells);
      }

      return {
        id: config.id,
        style: config.style,
        cells
      };
    });

    setGrids(generatedGrids);
  }, []);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0,
      userSelect: 'none',
      borderRadius: 'inherit' // clips to rounded corners of the parent card!
    }}>
      {grids.map(grid => (
        <div 
          key={grid.id} 
          style={{
            ...grid.style,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: '11px',
            lineHeight: '1.4',
            letterSpacing: '0.45em',
            color: '#475569', // slate gray
            fontWeight: 500,
            whiteSpace: 'pre'
          }}
        >
          {grid.cells.map((row, rIdx) => (
            <div key={rIdx} style={{ display: 'flex', justifyContent: 'flex-start' }}>
              {row.map((cell, cIdx) => (
                <span 
                  key={cIdx} 
                  style={{ 
                    opacity: cell.opacity,
                    width: '1.4em',
                    textAlign: 'center',
                    display: 'inline-block'
                  }}
                >
                  {cell.char}
                </span>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
