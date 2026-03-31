import React, { createContext, useContext, useState } from 'react';

const UnitContext = createContext(null);

export const UnitProvider = ({ children }) => {
    const [tempUnit, setTempUnit] = useState('C');    // 'C' | 'F'
    const [speedUnit, setSpeedUnit] = useState('mph'); // 'mph' | 'kph'
    const [heightUnit, setHeightUnit] = useState('m'); // 'm' | 'ft'

    const convertTemp = (val) => {
        if (val == null) return val;
        if (tempUnit === 'F') return Math.round((val * 9/5 + 32) * 10) / 10;
        return val;
    };
    const tempLabel = () => tempUnit === 'C' ? '°C' : '°F';

    const convertSpeed = (val) => {
        if (val == null) return val;
        if (speedUnit === 'kph') return Math.round(val * 1.60934 * 10) / 10;
        return val;
    };
    const speedLabel = () => speedUnit;

    const convertHeight = (val) => {
        if (val == null) return val;
        if (heightUnit === 'ft') return Math.round(val * 3.28084 * 10) / 10;
        return val;
    };
    const heightLabel = () => heightUnit;

    return (
        <UnitContext.Provider value={{
            tempUnit, setTempUnit,
            speedUnit, setSpeedUnit,
            heightUnit, setHeightUnit,
            convertTemp, tempLabel,
            convertSpeed, speedLabel,
            convertHeight, heightLabel,
        }}>
            {children}
        </UnitContext.Provider>
    );
};

export const useUnits = () => useContext(UnitContext);
